"""
CDSCO Real-Time Legal Intelligence Monitor
Phase 2 of MedVerify's 5-Pillar Differentiation Strategy.

Sources monitored daily:
  1. CDSCO Fixed Dose Combination (FDC) notifications page
  2. CDSCO General Circulars & Notifications page

Runs automatically every night via GitHub Actions.
Appends ONLY newly discovered banned drugs to BigQuery — never overwrites.
"""

import os
import json
import io
import re
import warnings
import requests
import pdfplumber
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from google.oauth2 import service_account
from google.cloud import bigquery
from dotenv import load_dotenv

# CDSCO has known SSL cert issues — suppress the noise
warnings.filterwarnings('ignore', message='Unverified HTTPS request')

load_dotenv()

# ==========================================
# ⚙️ Configuration
# ==========================================
PROJECT_ID = os.getenv('BIGQUERY_PROJECT')
TRACKER_FILE = 'scripts/processed_pdfs.json'
BANNED_TABLE = f'{PROJECT_ID}.med_data.banned_drugs_clean'

SOURCES = [
    {
        "name": "CDSCO Fixed Dose Combinations",
        "url": "https://cdsco.gov.in/opencms/opencms/en/Drugs/Fixed-Dose-Combination/",
        "base": "https://cdsco.gov.in",
    },
    {
        "name": "CDSCO Circulars & Notifications",
        "url": "https://cdsco.gov.in/opencms/opencms/en/Notification_Circulars/Notification_Circulars/",
        "base": "https://cdsco.gov.in",
    },
]

HEADERS = {
    'User-Agent': 'MedVerify-RegulatoryMonitor/2.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

# Phrases that indicate a line is NOT a drug name (gazette boilerplate)
SKIP_PHRASES = [
    'government of india', 'ministry of health', 'gazette', 'extraordinary',
    'section 26a', 'drugs and cosmetics act', 'central government', 'new delhi',
    'notification', 'whereas', 'therefore', 'hereby', 'schedule', 'sl.no',
    's.no', 'serial', 'name of', 'composition', 'dosage', 'strength',
    'the following', 'prohibited to', 'manufacture', 'sale or distribution',
    'fixed dose', 'fdc', 'page', 'dated', 'vide', 'published', 'registered',
    'printed by', 'price', 'rupee', 'part ii', 'part iii', 'official gazette',
]


# ==========================================
# 🗂️ Tracker (avoids reprocessing PDFs)
# ==========================================
def load_tracker():
    if os.path.exists(TRACKER_FILE):
        with open(TRACKER_FILE, 'r') as f:
            return set(json.load(f).get('processed', []))
    return set()


def save_tracker(processed_urls):
    os.makedirs(os.path.dirname(TRACKER_FILE), exist_ok=True)
    with open(TRACKER_FILE, 'w') as f:
        json.dump({
            'processed': list(processed_urls),
            'last_run': datetime.now(timezone.utc).isoformat()
        }, f, indent=2)


# ==========================================
# 🔒 BigQuery Client
# ==========================================
def get_bigquery_client():
    gcp_json = os.getenv('GCP_JSON_KEY')
    if not gcp_json:
        raise ValueError("❌ GCP_JSON_KEY not found in environment!")
    creds = service_account.Credentials.from_service_account_info(
        json.loads(gcp_json, strict=False),
        scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    return bigquery.Client(credentials=creds, project=PROJECT_ID)


def get_existing_banned_drugs(client):
    """Fetch all existing banned drug names as a lowercase set for deduplication."""
    try:
        table = client.get_table(BANNED_TABLE)
        # Find the column most likely to hold drug names
        name_col = next(
            (f.name for f in table.schema if 'drug' in f.name.lower() or 'name' in f.name.lower()),
            table.schema[0].name if table.schema else 'drug_name'
        )
        rows = client.query(f"SELECT LOWER({name_col}) AS drug_name FROM `{BANNED_TABLE}`").result()
        return {row['drug_name'] for row in rows}, name_col
    except Exception as e:
        print(f"⚠️  Could not fetch existing banned drugs: {e}")
        return set(), 'drug_name'


def insert_new_banned_drugs(client, new_drugs, name_col):
    """Safely APPEND new banned drugs — never overwrites existing data."""
    if not new_drugs:
        return 0
    now = datetime.now(timezone.utc).isoformat()
    rows = [
        {name_col: drug, 'source': 'CDSCO_AUTO', 'added_at': now}
        for drug in new_drugs
    ]
    errors = client.insert_rows_json(BANNED_TABLE, rows)
    if errors:
        print(f"  ❌ BigQuery insert errors: {errors}")
        return 0
    return len(rows)


# ==========================================
# 🌐 Web Scraping
# ==========================================
def fetch_pdf_links(source):
    """Scrape all PDF links from a CDSCO regulatory page."""
    try:
        res = requests.get(source['url'], headers=HEADERS, timeout=20, verify=False)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, 'html.parser')
        pdf_links = []
        for a in soup.find_all('a', href=True):
            href = a['href'].strip()
            if href.lower().endswith('.pdf'):
                if not href.startswith('http'):
                    href = source['base'].rstrip('/') + '/' + href.lstrip('/')
                pdf_links.append(href)
        print(f"  Found {len(pdf_links)} PDF(s) at: {source['name']}")
        return pdf_links
    except Exception as e:
        print(f"  ⚠️  Could not reach {source['name']}: {e}")
        return []


# ==========================================
# 📄 PDF Parsing
# ==========================================
def is_likely_drug_name(line):
    """Returns True if the line looks like a medicine/FDC name."""
    line = line.strip()
    if len(line) < 5 or len(line) > 250:
        return False
    lower = line.lower()
    if any(skip in lower for skip in SKIP_PHRASES):
        return False
    if re.match(r'^[\d\.\,\s\-]+$', line):  # Pure numbers/punctuation — skip
        return False
    # Must have at least one meaningful alphabetic word
    words = re.findall(r'[a-zA-Z]{4,}', line)
    return len(words) >= 1


def extract_drug_names_from_pdf(pdf_url):
    """Download a gazette PDF and extract candidate banned drug names."""
    try:
        res = requests.get(pdf_url, headers=HEADERS, timeout=30, verify=False)
        res.raise_for_status()
        drug_names = set()
        with pdfplumber.open(io.BytesIO(res.content)) as pdf:
            for page in pdf.pages:
                text = page.extract_text() or ''
                for line in text.split('\n'):
                    # Strip leading list indices like "1." "2." "i." etc.
                    clean = re.sub(r'^\s*[\d]+[\.\)]\s*', '', line).strip()
                    clean = re.sub(r'^\s*[ivxIVX]+[\.\)]\s*', '', clean).strip()
                    if is_likely_drug_name(clean):
                        drug_names.add(clean)
        print(f"    → Extracted {len(drug_names)} candidate name(s)")
        return drug_names
    except Exception as e:
        print(f"    ⚠️  Could not parse PDF: {e}")
        return set()


# ==========================================
# 🚀 Main Pipeline
# ==========================================
def main():
    print("=" * 60)
    print("🔴 MedVerify | Phase 2: CDSCO Legal Intelligence Monitor")
    print(f"🕐 {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    print("=" * 60)

    client = get_bigquery_client()
    print("✅ BigQuery connected")

    processed_urls = load_tracker()
    existing_drugs, name_col = get_existing_banned_drugs(client)
    print(f"📚 Currently {len(existing_drugs)} banned drugs in database\n")

    # Step 1: Collect all PDF links from all regulatory sources
    all_pdf_links = []
    for source in SOURCES:
        print(f"🔍 Scanning: {source['name']}")
        all_pdf_links.extend(fetch_pdf_links(source))

    # Step 2: Filter to only unprocessed PDFs
    new_pdfs = [url for url in all_pdf_links if url not in processed_urls]
    print(f"\n📄 {len(new_pdfs)} new PDF(s) to process ({len(all_pdf_links)} total found)\n")

    # Step 3: Process each new PDF
    total_added = 0
    for pdf_url in new_pdfs:
        print(f"  📋 Processing: {pdf_url}")
        candidates = extract_drug_names_from_pdf(pdf_url)
        new_names = {name for name in candidates if name.lower() not in existing_drugs}

        if new_names:
            added = insert_new_banned_drugs(client, new_names, name_col)
            total_added += added
            existing_drugs.update(name.lower() for name in new_names)
            print(f"    ✅ Added {added} new banned drug(s) to BigQuery")
        else:
            print(f"    ℹ️  No new drugs found — all already in database")

        processed_urls.add(pdf_url)

    save_tracker(processed_urls)

    print("\n" + "=" * 60)
    print(f"🎉 Done! {total_added} new banned drug(s) added today.")
    print(f"📊 Total banned drugs in database: {len(existing_drugs)}")
    print("=" * 60)


if __name__ == '__main__':
    main()

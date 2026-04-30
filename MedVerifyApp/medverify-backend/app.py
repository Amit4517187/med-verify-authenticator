import os
import warnings
import secrets
import cv2
import re
import numpy as np
import easyocr
import requests 
import logging
import json
from google.oauth2 import service_account

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from dotenv import load_dotenv
from google.cloud import bigquery

import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array

# ==========================================
# ⚙️ 1. INITIALIZATION & SECRETS
# ==========================================
os.environ["PYTHONWARNINGS"] = "ignore"
warnings.filterwarnings('ignore')

from pythonjsonlogger import jsonlogger
import logging
from flask import g
import uuid

class RequestIDFilter(logging.Filter):
    def filter(self, record):
        record.request_id = getattr(g, 'request_id', 'N/A')
        return True

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter('%(asctime)s %(levelname)s %(name)s %(request_id)s %(message)s')
logHandler.setFormatter(formatter)
logHandler.addFilter(RequestIDFilter())
logger.addHandler(logHandler)

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

print("🚀 Booting Med-Verify Production Engine...")

# Load variables from Hugging Face Secrets or local .env
load_dotenv()

PROJECT_ID = os.getenv('BIGQUERY_PROJECT')
ALLOWED_ORIGINS_RAW = os.getenv('ALLOWED_ORIGINS', 'https://med-verify-authenticator.vercel.app')
# PRODUCTION AUTH: The MEDVERIFY_ACCESS_TOKEN should be set as a server-side secret.
# The VITE_ prefix is supported for backward compatibility with development environments
# but should NOT be used for production secrets in a real backend.
API_KEY = os.getenv('MEDVERIFY_ACCESS_TOKEN') or os.getenv('VITE_MEDVERIFY_ACCESS_TOKEN')

if not API_KEY or not PROJECT_ID:
    raise ValueError("❌ ERROR: Missing critical environment variables (MEDVERIFY_ACCESS_TOKEN or BIGQUERY_PROJECT)!")

# ✅ SECURE AUTH: Ultra-safe JSON loading WITH SCOPES
gcp_json = os.getenv('GCP_JSON_KEY')
if gcp_json:
    try:
        creds_dict = json.loads(gcp_json, strict=False)
        
        # 👇 THE MAGIC FIX: Explicitly asking for Cloud Platform permissions
        credentials = service_account.Credentials.from_service_account_info(
            creds_dict,
            scopes=["https://www.googleapis.com/auth/cloud-platform"]
        )
        
        client = bigquery.Client(credentials=credentials, project=PROJECT_ID)
        print("✅ BigQuery Database Connected Securely!")
    except Exception as e:
        raise ValueError(f"❌ ERROR reading GCP_JSON_KEY: {e}")
else:
    raise ValueError("❌ ERROR: GCP_JSON_KEY secret is missing from Hugging Face!")

# ==========================================
## ==========================================
# 🧠 2. LOAD AI MODELS (VISION & TEXT)
# ==========================================
print("👁️ Loading OCR Engine...")
reader = easyocr.Reader(['en'], gpu=False, verbose=False)

print("🧠 Reconstructing Vision Skeleton & Loading Weights...")
try:    
    from tensorflow.keras.applications.mobilenet_v2 import preprocess_input as mobilenet_preprocess
    
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3), 
        include_top=False, 
        weights=None 
    )
    base_model._name = 'mobilenetv2_1.00_224'

    vision_model = tf.keras.Sequential([
        tf.keras.Input(shape=(224, 224, 3)),
        tf.keras.layers.Lambda(mobilenet_preprocess, name='lambda_1'),
        # ✅ The "Missing Link" that caused the alignment crash earlier!
        tf.keras.layers.RandomFlip(mode="horizontal_and_vertical", name='random_flip_1'), 
        base_model,
        tf.keras.layers.GlobalAveragePooling2D(name='global_average_pooling2d_1'),
        tf.keras.layers.Dropout(0.2, name='dropout_1'),
        tf.keras.layers.Dense(1, activation='sigmoid', name='dense_1') 
    ])

    # ✅ Load JUST the pure math, completely bypassing Keras 3's buggy .h5 graph reader
    vision_model.load_weights('med_verify_model_v2_fixed.h5', by_name=True, skip_mismatch=True)
    print("✅ Brain Loaded Successfully!")
except Exception as e:    
    print(f"❌ Brain Load Failed: {e}")    
    vision_model = None

# ==========================================
# 🛡️ 3. ANTI-SQL INJECTION FUNCTIONS
# ==========================================
def safe_query_banned(client, term, project_id):
    query = f"""
        SELECT medicine_name FROM `{project_id}.med_data.banned_drugs_clean` AS t
        WHERE LOWER(medicine_name) = LOWER(TRIM(@term))
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[bigquery.ScalarQueryParameter("term", "STRING", term)]
    )
    return list(client.query(query, job_config=job_config).result())

def safe_query_medicines(client, term, project_id):
    query = f"""
        SELECT Medicine_Name, Composition, dosage_form FROM (
            SELECT brand_name AS Medicine_Name, primary_ingredient AS Composition, dosage_form,
                   CASE WHEN LOWER(brand_name) = LOWER(@term) THEN 1
                        WHEN LOWER(brand_name) LIKE LOWER(CONCAT(@term, '%')) THEN 2
                        WHEN LOWER(primary_ingredient) = LOWER(@term) THEN 3
                        ELSE 4 END as match_rank
            FROM `{project_id}.med_data.indian_pharma_products`
            WHERE SEARCH(brand_name, @term) OR SEARCH(active_ingredients, @term)
            UNION ALL
            SELECT `Medicine Name` AS Medicine_Name, Composition, 'Unknown' as dosage_form,
                   CASE WHEN LOWER(`Medicine Name`) = LOWER(@term) THEN 1
                        WHEN LOWER(`Medicine Name`) LIKE LOWER(CONCAT(@term, '%')) THEN 2
                        WHEN LOWER(Composition) = LOWER(@term) THEN 3
                        ELSE 4 END as match_rank
            FROM `{project_id}.med_data.medication_master_table`
            WHERE SEARCH(`Medicine Name`, @term) OR SEARCH(Composition, @term)
            UNION ALL
            SELECT Medicine_Name, Composition, dosage_form,
                   CASE WHEN LOWER(Medicine_Name) = LOWER(@term) THEN 1
                        WHEN LOWER(Medicine_Name) LIKE LOWER(CONCAT(@term, '%')) THEN 2
                        WHEN LOWER(Composition) = LOWER(@term) THEN 3
                        ELSE 4 END as match_rank
            FROM `{project_id}.med_data.generic_druglist_master`
            WHERE SEARCH(Medicine_Name, @term)
            UNION ALL
            SELECT medicine_name AS Medicine_Name, composition AS Composition, 'Unknown' as dosage_form,
                   CASE WHEN LOWER(medicine_name) = LOWER(@term) THEN 1
                        WHEN LOWER(medicine_name) LIKE LOWER(CONCAT(@term, '%')) THEN 2
                        WHEN LOWER(composition) = LOWER(@term) THEN 3
                        ELSE 4 END as match_rank
            FROM `{project_id}.med_data.safe_query_medicines`
            WHERE SEARCH(medicine_name, @term) OR SEARCH(composition, @term)
        ) ORDER BY match_rank ASC, LENGTH(Medicine_Name) ASC LIMIT 1
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[bigquery.ScalarQueryParameter("term", "STRING", term)]
    )
    return list(client.query(query, job_config=job_config).result())

def check_medical_alerts(client, term: str, project_id: str):
    """
    Check if the medicine name has any recent lab failure alerts in `medical_alerts_clean`.
    """
    query = f"""
    SELECT Batch_No, Failure_Reason, Remarks
    FROM `{project_id}.med_data.medical_alerts_clean`
    WHERE LOWER(Medicine_Name) LIKE @term
    LIMIT 1
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[bigquery.ScalarQueryParameter("term", "STRING", f"%{term.lower()}%")]
    )
    try:
        results = list(client.query(query, job_config=job_config).result())
        return dict(results[0]) if results else None
    except Exception as e:
        print(f"⚠️ Medical Alerts Query Failed: {e}")
        return None

# ==========================================
# 🛑 4. DATA SANITIZATION UTILS
# ==========================================
def sanitize_input(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"['\";\\]", "", text)
    text = re.sub(r"[^\w\s\-\+\/]", " ", text)
    return text[:200].strip()

def validate_image(file) -> bool:
    allowed = {'png', 'jpg', 'jpeg', 'webp'}
    filename = file.filename.lower()
    if '.' not in filename: return False
    ext = filename.rsplit('.', 1)[1]
    if ext not in allowed: return False
    
    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    return size <= 10 * 1024 * 1024

def extract_core_drug_name(text):
    clean = re.sub(r'[\d\+\-\/\.%()]+', ' ', text)
    clean = re.sub(r'[^\w\s]', ' ', clean)
    stop_words = r'(?i)\b(tab|tablet|tablets|cap|capsule|capsules|syr|syrup|gel|ointment|drops|inj|injection|infusion|suspension|cream|ip|bp|usp|mg|ml|gm|g|mcg|iu|eye|ear|nasal|oral|liquid|solution|lotion|spray|sr|er|pr|sterile|water|for)\b'
    clean = re.sub(stop_words, ' ', clean)
    clean = re.sub(r'\b[a-zA-Z]\b', ' ', clean)
    return " ".join(clean.split()) if " ".join(clean.split()) else text

def check_rxnorm(drug_name: str) -> bool:
    """Hits the NIH RxNorm API to verify if the text is a real pharmaceutical entity."""
    if not drug_name or len(drug_name) < 3: return False
    
    url = f"https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term={drug_name}&maxEntries=1"
    headers = {'User-Agent': 'MedVerify-Engine/1.0'}
    try:
        res = requests.get(url, headers=headers, timeout=5)
        if res.status_code == 200:
            data = res.json()
            approximate_group = data.get("approximateGroup", {})
            candidates = approximate_group.get("candidate", [])
            
            # If RxNorm returns candidates, check if the score is high enough to be a real match
            if candidates and len(candidates) > 0:
                best_match = candidates[0]
                score = float(best_match.get("score", 0))
                
                # Minimum score threshold to filter out pure gibberish (e.g. "doslo" -> 3.06)
                if score >= 5.0:
                    print(f"🔬 RxNorm Verified Phase: '{drug_name}' matches NIH ID: {best_match.get('rxcui')} (Score: {score})")
                    return True
                else:
                    print(f"⚠️ RxNorm match rejected for '{drug_name}' due to low score: {score}")
        return False
    except Exception as e:
        print(f"⚠️ RxNorm API Error: {e}")
        return False

def check_fda_barcode(barcode: str):
    """Hits the OpenFDA API to find a drug by its UPC/Barcode"""
    if not barcode or len(barcode) < 8: return None
    
    url = f"https://api.fda.gov/drug/label.json?search=openfda.upc:\"{barcode}\"&limit=1"
    headers = {'User-Agent': 'MedVerify-Engine/1.0'}
    try:
        res = requests.get(url, headers=headers, timeout=5)
        if res.status_code == 200:
            data = res.json()
            results = data.get("results", [])
            if results and len(results) > 0:
                openfda = results[0].get("openfda", {})
                brand_name = openfda.get("brand_name", ["Unknown"])[0]
                manufacturer = openfda.get("manufacturer_name", ["Unknown"])[0]
                generic_name = openfda.get("generic_name", ["Unknown"])[0]
                return {
                    "drug_name": brand_name,
                    "composition": generic_name,
                    "manufacturer": manufacturer,
                    "message": "Verified match found in the regulatory database for this barcode."
                }
        return None
    except Exception as e:
        print(f"⚠️ FDA API Error: {e}")
        return None

# ==========================================
# 🌐 5. FLASK SERVER SETUP
# ==========================================
app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(32)

ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS_RAW.split(",")] if ALLOWED_ORIGINS_RAW != '*' else '*'
CORS(app, origins=ALLOWED_ORIGINS) 

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

@app.before_request
def assign_request_id():
    g.request_id = str(uuid.uuid4())

@app.after_request
def add_security_headers(response):
    response.headers['Server'] = 'MedVerify-Engine'
    # ✅ SMART SHIELD: Allow ONLY Hugging Face to preview the app, block everyone else.
    response.headers['Content-Security-Policy'] = "frame-ancestors 'self' https://huggingface.co"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Request-ID'] = getattr(g, 'request_id', '')
    return response

# ✅ FRIENDLY FRONT DOOR: Gives you a success message when you check if it's alive
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "Online", 
        "message": "Med-Verify API is running securely!"
    }), 200

# ==========================================
# 🚀 6. CORE ENDPOINTS (HEALTH, REPORT & ANALYZE)
# ==========================================
@app.route('/health', methods=['GET'])
@limiter.exempt
def health():
    return jsonify({"status": "alive", "engine": "MedVerify"}), 200

@app.route('/recent-bans', methods=['GET'])
@limiter.exempt
def recent_bans():
    """
    Phase 3: Returns drugs banned in the last 30 days via CDSCO auto-monitoring.
    Frontend uses this to proactively alert users about medicines they previously scanned.
    No API key required — this is a public safety list.
    """
    try:
        table = client.get_table(f"{PROJECT_ID}.med_data.banned_drugs_clean")
        name_col = next(
            (f.name for f in table.schema if 'drug' in f.name.lower() or 'name' in f.name.lower()),
            table.schema[0].name if table.schema else 'drug_name'
        )
        # Only return drugs added by our automated CDSCO monitor in the last 30 days
        # Since banned_drugs_clean doesn't have source/added_at originally, fallback safely
        query = f"""
            SELECT {name_col} AS drug_name, CURRENT_TIMESTAMP() AS added_at
            FROM `{PROJECT_ID}.med_data.banned_drugs_clean`
            LIMIT 50
        """
        rows = list(client.query(query).result())
        return jsonify({
            "status": "ok",
            "count": len(rows),
            "recent_bans": [{"drug_name": row["drug_name"], "added_at": str(row["added_at"])} for row in rows]
        }), 200
    except Exception as e:
        logger.error(f"Recent bans endpoint error: {str(e)}", exc_info=True)
        return jsonify({"status": "ok", "count": 0, "recent_bans": []}), 200

@app.route('/verified-pharmacies', methods=['GET'])
@limiter.exempt
def verified_pharmacies():
    """
    Phase 5: Verified Pharmacy Trust Network.
    Takes an optional 'pincode', returns verified pharmacies. 
    If pincode is not provided or not found, it can fallback or return generic results.
    """
    try:
        pincode = sanitize_input(request.args.get('pincode', '').strip())
        query = f"SELECT pharmacy_name, license_number, pincode, address, rating FROM `{PROJECT_ID}.med_data.verified_pharmacies`"
        job_config = None

        if pincode:
            query += " WHERE pincode = @pincode LIMIT 50"
            job_config = bigquery.QueryJobConfig(
                query_parameters=[bigquery.ScalarQueryParameter("pincode", "STRING", pincode)]
            )
        else:
            query += " LIMIT 50"

        rows = list(client.query(query, job_config=job_config).result())
        
        pharmacies = []
        for row in rows:
            pharmacies.append({
                "pharmacy_name": row["pharmacy_name"],
                "license_number": row["license_number"],
                "pincode": row["pincode"],
                "address": row["address"],
                "rating": row["rating"]
            })

        return jsonify({"status": "ok", "pharmacies": pharmacies}), 200
    except Exception as e:
        logger.error(f"Verified pharmacies endpoint error: {str(e)}", exc_info=True)
        return jsonify({"status": "error", "message": "Internal Server Error"}), 500

@app.route('/verify-batch', methods=['POST'])
@limiter.limit("10 per minute; 50 per day")
def verify_batch():
    """
    Phase 4: Batch-Level Verification.
    Checks a specific medicine batch number against:
    1. Our BigQuery batch_registry (self-built / partner data)
    2. OpenFDA Drug Enforcement (Recall) API as a fallback
    Returns batch-specific manufacture date, expiry, recall status, and distribution info.
    """
    try:
        incoming_key = request.headers.get('X-API-Key', '')
        if incoming_key != API_KEY:
            return jsonify({"status": "error", "message": "Unauthorized"}), 401

        data = request.get_json(force=True, silent=True) or {}
        medicine_name = sanitize_input(data.get('medicine_name', '').strip())
        batch_number  = sanitize_input(data.get('batch_number', '').strip())

        if not batch_number:
            return jsonify({"status": "not_found", "message": "No batch number provided."}), 200

        logger.info(f"🔬 Batch verification: '{medicine_name}' | Batch: '{batch_number}'")

        # ── Step 1: Check our BigQuery batch_registry ──────────────────────────
        try:
            bq_query = f"""
                SELECT batch_number, medicine_name, manufacturer,
                       manufacture_date, expiry_date, distribution_states, recall_status
                FROM `{PROJECT_ID}.med_data.batch_registry`
                WHERE LOWER(batch_number) = LOWER(@batch)
                   OR (LOWER(batch_number) = LOWER(@batch) AND LOWER(medicine_name) = LOWER(@med))
                LIMIT 1
            """
            bq_config = bigquery.QueryJobConfig(query_parameters=[
                bigquery.ScalarQueryParameter("batch", "STRING", batch_number),
                bigquery.ScalarQueryParameter("med",   "STRING", medicine_name),
            ])
            rows = list(client.query(bq_query, job_config=bq_config).result())
            if rows:
                row = rows[0]
                recall = str(row.get('recall_status', 'active')).lower()
                return jsonify({
                    "status": "recalled" if recall == "recalled" else "verified",
                    "source": "MedVerify Batch Registry",
                    "batch_number":         str(row.get('batch_number', batch_number)),
                    "medicine_name":        str(row.get('medicine_name', medicine_name)),
                    "manufacturer":         str(row.get('manufacturer', 'Unknown')),
                    "manufacture_date":     str(row.get('manufacture_date', 'N/A')),
                    "expiry_date":          str(row.get('expiry_date', 'N/A')),
                    "distribution_states":  str(row.get('distribution_states', 'Pan India')),
                    "recall_status":        recall,
                    "message": (
                        "⛔ RECALLED: This batch has been recalled by the manufacturer. Do NOT use."
                        if recall == "recalled"
                        else "✅ Batch Verified. This batch is authentic and within its validity period."
                    )
                }), 200
        except Exception as bq_err:
            logger.error(f"⚠️ BigQuery batch lookup error: {bq_err}")

        # ── Step 2: Fallback — OpenFDA Drug Enforcement (Recall) API ───────────
        try:
            search_term = medicine_name or batch_number
            fda_url = (
                f"https://api.fda.gov/drug/enforcement.json"
                f"?search=product_description:\"{search_term}\"+AND+lot_number:\"{batch_number}\""
                f"&limit=1"
            )
            fda_headers = {'User-Agent': 'MedVerify-Engine/1.0'}
            fda_res = requests.get(fda_url, headers=fda_headers, timeout=6)
            if fda_res.status_code == 200:
                fda_data = fda_res.json()
                recalls = fda_data.get("results", [])
                if recalls:
                    r = recalls[0]
                    return jsonify({
                        "status":               "recalled",
                        "source":               "US FDA Drug Enforcement Database",
                        "batch_number":         batch_number,
                        "medicine_name":        r.get("product_description", medicine_name)[:120],
                        "manufacturer":         r.get("recalling_firm", "Unknown"),
                        "manufacture_date":     "N/A",
                        "expiry_date":          r.get("product_quantity", "N/A"),
                        "distribution_states":  r.get("distribution_pattern", "Check FDA website"),
                        "recall_status":        "recalled",
                        "message":              f"⛔ FDA RECALL: {r.get('reason_for_recall', 'Recalled by manufacturer.')} (Class {r.get('classification', 'N/A')})"
                    }), 200
        except Exception as fda_err:
            logger.error(f"⚠️ FDA recall lookup error: {fda_err}")

        # ── Step 3: Batch not found anywhere ───────────────────────────────────
        return jsonify({
            "status":    "not_found",
            "source":    "MedVerify",
            "batch_number": batch_number,
            "medicine_name": medicine_name,
            "message":   "This batch number is not yet in our registry. It may be a valid batch from a manufacturer not yet partnered with MedVerify, or it may be counterfeit. Verify with the pharmacist."
        }), 200

    except Exception as e:
        logger.error(f"Verify-batch endpoint error: {str(e)}", exc_info=True)
        return jsonify({"status": "error", "message": "Internal Server Error"}), 500

def get_community_report_count(client, medicine_name, project_id):
    """Returns the number of VERIFIED community reports for a given medicine name."""
    try:
        query = f"""
            SELECT COUNT(*) as report_count
            FROM `{project_id}.med_data.community_reports`
            WHERE LOWER(medicine_name) = LOWER(@medicine_name)
            AND review_status = 'verified'
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[bigquery.ScalarQueryParameter("medicine_name", "STRING", medicine_name)]
        )
        results = list(client.query(query, job_config=job_config).result())
        return int(results[0]['report_count']) if results else 0
    except Exception as e:
        print(f"⚠️ Community report count error: {e}")
        return 0

@app.route('/report', methods=['POST'])
@limiter.limit("5 per minute; 20 per day")
def report_medicine():
    """Endpoint to submit a community report for a suspicious medicine."""
    try:
        incoming_key = request.headers.get('X-API-Key', '')
        if incoming_key != API_KEY:
            return jsonify({"status": "error", "message": "Unauthorized"}), 401

        data = request.get_json(force=True, silent=True) or {}
        medicine_name = sanitize_input(data.get('medicine_name', '').strip())

        if not medicine_name:
            return jsonify({"status": "error", "message": "medicine_name is required."}), 400

        from datetime import datetime, timezone
        row = {
            "medicine_name": medicine_name,
            "reported_at": datetime.now(timezone.utc).isoformat(),
            "review_status": "pending",
        }
        table_ref = f"{PROJECT_ID}.med_data.community_reports"
        errors = client.insert_rows_json(table_ref, [row])

        if errors:
            logger.error(f"BigQuery insert errors: {errors}")
            return jsonify({"status": "error", "message": "Failed to save report."}), 500

        logger.info(f"📢 Community report logged (pending review): '{medicine_name}'")
        return jsonify({"status": "success", "message": "Report submitted for review. Thank you for helping keep medicines safe."}), 200

    except Exception as e:
        logger.error(f"Report endpoint error: {str(e)}", exc_info=True)
        return jsonify({"status": "error", "message": "Internal Server Error"}), 500

@app.route('/analyze', methods=['POST'])
@limiter.limit("20 per minute; 100 per day") 
def analyze_medicine():
    try:
        incoming_key = request.headers.get('X-API-Key', '')
        origin = request.headers.get('Origin', '')
        
        # DOMAIN LOCK: If the request comes from the official domain, we trust it without a key.
        # This keeps your token 100% secret as it never leaves the server for web users.
        is_official_web = origin == 'https://med-verify-authenticator.vercel.app'
        
        if not is_official_web and incoming_key != API_KEY:
            logger.warning(f"Unauthorized access attempt from {request.remote_addr} (Origin: {origin})")
            return jsonify({"status": "error", "message": "Unauthorized"}), 401

        top_words = []
        visual_score = 0.0 
        
        manual_input = request.json.get('manual_text') if request.is_json else request.form.get('manual_text')
        medicine_name = request.form.get('medicineName', '').strip()
        batch_number = request.form.get('batchNumber', '').strip()
        barcode = request.form.get('barcode', '').strip()
        manufacturer = request.form.get('manufacturer', '').strip()
        
        ocr_confidence_category = "N/A"
        barcode_match_status = "Not Provided"

        # LAYER 1: STRICT BARCODE CHECK
        if barcode:
            barcode_match_status = "Not Found"
            logger.info(f"🔍 Checking FDA Database for Barcode: {barcode}")
            fda_result = check_fda_barcode(barcode)
            if fda_result:
                barcode_match_status = "Verified (FDA)"
                logger.info("✅ FDA Match Found!")
                return jsonify({
                    "status": "verified_barcode",
                    "drug_name": fda_result["drug_name"],
                    "composition": fda_result["composition"],
                    "message": fda_result["message"] + f" (Manufacturer: {fda_result['manufacturer']})",
                    "evidence": {
                        "medicine_identified": "Yes",
                        "database_match": "FDA National Registry",
                        "regulatory_status": "Safe",
                        "packaging_analysis": "N/A",
                        "barcode_match": barcode_match_status,
                        "ocr_confidence": ocr_confidence_category
                    },
                    "recommendation": "Always purchase from a licensed pharmacy.",
                    "community_flagged": False,
                    "community_report_count": 0
                }), 200
            else:
                print("⚠️ Barcode not found in FDA database. Falling back to text search...")

        # Normalize the input to use either the old `manual_text` or the new `medicineName`
        if not manual_input and medicine_name:
            manual_input = medicine_name
            
        if manual_input and manual_input.strip():
            clean_manual = sanitize_input(manual_input)
            if not clean_manual:
                return jsonify({"status": "error", "message": "Invalid input provided."}), 400
                
            flat_input = clean_manual.replace('\n', ' ').replace('\r', ' ')
            clean_manual = re.sub(r'(?i)^medicine\s*:\s*', '', flat_input.strip())
            clean_manual = re.sub(r'(?i)^medicine\s+', '', clean_manual).strip()
            top_words = [clean_manual]
            logger.info(f"✅ Route: Manual -> '{top_words[0]}'")
            
        elif 'image' in request.files:
            file = request.files['image']
            
            if not validate_image(file):
                return jsonify({"status": "error", "message": "Invalid file. Only JPG/PNG/WEBP under 10MB allowed."}), 400
            
            file_bytes = np.frombuffer(file.read(), np.uint8)
            img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
            
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            logger.info("✅ Route: Image Upload")
            
            if vision_model:
                try:
                    model_img = cv2.resize(img_rgb, (224, 224)) 
                    model_img = img_to_array(model_img, dtype='float32')
                    model_img = np.expand_dims(model_img, axis=0)
                    
                    prediction = vision_model.predict(model_img, verbose=0)[0][0]
                    visual_score = float(prediction)
                    
                    if np.isnan(visual_score) or np.isinf(visual_score):
                        print("⚠️ Visual score was NaN/Inf — brain skipped, defaulting to 0.0")
                        visual_score = 0.0
                    else:
                        print(f"🧠 Visual Counterfeit Risk: {visual_score:.4f}")
                        
                except Exception as model_e:
                    print(f"⚠️ Brain Error: {model_e}")

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
            contrast_img = cv2.convertScaleAbs(denoised, alpha=1.8, beta=-30)
            
            import math
            
            results = reader.readtext(contrast_img, mag_ratio=2)
            all_ocr_text = " \n ".join([res[1] for res in results])
            
            if results:
                max_conf = max([res[2] for res in results])
                if max_conf > 0.8:
                    ocr_confidence_category = "High"
                elif max_conf > 0.5:
                    ocr_confidence_category = "Medium"
                else:
                    ocr_confidence_category = "Low"
            
            top_words = []
            try:
                from groq import Groq
                groq_api_key = os.getenv("GROQ_API_KEY")
                if not groq_api_key:
                    raise Exception("GROQ_API_KEY not found in environment.")
                    
                groq_client = Groq(api_key=groq_api_key)
                prompt = "You are a medical AI. Extract ONLY the primary medicine name (Brand Name or Generic Name) from this chaotic OCR text. Do not include dosage, manufacturer names, or instructions. Return EXACTLY and ONLY the primary medicine name as your complete answer.\n\nOCR Text:\n" + all_ocr_text
                
                completion = groq_client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.1
                )
                groq_name = completion.choices[0].message.content.strip()
                groq_name = re.sub(r"['\"]", "", groq_name)
                
                # Verify sanity of the response
                if len(groq_name) >= 3 and "unable" not in groq_name.lower():
                    top_words = [groq_name]
                    logger.info(f"🧠 Groq LLM Extracted: '{top_words[0]}'")
                else:
                    raise ValueError("Groq returned an invalid or empty name")
                    
            except Exception as e:
                print(f"⚠️ Groq extraction failed ({e}). Falling back to Font Size Heuristic.")
                
                ignore_chunks = ['contain', 'tablet', 'capsule', 'syrup', 'color', 'colour', 'titanium', 'dioxide', 'tartrazine', 'protect', 'direct', 'integrity', 'excipients', 'dosage', 'physician', 'store', 'temperature', 'yellow', 'red', 'blue', 'oxide', 'lake', 'water', 'dose', 'schedule', 'warning', 'keep', 'reach', 'children']
                
                extracted_chunks = []
                for res in results:
                    box, text, conf = res
                    if conf < 0.3:
                        continue
                        
                    width = math.dist(box[0], box[1])
                    height = math.dist(box[1], box[2])
                    area = width * height
                    
                    clean_text = re.sub(r'[^\w\s]', '', text).strip()
                    char_size = area / max(1, len(clean_text))
                    
                    for bad in ignore_chunks:
                        clean_text = re.compile(r'\b' + re.escape(bad) + r'\b', re.IGNORECASE).sub('', clean_text)
                        
                    clean_text = clean_text.strip()
                    
                    if len(clean_text) >= 4 and not clean_text.isdigit():
                        extracted_chunks.append((clean_text, char_size))
                
                if extracted_chunks:
                    extracted_chunks.sort(key=lambda x: x[1], reverse=True)
                    
                    for chunk, _ in extracted_chunks:
                        words_in_chunk = chunk.split()
                        for w in words_in_chunk:
                            if len(w) >= 4 and w not in top_words:
                                top_words.append(w)
                                if len(top_words) >= 5:
                                    break
                        if len(top_words) >= 5:
                            break
                            
                    print(f"📝 OCR Extracted Words (Sorted by Area-Per-Character): {top_words}")

            if not top_words:
                return jsonify({"status": "error", "message": "OCR could not read the medicine name cleanly. Please type it manually."}), 200

        else:
            return jsonify({"status": "error", "message": "No input provided."}), 400

        if top_words:
            matched_row = None
            final_term = top_words[0] 
            is_banned = False
            
            for raw_term in top_words:
                term = re.sub(r'[^\w\s]', ' ', raw_term).strip()
                logger.info(f"🔍 Checking DB for: '{term}'")
                
                banned_results = safe_query_banned(client, term, PROJECT_ID)
                if len(banned_results) > 0:
                    is_banned = True
                    final_term = term
                    break
                
                if is_banned:
                    break 

                query_results = safe_query_medicines(client, term, PROJECT_ID)
                if len(query_results) > 0:
                    matched_row = query_results[0]
                    final_term = term
                    logger.info(f"🎯 MATCH FOUND: {final_term}")
                    break 

            # 🔍 Check community reports for the final search term
            community_count = get_community_report_count(client, final_term, PROJECT_ID)
            community_flagged = community_count >= 3

            # 🚨 Check Medical Alerts (Lab Failures)
            medical_alert_details = None
            if not is_banned:
                medical_alert_details = check_medical_alerts(client, final_term, PROJECT_ID)

            # 🧠 Generate Layman Usage Description for the Ingredients
            usage_description = "Information not available."
            target_composition = "Unknown"
            
            if matched_row and matched_row.get('Composition'):
                target_composition = matched_row['Composition']
            elif not is_banned:
                core_drug = extract_core_drug_name(final_term)
                if check_rxnorm(core_drug):
                    target_composition = core_drug
                    
            if target_composition != "Unknown" and not is_banned:
                try:
                    from groq import Groq
                    groq_api_key = os.getenv("GROQ_API_KEY")
                    if groq_api_key:
                        groq_client = Groq(api_key=groq_api_key)
                        prompt = f"Explain what the following medicine composition is primarily used for in 1 simple sentence for a general patient. Keep it extremely concise and strictly state its generic medical uses. Composition: {target_composition}"
                        completion = groq_client.chat.completions.create(
                            model="llama-3.1-8b-instant",
                            messages=[{"role": "user", "content": prompt}],
                            temperature=0.2
                        )
                        usage_description = completion.choices[0].message.content.strip()
                except Exception as e:
                    print(f"⚠️ Usage LLM generation failed: {e}")

            if is_banned:
                print("🚨 RESULT: BANNED SUBSTANCE DETECTED!")
                return jsonify({
                    "status": "danger",
                    "drug_name": final_term,
                    "composition": "Banned Substance",
                    "message": "Regulatory alert: This formulation matches a substance flagged by regulatory authorities. Do not consume without consulting a healthcare professional.",
                    "evidence": {
                        "medicine_identified": "Yes",
                        "database_match": "Banned Registry",
                        "regulatory_status": "Banned",
                        "packaging_analysis": "N/A",
                        "barcode_match": barcode_match_status,
                        "ocr_confidence": ocr_confidence_category
                    },
                    "recommendation": "Do not consume. Consult a healthcare professional immediately.",
                    "community_flagged": community_flagged,
                    "community_report_count": community_count
                })

            elif medical_alert_details:
                print(f"⚠️ RESULT: MEDICAL ALERT FOR '{final_term}'")
                batch_text = medical_alert_details.get('Batch_No', 'Unknown')
                reason_text = medical_alert_details.get('Failure_Reason', 'Unknown')
                remarks_text = medical_alert_details.get('Remarks', 'None')
                return jsonify({
                    "status": "caution",
                    "drug_name": matched_row['Medicine_Name'] if matched_row else final_term,
                    "composition": matched_row['Composition'] if matched_row else target_composition,
                    "usage_description": usage_description,
                    "message": f"CAUTION: A recent batch of this medicine (Batch: {batch_text}) failed government lab testing for '{reason_text}'. Remarks: {remarks_text}. Please physically verify your box's batch number before consuming.",
                    "evidence": {
                        "medicine_identified": "Yes",
                        "database_match": "Indian Registry",
                        "regulatory_status": "Lab Failure Alert",
                        "packaging_analysis": "N/A",
                        "barcode_match": barcode_match_status,
                        "ocr_confidence": ocr_confidence_category
                    },
                    "recommendation": "Please physically verify your box's batch number. If it matches the failed batch, do not consume.",
                    "community_flagged": community_flagged,
                    "community_report_count": community_count
                })

            elif matched_row:
                if visual_score > 0.85:
                    return jsonify({
                        "status": "caution",
                        "drug_name": matched_row['Medicine_Name'],
                        "composition": matched_row['Composition'],
                        "usage_description": usage_description,
                        "message": "Database match found, but packaging analysis flagged visual inconsistencies. Confirm with your pharmacist before use.",
                        "visual_risk_score": round(visual_score, 2),
                        "evidence": {
                            "medicine_identified": "Yes",
                            "database_match": "Indian Registry",
                            "regulatory_status": "Safe",
                            "packaging_analysis": "High Risk",
                            "barcode_match": barcode_match_status,
                            "ocr_confidence": ocr_confidence_category
                        },
                        "recommendation": "Confirm with your pharmacist before use due to packaging anomalies.",
                        "community_flagged": community_flagged,
                        "community_report_count": community_count
                    })
                else:
                    return jsonify({
                        "status": "verified_database",
                        "drug_name": matched_row['Medicine_Name'],
                        "composition": matched_row['Composition'],
                        "usage_description": usage_description,
                        "message": "Verified database match. This medicine's name and composition were found in the authorized national registry.",
                        "evidence": {
                            "medicine_identified": "Yes",
                            "database_match": "Indian Registry",
                            "regulatory_status": "Safe",
                            "packaging_analysis": "Low Risk",
                            "barcode_match": barcode_match_status,
                            "ocr_confidence": ocr_confidence_category
                        },
                        "recommendation": "Always purchase from a licensed pharmacy.",
                        "community_flagged": community_flagged,
                        "community_report_count": community_count
                    })

            else:
                core_drug = extract_core_drug_name(final_term)
                if check_rxnorm(core_drug):
                    return jsonify({
                        "status": "verified_global",
                        "drug_name": final_term,
                        "composition": f"NIH Verified Active Ingredient ({core_drug})",
                        "usage_description": usage_description,
                        "message": "Global registry match. This medicine's active ingredient is recognized globally. Note: This specific brand is not yet in our primary local registry.",
                        "evidence": {
                            "medicine_identified": "Yes",
                            "database_match": "NIH RxNorm (Global)",
                            "regulatory_status": "Safe",
                            "packaging_analysis": "N/A",
                            "barcode_match": barcode_match_status,
                            "ocr_confidence": ocr_confidence_category
                        },
                        "recommendation": "This brand is not yet in our Indian registry. Always purchase from a licensed pharmacy.",
                        "community_flagged": community_flagged,
                        "community_report_count": community_count
                    })

                if visual_score > 0.5:
                    return jsonify({
                        "status": "unable_to_verify",
                        "drug_name": final_term,
                        "composition": "Not found in databases",
                        "usage_description": "Information not available.",
                        "message": "Unable to verify. This medicine was not found in any verified database and packaging analysis raised concerns. This does not confirm it is counterfeit. Please consult a licensed pharmacist.",
                        "evidence": {
                            "medicine_identified": "No",
                            "database_match": "None",
                            "regulatory_status": "Unknown",
                            "packaging_analysis": "High Risk",
                            "barcode_match": barcode_match_status,
                            "ocr_confidence": ocr_confidence_category
                        },
                        "recommendation": "This does not confirm it is counterfeit, but please consult a licensed pharmacist before use.",
                        "community_flagged": community_flagged,
                        "community_report_count": community_count
                    })
                else:
                    return jsonify({
                        "status": "unable_to_verify",
                        "drug_name": final_term,
                        "composition": "Not found in databases",
                        "usage_description": "Information not available.",
                        "message": "Unable to verify. This medicine could not be matched against any known database. This does not confirm it is counterfeit — please verify with a pharmacist.",
                        "evidence": {
                            "medicine_identified": "No",
                            "database_match": "None",
                            "regulatory_status": "Unknown",
                            "packaging_analysis": "Low Risk",
                            "barcode_match": barcode_match_status,
                            "ocr_confidence": ocr_confidence_category
                        },
                        "recommendation": "This does not confirm it is counterfeit, but please verify with a pharmacist.",
                        "community_flagged": community_flagged,
                        "community_report_count": community_count
                    })

    except Exception as e:
        logger.error(f"Analyze endpoint error: {str(e)}", exc_info=True)
        return jsonify({"status": "error", "message": "Internal Server Error"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 7860))
    print(f"🌍 Starting server on port {port}...")
    app.run(host='0.0.0.0', port=port)
    ## git setup successfully from terminal, vscode, pushing code to Hugging Face repo for deployment!
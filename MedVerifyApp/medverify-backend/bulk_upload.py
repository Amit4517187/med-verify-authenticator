import pandas as pd
from google.cloud import bigquery
import os
import argparse

# -------------------------------------------------------------
# MedVerify Bulk Data Uploader 
# Quickly ingest massive CSV files of medicines directly into BigQuery.
# -------------------------------------------------------------

def upload_csv_to_bigquery(csv_path, project_id, table_name):
    print(f"Loading {csv_path}...")
    
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"❌ Error reading {csv_path}: {e}")
        return

    # Standardize column headers to BigQuery format
    df.columns = df.columns.str.replace(' ', '_').str.replace('(', '').str.replace(')', '').str.lower()
    
    # Check if necessary columns exist
    if 'medicine_name' not in df.columns or 'composition' not in df.columns:
        print("⚠️ Warning: Could not find exactly 'medicine_name' or 'composition' columns.")
        print(f"Detected columns: {list(df.columns)}")
        print("Tip: You might need to rename the columns in your CSV to match your BigQuery table before uploading.")

    print(f"🚀 Initializing upload of {len(df):,} medicines...")
    
    client = bigquery.Client(project=project_id)
    table_ref = f"{project_id}.medverify_db.{table_name}"

    job_config = bigquery.LoadJobConfig(
        write_disposition="WRITE_APPEND", # Append data so it doesn't overwrite existing
        source_format=bigquery.SourceFormat.CSV,
        autodetect=True, 
    )

    try:
        job = client.load_table_from_dataframe(df, table_ref, job_config=job_config)
        job.result() 
        print(f"✅ SUCCESS! {len(df):,} medicines were added to '{table_name}' instantly.")
    except Exception as e:
        print(f"❌ Failed to upload: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload India Medicine CSV to BigQuery.")
    parser.add_argument("--csv", required=True, help="Path to your downloaded CSV file")
    parser.add_argument("--project", required=True, help="Your Google Cloud Project ID")
    parser.add_argument("--table", default="safe_query_medicines", help="Target BigQuery Table (e.g. safe_query_medicines)")
    args = parser.parse_args()
    
    upload_csv_to_bigquery(args.csv, args.project, args.table)

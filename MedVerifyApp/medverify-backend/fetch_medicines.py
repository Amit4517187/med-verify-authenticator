import os
import argparse
import pandas as pd
from datasets import load_dataset
from google.cloud import bigquery

# -------------------------------------------------------------
# MedVerify Dataset Auto-Fetcher
# Downloads an open-source dataset of 11,800+ Indian medicines
# and inserts them directly into your BigQuery Database!
# -------------------------------------------------------------

def main(project_id):
    print("⏳ Downloading Indian Medicines Dataset from Hugging Face Open-Source Library...")
    print("This dataset contains 11,825 real Indian medicine brands and their chemical compositions.")
    
    try:
        # Load dataset from Hugging Face public portal
        dataset = load_dataset("Aravind160324/indian-medicines", split='train')
    except Exception as e:
        print(f"❌ Download failed! Error: {e}")
        return
        
    # Convert to standard Pandas spreadsheet
    df = dataset.to_pandas()
    
    print(f"✅ Successfully downloaded {len(df):,} medicines!")
    
    # Rename columns to match what the MedVerify Python app expects: 'medicine_name' and 'composition'
    if 'name' in df.columns:
        df = df.rename(columns={'name': 'medicine_name'})
    
    # Keep only the columns we need for verification
    if 'medicine_name' in df.columns and 'composition' in df.columns:
        df = df[['medicine_name', 'composition']]
    else:
        print("❌ Dataset format changed. Expected 'name' and 'composition' columns.")
        return

    # Fill any missing blanks
    df = df.fillna("Unknown Formulation")

    print(f"🚀 Initializing secure connection to BigQuery Project: '{project_id}'...")
    
    from dotenv import load_dotenv
    import json
    from google.oauth2 import service_account

    load_dotenv()
    gcp_json = os.getenv('GCP_JSON_KEY')
    
    if not gcp_json:
        print("❌ Error: Could not find GCP_JSON_KEY in your .env file!")
        return
        
    creds_dict = json.loads(gcp_json, strict=False)
    credentials = service_account.Credentials.from_service_account_info(
        creds_dict,
        scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    
    # Initialize Google Cloud Client with credentials
    try:
        client = bigquery.Client(credentials=credentials, project=project_id)
        table_ref = f"{project_id}.med_data.safe_query_medicines"

        # Setup upload rules: We want to APPEND to existing valid drugs
        job_config = bigquery.LoadJobConfig(
            write_disposition="WRITE_APPEND", 
        )

        print(f"📤 Uploading straight to {table_ref}...")
        job = client.load_table_from_dataframe(df, table_ref, job_config=job_config)
        job.result() # Wait for job to complete
        
        print(f"\n🎉 SUCCESS! {len(df):,} new medicines were added to MedVerify instantly.")
        print("Your Python backend will now automatically identify 11,000+ brand new drugs!")
    except Exception as e:
        print(f"\n❌ Failed to upload to BigQuery: {e}")
        print("Hint: Check if your Google Cloud credentials are set up or if the --project ID is fully correct.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Auto-fetch and upload Indian Medicines.")
    parser.add_argument("--project", required=True, help="Your Google Cloud Project ID (e.g. alert-airway-449313)")
    args = parser.parse_args()
    
    main(args.project)

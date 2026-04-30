from google.cloud import bigquery
from google.oauth2 import service_account
from dotenv import load_dotenv
import os
import json

load_dotenv()
gcp_json = os.getenv('GCP_JSON_KEY')
credentials = service_account.Credentials.from_service_account_info(json.loads(gcp_json))
PROJECT_ID = os.environ.get("BIGQUERY_PROJECT", "studio-4456263262-8b86f")
client = bigquery.Client(credentials=credentials, project=PROJECT_ID)

tables = ["clean_medicines", "banned_drugs_clean", "batch_registry"]

for table_name in tables:
    full_table_id = f"{PROJECT_ID}.med_data.{table_name}"
    print(f"Updating schema for {full_table_id}...")
    try:
        query_job = client.query(f"ALTER TABLE `{full_table_id}` ADD COLUMN source STRING")
        query_job.result()
        print(f"Added source to {table_name}")
    except Exception as e:
        print(f"source col might exist: {e}")
        
    try:
        query_job = client.query(f"ALTER TABLE `{full_table_id}` ADD COLUMN last_verified_at TIMESTAMP")
        query_job.result()
        print(f"Added last_verified_at to {table_name}")
    except Exception as e:
        print(f"last_verified_at col might exist: {e}")


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

# 1. clean_medicines
table_id = f"{PROJECT_ID}.med_data.clean_medicines"
for col in ["manufacturer", "country", "source_url", "dosage_form", "strength"]:
    try:
        client.query(f"ALTER TABLE `{table_id}` ADD COLUMN {col} STRING").result()
        print(f"Added {col} to clean_medicines")
    except Exception as e:
        print(f"Error adding {col} to clean_medicines: {e}")

# 2. banned_drugs_clean
table_id = f"{PROJECT_ID}.med_data.banned_drugs_clean"
for col in ["source_url", "country"]:
    try:
        client.query(f"ALTER TABLE `{table_id}` ADD COLUMN {col} STRING").result()
        print(f"Added {col} to banned_drugs_clean")
    except Exception as e:
        print(f"Error adding {col} to banned_drugs_clean: {e}")

# 3. batch_registry
table_id = f"{PROJECT_ID}.med_data.batch_registry"
for col in ["source_url"]:
    try:
        client.query(f"ALTER TABLE `{table_id}` ADD COLUMN {col} STRING").result()
        print(f"Added {col} to batch_registry")
    except Exception as e:
        print(f"Error adding {col} to batch_registry: {e}")


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

query_job = client.query(f"ALTER TABLE `{PROJECT_ID}.med_data.community_reports` ADD COLUMN review_status STRING")
query_job.result()
print("Added review_status column.")

try:
    query_job = client.query(f"ALTER TABLE `{PROJECT_ID}.med_data.community_reports` ALTER COLUMN review_status SET DEFAULT 'pending'")
    query_job.result()
    print("Set default value for review_status.")
except Exception as e:
    print("Could not set default:", e)

try:
    query_job = client.query(f"UPDATE `{PROJECT_ID}.med_data.community_reports` SET review_status = 'pending' WHERE review_status IS NULL")
    query_job.result()
    print("Updated existing rows to pending.")
except Exception as e:
    print("Could not update rows:", e)

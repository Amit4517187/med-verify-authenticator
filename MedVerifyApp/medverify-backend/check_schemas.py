import os
import json
from google.oauth2 import service_account
from google.cloud import bigquery
from dotenv import load_dotenv

load_dotenv()
gcp_json = os.getenv('GCP_JSON_KEY')
project_id = os.getenv('BIGQUERY_PROJECT')
creds = service_account.Credentials.from_service_account_info(
    json.loads(gcp_json, strict=False),
    scopes=['https://www.googleapis.com/auth/cloud-platform']
)
client = bigquery.Client(credentials=creds, project=project_id)

tables_to_check = [
    "medical_alerts_clean",
    "automated_knowledge_base",
    "batch_registry",
    "drug_reports_clean"
]

for table_id in tables_to_check:
    try:
        table_ref = f"{project_id}.med_data.{table_id}"
        table = client.get_table(table_ref)
        print(f"\n--- {table_id} ---")
        for schema_field in table.schema:
            print(f"{schema_field.name} ({schema_field.field_type})")
    except Exception as e:
        print(f"Failed to fetch {table_id}: {e}")

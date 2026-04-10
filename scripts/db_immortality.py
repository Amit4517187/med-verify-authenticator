"""
DB Immortality Protocol
-----------------------
This script extends the expiration date of all BigQuery tables in the 'med_data'
dataset to 59 days in the future. Because BigQuery Sandbox limits lifetime to 60 days,
running this daily effectively creates permanent tables for free.
"""

import os
import json
import datetime
import logging
from google.oauth2 import service_account
from google.cloud import bigquery
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def make_tables_immortal():
    load_dotenv()
    
    # Authenticate
    gcp_json = os.getenv('GCP_JSON_KEY')
    project_id = os.getenv('BIGQUERY_PROJECT')

    if not gcp_json or not project_id:
        logger.error("Missing GCP_JSON_KEY or BIGQUERY_PROJECT environment variables. Exiting.")
        return

    try:
        creds = service_account.Credentials.from_service_account_info(
            json.loads(gcp_json, strict=False),
            scopes=['https://www.googleapis.com/auth/cloud-platform']
        )
        client = bigquery.Client(credentials=creds, project=project_id)
        
        dataset_id = f"{project_id}.med_data"
        logger.info(f"Scanning dataset: {dataset_id}")
        
        tables = list(client.list_tables(dataset_id))
        if not tables:
            logger.info("No tables found in dataset.")
            return
            
        success_count = 0
        
        # Calculate new expiration (59 days from now to be safe within the 60 day limit)
        new_expiry = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=59)
        
        for table_item in tables:
            table_ref = table_item.reference
            table = client.get_table(table_ref)
            
            try:
                table.expires = new_expiry
                client.update_table(table, ["expires"])
                logger.info(f"✅ Extended lifetime of {table.table_id} to {new_expiry.strftime('%Y-%m-%d')}")
                success_count += 1
            except Exception as update_err:
                logger.error(f"Failed to extend {table.table_id}: {update_err}")

        logger.info(f"Immortality protocol complete: {success_count}/{len(tables)} tables extended.")

    except Exception as e:
        logger.error(f"Fatal error during immortality run: {str(e)}")

if __name__ == "__main__":
    make_tables_immortal()

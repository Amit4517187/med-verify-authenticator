import csv
import json
import os

csv_path = '/Users/amitmishra/WORK/medverify-backend/apollo_medicines.csv'
json_output = '/Users/amitmishra/WORK/med_verify_authenticator/public/medicine_db.json'

def convert():
    medicines = []
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Keep it lightweight
            medicines.append({
                "n": row.get('Medicine_Name', '').strip().lower(),
                "c": row.get('Composition', '').strip().lower(),
                "m": row.get('manufacturer', '').strip().lower()
            })
    
    with open(json_output, 'w', encoding='utf-8') as f:
        json.dump(medicines, f, separators=(',', ':')) # Compact JSON
    
    print(f"Exported {len(medicines)} medicines to {json_output}")

if __name__ == "__main__":
    convert()

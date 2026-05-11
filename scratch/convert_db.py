import csv
import json
import os

# New Master File Path
csv_path = '/Users/amitmishra/Downloads/master_medicines_enriched.csv'
json_output = '/Users/amitmishra/WORK/med_verify_authenticator/public/medicine_db.json'

def convert():
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found!")
        return

    medicines = []
    print(f"Starting conversion of {csv_path} with concise descriptions...")
    
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        count = 0
        for row in reader:
            name = row.get('medicine_name', '').strip()
            if not name: continue
            
            # Get description and truncate to ~15 words to save tokens/space
            desc = row.get('description', '').strip()
            if not desc or desc.lower() == 'unknown':
                desc = "Used for patient health management."
            
            # Truncate to 100 characters max for offline portability
            short_desc = (desc[:97] + '...') if len(desc) > 100 else desc

            medicines.append({
                "n": name.lower(),
                "m": row.get('manufacturer', '').strip().lower(),
                "c": row.get('composition', '').strip().lower(),
                "d": short_desc # d for description
            })
            count += 1
            if count % 50000 == 0:
                print(f"Processed {count} records...")
    
    print(f"Writing {len(medicines)} records to {json_output}...")
    with open(json_output, 'w', encoding='utf-8') as f:
        json.dump(medicines, f, separators=(',', ':')) # Ultra-Compact JSON
    
    print(f"Done! Final file size: {os.path.getsize(json_output) / 1024 / 1024:.2f} MB")

if __name__ == "__main__":
    convert()

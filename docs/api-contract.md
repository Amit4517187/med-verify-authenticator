# MedVerify API Contract (Private)

This document defines the interface for the private MedVerify backend engine. The frontend consumes these endpoints without needing direct access to the backend source code.

## 1. POST `/analyze`
Main endpoint for medicine authentication via image or text.

### Request
- **Headers**: `Origin` (must match authorized domain)
- **Body** (Multipart Form Data):
  - `image`: (File) Optional. Photo of medicine packaging.
  - `manual_text`: (String) Optional. Manually entered details.
  - `medicineName`: (String) Optional.
  - `batchNumber`: (String) Optional.
  - `barcode`: (String) Optional.
  - `manufacturer`: (String) Optional.

### Response
```json
{
  "status": "safe | verified_database | verified_barcode | verified_global | caution | danger | unable_to_verify",
  "drug_name": "Medicine Name",
  "composition": "Active ingredients",
  "message": "Detailed analysis result",
  "visual_risk_score": 0.05,
  "evidence": {
    "medicine_identified": "Yes/No",
    "database_match": "Registry Name",
    "regulatory_status": "Safe/Restricted",
    "packaging_analysis": "Low Risk/High Risk",
    "barcode_match": "Verified/Not Found",
    "ocr_confidence": "High/Low"
  },
  "recommendation": "Safety recommendation string"
}
```

## 2. POST `/verify-batch`
Cross-references batch details with manufacturer records.

### Request
```json
{
  "medicine_name": "String",
  "batch_number": "String"
}
```

### Response
```json
{
  "status": "verified | recalled | not_found",
  "message": "Status description",
  "manufacturer": "Company Name",
  "expiry_date": "YYYY-MM-DD"
}
```

## 3. GET `/recent-bans`
Returns list of recently banned or recalled drugs.

### Response
```json
{
  "recent_bans": [
    { "drug_name": "String", "reason": "String" }
  ]
}
```

## 4. POST `/report`
Flags a medicine result for review by the community/administrators.

### Request
```json
{
  "medicine_name": "String"
}
```

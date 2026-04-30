export interface EvidenceData {
  medicine_identified: string;
  database_match: string;
  regulatory_status: string;
  barcode_match?: string;
  ocr_confidence?: string;
  packaging_analysis?: string;
}

export interface VerificationResult {
  status: 'safe' | 'verified_database' | 'verified_barcode' | 'verified_global' | 'caution' | 'danger' | 'unable_to_verify' | 'recalled' | 'error';
  drug_name?: string;
  composition?: string;
  message?: string;
  usage_description?: string;
  visual_risk_score?: number;
  evidence?: EvidenceData;
  recommendation?: string;
  community_flagged?: boolean;
  community_report_count?: number;
  batch_number?: string;
  manufacturer?: string;
  manufacture_date?: string;
  expiry_date?: string;
  source?: string;
}

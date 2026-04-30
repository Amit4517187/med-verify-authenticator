export type VerificationStatus = "safe" | "caution" | "danger" | "error" | "verified_global" | "unable_to_verify" | "verified_database" | "verified_barcode";

export interface VerificationResult {
  status: VerificationStatus;
  drug_name?: string;
  composition?: string;
  usage_description?: string;
  message?: string;
  communityFlagged?: boolean;
  communityReportCount?: number;
  evidence?: {
    medicine_identified: string;
    database_match: string;
    regulatory_status: string;
    packaging_analysis: string;
    barcode_match: string;
    ocr_confidence: string;
  };
  recommendation?: string;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  medicineName: string;
  status: VerificationStatus;
  result: VerificationResult;
}

export interface ManualFormData {
  medicineName: string;
  batchNumber: string;
  barcode: string;
  manufacturer: string;
}

export type VerificationStatus = "safe" | "caution" | "danger" | "error";

export interface VerificationResult {
  status: VerificationStatus;
  drug_name?: string;
  composition?: string;
  message?: string;
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

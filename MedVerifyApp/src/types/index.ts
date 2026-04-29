export type VerificationStatus = "safe" | "caution" | "danger" | "error" | "verified_global" | "unable_to_verify";

export interface VerificationResult {
  status: VerificationStatus;
  drug_name?: string;
  composition?: string;
  usage_description?: string;
  message?: string;
  communityFlagged?: boolean;
  communityReportCount?: number;
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

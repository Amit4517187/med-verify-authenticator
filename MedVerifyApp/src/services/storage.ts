import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScanHistoryItem, VerificationResult, VerificationStatus } from "../types";

const HISTORY_KEY = "@medverify_scan_history";
const MAX_HISTORY = 50;

export async function getScanHistory(): Promise<ScanHistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveScanResult(
  medicineName: string,
  status: VerificationStatus,
  result: VerificationResult
): Promise<void> {
  try {
    const current = await getScanHistory();
    const newItem: ScanHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      medicineName: medicineName || result.drug_name || "Unknown Medicine",
      status,
      result,
    };
    const updated = [newItem, ...current].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to save scan result:", e);
  }
}

export async function clearScanHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

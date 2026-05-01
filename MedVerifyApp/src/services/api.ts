import Constants from "expo-constants";
import { VerificationResult } from "../types";

export const API_URL = (Constants.expoConfig?.extra?.apiUrl as string) || "";
// Optional: Use a server-side proxy for production to avoid exposing keys in mobile bundles
export const API_KEY = (Constants.expoConfig?.extra?.apiKey as string) || "";

export type AnalyzeInput =
  | { type: "image"; uri: string; mimeType: string; fileName: string }
  | { type: "manual"; medicineName: string; batchNumber: string; barcode: string; manufacturer: string };

export async function analyzeMedicine(input: AnalyzeInput): Promise<VerificationResult> {
  const formData = new FormData();

  if (input.type === "image") {
    // @ts-expect-error - React Native FormData accepts { uri, type, name }
    formData.append("image", {
      uri: input.uri,
      type: input.mimeType,
      name: input.fileName,
    });
  } else {
    const parts = [
      input.medicineName && `Medicine: ${input.medicineName}`,
      input.batchNumber && `Batch: ${input.batchNumber}`,
      input.barcode && `Barcode: ${input.barcode}`,
      input.manufacturer && `Manufacturer: ${input.manufacturer}`,
    ].filter(Boolean);
    formData.append("manual_text", parts.join("\n"));
  }

  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "true",
  };

  if (API_KEY) {
    headers["X-API-Key"] = API_KEY;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Server returned ${response.status}: ${response.statusText || "Unexpected error"}`);
  }

  const data: VerificationResult = await response.json();
  return data;
}

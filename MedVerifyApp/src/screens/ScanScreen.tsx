import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CameraView } from "expo-camera";
import { useLanguage } from "../contexts/LanguageContext";
import { analyzeMedicine } from "../services/api";
import { saveScanResult } from "../services/storage";
import { ManualFormData, VerificationStatus } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = {
  navigation: any;
};

const { width } = Dimensions.get("window");

const ANALYSIS_STEPS = [
  "analyzingStep1",
  "analyzingStep2",
  "analyzingStep3",
  "analyzingStep4",
] as const;

type StepKey = typeof ANALYSIS_STEPS[number];

export default function ScanScreen({ navigation }: Props) {
  const { t } = useLanguage();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerPermission, setScannerPermission] = useState<boolean | null>(null);
  const [form, setForm] = useState<ManualFormData>({
    medicineName: "",
    batchNumber: "",
    barcode: "",
    manufacturer: "",
  });
  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startStepAnimation = () => {
    setCurrentStep(0);
    stepIntervalRef.current = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 2000);
  };

  const stopStepAnimation = () => {
    if (stepIntervalRef.current) {
      clearInterval(stepIntervalRef.current);
      stepIntervalRef.current = null;
    }
  };

  // Camera / Gallery
  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera permission is needed to take photos.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Gallery permission is needed to select photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openBarcodeScanner = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setScannerPermission(status === "granted");
    if (status === "granted") {
      setShowScanner(true);
    } else {
      Alert.alert("Permission Required", "Camera permission is needed to scan barcodes.");
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setShowScanner(false);
    setForm((prev) => ({ ...prev, barcode: data }));
  };

  // Submit
  const handleSubmit = async () => {
    const hasImage = !!imageUri;
    const hasManual =
      form.medicineName.trim() ||
      form.batchNumber.trim() ||
      form.barcode.trim() ||
      form.manufacturer.trim();

    if (!hasImage && !hasManual) {
      Alert.alert(
        "Missing Information",
        "Please take/upload a medicine photo or enter at least the medicine name.",
        [{ text: "OK" }]
      );
      return;
    }

    setLoading(true);
    startStepAnimation();

    try {
      let result;

      if (hasImage && imageUri) {
        const fileName = imageUri.split("/").pop() || "medicine.jpg";
        const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
        const mimeType = ext === "png" ? "image/png" : "image/jpeg";
        result = await analyzeMedicine({
          type: "image",
          uri: imageUri,
          mimeType,
          fileName,
        });
      } else {
        result = await analyzeMedicine({
          type: "manual",
          medicineName: form.medicineName.trim(),
          batchNumber: form.batchNumber.trim(),
          barcode: form.barcode.trim(),
          manufacturer: form.manufacturer.trim(),
        });
      }

      if (result.status === "error") {
        Alert.alert("Analysis Error", result.message || "An error occurred during analysis.");
        return;
      }

      // Save to history
      await saveScanResult(
        form.medicineName || result.drug_name || "Unknown",
        result.status as VerificationStatus,
        result
      );

      navigation.navigate("Results", { result });
    } catch (err: any) {
      const isNetwork =
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("NetworkError") ||
        err?.message?.includes("network");
      Alert.alert(
        isNetwork ? t("connectionErrorTitle") : "Server Error",
        isNetwork
          ? t("connectionError")
          : err?.message || "Cannot connect to the MediGuard Engine. Please try again.",
        [
          { text: t("tryAgain"), onPress: handleSubmit },
          { text: t("cancel"), style: "cancel" },
        ]
      );
    } finally {
      setLoading(false);
      stopStepAnimation();
    }
  };

  const canSubmit =
    !!imageUri ||
    !!form.medicineName.trim() ||
    !!form.batchNumber.trim() ||
    !!form.barcode.trim() ||
    !!form.manufacturer.trim();

  return (
    <View style={styles.container}>
      {/* Barcode Scanner Modal */}
      <Modal visible={showScanner} animationType="slide" onRequestClose={() => setShowScanner(false)}>
        <View style={styles.scannerContainer}>
          <CameraView
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "ean8", "upc_e", "codabar", "code39", "code93", "code128", "itf14"]
            }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scannerHint}>Point camera at barcode or QR code</Text>
            <TouchableOpacity onPress={() => setShowScanner(false)} style={styles.closeScannerBtn}>
              <Text style={styles.closeScannerText}>✕  Cancel Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <View style={styles.shieldContainer}>
              <Text style={styles.shieldIcon}>🛡️</Text>
            </View>
            <Text style={styles.loadingTitle}>{t("analyzingDetail")}</Text>
            <Text style={styles.loadingSubtitle}>{t("analyzingSubDetail")}</Text>
            <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 12 }} />
            <Text style={styles.stepText}>{t(ANALYSIS_STEPS[currentStep] as StepKey)}</Text>
            <View style={styles.stepDots}>
              {ANALYSIS_STEPS.map((_, i) => (
                <View
                  key={i}
                  style={[styles.stepDot, i <= currentStep ? styles.stepDotActive : null]}
                />
              ))}
            </View>
            <Text style={styles.loadingHint}>This may take 5–8 seconds</Text>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.title}>{t("uploadTitle")}</Text>
        <Text style={styles.subtitle}>{t("uploadSubtitle")}</Text>

        {/* Image Preview or Picker Buttons */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📸  {t("uploadPhoto")}</Text>
          {imageUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
              <TouchableOpacity style={styles.clearBtn} onPress={() => setImageUri(null)}>
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoBtn} onPress={pickFromCamera} activeOpacity={0.8}>
                <Text style={styles.photoBtnIcon}>📷</Text>
                <Text style={styles.photoBtnText}>{t("uploadPhoto")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoBtn} onPress={pickFromGallery} activeOpacity={0.8}>
                <Text style={styles.photoBtnIcon}>🖼️</Text>
                <Text style={styles.photoBtnText}>{t("uploadGallery")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.photoBtn, styles.barcodeBtn]} onPress={openBarcodeScanner} activeOpacity={0.8}>
                <Text style={styles.photoBtnIcon}>📲</Text>
                <Text style={styles.photoBtnText}>{t("scanBarcode")}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t("orEnterManually")}</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Manual Form */}
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t("medicineName")}</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Paracetamol 500mg"
              placeholderTextColor="#475569"
              value={form.medicineName}
              onChangeText={(v) => setForm({ ...form, medicineName: v })}
            />
          </View>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>{t("batchNumber")}</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. BN-2024-001"
                placeholderTextColor="#475569"
                value={form.batchNumber}
                onChangeText={(v) => setForm({ ...form, batchNumber: v })}
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>{t("barcode")}</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 8901234567"
                placeholderTextColor="#475569"
                value={form.barcode}
                onChangeText={(v) => setForm({ ...form, barcode: v })}
                keyboardType="number-pad"
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t("manufacturer")}</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Cipla Ltd."
              placeholderTextColor="#475569"
              value={form.manufacturer}
              onChangeText={(v) => setForm({ ...form, manufacturer: v })}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || loading}
          activeOpacity={0.85}
        >
          <Text style={styles.submitBtnText}>
            {loading ? t("analyzing") : `🔍  ${t("verifyMedicine")}`}
          </Text>
        </TouchableOpacity>

        <Text style={styles.privacyNote}>🔒 Your data is processed securely and never stored.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  content: { padding: 20, paddingTop: 16, paddingBottom: 40 },

  title: { fontSize: 26, fontWeight: "800", color: "#f8fafc", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#94a3b8", textAlign: "center", marginBottom: 24, lineHeight: 20 },

  card: {
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.15)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    gap: 14,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#f1f5f9" },

  photoButtons: { gap: 10 },
  photoBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59,130,246,0.1)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.25)",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  barcodeBtn: {
    backgroundColor: "rgba(16,185,129,0.1)",
    borderColor: "rgba(16,185,129,0.25)",
  },
  photoBtnIcon: { fontSize: 20 },
  photoBtnText: { fontSize: 14, fontWeight: "600", color: "#cbd5e1" },

  imageContainer: { position: "relative", alignItems: "center" },
  previewImage: { width: "100%", height: 200, borderRadius: 12 },
  clearBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(239,68,68,0.85)",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },

  divider: { flexDirection: "row", alignItems: "center", marginVertical: 8, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(59,130,246,0.15)" },
  dividerText: { fontSize: 12, color: "#64748b", fontWeight: "600" },

  inputGroup: { gap: 6 },
  row: { flexDirection: "row" },
  inputLabel: { fontSize: 13, fontWeight: "600", color: "#94a3b8" },
  input: {
    backgroundColor: "rgba(30,41,59,0.8)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.2)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: "#f1f5f9",
    fontSize: 14,
  },

  submitBtn: {
    backgroundColor: "#3b82f6",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  submitBtnDisabled: { backgroundColor: "#1e3a5f", shadowOpacity: 0 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  privacyNote: {
    textAlign: "center",
    fontSize: 12,
    color: "#475569",
    marginTop: 12,
  },

  // Loading Overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: "rgba(10,15,30,0.97)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingCard: {
    alignItems: "center",
    maxWidth: 300,
  },
  shieldContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(59,130,246,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(59,130,246,0.3)",
  },
  shieldIcon: { fontSize: 36 },
  loadingTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#f8fafc",
    textAlign: "center",
    marginBottom: 4,
  },
  loadingSubtitle: { fontSize: 13, color: "#64748b", textAlign: "center", marginBottom: 8 },
  stepText: {
    marginTop: 14,
    fontSize: 13,
    color: "#60a5fa",
    fontWeight: "600",
    textAlign: "center",
  },
  stepDots: { flexDirection: "row", gap: 8, marginTop: 12 },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  stepDotActive: { backgroundColor: "#3b82f6" },
  loadingHint: { fontSize: 11, color: "#334155", marginTop: 20, textAlign: "center" },

  // Barcode Scanner
  scannerContainer: { flex: 1, backgroundColor: "#000" },
  scannerOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#3b82f6",
    borderRadius: 16,
    marginBottom: 24,
  },
  scannerHint: { color: "#fff", fontSize: 15, marginBottom: 30, textAlign: "center" },
  closeScannerBtn: {
    backgroundColor: "rgba(239,68,68,0.9)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  closeScannerText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});

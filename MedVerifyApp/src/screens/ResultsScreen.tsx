import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useLanguage } from "../contexts/LanguageContext";
import { VerificationResult } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

type Props = {
  navigation: any;
  route: RouteProp<RootStackParamList, "Results">;
};

const STATUS_CONFIG = {
  safe: {
    emoji: "✅",
    bgColor: "rgba(16,185,129,0.15)",
    borderColor: "rgba(16,185,129,0.4)",
    textColor: "#34d399",
    badgeBg: "rgba(16,185,129,0.2)",
    label: "genuine",
    desc: "genuineDesc",
  },
  verified_global: {
    emoji: "🌐",
    bgColor: "rgba(16,185,129,0.15)",
    borderColor: "rgba(16,185,129,0.4)",
    textColor: "#34d399",
    badgeBg: "rgba(16,185,129,0.2)",
    label: "realMedicine",
    desc: "realMedicineDesc",
  },
  caution: {
    emoji: "⚠️",
    bgColor: "rgba(245,158,11,0.15)",
    borderColor: "rgba(245,158,11,0.4)",
    textColor: "#fbbf24",
    badgeBg: "rgba(245,158,11,0.2)",
    label: "suspicious",
    desc: "suspiciousDesc",
  },
  danger: {
    emoji: "🚨",
    bgColor: "rgba(239,68,68,0.15)",
    borderColor: "rgba(239,68,68,0.4)",
    textColor: "#f87171",
    badgeBg: "rgba(239,68,68,0.2)",
    label: "fake",
    desc: "fakeDesc",
  },
  unable_to_verify: {
    emoji: "❓",
    bgColor: "rgba(148,163,184,0.15)",
    borderColor: "rgba(148,163,184,0.3)",
    textColor: "#94a3b8",
    badgeBg: "rgba(148,163,184,0.15)",
    label: "unableToVerify",
    desc: "unableToVerifyDesc",
  },
  error: {
    emoji: "❓",
    bgColor: "rgba(148,163,184,0.15)",
    borderColor: "rgba(148,163,184,0.3)",
    textColor: "#94a3b8",
    badgeBg: "rgba(148,163,184,0.15)",
    label: "suspicious",
    desc: "suspiciousDesc",
  },
};

export default function ResultsScreen({ navigation, route }: Props) {
  const { t } = useLanguage();
  const { result } = route.params;

  const [addedToCabinet, setAddedToCabinet] = React.useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

  const config = STATUS_CONFIG[result.status] || STATUS_CONFIG.error;

  const handleAddToCabinet = async () => {
    try {
      const stored = await AsyncStorage.getItem("medverify_cabinet");
      const cabinet = stored ? JSON.parse(stored) : [];
      const newMed = {
        id: Date.now().toString(),
        name: result.drug_name || "Unknown Medicine",
        composition: result.composition || "",
        addedAt: new Date().toISOString(),
      };
      cabinet.push(newMed);
      await AsyncStorage.setItem("medverify_cabinet", JSON.stringify(cabinet));
      setAddedToCabinet(true);
      Alert.alert("Success", "Added to your Medicine Cabinet.");
    } catch (e) {
      Alert.alert("Error", "Could not add to cabinet.");
    }
  };

  const handleGetCertificate = async () => {
    try {
      setIsGeneratingPdf(true);
      const html = `
        <html>
          <body style="font-family: sans-serif; padding: 40px;">
            <h1 style="color: #0f172a;">MedVerify Certificate</h1>
            <h2 style="color: ${config.textColor};">${t(config.label as any)}</h2>
            <hr />
            <p><strong>Medicine Name:</strong> ${result.drug_name || "N/A"}</p>
            <p><strong>Composition:</strong> ${result.composition || "N/A"}</p>
            <p><strong>Analysis:</strong> ${result.message || "N/A"}</p>
            <br />
            <p style="color: #64748b; font-size: 12px;">Generated on: ${new Date().toLocaleString()}</p>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (e) {
      Alert.alert("Error", "Could not generate certificate.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleFindPharmacy = () => {
    Linking.openURL("https://www.google.com/maps/search/pharmacies+near+me");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Status Card */}
      <View
        style={[
          styles.statusCard,
          { backgroundColor: config.bgColor, borderColor: config.borderColor },
        ]}
      >
        <Text style={styles.statusEmoji}>{config.emoji}</Text>
        <Text style={styles.verificationComplete}>{t("verificationComplete")}</Text>
        <View style={[styles.statusBadge, { backgroundColor: config.badgeBg }]}>
          <Text style={[styles.statusBadgeText, { color: config.textColor }]}>
            {t(config.label as any)}
          </Text>
        </View>
        <Text style={styles.statusDesc}>{t(config.desc as any)}</Text>
      </View>

      {/* Drug Details */}
      {(result.drug_name || result.composition || result.message) && (
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>📋 Verification Details</Text>
          {result.drug_name && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("drugName")}</Text>
              <Text style={styles.detailValue}>{result.drug_name}</Text>
            </View>
          )}
          {result.composition && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("composition")}</Text>
              <Text style={styles.detailValue}>{result.composition}</Text>
              {result.usage_description && result.usage_description !== "Information not available." && (
                <View style={styles.usageContainer}>
                  <Text style={styles.usageTitle}>What it is used for:</Text>
                  <Text style={styles.usageText}>{result.usage_description}</Text>
                </View>
              )}
            </View>
          )}
          {result.evidence ? (
            <>
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.detailLabel}>{t("evidenceBreakdown" as any)}</Text>
                <View style={styles.evidenceContainer}>
                  <View style={styles.evidenceRow}>
                    <Text style={styles.evidenceLabel}>{t("medicineIdentified" as any)}:</Text>
                    <Text style={styles.evidenceValue}>{result.evidence.medicine_identified}</Text>
                  </View>
                  <View style={styles.evidenceRow}>
                    <Text style={styles.evidenceLabel}>{t("databaseMatch" as any)}:</Text>
                    <Text style={styles.evidenceValue}>{result.evidence.database_match}</Text>
                  </View>
                  <View style={styles.evidenceRow}>
                    <Text style={styles.evidenceLabel}>{t("regulatoryStatus" as any)}:</Text>
                    <Text style={styles.evidenceValue}>{result.evidence.regulatory_status}</Text>
                  </View>
                  <View style={styles.evidenceRow}>
                    <Text style={styles.evidenceLabel}>{t("packagingAnalysis" as any)}:</Text>
                    <Text style={styles.evidenceValue}>{result.evidence.packaging_analysis}</Text>
                  </View>
                </View>
              </View>
              {result.recommendation && (
                <View style={[styles.detailRow, styles.recommendationContainer]}>
                  <Text style={styles.recommendationTitle}>{t("recommendation" as any)}</Text>
                  <Text style={styles.recommendationText}>{result.recommendation}</Text>
                </View>
              )}
            </>
          ) : result.message ? (
            <View style={[styles.detailRow, styles.messageRow]}>
              <Text style={styles.detailLabel}>Analysis</Text>
              <Text style={[styles.detailValue, styles.messageText]}>{result.message}</Text>
            </View>
          ) : null}
        </View>
      )}

      {/* Community Warning Banner */}
      {result.communityFlagged && (
        <View style={styles.communityWarningCard}>
          <Text style={styles.communityWarningTitle}>👥 Community Warning</Text>
          <Text style={styles.communityWarningText}>
            {result.communityReportCount || 1} users near you have flagged this medicine as suspicious. Verify with a licensed pharmacist before use.
          </Text>
        </View>
      )}

      {/* Warning for danger */}
      {result.status === "danger" && (
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>⛔ Do NOT Consume</Text>
          <Text style={styles.warningText}>
            This medicine has failed multiple verification layers. Immediately consult a licensed pharmacist or healthcare professional.
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => navigation.navigate("MainTabs", { screen: "Scan" })}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryBtnText}>📸  {t("scanAnother")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={handleAddToCabinet}
        disabled={addedToCabinet}
      >
        <Text style={[styles.actionBtnText, addedToCabinet && { color: "#10b981" }]}>
          {addedToCabinet ? "✅ Added to Cabinet" : "🗄️ Add to Cabinet"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={handleGetCertificate}
        disabled={isGeneratingPdf}
      >
        {isGeneratingPdf ? (
          <ActivityIndicator color="#cbd5e1" size="small" />
        ) : (
          <Text style={styles.actionBtnText}>📄 Get Certificate</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={handleFindPharmacy}
      >
        <Text style={styles.actionBtnText}>📍 Find Genuine Pharmacy</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
        activeOpacity={0.85}
      >
        <Text style={styles.secondaryBtnText}>🏠  Back to Home</Text>
      </TouchableOpacity>

      <Text style={styles.privacyNote}>🔒 This result is not stored on our servers.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  content: { padding: 20, paddingBottom: 40 },

  // Status Card
  statusCard: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    marginBottom: 20,
  },
  statusEmoji: { fontSize: 52, marginBottom: 12 },
  verificationComplete: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 14,
  },
  statusBadgeText: { fontSize: 18, fontWeight: "800" },
  statusDesc: { fontSize: 14, color: "#cbd5e1", textAlign: "center", lineHeight: 22 },

  // Details Card
  detailsCard: {
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.15)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    gap: 14,
  },
  detailsTitle: { fontSize: 15, fontWeight: "700", color: "#f1f5f9", marginBottom: 4 },
  detailRow: {
    borderTopWidth: 1,
    borderTopColor: "rgba(59,130,246,0.08)",
    paddingTop: 10,
    gap: 4,
  },
  detailLabel: { fontSize: 11, fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 },
  detailValue: { fontSize: 14, color: "#cbd5e1", lineHeight: 20 },
  messageRow: {},
  messageText: { lineHeight: 22 },
  usageContainer: {
    marginTop: 10,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  evidenceContainer: {
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  evidenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    paddingBottom: 4,
  },
  evidenceLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
  evidenceValue: {
    fontSize: 12,
    color: "#f8fafc",
    fontWeight: "600",
  },
  recommendationContainer: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#60a5fa",
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: "#bfdbfe",
    lineHeight: 18,
    fontWeight: "500",
  },
  usageTitle: {
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  usageText: {
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 18,
  },
  // Warning Card
  warningCard: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.35)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  warningTitle: { fontSize: 16, fontWeight: "800", color: "#f87171", marginBottom: 8 },
  warningText: { fontSize: 13, color: "#fca5a5", lineHeight: 20 },

  // Community Warning Card
  communityWarningCard: {
    backgroundColor: "rgba(245,158,11,0.12)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.35)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  communityWarningTitle: { fontSize: 16, fontWeight: "800", color: "#fbbf24", marginBottom: 8 },
  communityWarningText: { fontSize: 13, color: "#fcd34d", lineHeight: 20 },

  // Buttons
  primaryBtn: {
    backgroundColor: "#3b82f6",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  actionBtn: {
    backgroundColor: "rgba(30,41,59,0.8)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.2)",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  actionBtnText: { color: "#cbd5e1", fontSize: 14, fontWeight: "600" },
  secondaryBtn: {
    backgroundColor: "rgba(30,41,59,0.8)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.2)",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  secondaryBtnText: { color: "#94a3b8", fontSize: 14, fontWeight: "600" },

  privacyNote: { textAlign: "center", fontSize: 12, color: "#334155" },
});

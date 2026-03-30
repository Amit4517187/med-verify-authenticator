import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
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

  const config = STATUS_CONFIG[result.status] || STATUS_CONFIG.error;

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
            </View>
          )}
          {result.message && (
            <View style={[styles.detailRow, styles.messageRow]}>
              <Text style={styles.detailLabel}>Analysis</Text>
              <Text style={[styles.detailValue, styles.messageText]}>{result.message}</Text>
            </View>
          )}
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

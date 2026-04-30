import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { useLanguage, TranslationKey } from "../contexts/LanguageContext";
import { API_URL } from "../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Constants from 'expo-constants';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const { width } = Dimensions.get("window");

const FEATURES = [
  { icon: "🔬", key: "feature1" as const },
  { icon: "📋", key: "feature2" as const },
  { icon: "📲", key: "feature3" as const },
  { icon: "💰", key: "feature4" as const },
  { icon: "🏥", key: "feature5" as const },
];

const STATS = [
  { key: "stat1" as const },
  { key: "stat2" as const },
  { key: "stat3" as const },
  { key: "stat4" as const },
];

export default function HomeScreen({ navigation }: Props) {
  const { t } = useLanguage();

  const [cabinet, setCabinet] = React.useState<unknown[]>([]);
  const [recallAlerts, setRecallAlerts] = React.useState<string[]>([]);
  const [alertDismissed, setAlertDismissed] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // 1. Load Medicine Cabinet
      const loadCabinet = async () => {
        try {
          const stored = await AsyncStorage.getItem("medverify_cabinet");
          if (stored) {
            setCabinet(JSON.parse(stored));
          }
        } catch (error) { 
          console.error("Failed to load cabinet:", error);
        }
      };

      // 2. Load Proactive Recall Alerts
      const checkRecalls = async () => {
        try {
          const histStatus = await AsyncStorage.getItem("medverify_history");
          const history = histStatus ? JSON.parse(histStatus) : [];
          if (history.length === 0) return;

          const base = API_URL.replace(/\/analyze$/, "");
          const res = await fetch(`${base}/recent-bans`);
          if (res.ok) {
            const data = await res.json();
            const recentBans = (data.recent_bans || []).map((b: { drug_name: string }) => b.drug_name.toLowerCase());
            
            const matches = history
              .filter((h: { medicineName: string }) => recentBans.includes((h.medicineName || "").toLowerCase()))
              .map((h: { medicineName: string }) => h.medicineName);
            
            if (matches.length > 0) setRecallAlerts([...new Set<string>(matches)]);
          }
        } catch (error) {
          console.error("Failed to check recalls:", error);
        }
      };

      loadCabinet();
      checkRecalls();
    }, [])
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

      {/* Proactive Recall Alert Banner */}
      {recallAlerts.length > 0 && !alertDismissed && (
        <View style={styles.recallBanner}>
          <Text style={styles.recallBannerTitle}>⚠️ SAFETY RECALL ALERT</Text>
          <Text style={styles.recallBannerText}>
            {recallAlerts.length === 1
              ? `The medicine "${recallAlerts[0]}" that you previously scanned has been banned by CDSCO. Stop use immediately and consult your doctor.`
              : `${recallAlerts.length} medicines you previously scanned have been banned by CDSCO: ${recallAlerts.join(", ")}. Stop use and consult a doctor immediately.`}
          </Text>
          <TouchableOpacity style={styles.recallDismissBtn} onPress={() => setAlertDismissed(true)}>
            <Text style={styles.recallDismissBtnText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Hero Section */}
      <LinearGradient colors={["#0f172a", "#1e3a5f", "#0f172a"]} style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🛡️ AI-Powered Verification</Text>
        </View>
        <Text style={styles.heroTitle}>{t("heroTitle")}</Text>
        <Text style={styles.heroSubtitle}>{t("heroSubtitle")}</Text>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate("Scan")}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaButtonText}>📸  {t("scanNow")}</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Medicine Cabinet Section */}
      {cabinet.length > 0 && (
        <View style={styles.cabinetSection}>
          <Text style={styles.sectionTitle}>🗄️ My Medicine Cabinet</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cabinetScroll}>
            {cabinet.map((med) => (
              <View key={med.id} style={styles.cabinetCard}>
                <Text style={styles.cabinetMedName} numberOfLines={1}>{med.name}</Text>
                <Text style={styles.cabinetMedComp} numberOfLines={2}>{med.composition}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Stats Grid */}
      <View style={styles.section}>
        <View style={styles.statsGrid}>
          {STATS.map(({ key }) => (
            <View key={key} style={styles.statCard}>
              <Text style={styles.statValue}>{t(`${key}Value` as TranslationKey)}</Text>
              <Text style={styles.statLabel}>{t(`${key}Label` as TranslationKey)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("featuresTitle")}</Text>
        <View style={styles.featuresGrid}>
          {FEATURES.map(({ icon, key }) => (
            <View key={key} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{icon}</Text>
              <Text style={styles.featureTitle}>{t(`${key}Title` as TranslationKey)}</Text>
              <Text style={styles.featureDesc}>{t(`${key}Desc` as TranslationKey)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Bottom */}
      <View style={[styles.section, styles.bottomCta]}>
        <Text style={styles.ctaBottomTitle}>Ready to scan a medicine?</Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate("Scan")}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaButtonText}>📸  {t("scanNow")}</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>🛡️ {t("footerText")}</Text>
        <Text style={styles.teamName}>{t("teamName")}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },

  // Hero
  hero: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
    alignItems: "center",
  },
  badge: {
    backgroundColor: "rgba(59,130,246,0.15)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.3)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: { color: "#60a5fa", fontSize: 12, fontWeight: "600" },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#f8fafc",
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 320,
  },
  ctaButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // Recall Banner
  recallBanner: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#b91c1c",
  },
  recallBannerTitle: { fontSize: 13, fontWeight: "800", color: "#fff", marginBottom: 4 },
  recallBannerText: { fontSize: 12, color: "#fef2f2", lineHeight: 18 },
  recallDismissBtn: { alignSelf: "flex-end", marginTop: 8, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 6 },
  recallDismissBtnText: { color: "#fff", fontSize: 11, fontWeight: "600" },

  // Cabinet Section
  cabinetSection: { paddingVertical: 24, paddingLeft: 20 },
  cabinetScroll: { gap: 12, paddingRight: 20 },
  cabinetCard: {
    width: 160,
    backgroundColor: "rgba(30,58,95,0.4)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.3)",
    borderRadius: 14,
    padding: 14,
  },
  cabinetMedName: { fontSize: 14, fontWeight: "700", color: "#f8fafc", marginBottom: 4 },
  cabinetMedComp: { fontSize: 11, color: "#94a3b8", lineHeight: 16 },

  // Sections
  section: { paddingHorizontal: 20, paddingVertical: 24 },

  // Stats
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: "rgba(30,58,95,0.5)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.15)",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },
  statValue: { fontSize: 22, fontWeight: "800", color: "#60a5fa", marginBottom: 4 },
  statLabel: { fontSize: 12, color: "#94a3b8", textAlign: "center" },

  // Features
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 16,
    textAlign: "center",
  },
  featuresGrid: { gap: 12 },
  featureCard: {
    backgroundColor: "rgba(15,23,42,0.8)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.12)",
    borderRadius: 16,
    padding: 18,
  },
  featureIcon: { fontSize: 28, marginBottom: 8 },
  featureTitle: { fontSize: 16, fontWeight: "700", color: "#f1f5f9", marginBottom: 4 },
  featureDesc: { fontSize: 13, color: "#94a3b8", lineHeight: 20 },

  // Bottom CTA
  bottomCta: { alignItems: "center", paddingBottom: 12 },
  ctaBottomTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 16,
    textAlign: "center",
  },

  // Footer
  footer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(59,130,246,0.12)",
  },
  footerText: { fontSize: 13, color: "#64748b", marginBottom: 4 },
  teamName: { fontSize: 12, color: "#475569" },
});

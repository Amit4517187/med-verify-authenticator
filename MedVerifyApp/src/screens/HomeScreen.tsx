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
import { useLanguage } from "../contexts/LanguageContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  navigation: any;
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

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

      {/* Stats Grid */}
      <View style={styles.section}>
        <View style={styles.statsGrid}>
          {STATS.map(({ key }) => (
            <View key={key} style={styles.statCard}>
              <Text style={styles.statValue}>{t(`${key}Value` as any)}</Text>
              <Text style={styles.statLabel}>{t(`${key}Label` as any)}</Text>
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
              <Text style={styles.featureTitle}>{t(`${key}Title` as any)}</Text>
              <Text style={styles.featureDesc}>{t(`${key}Desc` as any)}</Text>
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

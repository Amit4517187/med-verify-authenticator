import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLanguage } from "../contexts/LanguageContext";

const FOUNDER_EMAIL = "amitkmishrawork@gmail.com";

const BUILT_ITEMS = [
  { icon: "🤖", key: "builtAI" as const },
  { icon: "⚙️", key: "builtBackend" as const },
  { icon: "📱", key: "builtFrontend" as const },
  { icon: "🗄️", key: "builtData" as const },
];

const TECH_ITEMS = [
  { icon: "🔍", key: "tech1" as const },
  { icon: "🗃️", key: "tech2" as const },
  { icon: "👁️", key: "tech3" as const },
  { icon: "📊", key: "tech4" as const },
];

export default function AboutScreen() {
  const { t } = useLanguage();

  const openEmail = (subject = "MedVerify Inquiry") => {
    Linking.openURL(`mailto:${FOUNDER_EMAIL}?subject=${encodeURIComponent(subject)}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.badge}>🛡️ {t("ourStory")}</Text>
        <Text style={styles.heroTitle}>{t("aboutTitle")}</Text>
        <Text style={styles.heroSubtitle}>{t("aboutSubtitle")}</Text>
      </View>

      {/* Mission Cards */}
      <View style={styles.section}>
        {[
          { title: t("aboutMission"), desc: t("aboutMissionDesc"), icon: "🎯" },
          { title: t("aboutWhy"), desc: t("aboutWhyDesc"), icon: "💡" },
          { title: t("aboutPromise"), desc: t("aboutPromiseDesc"), icon: "🔒" },
        ].map((item, i) => (
          <View key={i} style={styles.valueCard}>
            <Text style={styles.valueIcon}>{item.icon}</Text>
            <Text style={styles.valueTitle}>{item.title}</Text>
            <Text style={styles.valueDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statVal}>₹6,000 Cr</Text>
          <Text style={styles.statLbl}>{t("statFakeMarket")}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statVal}>5-Layer</Text>
          <Text style={styles.statLbl}>{t("statAIDepth")}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statVal}>&lt;8s</Text>
          <Text style={styles.statLbl}>{t("statScanTime")}</Text>
        </View>
      </View>

      {/* Founder Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("theBuilder")}</Text>
        <View style={styles.founderCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>AM</Text>
          </View>
          <Text style={styles.founderName}>Amit Mishra</Text>
          <Text style={styles.founderRole}>{t("founderRole")}</Text>
          <Text style={styles.founderBio}>{t("founderBio")}</Text>
          <TouchableOpacity style={styles.emailBtn} onPress={() => openEmail("Hello from MedVerify App")} activeOpacity={0.85}>
            <Text style={styles.emailBtnText}>✉️  {t("contactEmail")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* What I Built */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("builtSolo")}</Text>
        <Text style={styles.sectionSubtitle}>{t("builtSoloDesc")}</Text>
        <View style={styles.builtGrid}>
          {BUILT_ITEMS.map(({ icon, key }) => (
            <View key={key} style={styles.builtCard}>
              <Text style={styles.builtIcon}>{icon}</Text>
              <Text style={styles.builtTitle}>{t(`${key}` as any)}</Text>
              <Text style={styles.builtDesc}>{t(`${key}Desc` as any)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Technology */}
      <View style={styles.section}>
        <Text style={styles.sectionBadge}>{t("technologyLabel")}</Text>
        <Text style={styles.sectionTitle}>{t("howWorksTitle")}</Text>
        <View style={styles.techList}>
          {TECH_ITEMS.map(({ icon, key }, i) => (
            <View key={key} style={styles.techRow}>
              <View style={styles.techNumBadge}>
                <Text style={styles.techNum}>{i + 1}</Text>
              </View>
              <View style={styles.techContent}>
                <Text style={styles.techIcon}>{icon} {t(`${key}Title` as any)}</Text>
                <Text style={styles.techDesc}>{t(`${key}Desc` as any)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Collaborate CTA */}
      <View style={[styles.section, styles.ctaSection]}>
        <Text style={styles.ctaTitle}>{t("collaborateTitle")}</Text>
        <Text style={styles.ctaDesc}>{t("collaborateDesc")}</Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => openEmail("Collaboration Inquiry")} activeOpacity={0.85}>
          <Text style={styles.ctaBtnText}>🤝  {t("getInTouch")}</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>{t("orEmailDirectly")}</Text>
        <TouchableOpacity onPress={() => openEmail()}>
          <Text style={styles.emailLink}>{FOUNDER_EMAIL}</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>🛡️ MedVerify — Saving Lives Through AI Innovation</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },

  hero: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: "center",
    backgroundColor: "rgba(30,58,95,0.25)",
  },
  badge: { fontSize: 13, color: "#60a5fa", fontWeight: "700", marginBottom: 12 },
  heroTitle: { fontSize: 28, fontWeight: "800", color: "#f8fafc", textAlign: "center", marginBottom: 12, lineHeight: 36 },
  heroSubtitle: { fontSize: 14, color: "#94a3b8", textAlign: "center", lineHeight: 22, maxWidth: 310 },

  section: { padding: 20 },

  // Value Cards
  valueCard: {
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.12)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  valueIcon: { fontSize: 28, marginBottom: 8 },
  valueTitle: { fontSize: 16, fontWeight: "700", color: "#f1f5f9", marginBottom: 6 },
  valueDesc: { fontSize: 13, color: "#94a3b8", lineHeight: 20 },

  // Stats
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 4,
  },
  statItem: {
    flex: 1,
    backgroundColor: "rgba(30,58,95,0.5)",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.15)",
  },
  statVal: { fontSize: 16, fontWeight: "800", color: "#60a5fa", marginBottom: 4 },
  statLbl: { fontSize: 10, color: "#64748b", textAlign: "center" },

  // Founder
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#f8fafc", marginBottom: 8 },
  sectionSubtitle: { fontSize: 13, color: "#64748b", marginBottom: 16, lineHeight: 20 },
  sectionBadge: { fontSize: 12, color: "#60a5fa", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },

  founderCard: {
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.2)",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 26, fontWeight: "800", color: "#fff" },
  founderName: { fontSize: 20, fontWeight: "800", color: "#f8fafc", marginBottom: 4 },
  founderRole: { fontSize: 13, color: "#60a5fa", fontWeight: "600", marginBottom: 12 },
  founderBio: { fontSize: 13, color: "#94a3b8", textAlign: "center", lineHeight: 20, marginBottom: 18 },
  emailBtn: {
    backgroundColor: "rgba(59,130,246,0.15)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.35)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emailBtnText: { color: "#60a5fa", fontSize: 14, fontWeight: "700" },

  // Built Grid
  builtGrid: { gap: 10 },
  builtCard: {
    backgroundColor: "rgba(15,23,42,0.8)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.1)",
    borderRadius: 14,
    padding: 16,
  },
  builtIcon: { fontSize: 24, marginBottom: 6 },
  builtTitle: { fontSize: 14, fontWeight: "700", color: "#e2e8f0", marginBottom: 4 },
  builtDesc: { fontSize: 12, color: "#64748b", lineHeight: 18 },

  // Tech List
  techList: { gap: 14 },
  techRow: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  techNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(59,130,246,0.2)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  techNum: { fontSize: 12, fontWeight: "800", color: "#60a5fa" },
  techContent: { flex: 1 },
  techIcon: { fontSize: 14, fontWeight: "700", color: "#e2e8f0", marginBottom: 4 },
  techDesc: { fontSize: 12, color: "#64748b", lineHeight: 18 },

  // CTA Section
  ctaSection: {
    alignItems: "center",
    backgroundColor: "rgba(30,58,95,0.2)",
    borderTopWidth: 1,
    borderTopColor: "rgba(59,130,246,0.12)",
  },
  ctaTitle: { fontSize: 20, fontWeight: "800", color: "#f8fafc", textAlign: "center", marginBottom: 8 },
  ctaDesc: { fontSize: 13, color: "#94a3b8", textAlign: "center", lineHeight: 20, marginBottom: 20, maxWidth: 280 },
  ctaBtn: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  orText: { fontSize: 12, color: "#475569", marginBottom: 4 },
  emailLink: { fontSize: 14, color: "#60a5fa", fontWeight: "600" },

  // Footer
  footer: {
    padding: 24,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(59,130,246,0.08)",
  },
  footerText: { fontSize: 12, color: "#334155", textAlign: "center" },
});

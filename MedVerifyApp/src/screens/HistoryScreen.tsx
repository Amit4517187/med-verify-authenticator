import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useLanguage } from "../contexts/LanguageContext";
import { getScanHistory, clearScanHistory } from "../services/storage";
import { ScanHistoryItem } from "../types";

const STATUS_CONFIG: Record<string, { emoji: string; color: string; label: string }> = {
  safe: { emoji: "✅", color: "#34d399", label: "Genuine" },
  verified_global: { emoji: "🌐", color: "#34d399", label: "Genuine (Global)" },
  caution: { emoji: "⚠️", color: "#fbbf24", label: "Suspicious" },
  danger: { emoji: "🚨", color: "#f87171", label: "Fake" },
  error: { emoji: "❓", color: "#94a3b8", label: "Unknown" },
};

export default function HistoryScreen() {
  const { t } = useLanguage();
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      getScanHistory().then(setHistory);
    }, [])
  );

  const handleClear = () => {
    Alert.alert("Clear History", "Are you sure you want to delete all scan history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: async () => {
          await clearScanHistory();
          setHistory([]);
        },
      },
    ]);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>{t("historyEmpty")}</Text>
        <Text style={styles.emptyDesc}>{t("historyEmptyDesc")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {t("historyTitle")} ({history.length})
        </Text>
        <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>🗑️ {t("clearHistory")}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.error;
          return (
            <View style={styles.historyCard}>
              <View style={styles.historyLeft}>
                <Text style={styles.historyEmoji}>{cfg.emoji}</Text>
              </View>
              <View style={styles.historyContent}>
                <Text style={styles.historyName} numberOfLines={1}>
                  {item.medicineName}
                </Text>
                <Text style={[styles.historyStatus, { color: cfg.color }]}>
                  {cfg.label}
                </Text>
                <Text style={styles.historyDate}>{formatDate(item.timestamp)}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(59,130,246,0.12)",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#f8fafc" },
  clearBtn: {
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  clearBtnText: { fontSize: 12, color: "#f87171", fontWeight: "600" },

  list: { padding: 16, gap: 10 },

  historyCard: {
    flexDirection: "row",
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.12)",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 12,
  },
  historyLeft: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(30,41,59,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  historyEmoji: { fontSize: 22 },
  historyContent: { flex: 1 },
  historyName: { fontSize: 15, fontWeight: "700", color: "#f1f5f9", marginBottom: 2 },
  historyStatus: { fontSize: 12, fontWeight: "700", marginBottom: 2 },
  historyDate: { fontSize: 11, color: "#475569" },

  // Empty state
  emptyContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: "#64748b", marginBottom: 8, textAlign: "center" },
  emptyDesc: { fontSize: 14, color: "#475569", textAlign: "center", lineHeight: 20 },
});

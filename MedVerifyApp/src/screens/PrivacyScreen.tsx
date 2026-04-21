import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.date}>Effective Date: March 2026</Text>
      
      <View style={styles.section}>
        <Text style={styles.heading}>1. Data Collection</Text>
        <Text style={styles.paragraph}>
          MedVerify is committed to your privacy. We DO NOT collect, store, or transmit your personal identifiable information (PII). Any image that you scan using our app is processed locally prior to generic text extraction, and no imagery is ever stored on our servers.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>2. Analytics</Text>
        <Text style={styles.paragraph}>
          We collect anonymized app usage data (crash reports, processing times) to improve our AI model. This data cannot be traced back to you.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>3. Your Medicine Cabinet</Text>
        <Text style={styles.paragraph}>
          Any medicines you save to "My Medicine Cabinet" are stored exclusively in your device's local storage (AsyncStorage). If you uninstall the app, this data is permanently destroyed. We have no access to it.
        </Text>
      </View>

      <Text style={styles.footer}>MedVerify Authenticator Initiative</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: '800', color: '#f8fafc', marginBottom: 8 },
  date: { fontSize: 13, color: '#64748b', marginBottom: 32 },
  section: { marginBottom: 24 },
  heading: { fontSize: 18, fontWeight: '700', color: '#60a5fa', marginBottom: 12 },
  paragraph: { fontSize: 15, color: '#cbd5e1', lineHeight: 24 },
  footer: { marginTop: 40, textAlign: 'center', color: '#475569', fontSize: 12 }
});

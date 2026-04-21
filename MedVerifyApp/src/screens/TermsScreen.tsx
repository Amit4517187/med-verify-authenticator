import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Terms and Conditions</Text>
      <Text style={styles.date}>Effective Date: March 2026</Text>

      <View style={styles.section}>
        <Text style={styles.heading}>1. Not Medical Advice</Text>
        <Text style={styles.paragraph}>
          MedVerify is an AI-powered authenticity tracker, NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a licensed pharmacist or your physician before consuming any medication.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>2. Accuracy Disclaimer</Text>
        <Text style={styles.paragraph}>
          While MedVerify cross-references databases like CDSCO and RxNorm, OCR technology and LLM predictions are not 100% foolproof. Misidentification of a drug is possible. A "Genuine" verification does NOT guarantee a medicine safe for your specific health condition.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>3. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          The developers of MedVerify shall not be held liable for any damages, health issues, or losses resulting from the use or inability to use this app. You assume full responsibility for taking any medication scanned by this application.
        </Text>
      </View>

      <Text style={styles.footer}>By using this app, you accept these terms globally.</Text>
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

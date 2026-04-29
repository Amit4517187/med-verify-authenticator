import React, { createContext, useContext, useState, useCallback } from "react";

type Language = "en" | "hi";

const translations = {
  en: {
    // Nav
    appName: "MedVerify",
    tagline: "Verify. Trust. Stay Safe.",
    home: "Home",
    scan: "Scan Medicine",
    about: "About",
    results: "Results",
    history: "History",
    language: "हिंदी",

    // Landing
    heroTitle: "Is Your Medicine Real?",
    heroSubtitle:
      "India's ₹6,000 Cr fake medicine market kills thousands every year. Verify any medicine in seconds with AI-powered multi-layer authentication.",
    scanNow: "Scan Medicine Now",
    howItWorks: "How It Works",

    // Stats
    stat1Value: "₹6,000 Cr",
    stat1Label: "Fake medicine market",
    stat2Value: "35%",
    stat2Label: "Higher risk in rural areas",
    stat3Value: "3 sec",
    stat3Label: "Verification time",
    stat4Value: "5 Layers",
    stat4Label: "Of AI verification",

    // Features
    featuresTitle: "5-Layer AI Verification",
    feature1Title: "Visual AI",
    feature1Desc: "Detects hologram authenticity, print quality & packaging defects using deep learning",
    feature2Title: "OCR + Database",
    feature2Desc: "Reads text from packaging and matches against verified medicine database",
    feature3Title: "Barcode / QR",
    feature3Desc: "Verifies barcode and QR codes against manufacturer records",
    feature4Title: "Price Intelligence",
    feature4Desc: "Compares pricing to detect suspiciously cheap counterfeit medicines",
    feature5Title: "Pharmacy Check",
    feature5Desc: "Verifies if the selling pharmacy is licensed and registered",

    // Scan page
    uploadTitle: "Scan Your Medicine",
    uploadSubtitle: "Take a photo, upload from gallery, scan barcode, or enter details manually",
    uploadPhoto: "Take Photo",
    uploadGallery: "Choose from Gallery",
    scanBarcode: "Scan Barcode / QR",
    dragDrop: "Tap to add medicine photo",
    orEnterManually: "Or Enter Details Manually",
    medicineName: "Medicine Name",
    batchNumber: "Batch Number",
    barcode: "Barcode Number",
    manufacturer: "Manufacturer",
    verifyMedicine: "Verify Medicine",
    analyzing: "Analyzing...",
    analyzingDetail: "Analyzing Medical Data...",
    analyzingSubDetail: "Please do not close the app",
    analyzingStep1: "Running Deep Learning OCR...",
    analyzingStep2: "Querying Medicine Database...",
    analyzingStep3: "Checking Web Footprint...",
    analyzingStep4: "Generating Threat Assessment...",
    connectionError: "Error: Cannot connect to the MediGuard Engine. Please try again later.",
    connectionErrorTitle: "Connection Failed",
    tryAgain: "Try Again",
    cancel: "Cancel",

    // Result data fields
    drugName: "Drug Name",
    composition: "Composition",
    threatStatus: "Threat Status",
    webFootprint: "Web Footprint",
    batchInfo: "Batch Information",
    manufacturerInfo: "Manufacturer",
    noDataYet: "Awaiting data from server...",

    // Results
    verificationComplete: "Verification Complete",
    genuine: "Verified Database Match",
    realMedicine: "Global Registry Match",
    suspicious: "Verification Warning",
    fake: "Regulatory Warning",
    genuineDesc: "This medicine matched verified regulatory databases.",
    realMedicineDesc: "The active ingredient is recognized globally. Always buy from a trusted pharmacy.",
    suspiciousDesc: "Some verification checks raised concerns. Please verify with a pharmacist.",
    fakeDesc: "This medicine is flagged by regulatory authorities. Consult a healthcare professional.",
    unableToVerify: "Unable to Verify",
    unableToVerifyDesc: "This medicine could not be matched against known databases. This does not confirm it is counterfeit. Please consult a pharmacist.",
    confidence: "Confidence Score",
    layerResults: "Layer-by-Layer Results",
    warning: "Warning",
    scanAnother: "Scan Another Medicine",
    reportFake: "Report as Fake",
    findPharmacy: "Find Genuine Pharmacy",
    evidenceBreakdown: "Evidence Breakdown",
    medicineIdentified: "Medicine Identified",
    databaseMatch: "Database Match",
    regulatoryStatus: "Regulatory Status",
    packagingAnalysis: "Packaging Analysis",
    recommendation: "Recommendation",

    // History
    historyTitle: "Scan History",
    historyEmpty: "No scans yet",
    historyEmptyDesc: "Your medicine scan history will appear here",
    clearHistory: "Clear History",

    // Footer
    footerText: "Saving Lives Through AI Innovation",
    teamName: "Team MedVerify Innovations",

    // About
    ourStory: "Our Story",
    aboutTitle: "About MedVerify",
    aboutSubtitle: "Built by one engineer with a mission — to use AI to protect lives from counterfeit medicines across India and beyond.",
    aboutMission: "Our Mission",
    aboutMissionDesc: "Make medicine verification accessible to every Indian citizen — from urban hospitals to the most remote rural clinics.",
    aboutWhy: "Why I Built This",
    aboutWhyDesc: "India's ₹6,000 Cr counterfeit medicine market kills thousands every year. I believe one person with the right technology can change that.",
    aboutPromise: "My Promise",
    aboutPromiseDesc: "MedVerify will never store your personal data. All analysis is processed securely and results are shown only to you.",
    statFakeMarket: "Fake medicine market size",
    statAIDepth: "AI verification depth",
    statScanTime: "Average scan time",
    theBuilder: "The Builder",
    builtSolo: "Built Solo, From Scratch",
    builtSoloDesc: "Every layer of MedVerify — from the AI model to the database to this app — was designed, built, and deployed by one person.",
    founderRole: "Founder & Solo Engineer",
    founderBio: "Designed and built MedVerify end-to-end — AI model training, Flask backend, React Native app, BigQuery database, and all research.",
    contactEmail: "Send Email",
    builtAI: "AI Model Training",
    builtAIDesc: "MobileNetV2 trained on real vs fake medicine image datasets",
    builtBackend: "Backend Engineering",
    builtBackendDesc: "Flask API with 4-layer decision engine and security hardening",
    builtFrontend: "Mobile Development",
    builtFrontendDesc: "React Native app with bilingual support and native camera integration",
    builtData: "Data & Research",
    builtDataDesc: "BigQuery database with 3 medicine tables and banned drug registry",
    technologyLabel: "Technology",
    howWorksTitle: "How MedVerify Works",
    tech1Title: "Deep Learning OCR",
    tech1Desc: "Extracts text from medicine packaging with high accuracy, even from low-quality photos taken in poor lighting conditions.",
    tech2Title: "Verified Medicine Database",
    tech2Desc: "Cross-references extracted data against a curated BigQuery database of approved medicines, batch numbers, and manufacturers.",
    tech3Title: "Visual Authenticity Check",
    tech3Desc: "MobileNetV2 model trained on real vs fake medicine images analyzes packaging to detect visual signs of counterfeiting.",
    tech4Title: "Threat Assessment Report",
    tech4Desc: "Synthesizes all signals into a clear, actionable verdict — Genuine, Suspicious, or Fake — with a detailed explanation.",
    collaborateTitle: "Want to Collaborate?",
    collaborateDesc: "Looking for healthcare partners, NGOs, investors, and government bodies to help scale MedVerify across India and beyond.",
    getInTouch: "Get In Touch",
    tryMedVerify: "Try MedVerify",
    orEmailDirectly: "Or email directly:",
  },
  hi: {
    appName: "MedVerify",
    tagline: "सत्यापित करें। विश्वास करें। सुरक्षित रहें।",
    home: "होम",
    scan: "दवा स्कैन करें",
    about: "हमारे बारे में",
    results: "परिणाम",
    history: "इतिहास",
    language: "English",

    heroTitle: "क्या आपकी दवा असली है?",
    heroSubtitle: "भारत का ₹6,000 करोड़ का नकली दवा बाज़ार हर साल हज़ारों लोगों की जान लेता है। AI-संचालित बहु-स्तरीय प्रमाणीकरण से किसी भी दवा को सेकंड में सत्यापित करें।",
    scanNow: "अभी दवा स्कैन करें",
    howItWorks: "यह कैसे काम करता है",

    stat1Value: "₹6,000 करोड़",
    stat1Label: "नकली दवा बाज़ार",
    stat2Value: "35%",
    stat2Label: "ग्रामीण क्षेत्रों में अधिक जोखिम",
    stat3Value: "3 सेकंड",
    stat3Label: "सत्यापन समय",
    stat4Value: "5 स्तर",
    stat4Label: "AI सत्यापन के",

    featuresTitle: "5-स्तरीय AI सत्यापन",
    feature1Title: "विज़ुअल AI",
    feature1Desc: "डीप लर्निंग का उपयोग करके होलोग्राम प्रामाणिकता, प्रिंट गुणवत्ता और पैकेजिंग दोषों का पता लगाता है",
    feature2Title: "OCR + डेटाबेस",
    feature2Desc: "पैकेजिंग से टेक्स्ट पढ़ता है और सत्यापित दवा डेटाबेस से मिलान करता है",
    feature3Title: "बारकोड / QR",
    feature3Desc: "निर्माता रिकॉर्ड के विरुद्ध बारकोड और QR कोड सत्यापित करता है",
    feature4Title: "मूल्य बुद्धिमत्ता",
    feature4Desc: "संदिग्ध रूप से सस्ती नकली दवाओं का पता लगाने के लिए मूल्य की तुलना करता है",
    feature5Title: "फार्मेसी जांच",
    feature5Desc: "सत्यापित करता है कि विक्रय फार्मेसी लाइसेंस प्राप्त और पंजीकृत है",

    uploadTitle: "अपनी दवा स्कैन करें",
    uploadSubtitle: "फोटो लें, गैलरी से अपलोड करें, बारकोड स्कैन करें, या मैन्युअल रूप से विवरण दर्ज करें",
    uploadPhoto: "फोटो लें",
    uploadGallery: "गैलरी से चुनें",
    scanBarcode: "बारकोड / QR स्कैन करें",
    dragDrop: "दवा फोटो जोड़ने के लिए टैप करें",
    orEnterManually: "या मैन्युअल रूप से विवरण दर्ज करें",
    medicineName: "दवा का नाम",
    batchNumber: "बैच नंबर",
    barcode: "बारकोड नंबर",
    manufacturer: "निर्माता",
    verifyMedicine: "दवा सत्यापित करें",
    analyzing: "विश्लेषण हो रहा है...",
    analyzingDetail: "चिकित्सा डेटा का विश्लेषण हो रहा है...",
    analyzingSubDetail: "कृपया ऐप बंद न करें",
    analyzingStep1: "डीप लर्निंग OCR चल रहा है...",
    analyzingStep2: "दवा डेटाबेस में खोज रहा है...",
    analyzingStep3: "वेब फुटप्रिंट जांच रहा है...",
    analyzingStep4: "खतरा मूल्यांकन तैयार कर रहा है...",
    connectionError: "त्रुटि: MediGuard इंजन से कनेक्ट नहीं हो पा रहा है। कृपया बाद में पुनः प्रयास करें।",
    connectionErrorTitle: "कनेक्शन विफल",
    tryAgain: "पुनः प्रयास करें",
    cancel: "रद्द करें",

    drugName: "दवा का नाम",
    composition: "संरचना",
    threatStatus: "खतरा स्थिति",
    webFootprint: "वेब फुटप्रिंट",
    batchInfo: "बैच जानकारी",
    manufacturerInfo: "निर्माता",
    noDataYet: "सर्वर से डेटा की प्रतीक्षा है...",

    verificationComplete: "सत्यापन पूर्ण",
    genuine: "सत्यापित डेटाबेस मैच",
    realMedicine: "ग्लोबल रजिस्ट्री मैच",
    suspicious: "सत्यापन चेतावनी",
    fake: "नियामक चेतावनी",
    genuineDesc: "यह दवा सत्यापित नियामक डेटाबेस में मिली।",
    realMedicineDesc: "सक्रिय सामग्री विश्व स्तर पर मान्यता प्राप्त है। हमेशा एक विश्वसनीय फार्मेसी से खरीदें।",
    suspiciousDesc: "कुछ सत्यापन जांचों ने चिंताएं जताई हैं। कृपया फार्मासिस्ट से सत्यापित करें।",
    fakeDesc: "यह दवा नियामक अधिकारियों द्वारा चिह्नित है। स्वास्थ्य पेशेवर से परामर्श करें।",
    unableToVerify: "सत्यापित नहीं हो सका",
    unableToVerifyDesc: "यह दवा किसी ज्ञात डेटाबेस में नहीं मिली। इसका मतलब यह नहीं कि यह नकली है। कृपया फार्मासिस्ट से परामर्श करें।",
    confidence: "विश्वास स्कोर",
    layerResults: "स्तर-दर-स्तर परिणाम",
    passed: "पास",
    failed: "विफल",
    warning: "चेतावनी",
    scanAnother: "अन्य दवा स्कैन करें",
    reportFake: "नकली के रूप में रिपोर्ट करें",
    findPharmacy: "असली फार्मेसी खोजें",
    evidenceBreakdown: "सबूत का विवरण",
    medicineIdentified: "दवा की पहचान हुई",
    databaseMatch: "डेटाबेस मैच",
    regulatoryStatus: "नियामक स्थिति",
    packagingAnalysis: "पैकेजिंग विश्लेषण",
    recommendation: "सिफ़ारिश",

    historyTitle: "स्कैन इतिहास",
    historyEmpty: "अभी तक कोई स्कैन नहीं",
    historyEmptyDesc: "आपका दवा स्कैन इतिहास यहाँ दिखाई देगा",
    clearHistory: "इतिहास साफ़ करें",

    footerText: "AI नवाचार के माध्यम से जीवन बचाना",
    teamName: "टीम MedVerify Innovations",

    ourStory: "हमारी कहानी",
    aboutTitle: "MedVerify के बारे में",
    aboutSubtitle: "एक इंजीनियर द्वारा एक मिशन के साथ बनाया गया — AI का उपयोग करके भारत और उससे परे नकली दवाओं से जीवन की रक्षा करना।",
    aboutMission: "हमारा मिशन",
    aboutMissionDesc: "प्रत्येक भारतीय नागरिक तक दवा सत्यापन पहुँचाना — शहरी अस्पतालों से लेकर दूरदराज के ग्रामीण क्लिनिक तक।",
    aboutWhy: "मैंने यह क्यों बनाया",
    aboutWhyDesc: "भारत का ₹6,000 करोड़ का नकली दवा बाज़ार हर साल हज़ारों लोगों की जान लेता है। मेरा मानना है कि सही तकनीक से एक व्यक्ति यह बदल सकता है।",
    aboutPromise: "मेरा वादा",
    aboutPromiseDesc: "MedVerify आपका कोई भी व्यक्तिगत डेटा कभी संग्रहीत नहीं करेगा।",
    statFakeMarket: "नकली दवा बाज़ार का आकार",
    statAIDepth: "AI सत्यापन गहराई",
    statScanTime: "औसत स्कैन समय",
    theBuilder: "निर्माता",
    builtSolo: "अकेले, शुरू से बनाया",
    builtSoloDesc: "MedVerify की हर परत — AI मॉडल से लेकर डेटाबेस और इस ऐप तक — एक ही व्यक्ति द्वारा बनाई गई।",
    founderRole: "संस्थापक और एकमात्र इंजीनियर",
    founderBio: "MedVerify को शुरू से अंत तक डिज़ाइन और निर्मित किया — AI मॉडल प्रशिक्षण, Flask बैकएंड, React Native ऐप, BigQuery डेटाबेस।",
    contactEmail: "ईमेल भेजें",
    builtAI: "AI मॉडल प्रशिक्षण",
    builtAIDesc: "असली बनाम नकली दवा छवि डेटासेट पर प्रशिक्षित MobileNetV2",
    builtBackend: "बैकएंड इंजीनियरिंग",
    builtBackendDesc: "4-परत निर्णय इंजन के साथ Flask API",
    builtFrontend: "मोबाइल विकास",
    builtFrontendDesc: "द्विभाषी समर्थन के साथ React Native ऐप",
    builtData: "डेटा और शोध",
    builtDataDesc: "3 दवा तालिकाओं के साथ BigQuery डेटाबेस",
    technologyLabel: "तकनीक",
    howWorksTitle: "MedVerify कैसे काम करता है",
    tech1Title: "डीप लर्निंग OCR",
    tech1Desc: "दवा पैकेजिंग से उच्च सटीकता के साथ पाठ निकालता है।",
    tech2Title: "सत्यापित दवा डेटाबेस",
    tech2Desc: "निकाले गए डेटा को अनुमोदित दवाओं के BigQuery डेटाबेस से मिलाता है।",
    tech3Title: "दृश्य प्रामाणिकता जाँच",
    tech3Desc: "MobileNetV2 मॉडल नकली दवाओं के दृश्य संकेतों का पता लगाता है।",
    tech4Title: "खतरा मूल्यांकन रिपोर्ट",
    tech4Desc: "सभी संकेतों को एक स्पष्ट निर्णय में संयोजित करता है।",
    collaborateTitle: "सहयोग करना चाहते हैं?",
    collaborateDesc: "स्वास्थ्य सेवा भागीदारों, NGOs और निवेशकों की तलाश है।",
    getInTouch: "संपर्क करें",
    tryMedVerify: "MedVerify आज़माएँ",
    orEmailDirectly: "या सीधे ईमेल करें:",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  lang: Language;
  t: (key: TranslationKey) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>("en");

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === "en" ? "hi" : "en"));
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => translations[lang][key] || key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

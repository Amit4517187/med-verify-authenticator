import React, { createContext, useContext, useState, useCallback } from "react";

type Language = "en" | "hi";

const translations = {
  en: {
    // Nav
    appName: "MedVerify",
    tagline: "Verify. Trust. Stay Safe.",
    home: "Home",
    scan: "Scan Medicine",
    about: "About Us",
    results: "Results",
    language: "हिंदी",

    // Landing
    heroTitle: "Is Your Medicine Real?",
    heroSubtitle: "India's ₹6,000 Cr fake medicine market kills thousands every year. Verify any medicine in 3 seconds with AI-powered multi-layer authentication.",
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
    uploadSubtitle: "Upload a photo of the medicine packaging or enter details manually",
    uploadPhoto: "Upload Photo",
    dragDrop: "Drag & drop or click to upload",
    orEnterManually: "Or Enter Details Manually",
    medicineName: "Medicine Name",
    batchNumber: "Batch Number",
    barcode: "Barcode Number",
    manufacturer: "Manufacturer",
    verifyMedicine: "Verify Medicine",
    analyzing: "Analyzing...",
    analyzingDetail: "Analyzing Medical Data... Please do not close this page",
    analyzingStep1: "Running Deep Learning OCR...",
    analyzingStep2: "Querying Medicine Database...",
    analyzingStep3: "Checking Web Footprint...",
    analyzingStep4: "Generating Threat Assessment...",
    connectionError: "Error: Cannot connect to the MediGuard Engine. Please try again later.",
    connectionErrorTitle: "Connection Failed",
    tryAgain: "Try Again",

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
    genuine: "Genuine Medicine",
    suspicious: "Suspicious",
    fake: "Potentially Fake",
    genuineDesc: "This medicine has passed all 5 layers of verification.",
    suspiciousDesc: "Some checks raised concerns. Exercise caution.",
    fakeDesc: "Multiple verification layers failed. Do NOT consume.",
    confidence: "Confidence Score",
    layerResults: "Layer-by-Layer Results",
    passed: "Passed",
    failed: "Failed",
    warning: "Warning",
    scanAnother: "Scan Another Medicine",
    reportFake: "Report as Fake",
    findPharmacy: "Find Genuine Pharmacy",

    // Footer
    footerText: "Saving Lives Through AI Innovation",
    teamName: "Team MedVerify Innovations",

    // About page — hero
    ourStory: "Our Story",
    aboutTitle: "About MedVerify",
    aboutSubtitle: "Built by one engineer with a mission — to use AI to protect lives from counterfeit medicines across India and beyond.",

    // About page — values
    aboutMission: "Our Mission",
    aboutMissionDesc: "Make medicine verification accessible to every Indian citizen — from urban hospitals to the most remote rural clinics where fake medicines kill silently.",
    aboutWhy: "Why I Built This",
    aboutWhyDesc: "India's ₹6,000 Cr counterfeit medicine market kills thousands every year. I believe one person with the right technology can change that.",
    aboutPromise: "My Promise",
    aboutPromiseDesc: "MedVerify will never store your personal data. All analysis is processed securely and results are shown only to you.",

    // About page — stats
    statFakeMarket: "Fake medicine market size",
    statAIDepth: "AI verification depth",
    statScanTime: "Average scan time",

    // About page — founder
    theBuilder: "The Builder",
    builtSolo: "Built Solo, From Scratch",
    builtSoloDesc: "Every layer of MedVerify — from the AI model to the database to this interface — was designed, built, and deployed by one person.",
    founderRole: "Founder & Solo Engineer",
    founderBio: "Designed and built MedVerify end-to-end — AI model training, Flask backend, React frontend, BigQuery database, and all research. A one-person mission to make medicines safe for everyone.",
    contactEmail: "Send Email",

    // About page — what I built
    builtAI: "AI Model Training",
    builtAIDesc: "MobileNetV2 trained on real vs fake medicine image datasets",
    builtBackend: "Backend Engineering",
    builtBackendDesc: "Flask API with 4-layer decision engine and security hardening",
    builtFrontend: "Frontend Development",
    builtFrontendDesc: "React + TypeScript mobile-first interface with bilingual support",
    builtData: "Data & Research",
    builtDataDesc: "BigQuery database with 3 medicine tables and banned drug registry",

    // About page — technology
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

    // About page — contact
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
    language: "English",

    heroTitle: "क्या आपकी दवा असली है?",
    heroSubtitle: "भारत का ₹6,000 करोड़ का नकली दवा बाज़ार हर साल हज़ारों लोगों की जान लेता है। AI-संचालित बहु-स्तरीय प्रमाणीकरण से किसी भी दवा को 3 सेकंड में सत्यापित करें।",
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
    uploadSubtitle: "दवा पैकेजिंग की फोटो अपलोड करें या मैन्युअल रूप से विवरण दर्ज करें",
    uploadPhoto: "फोटो अपलोड करें",
    dragDrop: "खींचें और छोड़ें या अपलोड करने के लिए क्लिक करें",
    orEnterManually: "या मैन्युअल रूप से विवरण दर्ज करें",
    medicineName: "दवा का नाम",
    batchNumber: "बैच नंबर",
    barcode: "बारकोड नंबर",
    manufacturer: "निर्माता",
    verifyMedicine: "दवा सत्यापित करें",
    analyzing: "विश्लेषण हो रहा है...",
    analyzingDetail: "चिकित्सा डेटा का विश्लेषण हो रहा है... कृपया इस पेज को बंद न करें",
    analyzingStep1: "डीप लर्निंग OCR चल रहा है...",
    analyzingStep2: "दवा डेटाबेस में खोज रहा है...",
    analyzingStep3: "वेब फुटप्रिंट जांच रहा है...",
    analyzingStep4: "खतरा मूल्यांकन तैयार कर रहा है...",
    connectionError: "त्रुटि: MediGuard इंजन से कनेक्ट नहीं हो पा रहा है। कृपया बाद में पुनः प्रयास करें।",
    connectionErrorTitle: "कनेक्शन विफल",
    tryAgain: "पुनः प्रयास करें",

    drugName: "दवा का नाम",
    composition: "संरचना",
    threatStatus: "खतरा स्थिति",
    webFootprint: "वेब फुटप्रिंट",
    batchInfo: "बैच जानकारी",
    manufacturerInfo: "निर्माता",
    noDataYet: "सर्वर से डेटा की प्रतीक्षा है...",

    verificationComplete: "सत्यापन पूर्ण",
    genuine: "असली दवा",
    suspicious: "संदिग्ध",
    fake: "संभावित नकली",
    genuineDesc: "इस दवा ने सभी 5 स्तरों का सत्यापन पास कर लिया है।",
    suspiciousDesc: "कुछ जांचों ने चिंताएं जताई हैं। सावधानी बरतें।",
    fakeDesc: "कई सत्यापन स्तर विफल रहे। सेवन न करें।",
    confidence: "विश्वास स्कोर",
    layerResults: "स्तर-दर-स्तर परिणाम",
    passed: "पास",
    failed: "विफल",
    warning: "चेतावनी",
    scanAnother: "अन्य दवा स्कैन करें",
    reportFake: "नकली के रूप में रिपोर्ट करें",
    findPharmacy: "असली फार्मेसी खोजें",

    footerText: "AI नवाचार के माध्यम से जीवन बचाना",
    teamName: "टीम MedVerify Innovations",

    // About page — hero
    ourStory: "हमारी कहानी",
    aboutTitle: "MedVerify के बारे में",
    aboutSubtitle: "एक इंजीनियर द्वारा एक मिशन के साथ बनाया गया — AI का उपयोग करके भारत और उससे परे नकली दवाओं से जीवन की रक्षा करना।",

    // About page — values
    aboutMission: "हमारा मिशन",
    aboutMissionDesc: "प्रत्येक भारतीय नागरिक तक दवा सत्यापन पहुँचाना — शहरी अस्पतालों से लेकर सबसे दूरदराज के ग्रामीण क्लिनिक तक जहाँ नकली दवाएँ चुपचाप जान लेती हैं।",
    aboutWhy: "मैंने यह क्यों बनाया",
    aboutWhyDesc: "भारत का ₹6,000 करोड़ का नकली दवा बाज़ार हर साल हज़ारों लोगों की जान लेता है। मेरा मानना है कि सही तकनीक से एक व्यक्ति यह बदल सकता है।",
    aboutPromise: "मेरा वादा",
    aboutPromiseDesc: "MedVerify आपका कोई भी व्यक्तिगत डेटा कभी संग्रहीत नहीं करेगा। सभी विश्लेषण सुरक्षित रूप से संसाधित होते हैं और परिणाम केवल आपको दिखाए जाते हैं।",

    // About page — stats
    statFakeMarket: "नकली दवा बाज़ार का आकार",
    statAIDepth: "AI सत्यापन गहराई",
    statScanTime: "औसत स्कैन समय",

    // About page — founder
    theBuilder: "निर्माता",
    builtSolo: "अकेले, शुरू से बनाया",
    builtSoloDesc: "MedVerify की हर परत — AI मॉडल से लेकर डेटाबेस और इस इंटरफ़ेस तक — एक ही व्यक्ति द्वारा डिज़ाइन, निर्मित और तैनात की गई।",
    founderRole: "संस्थापक और एकमात्र इंजीनियर",
    founderBio: "MedVerify को शुरू से अंत तक डिज़ाइन और निर्मित किया — AI मॉडल प्रशिक्षण, Flask बैकएंड, React फ्रंटएंड, BigQuery डेटाबेस और सभी शोध। सभी के लिए दवाओं को सुरक्षित बनाने का एक-व्यक्ति मिशन।",
    contactEmail: "ईमेल भेजें",

    // About page — what I built
    builtAI: "AI मॉडल प्रशिक्षण",
    builtAIDesc: "असली बनाम नकली दवा छवि डेटासेट पर प्रशिक्षित MobileNetV2",
    builtBackend: "बैकएंड इंजीनियरिंग",
    builtBackendDesc: "4-परत निर्णय इंजन और सुरक्षा के साथ Flask API",
    builtFrontend: "फ्रंटएंड विकास",
    builtFrontendDesc: "द्विभाषी समर्थन के साथ React + TypeScript मोबाइल-फर्स्ट इंटरफ़ेस",
    builtData: "डेटा और शोध",
    builtDataDesc: "3 दवा तालिकाओं और प्रतिबंधित दवा रजिस्ट्री के साथ BigQuery डेटाबेस",

    // About page — technology
    technologyLabel: "तकनीक",
    howWorksTitle: "MedVerify कैसे काम करता है",
    tech1Title: "डीप लर्निंग OCR",
    tech1Desc: "दवा पैकेजिंग से उच्च सटीकता के साथ पाठ निकालता है, यहाँ तक कि खराब रोशनी में ली गई कम गुणवत्ता वाली तस्वीरों से भी।",
    tech2Title: "सत्यापित दवा डेटाबेस",
    tech2Desc: "निकाले गए डेटा को अनुमोदित दवाओं, बैच नंबर और निर्माताओं के BigQuery डेटाबेस से मिलाता है।",
    tech3Title: "दृश्य प्रामाणिकता जाँच",
    tech3Desc: "असली बनाम नकली दवा छवियों पर प्रशिक्षित MobileNetV2 मॉडल नकली दवाओं के दृश्य संकेतों का पता लगाता है।",
    tech4Title: "खतरा मूल्यांकन रिपोर्ट",
    tech4Desc: "सभी संकेतों को एक स्पष्ट निर्णय में संयोजित करता है — असली, संदिग्ध, या नकली — विस्तृत स्पष्टीकरण के साथ।",

    // About page — contact
    collaborateTitle: "सहयोग करना चाहते हैं?",
    collaborateDesc: "स्वास्थ्य सेवा भागीदारों, NGOs, निवेशकों और सरकारी निकायों की तलाश है जो MedVerify को भारत भर में विस्तारित करने में मदद करें।",
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
    (key: TranslationKey) => translations[lang][key] || key,
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

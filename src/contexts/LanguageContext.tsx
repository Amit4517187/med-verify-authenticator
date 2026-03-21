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

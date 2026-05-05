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
    passed: "Passed",
    failed: "Failed",
    warning: "Warning",
    scanAnother: "Scan Another Medicine",
    reportFake: "Report as Fake",
    findPharmacy: "Find Genuine Pharmacy",
    evidenceBreakdown: "Evidence Breakdown",
    medicineIdentified: "Medicine Identified",
    databaseMatch: "Database Match",
    regulatoryStatus: "Regulatory Status",
    packagingAnalysis: "Packaging Analysis",
    barcodeMatch: "Barcode/QR Result",
    ocrConfidence: "OCR Confidence",
    recommendation: "Recommendation",

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

    // Index - Live Demo
    liveDemo: "LIVE DEMO",
    seeItInAction: "See It In Action",
    demoSubtitle: "Watch MedVerify authenticate a medicine in real-time. Every detail — batch number, manufacturer, expiry — cross-checked against official records.",
    demoFeature1Title: "3-Second Results",
    demoFeature1Desc: "Faster than reading the label manually.",
    demoFeature2Title: "Works Offline",
    demoFeature2Desc: "Cached CDSCO data for rural areas with poor connectivity.",
    demoFeature3Title: "Hindi & English",
    demoFeature3Desc: "Full support for both languages across all results.",
    demoStatus: "VERIFIED AUTHENTIC",
    demoMedicine: "Paracetamol 500mg",
    demoManufacturer: "Cipla Ltd., Mumbai",
    demoBatch: "CPL-2025-B4471",
    demoExpiry: "Dec 2026",
    demoCdscoStatus: "Approved",
    scanAgain: "Scan Again",
    reportSuspicious: "Report Suspicious Medicine",

    // Index - Testimonials
    fromTheField: "FROM THE FIELD",
    trustedTitle: "Trusted by India's Health Workers",
    trustedSubtitle: "Real stories from ASHA workers, doctors, and pharmacists protecting their communities from counterfeit medicines.",
    testimonial1Quote: "I verified 12 medicines last week at our rural health camp. MedVerify flagged two suspicious batches that the supplier claimed were genuine. It saved lives.",
    testimonial1Author: "Sunita Devi",
    testimonial1Role: "ASHA Worker - Varanasi, UP",
    testimonial1Stat: "12 medicines verified",
    testimonial2Quote: "The CDSCO database integration is what sets MedVerify apart. I can show patients the official verification record on my phone. Trust is everything in rural healthcare.",
    testimonial2Author: "Dr. Ramesh Patel",
    testimonial2Role: "Primary Health Centre Doctor - Rajkot, Gujarat",
    testimonial2Stat: "200+ verifications/month",
    testimonial3Quote: "Before MedVerify, I had no way to verify if a new supplier's stock was genuine. Now I scan every new batch before it goes on my shelves. It takes 3 seconds.",
    testimonial3Author: "Meera Krishnamurthy",
    testimonial3Role: "Community Pharmacist - Coimbatore, TN",
    testimonial3Stat: "Zero fake medicines since Jan 2025",

    // Footer & Legal
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    copyright: "© 2026 MedVerify. All rights reserved.",
    
    // Privacy Page
    privacyTitle: "Privacy Policy",
    privacySubtitle: "How MedVerify handles your data and ensures medical privacy.",
    privacy1Title: "Data Minimization",
    privacy1Desc: "MedVerify does not store your name, phone number, or biometric data. Images are processed in real-time and deleted immediately after analysis.",
    privacy2Title: "AI Ethics",
    privacy2Desc: "Our AI models are trained on public medical databases. No user-uploaded images are used for model training without explicit consent.",
    privacy3Title: "Local Processing",
    privacy3Desc: "Key verification layers run securely to ensure minimal data transmission, protecting your privacy in every scan.",

    // Terms Page
    termsTitle: "Terms of Service",
    termsSubtitle: "Legal framework and AI disclaimers for using MedVerify.",
    terms1Title: "No Medical Advice",
    terms1Desc: "MedVerify is an authentication tool, not a medical diagnostic service. Always consult a licensed healthcare professional before use.",
    terms2Title: "Verification Limits",
    terms2Desc: "AI analysis is a risk-assessment tool. It cannot detect chemical purity without laboratory testing. Use as a primary screening layer.",
    terms3Title: "User Responsibility",
    terms3Desc: "Users are encouraged to report suspicious medicines to authorities. MedVerify is not liable for errors in visual AI detection.",

    // Results page — new human-language labels
    aboutThisMedicine: "About This Medicine",
    whatShouldIDo: "What should I do?",
    whatUsedFor: "What it is used for:",

    // configMap titles & descriptions
    verifiedDbTitle: "✅ Medicine identity confirmed",
    verifiedDbDesc: "We found this medicine name and composition in our approved records. This means the medicine itself is a legitimate, approved product.",
    verifiedDbSafetyLabel: "Identity Confirmed",
    verifiedDbAction: "We confirmed this is a real, approved medicine. We cannot verify the specific box in your hand — always check the expiry date, buy from a licensed pharmacy, and if the packaging looks damaged or unusual, do not use it.",

    verifiedBarcodeTitle: "✅ Barcode matched an approved medicine",
    verifiedBarcodeDesc: "The barcode on this medicine matched a known, approved product in our records.",
    verifiedBarcodeSafetyLabel: "Barcode Recognised",
    verifiedBarcodeAction: "The barcode is legitimate. We cannot verify the specific box in your hand — always check the expiry date, buy from a licensed pharmacy, and if the packaging looks damaged or unusual, do not use it.",

    verifiedGlobalTitle: "✅ This medicine is a known product",
    verifiedGlobalDesc: "This medicine is found in international health databases as a recognised product. It is not yet in our Indian registry.",
    verifiedGlobalSafetyLabel: "Recognised Globally",
    verifiedGlobalAction: "This medicine exists as a real product, but we could not verify it in our Indian database. Buy only from a licensed pharmacy and always check the expiry date.",

    cautionTitle: "⚠️ Be careful with this medicine",
    cautionDesc: "Something about this medicine needs your attention. Please check it with a pharmacist before using.",
    cautionSafetyLabel: "Check Before Using",
    cautionAction: "Do not use this medicine yet. Show it to a licensed pharmacist or your doctor first.",

    dangerTitle: "🚫 Do NOT use this medicine",
    dangerDesc: "This medicine has been flagged. It may be fake, recalled, or harmful. Stop using it immediately.",
    dangerSafetyLabel: "Do Not Use",
    dangerAction: "Stop using this medicine immediately. Report it to your pharmacist and the nearest government health centre.",

    unableTitle: "🔍 We could not confirm this medicine",
    unableDesc: "We searched our records but could not find this medicine. This does not mean it is fake — it may not be in our database yet.",
    unableSafetyLabel: "Could Not Confirm",
    unableAction: "Ask your pharmacist to verify this medicine before you take it. When in doubt, do not use.",

    // Disclaimer block
    importantNotice: "Important Notice",
    disclaimerLine1: "MedVerify is an identity verification tool — it checks whether a medicine's name, barcode, or batch number matches approved records. It does not physically inspect or guarantee the quality of the medicine in your hand.",
    disclaimerLine2: "If you suspect your medicine is fake, tampered, or of poor quality, please:",
    disclaimerStep1: "Report it to CDSCO — Central Drugs Standard Control Organisation (India's official drug regulator)",
    disclaimerStep2: "Contact the pharmacy where you purchased it and ask for a replacement or refund.",
    disclaimerStep3: "Consult your doctor before continuing any treatment.",

    // Batch verification card
    batchVerificationTitle: "Batch Verification",

    // Scanner
    scannerTitle: "Scan Barcode / QR Code",
    scannerStarting: "Starting camera...",
    scannerPermissionDenied: "Camera permission denied. Please allow camera access in your browser settings.",
    scannerError: "Could not start camera. Please ensure no other app is using it.",
    scannerGoBack: "Go Back",
    scannerHint: "Point your camera at the barcode or QR code on the medicine box. Hold steady until detected.",

    // Evidence and Recommendation translations
    evidenceYes: "Yes",
    evidenceNo: "No",
    evidenceMedverifyRegistry: "MedVerify Registry",
    evidenceOpenfdaRegistry: "OpenFDA Registry",
    evidenceNihRegistry: "NIH RxNorm (Global)",
    evidenceRecalledBanned: "Recalled/Banned",
    evidenceSafe: "Safe",
    evidenceFlagged: "Flagged",
    evidenceLowRisk: "Low Risk",
    evidenceMatches: "Matches",
    evidenceNotProvided: "Not Provided",
    evidenceInvalid: "Invalid",
    evidenceHigh: "High",
    evidenceMedium: "Medium",
    evidenceLow: "Low",
    evidenceNA: "N/A",

    recLicensedPharmacy: "Always purchase from a licensed pharmacy.",
    recDoNotUse: "DO NOT USE. Please report this to CDSCO.",
    recSuspicious: "Packaging appears suspicious. Verify with a pharmacist.",
    recGlobal: "Medicine recognized globally, but always buy from a licensed Indian pharmacy.",
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
    barcodeMatch: "बारकोड/QR परिणाम",
    ocrConfidence: "OCR कॉन्फिडेंस",
    recommendation: "सिफ़ारिश",

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

    // Index - Live Demo
    liveDemo: "लाइव डेमो",
    seeItInAction: "इसे क्रियान्वित देखें",
    demoSubtitle: "MedVerify को वास्तविक समय में दवा को प्रमाणित करते हुए देखें। हर विवरण — बैच नंबर, निर्माता, समाप्ति — आधिकारिक रिकॉर्ड के साथ क्रॉस-चेक किया जाता है।",
    demoFeature1Title: "3-सेकंड परिणाम",
    demoFeature1Desc: "लेबल को मैन्युअल रूप से पढ़ने से तेज़।",
    demoFeature2Title: "ऑफ़लाइन काम करता है",
    demoFeature2Desc: "खराब कनेक्टिविटी वाले ग्रामीण क्षेत्रों के लिए कैश किया गया CDSCO डेटा।",
    demoFeature3Title: "हिंदी और अंग्रेजी",
    demoFeature3Desc: "सभी परिणामों में दोनों भाषाओं के लिए पूर्ण समर्थन।",
    demoStatus: "सत्यापित असली",
    demoMedicine: "पैरासिटामोल 500mg",
    demoManufacturer: "सिप्ला लिमिटेड, मुंबई",
    demoBatch: "CPL-2025-B4471",
    demoExpiry: "दिसंबर 2026",
    demoCdscoStatus: "अनुमोदित",
    scanAgain: "फिर से स्कैन करें",
    reportSuspicious: "संदिग्ध दवा की रिपोर्ट करें",

    // Index - Testimonials
    fromTheField: "क्षेत्र से रिपोर्ट",
    trustedTitle: "भारत के स्वास्थ्य कार्यकर्ताओं द्वारा विश्वसनीय",
    trustedSubtitle: "आशा कार्यकर्ताओं, डॉक्टरों और फार्मासिस्टों की वास्तविक कहानियाँ जो अपने समुदायों को नकली दवाओं से बचा रहे हैं।",
    testimonial1Quote: "मैंने पिछले हफ्ते अपने ग्रामीण स्वास्थ्य शिविर में 12 दवाओं का सत्यापन किया। MedVerify ने दो संदिग्ध बैचों को पकड़ा जिन्हें आपूर्तिकर्ता ने असली बताया था। इसने जानें बचाईं।",
    testimonial1Author: "सुनीता देवी",
    testimonial1Role: "आशा कार्यकर्ता - वाराणसी, यूपी",
    testimonial1Stat: "12 दवाओं का सत्यापन किया गया",
    testimonial2Quote: "CDSCO डेटाबेस एकीकरण MedVerify को अलग बनाता है। मैं अपने फोन पर मरीजों को आधिकारिक सत्यापन रिकॉर्ड दिखा सकता हूँ। ग्रामीण स्वास्थ्य सेवा में विश्वास ही सब कुछ है।",
    testimonial2Author: "डॉ. रमेश पटेल",
    testimonial2Role: "प्राथमिक स्वास्थ्य केंद्र के डॉक्टर - राजकोट, गुजरात",
    testimonial2Stat: "200+ सत्यापन/माह",
    testimonial3Quote: "MedVerify से पहले, मेरे पास यह सत्यापित करने का कोई तरीका नहीं था कि नए आपूर्तिकर्ता का स्टॉक असली है या नहीं। अब मैं अपने अलमारियों में रखने से पहले हर नए बैच को स्कैन करता हूँ। इसमें 3 सेकंड लगते हैं।",
    testimonial3Author: "मीरा कृष्णमूर्ति",
    testimonial3Role: "सामुदायिक फार्मासिस्ट - कोयंबटूर, टीएन",
    testimonial3Stat: "जनवरी 2025 से शून्य नकली दवाएँ",

    // Footer & Legal
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा की शर्तें",
    copyright: "© 2026 MedVerify. सर्वाधिकार सुरक्षित।",

    // Privacy Page
    privacyTitle: "गोपनीयता नीति",
    privacySubtitle: "MedVerify आपके डेटा को कैसे संभालता है और चिकित्सा गोपनीयता सुनिश्चित करता है।",
    privacy1Title: "डेटा न्यूनतमकरण",
    privacy1Desc: "MedVerify आपका नाम, फोन नंबर या बायोमेट्रिक डेटा संग्रहीत नहीं करता है। छवियों को वास्तविक समय में संसाधित किया जाता है और विश्लेषण के तुरंत बाद हटा दिया जाता है।",
    privacy2Title: "AI आचार संहिता",
    privacy2Desc: "हमारे AI मॉडल सार्वजनिक चिकित्सा डेटाबेस पर प्रशिक्षित हैं। उपयोगकर्ता द्वारा अपलोड की गई छवियों का उपयोग स्पष्ट सहमति के बिना मॉडल प्रशिक्षण के लिए नहीं किया जाता है।",
    privacy3Title: "स्थानीय प्रसंस्करण",
    privacy3Desc: "न्यूनतम डेटा ट्रांसमिशन सुनिश्चित करने के लिए मुख्य सत्यापन स्तर सुरक्षित रूप से चलते हैं, जिससे हर स्कैन में आपकी गोपनीयता बनी रहती है।",

    // Terms Page
    termsTitle: "सेवा की शर्तें",
    termsSubtitle: "MedVerify का उपयोग करने के लिए कानूनी ढाँचा और AI अस्वीकरण।",
    terms1Title: "कोई चिकित्सा सलाह नहीं",
    terms1Desc: "MedVerify एक प्रमाणीकरण उपकरण है, चिकित्सा निदान सेवा नहीं। उपयोग करने से पहले हमेशा एक लाइसेंस प्राप्त स्वास्थ्य पेशेवर से परामर्श लें।",
    terms2Title: "सत्यापन सीमाएं",
    terms2Desc: "AI विश्लेषण एक जोखिम-मूल्यांकन उपकरण है। यह प्रयोगशाला परीक्षण के बिना रासायनिक शुद्धता का पता नहीं लगा सकता है। इसका उपयोग प्राथमिक स्क्रीनिंग परत के रूप में करें।",
    terms3Title: "उपयोगकर्ता की जिम्मेदारी",
    terms3Desc: "उपयोगकर्ताओं को अधिकारियों को संदिग्ध दवाओं की रिपोर्ट करने के लिए प्रोत्साहित किया जाता है। MedVerify विज़ुअल AI पहचान में त्रुटियों के लिए उत्तरदायी नहीं है।",

    // Results page — new human-language labels
    aboutThisMedicine: "इस दवा के बारे में",
    whatShouldIDo: "मुझे क्या करना चाहिए?",
    whatUsedFor: "इसका उपयोग किसलिए होता है:",

    // configMap titles & descriptions
    verifiedDbTitle: "✅ दवा की पहचान सत्यापित हुई",
    verifiedDbDesc: "हमें यह दवा का नाम और संरचना हमारे अनुमोदित रिकॉर्ड में मिली। इसका मतलब है कि यह दवा एक वैध, अनुमोदित उत्पाद है।",
    verifiedDbSafetyLabel: "पहचान सत्यापित",
    verifiedDbAction: "हमने पुष्टि की है कि यह एक असली, अनुमोदित दवा है। हम आपके हाथ में मौजूद विशिष्ट पैकेट की जाँच नहीं कर सकते — हमेशा समाप्ति तिथि जाँचें, लाइसेंसी फार्मेसी से खरीदें, और यदि पैकेजिंग क्षतिग्रस्त या असामान्य लगे तो उपयोग न करें।",

    verifiedBarcodeTitle: "✅ बारकोड एक अनुमोदित दवा से मेल खाया",
    verifiedBarcodeDesc: "इस दवा का बारकोड हमारे रिकॉर्ड में एक ज्ञात, अनुमोदित उत्पाद से मेल खाया।",
    verifiedBarcodeSafetyLabel: "बारकोड पहचाना गया",
    verifiedBarcodeAction: "बारकोड वैध है। हम आपके हाथ में मौजूद विशिष्ट पैकेट की जाँच नहीं कर सकते — हमेशा समाप्ति तिथि जाँचें, लाइसेंसी फार्मेसी से खरीदें, और यदि पैकेजिंग असामान्य लगे तो उपयोग न करें।",

    verifiedGlobalTitle: "✅ यह दवा एक ज्ञात उत्पाद है",
    verifiedGlobalDesc: "यह दवा अंतरराष्ट्रीय स्वास्थ्य डेटाबेस में एक मान्यता प्राप्त उत्पाद के रूप में मिली है। यह अभी हमारी भारतीय रजिस्ट्री में नहीं है।",
    verifiedGlobalSafetyLabel: "वैश्विक स्तर पर मान्यता प्राप्त",
    verifiedGlobalAction: "यह दवा एक असली उत्पाद के रूप में मौजूद है, लेकिन हम इसे हमारे भारतीय डेटाबेस में सत्यापित नहीं कर सके। केवल लाइसेंसी फार्मेसी से खरीदें और हमेशा समाप्ति तिथि जाँचें।",

    cautionTitle: "⚠️ इस दवा के बारे में सावधान रहें",
    cautionDesc: "इस दवा के बारे में कुछ है जिस पर आपको ध्यान देना होगा। उपयोग करने से पहले कृपया किसी फार्मासिस्ट से जाँचें।",
    cautionSafetyLabel: "उपयोग से पहले जाँचें",
    cautionAction: "अभी इस दवा का उपयोग न करें। पहले इसे किसी लाइसेंसी फार्मासिस्ट या अपने डॉक्टर को दिखाएँ।",

    dangerTitle: "🚫 इस दवा का उपयोग न करें",
    dangerDesc: "इस दवा को चिह्नित किया गया है। यह नकली, वापस बुलाई गई, या हानिकारक हो सकती है। इसका उपयोग तुरंत बंद करें।",
    dangerSafetyLabel: "उपयोग न करें",
    dangerAction: "इस दवा का उपयोग तुरंत बंद करें। अपने फार्मासिस्ट और निकटतम सरकारी स्वास्थ्य केंद्र को इसकी रिपोर्ट करें।",

    unableTitle: "🔍 हम इस दवा की पुष्टि नहीं कर सके",
    unableDesc: "हमने अपने रिकॉर्ड में खोजा लेकिन यह दवा नहीं मिली। इसका मतलब यह नहीं कि यह नकली है — यह अभी हमारे डेटाबेस में नहीं हो सकती।",
    unableSafetyLabel: "पुष्टि नहीं हो सकी",
    unableAction: "दवा लेने से पहले अपने फार्मासिस्ट से इसे सत्यापित करवाएं। संदेह होने पर उपयोग न करें।",

    // Disclaimer block
    importantNotice: "महत्वपूर्ण सूचना",
    disclaimerLine1: "MedVerify एक पहचान सत्यापन उपकरण है — यह जाँचता है कि किसी दवा का नाम, बारकोड या बैच नंबर अनुमोदित रिकॉर्ड से मेल खाता है या नहीं। यह आपके हाथ में मौजूद दवा की भौतिक जाँच नहीं करता और उसकी गुणवत्ता की गारंटी नहीं देता।",
    disclaimerLine2: "यदि आपको संदेह है कि आपकी दवा नकली, मिलावटी या खराब गुणवत्ता की है, तो कृपया:",
    disclaimerStep1: "CDSCO — केंद्रीय औषधि मानक नियंत्रण संगठन (भारत के आधिकारिक दवा नियामक) को रिपोर्ट करें",
    disclaimerStep2: "उस फार्मेसी से संपर्क करें जहाँ से आपने इसे खरीदा और बदलने या वापसी के लिए कहें।",
    disclaimerStep3: "कोई भी उपचार जारी रखने से पहले अपने डॉक्टर से परामर्श करें।",

    // Batch verification card
    batchVerificationTitle: "बैच सत्यापन",

    // Scanner
    scannerTitle: "बारकोड / QR कोड स्कैन करें",
    scannerStarting: "कैमरा शुरू हो रहा है...",
    scannerPermissionDenied: "कैमरा अनुमति अस्वीकार की गई। कृपया अपनी ब्राउज़र सेटिंग में कैमरा पहुँच की अनुमति दें।",
    scannerError: "कैमरा शुरू नहीं हो सका। सुनिश्चित करें कि कोई अन्य ऐप इसका उपयोग नहीं कर रहा।",
    scannerGoBack: "वापस जाएँ",
    scannerHint: "दवा के डिब्बे पर बारकोड या QR कोड पर कैमरा रखें। पहचान होने तक स्थिर रखें।",

    // Evidence and Recommendation translations
    evidenceYes: "हाँ",
    evidenceNo: "नहीं",
    evidenceMedverifyRegistry: "MedVerify रजिस्ट्री",
    evidenceOpenfdaRegistry: "OpenFDA रजिस्ट्री",
    evidenceNihRegistry: "NIH RxNorm (वैश्विक)",
    evidenceRecalledBanned: "वापस बुलाई गई/प्रतिबंधित",
    evidenceSafe: "सुरक्षित",
    evidenceFlagged: "चिह्नित",
    evidenceLowRisk: "कम जोखिम",
    evidenceMatches: "मेल खाता है",
    evidenceNotProvided: "प्रदान नहीं किया गया",
    evidenceInvalid: "अमान्य",
    evidenceHigh: "उच्च",
    evidenceMedium: "मध्यम",
    evidenceLow: "कम",
    evidenceNA: "लागू नहीं",

    recLicensedPharmacy: "हमेशा लाइसेंस प्राप्त फार्मेसी से ही खरीदें।",
    recDoNotUse: "उपयोग न करें। कृपया CDSCO को इसकी रिपोर्ट करें।",
    recSuspicious: "पैकेजिंग संदिग्ध लग रही है। फार्मासिस्ट से सत्यापित करें।",
    recGlobal: "दवा वैश्विक स्तर पर मान्यता प्राप्त है, लेकिन हमेशा एक लाइसेंस प्राप्त भारतीय फार्मेसी से खरीदें।",
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

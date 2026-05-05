import { useState, useRef } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ShieldCheck, ShieldAlert, ShieldX, AlertTriangle, MapPin, ChevronRight, HelpCircle,
  Pill, FlaskConical, Scan, FileText, Users, CheckCircle2, Package, CalendarClock, Factory,
  Search, Building2, Star, Loader2, Download, Plus, Archive
} from "lucide-react";
// @ts-expect-error - jspdf types
import jsPDF from "jspdf";
// @ts-expect-error - html2canvas types
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollReveal } from "../components/animations/ScrollReveal";

type ApiStatus = "safe" | "verified_database" | "verified_barcode" | "caution" | "danger" | "verified_global" | "unable_to_verify";

interface BatchVerification {
  status: "verified" | "recalled" | "not_found" | "error";
  source?: string;
  batch_number?: string;
  manufacturer?: string;
  manufacture_date?: string;
  expiry_date?: string;
  distribution_states?: string;
  recall_status?: string;
  message?: string;
}

interface ResultState {
  status: ApiStatus | "error";
  drugName: string;
  composition: string;
  message: string;
  communityFlagged?: boolean;
  communityReportCount?: number;
  batchVerification?: BatchVerification | null;
  evidence?: {
    medicine_identified: string;
    database_match: string;
    regulatory_status: string;
    packaging_analysis: string;
    barcode_match: string;
    ocr_confidence: string;
  };
  recommendation?: string;
}

const ResultsPage = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const state = location.state as ResultState | null;

  const [reported, setReported] = useState(false);
  const [reporting, setReporting] = useState(false);

  // Phase 5 Polish: PDF & Cabinet state
  const certificateRef = useRef<HTMLDivElement>(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [addedToCabinet, setAddedToCabinet] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  const downloadPDF = async () => {
    if (!certificateRef.current) return;
    try {
      setDownloadingPDF(true);
      const canvas = await html2canvas(certificateRef.current, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false
      });
      
      // Use JPEG with 0.75 quality to drastically reduce file size (from 10MB+ to ~300KB)
      const imgData = canvas.toDataURL("image/jpeg", 0.75);
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions with 10mm margins
      const margin = 10;
      const contentWidth = pdfWidth - (2 * margin);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      
      // Logic to prevent cutting off: if content is too tall, scale it to fit the page
      let finalWidth = contentWidth;
      let finalHeight = contentHeight;
      const maxAllowedHeight = pdfPageHeight - 30; // 30mm reserved for margins and footer
      
      if (contentHeight > maxAllowedHeight) {
        finalHeight = maxAllowedHeight;
        finalWidth = (canvas.width * finalHeight) / canvas.height;
      }
      
      // Center the image horizontally
      const xOffset = (pdfWidth - finalWidth) / 2;
      
      pdf.addImage(imgData, "JPEG", xOffset, margin, finalWidth, finalHeight);
      
      // Footer text - cleaner and more professional
      pdf.setFontSize(8);
      pdf.setTextColor(160);
      const footerY = pdfPageHeight - 10;
      pdf.text(`MedVerify Digital Certificate of Authentication - Generated on ${new Date().toLocaleDateString()}`, margin, footerY);
      pdf.text(`Page 1/1`, pdfWidth - margin, footerY, { align: "right" });
      
      pdf.save(`MedVerify_Certificate_${drugName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setDownloadingPDF(false);
    }
  };

  const addToCabinet = () => {
    try {
      const cabinet = JSON.parse(localStorage.getItem("medverify_cabinet") || "[]");
      const newMed = {
        id: Date.now().toString(),
        name: drugName,
        composition,
        addedAt: new Date().toISOString(),
        expiryDate: batchVerification?.expiry_date && batchVerification.expiry_date !== "N/A" 
            ? batchVerification.expiry_date 
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default +1 yr
      };
      cabinet.push(newMed);
      localStorage.setItem("medverify_cabinet", JSON.stringify(cabinet));
      setAddedToCabinet(true);
    } catch {
      // Fail silently
    }
  };

  // Phase 5: Verified Pharmacy Search State
  const [showPharmacySearch, setShowPharmacySearch] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pharmacies, setPharmacies] = useState<unknown[]>([]);
  const [loadingPharmacies, setLoadingPharmacies] = useState(false);
  const [pharmacySearched, setPharmacySearched] = useState(false);

  const fetchPharmacies = async () => {
    setLoadingPharmacies(true);
    setPharmacySearched(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const base = API_URL.replace(/\/analyze$/, "");
      const res = await fetch(`${base}/verified-pharmacies?pincode=${pincode}`);
      if (res.ok) {
        const data = await res.json();
        setPharmacies(data.pharmacies || []);
      }
    } catch {
      // Fail silently, show empty list
    } finally {
      setLoadingPharmacies(false);
    }
  };

  if (!state) return <Navigate to="/scan" replace />;

  const { status, drugName, composition, usage_description, message, communityFlagged, communityReportCount, batchVerification } = state;

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background py-8 md:py-16">
        <ScrollReveal>
          <div className="container mx-auto max-w-2xl px-4">
            <Alert variant="destructive" className="mt-6">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription className="text-sm">{message}</AlertDescription>
            </Alert>
            <Link to="/scan" className="mt-6 block">
              <Button variant="default" size="lg" className="w-full gap-2">
                <Scan className="h-5 w-5" />
                {t("scanAnother")}
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  const configMap: Record<string, {
    Icon: React.ElementType;
    title: string;
    desc: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    badgeBg: string;
    safetyLabel: string;
    safetyEmoji: string;
    actionMessage: string;
  }> = {
    verified_database: {
      Icon: ShieldCheck,
      title: "✅ Medicine identity confirmed",
      desc: "We found this medicine name and composition in our approved records. This means the medicine itself is a legitimate, approved product.",
      bgClass: "bg-primary/8",
      textClass: "text-primary",
      borderClass: "border-primary/30",
      badgeBg: "bg-primary/10",
      safetyEmoji: "✅",
      safetyLabel: "Identity Confirmed",
      actionMessage: "We confirmed this is a real, approved medicine. We cannot verify the specific box in your hand — always check the expiry date, buy from a licensed pharmacy, and if the packaging looks damaged or unusual, do not use it.",
    },
    verified_barcode: {
      Icon: ShieldCheck,
      title: "✅ Barcode matched an approved medicine",
      desc: "The barcode on this medicine matched a known, approved product in our records.",
      bgClass: "bg-primary/8",
      textClass: "text-primary",
      borderClass: "border-primary/30",
      badgeBg: "bg-primary/10",
      safetyEmoji: "✅",
      safetyLabel: "Barcode Recognised",
      actionMessage: "The barcode is legitimate. We cannot verify the specific box in your hand — always check the expiry date, buy from a licensed pharmacy, and if the packaging looks damaged or unusual, do not use it.",
    },
    verified_global: {
      Icon: ShieldCheck,
      title: "✅ This medicine is a known product",
      desc: "This medicine is found in international health databases as a recognised product. It is not yet in our Indian registry.",
      bgClass: "bg-blue-500/8",
      textClass: "text-blue-600",
      borderClass: "border-blue-500/30",
      badgeBg: "bg-blue-500/10",
      safetyEmoji: "✅",
      safetyLabel: "Recognised Globally",
      actionMessage: "This medicine exists as a real product, but we could not verify it in our Indian database. Buy only from a licensed pharmacy and always check the expiry date.",
    },
    caution: {
      Icon: ShieldAlert,
      title: "⚠️ Be careful with this medicine",
      desc: "Something about this medicine needs your attention. Please check it with a pharmacist before using.",
      bgClass: "bg-warning/8",
      textClass: "text-warning",
      borderClass: "border-warning/30",
      badgeBg: "bg-warning/10",
      safetyEmoji: "⚠️",
      safetyLabel: "Check Before Using",
      actionMessage: "Do not use this medicine yet. Show it to a licensed pharmacist or your doctor first.",
    },
    danger: {
      Icon: ShieldX,
      title: "🚫 Do NOT use this medicine",
      desc: "This medicine has been flagged. It may be fake, recalled, or harmful. Stop using it immediately.",
      bgClass: "bg-destructive/8",
      textClass: "text-destructive",
      borderClass: "border-destructive/30",
      badgeBg: "bg-destructive/10",
      safetyEmoji: "🚫",
      safetyLabel: "Do Not Use",
      actionMessage: "Stop using this medicine immediately. Report it to your pharmacist and the nearest government health centre.",
    },
    unable_to_verify: {
      Icon: HelpCircle,
      title: "🔍 We could not confirm this medicine",
      desc: "We searched our records but could not find this medicine. This does not mean it is fake — it may not be in our database yet.",
      bgClass: "bg-slate-500/8",
      textClass: "text-slate-600",
      borderClass: "border-slate-500/30",
      badgeBg: "bg-slate-500/10",
      safetyEmoji: "🔍",
      safetyLabel: "Could Not Confirm",
      actionMessage: "Ask your pharmacist to verify this medicine before you take it. When in doubt, do not use.",
    },
  };

  const config = configMap[status];

  // Safety net: if status is an unknown value, redirect rather than crash
  if (!config) return <Navigate to="/scan" replace />;

  const threatColorClass =
    status === "verified_database" || status === "verified_barcode" || status === "verified_global"
      ? "text-primary"
      : status === "caution"
      ? "text-warning"
      : status === "unable_to_verify"
      ? "text-slate-400"
      : "text-destructive";

  return (
    <div className="min-h-screen bg-background py-6 md:py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:text-sm">
          {t("verificationComplete")}
        </p>

        {/* Main result card */}
        <div ref={certificateRef} className="bg-background pb-2">
          <ScrollReveal duration={0.6}>
          <Card className={`mt-5 overflow-hidden border-2 shadow-md ${config.borderClass}`}>
            <div className={`flex flex-col items-center gap-4 p-6 sm:p-8 ${config.bgClass}`}>
              <div className="relative">
                <config.Icon className={`h-16 w-16 sm:h-20 sm:w-20 ${config.textClass}`} strokeWidth={1.5} />
                {status === "safe" && (
                  <div className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-primary/30" />
                )}
              </div>
              <div className="text-center">
                <h1 className={`font-display text-2xl font-extrabold sm:text-3xl ${config.textClass}`}>
                  {config.title}
                </h1>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{drugName}</p>
              </div>
            </div>
            <CardContent className="px-4 py-4 sm:p-6">
              <p className="text-center text-sm text-muted-foreground">{config.desc}</p>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Community Warning Banner */}
        {communityFlagged && (
          <ScrollReveal delay={0.15} duration={0.5}>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
              <div>
                <p className="text-sm font-bold text-warning">Community Warning</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {communityReportCount} users near you have flagged this medicine as suspicious. Verify with a licensed pharmacist before use.
                </p>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Analysis data */}
        <ScrollReveal delay={0.2} duration={0.6}>
          <Card className="mt-5 border-border/60 shadow-sm">
            <CardHeader className="px-4 pb-2 pt-4 sm:px-6 sm:pt-6">
              <CardTitle className="font-display text-base sm:text-lg">About This Medicine</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 px-4 pb-4 pt-0 sm:gap-4 sm:px-6 sm:pb-6">
              {/* Drug Name */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-9 sm:w-9">
                  <Pill className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">{t("drugName")}</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground break-words">{drugName}</p>
                </div>
              </div>

              <Separator />

              {/* Composition */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-9 sm:w-9">
                  <FlaskConical className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">{t("composition")}</p>
                  <p
                    className={`mt-0.5 text-sm font-medium break-words ${
                      status === "danger" ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    {composition}
                  </p>
                  {usage_description && usage_description !== "Information not available." && (
                    <div className="mt-2 rounded-md bg-muted/50 p-2.5 border border-border/50">
                      <p className="text-xs font-semibold text-primary mb-0.5 mt-0">What it is used for:</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{usage_description}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* What should I do? */}
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${config.badgeBg}`}
                >
                  <span className="text-base leading-none">{config.safetyEmoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">What should I do?</p>
                  <p className={`mt-0.5 text-sm font-bold ${threatColorClass}`}>
                    {config.safetyLabel}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {config.actionMessage}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Message / Evidence Breakdown */}
              {state?.evidence ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-9 sm:w-9">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div 
                        className="flex items-center justify-between cursor-pointer group select-none"
                        onClick={() => setShowEvidence(!showEvidence)}
                      >
                        <p className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">{t("evidenceBreakdown")}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                            {showEvidence ? "Hide Details" : "Show Details"}
                          </span>
                          <ChevronRight className={`h-3 w-3 text-primary transition-transform duration-200 ${showEvidence ? "rotate-90" : ""}`} />
                        </div>
                      </div>
                      
                      {showEvidence && (
                        <ul className="mt-2 space-y-1.5 text-sm text-foreground bg-muted/30 p-2.5 rounded-md border border-border/50 animate-in fade-in slide-in-from-top-1 duration-200">
                          <li className="flex justify-between items-center border-b border-border/40 pb-1">
                            <span className="text-muted-foreground text-xs">{t("medicineIdentified")}</span>
                            <span className="font-semibold text-xs">{state.evidence.medicine_identified}</span>
                          </li>
                          <li className="flex justify-between items-center border-b border-border/40 pb-1">
                            <span className="text-muted-foreground text-xs">{t("databaseMatch")}</span>
                            <span className="font-semibold text-xs">{state.evidence.database_match}</span>
                          </li>
                          <li className="flex justify-between items-center border-b border-border/40 pb-1">
                            <span className="text-muted-foreground text-xs">{t("regulatoryStatus")}</span>
                            <span className="font-semibold text-xs">{state.evidence.regulatory_status}</span>
                          </li>
                          <li className="flex justify-between items-center border-b border-border/40 pb-1">
                            <span className="text-muted-foreground text-xs">{t("packagingAnalysis")}</span>
                            <span className="font-semibold text-xs">{state.evidence.packaging_analysis}</span>
                          </li>
                          <li className="flex justify-between items-center border-b border-border/40 pb-1">
                            <span className="text-muted-foreground text-xs">{t("barcodeMatch")}</span>
                            <span className="font-semibold text-xs">{state.evidence.barcode_match}</span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="text-muted-foreground text-xs">{t("ocrConfidence")}</span>
                            <span className="font-semibold text-xs">{state.evidence.ocr_confidence}</span>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                  {state?.recommendation && (
                    <>
                      <Separator className="my-1" />
                      <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-200 dark:border-blue-800">
                        <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">{t("recommendation")}</p>
                        <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed font-medium">{state.recommendation}</p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-9 sm:w-9">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Threat Matrix Analysis</p>
                    <p className="mt-0.5 text-sm text-foreground whitespace-pre-line break-words leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Phase 4: Batch Verification Card */}
        {batchVerification && batchVerification.status !== "error" && (
          <ScrollReveal delay={0.35}>
            <Card className={`mt-4 border-2 ${
              batchVerification.status === "recalled"
                ? "border-destructive/60 bg-destructive/5"
                : batchVerification.status === "verified"
                ? "border-primary/40 bg-primary/5"
                : "border-border/60"
            }`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-bold">
                  <Package className={`h-4 w-4 ${
                    batchVerification.status === "recalled" ? "text-destructive" :
                    batchVerification.status === "verified" ? "text-primary" : "text-muted-foreground"
                  }`} />
                  Batch-Level Verification
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    batchVerification.status === "recalled" ? "bg-destructive text-destructive-foreground" :
                    batchVerification.status === "verified"  ? "bg-primary text-primary-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {batchVerification.status === "recalled" ? "⛔ RECALLED" :
                     batchVerification.status === "verified"  ? "✅ VERIFIED"  : "⚠️ NOT FOUND"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <p className="text-xs text-muted-foreground leading-relaxed">{batchVerification.message}</p>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {batchVerification.batch_number && (
                    <div>
                      <p className="font-medium text-muted-foreground">Batch No.</p>
                      <p className="font-bold text-foreground">{batchVerification.batch_number}</p>
                    </div>
                  )}
                  {batchVerification.manufacturer && (
                    <div className="flex items-start gap-1">
                      <Factory className="h-3 w-3 mt-0.5 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-muted-foreground">Manufacturer</p>
                        <p className="font-bold text-foreground">{batchVerification.manufacturer}</p>
                      </div>
                    </div>
                  )}
                  {batchVerification.manufacture_date && batchVerification.manufacture_date !== "N/A" && (
                    <div className="flex items-start gap-1">
                      <CalendarClock className="h-3 w-3 mt-0.5 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-muted-foreground">Manufactured</p>
                        <p className="font-bold text-foreground">{batchVerification.manufacture_date}</p>
                      </div>
                    </div>
                  )}
                  {batchVerification.expiry_date && batchVerification.expiry_date !== "N/A" && (
                    <div>
                      <p className="font-medium text-muted-foreground">Expires</p>
                      <p className="font-bold text-foreground">{batchVerification.expiry_date}</p>
                    </div>
                  )}
                </div>
                {batchVerification.distribution_states && batchVerification.distribution_states !== "N/A" && (
                  <div className="flex items-start gap-2 rounded-lg bg-background/60 p-2">
                    <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground">Authorized Distribution</p>
                      <p className="text-xs font-semibold text-foreground">{batchVerification.distribution_states}</p>
                    </div>
                  </div>
                )}
                {batchVerification.source && (
                  <p className="text-[10px] text-muted-foreground text-right">Source: {batchVerification.source}</p>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>
        )}
        </div>

        {/* Actions */}
        <ScrollReveal delay={0.4}>
          {/* Responsible Use Disclaimer */}
          <div className="mt-6 rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">Important Notice</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">MedVerify is an identity verification tool</strong> — it checks whether a medicine's name, barcode, or batch number matches approved records. It does not physically inspect or guarantee the quality of the medicine in your hand.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you suspect your medicine is <strong className="text-foreground">fake, tampered, or of poor quality</strong>, please:
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground list-none">
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold shrink-0 mt-0.5">1.</span>
                <span>
                  Report it to{" "}
                  <a
                    href="https://cdsco.gov.in/opencms/opencms/en/consumer/consumer-complaint/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold underline underline-offset-2 hover:opacity-80"
                  >
                    CDSCO — Central Drugs Standard Control Organisation
                  </a>{" "}
                  (India's official drug regulator)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold shrink-0 mt-0.5">2.</span>
                <span>Contact the pharmacy where you purchased it and ask for a replacement or refund.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold shrink-0 mt-0.5">3.</span>
                <span>Consult your doctor before continuing any treatment.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 grid gap-3">
            <Link to="/scan">
              <Button variant="default" size="lg" className="w-full gap-2 bg-primary hover:bg-primary/90">
                <Scan className="h-5 w-5" />
                {t("scanAnother")}
              </Button>
            </Link>
            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
              {status !== "safe" && status !== "verified_global" && (
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full gap-2"
                  disabled={reported || reporting}
                  onClick={async () => {
                    setReporting(true);
                    try {
                      const API_URL = import.meta.env.VITE_API_URL || "";
                      const base = API_URL.replace(/\/analyze$/, "");
                      await fetch(`${base}/report`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          // X-API-Key removed for security: backend now uses Domain-Lock (Origin header)
                        },
                        body: JSON.stringify({ medicine_name: drugName }),
                      });
                      setReported(true);
                    } catch {
                      // fail silently — report best-effort
                    } finally {
                      setReporting(false);
                    }
                  }}
                >
                  {reported ? (
                    <><CheckCircle2 className="h-4 w-4" /> Report Submitted — Thank you!</>
                  ) : (
                    <><AlertTriangle className="h-4 w-4" /> {t("reportFake")}</>
                  )}
                </Button>
              )}
              
              {(status === "safe" || status === "verified_global" || status === "verified_database" || status === "verified_barcode") && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
                    disabled={addedToCabinet}
                    onClick={addToCabinet}
                  >
                    {addedToCabinet ? (
                      <><CheckCircle2 className="h-4 w-4 shrink-0" /> Saved to Cabinet</>
                    ) : (
                      <><Archive className="h-4 w-4 shrink-0" /> Add to Cabinet</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
                    disabled={downloadingPDF}
                    onClick={downloadPDF}
                  >
                    {downloadingPDF ? (
                      <><Loader2 className="h-4 w-4 shrink-0 animate-spin" /> ...</>
                    ) : (
                      <><Download className="h-4 w-4 shrink-0" /> Get Certificate</>
                    )}
                  </Button>
                </>
              )}

              <Button
                variant={showPharmacySearch ? "default" : "outline"}
                size="lg"
                className={`gap-2 ${showPharmacySearch ? "bg-primary text-primary-foreground" : "border-primary/30 text-primary hover:bg-primary/5"} ${
                  status === "safe" ? "xs:col-span-2" : ""
                }`}
                onClick={() => setShowPharmacySearch(!showPharmacySearch)}
              >
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{showPharmacySearch ? "Close Pharmacy Search" : t("findPharmacy")}</span>
                {!showPharmacySearch && <ChevronRight className="ml-auto h-4 w-4 shrink-0" />}
              </Button>
            </div>
            
            {/* Phase 5: Pharmacy Search Section */}
            {showPharmacySearch && (
              <Card className="mt-2 border-primary/20 bg-primary/5">
                <CardContent className="p-4 space-y-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold text-foreground">Find MedVerify Trusted Stockists</p>
                    <p className="text-xs text-muted-foreground">Search for authorized stockists in your area to ensure you receive only genuine, lab-tested medicines.</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        placeholder="Enter Pincode..." 
                        className="pl-9 h-10 border-primary/20"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchPharmacies()}
                      />
                    </div>
                    <Button onClick={fetchPharmacies} disabled={loadingPharmacies} className="h-10">
                      {loadingPharmacies ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                    </Button>
                  </div>

                  {pharmacySearched && !loadingPharmacies && pharmacies.length === 0 && (
                    <div className="text-center py-6 bg-white/50 rounded-xl border border-dashed border-border/50">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mx-auto mb-3">
                        <MapPin className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">No Certified Partners Found</p>
                      <p className="text-xs text-muted-foreground mt-1 px-4">
                        We haven't verified a stockist in {pincode || "this area"} yet. You can find nearby general pharmacies on Google Maps.
                      </p>
                      <Button 
                        variant="link" 
                        className="mt-2 text-primary font-bold gap-2"
                        onClick={() => window.open(`https://www.google.com/maps/search/pharmacy+near+${pincode || 'me'}`, '_blank')}
                      >
                        Find on Google Maps <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {pharmacies.length > 0 && (
                    <div className="space-y-3 mt-4">
                      {pharmacies.map((pharmacy, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-primary/10 shadow-sm transition-all hover:border-primary/30">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-bold text-foreground truncate">{pharmacy.pharmacy_name}</p>
                              {pharmacy.rating && (
                                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                                  <Star className="h-3 w-3 fill-current" /> {pharmacy.rating}
                                </div>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Lic: {pharmacy.license_number}</p>
                            <div className="flex items-start gap-1 mt-1.5">
                              <MapPin className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                              <p className="text-xs text-muted-foreground leading-tight">{pharmacy.address}, {pharmacy.pincode}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default ResultsPage;

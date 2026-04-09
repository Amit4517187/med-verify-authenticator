import { useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ShieldCheck, ShieldAlert, ShieldX, AlertTriangle, MapPin, ChevronRight,
  Pill, FlaskConical, Scan, FileText, Users, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollReveal } from "../components/animations/ScrollReveal";

type ApiStatus = "safe" | "caution" | "danger" | "verified_global";

interface ResultState {
  status: ApiStatus | "error";
  drugName: string;
  composition: string;
  message: string;
  communityFlagged?: boolean;
  communityReportCount?: number;
}

const ResultsPage = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const state = location.state as ResultState | null;

  const [reported, setReported] = useState(false);
  const [reporting, setReporting] = useState(false);

  if (!state) return <Navigate to="/scan" replace />;

  const { status, drugName, composition, message, communityFlagged, communityReportCount } = state;

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

  const configMap: Record<string, any> = {
    safe: {
      Icon: ShieldCheck,
      title: t("genuine"),
      desc: t("genuineDesc"),
      bgClass: "bg-primary/8",
      textClass: "text-primary",
      borderClass: "border-primary/30",
      badgeBg: "bg-primary/10",
      threatLabel: "LOW — No threat detected",
    },
    verified_global: {
      Icon: ShieldCheck,
      title: "NIH Globally Verified",
      desc: "This medicine is verified through the NIH RxNorm Global Database.",
      bgClass: "bg-blue-500/8",
      textClass: "text-blue-600",
      borderClass: "border-blue-500/30",
      badgeBg: "bg-blue-500/10",
      threatLabel: "AUTHENTIC — Global Match Found",
    },
    caution: {
      Icon: ShieldAlert,
      title: t("suspicious"),
      desc: t("suspiciousDesc"),
      bgClass: "bg-warning/8",
      textClass: "text-warning",
      borderClass: "border-warning/30",
      badgeBg: "bg-warning/10",
      threatLabel: "MEDIUM — Inconsistencies found",
    },
    danger: {
      Icon: ShieldX,
      title: t("fake"),
      desc: t("fakeDesc"),
      bgClass: "bg-destructive/8",
      textClass: "text-destructive",
      borderClass: "border-destructive/30",
      badgeBg: "bg-destructive/10",
      threatLabel: "HIGH — Likely counterfeit",
    },
  };

  const config = configMap[status];

  // Safety net: if status is an unknown value, redirect rather than crash
  if (!config) return <Navigate to="/scan" replace />;

  const threatColorClass =
    status === "safe"
      ? "text-primary"
      : status === "caution"
      ? "text-warning"
      : "text-destructive";

  return (
    <div className="min-h-screen bg-background py-6 md:py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:text-sm">
          {t("verificationComplete")}
        </p>

        {/* Main result card */}
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
              <CardTitle className="font-display text-base sm:text-lg">Medicine Analysis Data</CardTitle>
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
                </div>
              </div>

              <Separator />

              {/* Threat Status */}
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${config.badgeBg}`}
                >
                  <AlertTriangle className={`h-4 w-4 ${threatColorClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">{t("threatStatus")}</p>
                  <p className={`mt-0.5 text-sm font-bold ${threatColorClass}`}>
                    {config.threatLabel}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Message */}
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
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Actions */}
        <ScrollReveal delay={0.4}>
          <div className="mt-6 grid gap-3">
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
                      const API_KEY = import.meta.env.VITE_API_KEY || "";
                      const base = API_URL.replace(/\/analyze$/, "");
                      await fetch(`${base}/report`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "X-API-Key": API_KEY,
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
              <Button
                variant="outline"
                size="lg"
                className={`gap-2 border-primary/30 text-primary hover:bg-primary/5 ${
                  status === "safe" ? "xs:col-span-2" : ""
                }`}
              >
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{t("findPharmacy")}</span>
                <ChevronRight className="ml-auto h-4 w-4 shrink-0" />
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default ResultsPage;

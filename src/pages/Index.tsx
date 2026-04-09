import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Shield, Eye, FileText, QrCode, IndianRupee, Building2,
  ArrowRight, Scan, CheckCircle2, HeartPulse, Pill,
  Zap, WifiOff, Languages, Quote, AlertTriangle, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "../components/animations/ScrollReveal";

const Index = () => {
  const { t } = useLanguage();

  // Phase 3: Proactive Health Safety Alerts
  const [recallAlerts, setRecallAlerts] = useState<string[]>([]);
  const [alertDismissed, setAlertDismissed] = useState(false);

  useEffect(() => {
    const checkForRecalls = async () => {
      try {
        const history: { name: string; scannedAt: string }[] = JSON.parse(
          localStorage.getItem("medverify_scan_history") || "[]"
        );
        if (history.length === 0) return;

        const API_URL = import.meta.env.VITE_API_URL || "";
        const base = API_URL.replace(/\/analyze$/, "");
        const res = await fetch(`${base}/recent-bans`);
        if (!res.ok) return;

        const data = await res.json();
        const recentBans: string[] = (data.recent_bans || []).map(
          (b: { drug_name: string }) => b.drug_name.toLowerCase()
        );

        const matches = history
          .filter((h) => recentBans.includes(h.name.toLowerCase()))
          .map((h) => h.name);

        if (matches.length > 0) setRecallAlerts([...new Set(matches)]);
      } catch {
        // Fail silently — alert is best-effort
      }
    };
    checkForRecalls();
  }, []);

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label"), color: "text-destructive" },
    { value: t("stat2Value"), label: t("stat2Label"), color: "text-warning" },
    { value: t("stat3Value"), label: t("stat3Label"), color: "text-primary" },
    { value: t("stat4Value"), label: t("stat4Label"), color: "text-primary" },
  ];

  const features = [
    { icon: Eye,          title: t("feature1Title"), desc: t("feature1Desc"), layer: 1 },
    { icon: FileText,     title: t("feature2Title"), desc: t("feature2Desc"), layer: 2 },
    { icon: QrCode,       title: t("feature3Title"), desc: t("feature3Desc"), layer: 3 },
    { icon: IndianRupee,  title: t("feature4Title"), desc: t("feature4Desc"), layer: 4 },
    { icon: Building2,    title: t("feature5Title"), desc: t("feature5Desc"), layer: 5 },
  ];

  const trustPoints = [
    "Used by 50+ health workers across rural India",
    "Backed by CDSCO medicine database",
    "No personal data stored",
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Phase 3: Proactive Recall Alert Banner */}
      {recallAlerts.length > 0 && !alertDismissed && (
        <div className="sticky top-0 z-50 bg-destructive text-destructive-foreground px-4 py-3 shadow-lg">
          <div className="container mx-auto flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1 text-sm font-medium">
              <span className="font-bold">⚠️ SAFETY RECALL ALERT: </span>
              {recallAlerts.length === 1 ? (
                <>The medicine <strong>"{recallAlerts[0]}"</strong> that you previously scanned has been <strong>banned by CDSCO</strong>. Stop use immediately and consult your doctor.</>
              ) : (
                <>{recallAlerts.length} medicines you previously scanned have been <strong>banned by CDSCO</strong>: <strong>{recallAlerts.join(", ")}</strong>. Stop use and consult a doctor immediately.</>
              )}
            </div>
            <button
              onClick={() => setAlertDismissed(true)}
              className="shrink-0 rounded-full p-0.5 hover:bg-white/20 transition-colors"
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-32 bg-medical-pattern">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

        <div className="container relative mx-auto px-4">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:text-left">
            
            {/* Hero Text */}
            <div className="flex-1 text-center lg:text-left">
              <ScrollReveal direction="right">
                {/* Badge */}
                <div className="mx-auto lg:mx-0 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                  <HeartPulse className="h-4 w-4" />
                  AI-Powered Medicine Verification
                </div>

                <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
                  {t("heroTitle")}
                </h1>

                <p className="mx-auto lg:mx-0 mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl leading-relaxed">
                  {t("heroSubtitle")}
                </p>

                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <Link to="/scan" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto gap-2 px-10 py-7 text-lg shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90 font-bold"
                    >
                      <Scan className="h-6 w-6" />
                      {t("scanNow")}
                    </Button>
                  </Link>
                  <a href="#features" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto gap-2 px-10 py-7 text-lg border-primary/30 text-primary hover:bg-primary/5 font-semibold"
                    >
                      {t("howItWorks")}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </a>
                </div>

                {/* Trust indicators */}
                <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8">
                  {trustPoints.map((point) => (
                    <div key={point} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {point}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Hero Illustration - Scanning Mockup */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none">
              <ScrollReveal delay={0.3} direction="left">
                <div className="relative mx-auto h-[400px] w-full max-w-[320px] sm:h-[500px] sm:max-w-[400px]">
                  {/* Phone frame mockup */}
                  <div className="absolute inset-0 rounded-[3rem] border-[8px] border-foreground/5 bg-white shadow-2xl overflow-hidden ring-4 ring-foreground/5">
                    {/* App Header in mockup */}
                    <div className="h-12 bg-primary/5 flex items-center px-6 border-b border-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                      <div className="ml-2 h-2 w-20 rounded-full bg-primary/20" />
                    </div>
                    
                    {/* Viewport with scanning animation */}
                    <div className="relative h-full p-4 flex flex-col items-center justify-center bg-muted/30">
                      {/* Medicine Pack Placeholder */}
                      <div className="relative w-full aspect-square rounded-3xl bg-white shadow-inner border border-primary/10 p-6 flex flex-col items-center justify-center">
                        <Pill className="h-20 w-20 text-primary/20" />
                        <div className="mt-4 w-2/3 h-2 rounded-full bg-primary/10" />
                        <div className="mt-2 w-1/2 h-2 rounded-full bg-primary/10" />
                        
                        {/* Laser line animation */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-scan-line z-10" />
                        
                        {/* QR Code mockup */}
                        <div className="absolute bottom-6 right-6 h-12 w-12 rounded-lg bg-primary/5 border border-primary/10 p-2 opacity-60">
                          <QrCode className="h-full w-full text-primary" />
                        </div>
                      </div>
                      
                      {/* Scanning text */}
                      <div className="mt-8 flex flex-col items-center gap-2 animate-pulse">
                        <div className="h-3 w-32 rounded-full bg-primary/20" />
                        <div className="h-2 w-24 rounded-full bg-primary/10" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -right-6 top-20 rounded-2xl bg-white p-4 shadow-xl border border-primary/10 animate-bounce transition-all duration-3000">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -left-10 bottom-20 rounded-2xl bg-white p-4 shadow-xl border border-primary/10 animate-pulse transition-all duration-2000">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-white py-10">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <ScrollReveal key={stat.label} delay={idx * 0.1}>
              <div className="text-center">
                <p className={`font-display text-2xl font-bold sm:text-3xl md:text-4xl ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                How It Works
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                Verification in 3 Simple Steps
              </h2>
            </div>
          </ScrollReveal>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
            {[
              { step: "01", title: "Upload or Type", desc: "Take a photo of the medicine pack or enter the name and batch number manually." },
              { step: "02", title: "AI Analysis", desc: "Our 5-layer AI scans visual details, OCR data, barcodes, pricing and pharmacy records." },
              { step: "03", title: "Get Result", desc: "Receive a clear Genuine / Suspicious / Fake verdict in under 3 seconds." },
            ].map((item, idx) => (
              <ScrollReveal key={item.step} delay={idx * 0.15}>
                <div className="relative rounded-2xl border border-border bg-white p-6 shadow-sm text-center">
                  <span className="font-display text-5xl font-bold text-primary/15 select-none">{item.step}</span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section className="py-20 md:py-32 bg-medical-pattern/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Demo Phone Mockup */}
            <div className="flex-1 w-full max-w-sm">
              <ScrollReveal direction="right">
                <div className="relative mx-auto rounded-[3rem] border-[12px] border-foreground bg-white shadow-2xl overflow-hidden aspect-[9/18.5] ring-8 ring-foreground/5">
                  {/* Status Bar */}
                  <div className="h-8 bg-foreground flex justify-between items-center px-8 text-[10px] text-white font-medium">
                    <span>9:41</span>
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-white/30" />
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  </div>
                  
                  {/* App UI */}
                  <div className="p-5 flex flex-col h-full bg-white overflow-hidden">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-display font-bold text-foreground text-sm">MedVerify</span>
                      <div className="ml-auto flex gap-1">
                        <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                        <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                        <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                      </div>
                    </div>

                    {/* Result Card */}
                    <div className="rounded-[2rem] bg-primary/5 border border-primary/20 p-6 flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                          <CheckCircle2 className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-8 bg-white rounded-full px-2 py-1 shadow-sm border border-border flex items-center gap-1">
                          <Zap className="h-3 w-3 text-primary" />
                          <span className="text-[10px] font-bold text-primary">3 sec</span>
                        </div>
                      </div>
                      <h4 className="text-primary font-display font-extrabold text-sm uppercase tracking-wider">{t("demoStatus")}</h4>
                      <div className="mt-4 space-y-2 w-full">
                        <div className="flex justify-between text-[10px] border-b border-primary/10 pb-2">
                          <span className="text-muted-foreground font-medium">Medicine</span>
                          <span className="text-foreground font-bold">{t("demoMedicine")}</span>
                        </div>
                        <div className="flex justify-between text-[10px] border-b border-primary/10 pb-2">
                          <span className="text-muted-foreground font-medium">Manufacturer</span>
                          <span className="text-foreground font-bold">{t("demoManufacturer")}</span>
                        </div>
                        <div className="flex justify-between text-[10px] border-b border-primary/10 pb-2">
                          <span className="text-muted-foreground font-medium">Batch No.</span>
                          <span className="text-foreground font-bold">{t("demoBatch")}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-muted-foreground font-medium">CDSCO Status</span>
                          <span className="text-success font-bold flex items-center gap-1">
                            {t("demoCdscoStatus")} <CheckCircle2 className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                      
                      <Button className="mt-6 w-full rounded-xl bg-primary hover:bg-primary/90 text-[10px] py-4 h-auto font-bold">
                        {t("scanAgain")}
                      </Button>
                      <button className="mt-3 text-[10px] text-destructive font-bold hover:underline">
                        {t("reportSuspicious")}
                      </button>
                    </div>

                    {/* Footer Info in Mockup */}
                    <div className="mt-auto mb-10 p-3 bg-muted/20 rounded-xl flex items-center gap-3 shrink-0">
                      <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-border">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-foreground">CDSCO</span>
                        <span className="text-[8px] text-muted-foreground">Official DB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Demo Content */}
            <div className="flex-1">
              <ScrollReveal direction="left">
                <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                  {t("liveDemo")}
                </span>
                <h2 className="mt-4 font-display text-4xl font-extrabold text-foreground sm:text-5xl leading-tight">
                  {t("seeItInAction")}
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
                  {t("demoSubtitle")}
                </p>

                <div className="mt-10 space-y-6">
                  {[
                    { icon: Zap, title: t("demoFeature1Title"), desc: t("demoFeature1Desc") },
                    { icon: WifiOff, title: t("demoFeature2Title"), desc: t("demoFeature2Desc") },
                    { icon: Languages, title: t("demoFeature3Title"), desc: t("demoFeature3Desc") },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-border/60 shadow-sm hover:border-primary/20 transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                Technology
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                {t("featuresTitle")}
              </h2>
            </div>
          </ScrollReveal>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <ScrollReveal key={feature.layer} delay={idx * 0.1}>
                <Card
                  className="group relative overflow-hidden border-border/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
                    {feature.layer}
                  </div>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold text-foreground leading-tight">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                {t("fromTheField")}
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-foreground sm:text-5xl">
                {t("trustedTitle")}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                {t("trustedSubtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                quote: t("testimonial1Quote"),
                author: t("testimonial1Author"),
                role: t("testimonial1Role"),
                stat: t("testimonial1Stat"),
              },
              {
                quote: t("testimonial2Quote"),
                author: t("testimonial2Author"),
                role: t("testimonial2Role"),
                stat: t("testimonial2Stat"),
              },
              {
                quote: t("testimonial3Quote"),
                author: t("testimonial3Author"),
                role: t("testimonial3Role"),
                stat: t("testimonial3Stat"),
              },
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.15}>
                <Card className="h-full border-border/60 bg-white hover:border-primary/20 transition-all flex flex-col justify-between">
                  <CardContent className="p-8">
                    <Quote className="h-10 w-10 text-primary/10 mb-6" />
                    <p className="text-foreground font-medium leading-relaxed italic">
                      "{item.quote}"
                    </p>
                    
                    <div className="mt-10 flex items-center gap-4 border-t border-border/40 pt-6">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary shrink-0">
                        {item.author[0]}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-foreground text-sm">{item.author}</h4>
                        <p className="text-xs text-muted-foreground">{item.role}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-primary/5 rounded-full px-4 py-2 text-[10px] font-bold text-primary inline-flex items-center gap-2">
                       <CheckCircle2 className="h-3 w-3" />
                       {item.stat}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 text-center shadow-xl shadow-primary/25 sm:p-12">
              <Shield className="mx-auto h-12 w-12 text-white/80" />
              <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
                {t("heroTitle")}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-white/80 sm:text-base">
                {t("heroSubtitle").slice(0, 100)}…
              </p>
              <Link to="/scan">
                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-7 gap-2 px-10 bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
                >
                  <Scan className="h-5 w-5" />
                  {t("scanNow")}
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Index;

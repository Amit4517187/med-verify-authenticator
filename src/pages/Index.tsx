import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Shield, Eye, FileText, QrCode, IndianRupee, Building2,
  ArrowRight, Scan, CheckCircle2, HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const { t } = useLanguage();

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

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-28 bg-medical-pattern">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/6 blur-3xl pointer-events-none" />

        <div className="container relative mx-auto px-4 text-center">
          {/* Badge */}
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary">
            <HeartPulse className="h-4 w-4" />
            AI-Powered Medicine Verification
          </div>

          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {t("heroTitle")}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl leading-relaxed px-2">
            {t("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/scan" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 px-8 text-base shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90"
              >
                <Scan className="h-5 w-5" />
                {t("scanNow")}
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto gap-2 text-base border-primary/30 text-primary hover:bg-primary/5"
              >
                {t("howItWorks")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-white py-10">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className={`font-display text-2xl font-bold sm:text-3xl md:text-4xl ${stat.color}`}>
                {stat.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              How It Works
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              Verification in 3 Simple Steps
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
            {[
              { step: "01", title: "Upload or Type", desc: "Take a photo of the medicine pack or enter the name and batch number manually." },
              { step: "02", title: "AI Analysis", desc: "Our 5-layer AI scans visual details, OCR data, barcodes, pricing and pharmacy records." },
              { step: "03", title: "Get Result", desc: "Receive a clear Genuine / Suspicious / Fake verdict in under 3 seconds." },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-border bg-white p-6 shadow-sm text-center">
                <span className="font-display text-5xl font-bold text-primary/15 select-none">{item.step}</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              Technology
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              {t("featuresTitle")}
            </h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.layer}
                className="group relative overflow-hidden border-border/60 bg-white transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/8"
              >
                <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
                  {feature.layer}
                </div>
                <CardContent className="p-5 sm:p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-semibold text-foreground">{t("appName")}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{t("footerText")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("teamName")}</p>
          <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
            <span>·</span>
            <Link to="/scan" className="hover:text-primary transition-colors">Scan Medicine</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

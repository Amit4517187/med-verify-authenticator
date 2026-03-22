import { Link } from "react-router-dom";
import { Shield, Target, Heart, Mail, Scan, ArrowRight, Code, Brain, Database, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const CONTACT_EMAIL = "amitkmishrawork@gmail.com";
const MAILTO_LINK = `mailto:${CONTACT_EMAIL}?subject=MedVerify%20Collaboration&body=Hi%20Amit%2C%0A%0AI%20came%20across%20MedVerify%20and%20would%20love%20to%20discuss%20a%20collaboration.%0A%0A`;

const AboutPage = () => {
  const { t } = useLanguage();

  const values = [
    { icon: Target, title: t("aboutMission"), desc: t("aboutMissionDesc") },
    { icon: Heart,  title: t("aboutWhy"),     desc: t("aboutWhyDesc") },
    { icon: Shield, title: t("aboutPromise"), desc: t("aboutPromiseDesc") },
  ];

  const builtBy = [
    { icon: Brain,    label: t("builtAI"),       desc: t("builtAIDesc") },
    { icon: Code,     label: t("builtBackend"),   desc: t("builtBackendDesc") },
    { icon: Layers,   label: t("builtFrontend"),  desc: t("builtFrontendDesc") },
    { icon: Database, label: t("builtData"),      desc: t("builtDataDesc") },
  ];

  const techSteps = [
    { num: "01", title: t("tech1Title"), desc: t("tech1Desc") },
    { num: "02", title: t("tech2Title"), desc: t("tech2Desc") },
    { num: "03", title: t("tech3Title"), desc: t("tech3Desc") },
    { num: "04", title: t("tech4Title"), desc: t("tech4Desc") },
  ];

  const stats = [
    { value: "₹6,000 Cr", label: t("statFakeMarket") },
    { value: "5 Layers",  label: t("statAIDepth") },
    { value: "3 Sec",     label: t("statScanTime") },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-medical-pattern">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            {t("ourStory")}
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {t("aboutTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            {t("aboutSubtitle")}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="flex flex-col items-center gap-3 text-center p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border bg-muted/40 py-10">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-primary sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solo Founder */}
      <section className="py-14 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              {t("theBuilder")}
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
              {t("builtSolo")}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
              {t("builtSoloDesc")}
            </p>
          </div>

          {/* Founder card */}
          <div className="mx-auto mt-10 max-w-sm">
            <Card className="group overflow-hidden border-border/60 bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
              <CardContent className="p-8">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-white font-display text-2xl font-bold shadow-lg shadow-primary/30">
                  AK
                </div>
                <div className="mt-5 text-center">
                  <h3 className="font-display text-xl font-bold text-foreground">Amit Kumar Mishra</h3>
                  <p className="mt-1 text-sm font-semibold text-primary">{t("founderRole")}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t("founderBio")}</p>
                </div>

                {/* Email only */}
                <div className="mt-5 flex items-center justify-center">
                  <a
                    href={MAILTO_LINK}
                    className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                    title="Send Email"
                  >
                    <Mail className="h-4 w-4" />
                    {t("contactEmail")}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What I built grid */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {builtBy.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border/60 bg-white p-5 text-center shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="mt-3 font-display text-sm font-semibold text-foreground">{item.label}</h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology section */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                {t("technologyLabel")}
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                {t("howWorksTitle")}
              </h2>
            </div>
            <div className="mt-8 space-y-4">
              {techSteps.map((item) => (
                <div key={item.num} className="flex gap-4 rounded-xl border border-border/60 bg-background p-4 sm:p-5">
                  <span className="font-display text-2xl font-bold text-primary/20 shrink-0 leading-none mt-0.5">
                    {item.num}
                  </span>
                  <div>
                    <h4 className="font-display font-semibold text-foreground text-sm sm:text-base">{item.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-14 md:py-20 bg-muted/40">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            {t("collaborateTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            {t("collaborateDesc")}
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href={MAILTO_LINK}>
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                <Mail className="h-4 w-4" />
                {t("getInTouch")}
              </Button>
            </a>
            <Link to="/scan">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-primary/30 text-primary hover:bg-primary/5">
                <Scan className="h-4 w-4" />
                {t("tryMedVerify")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {t("orEmailDirectly")}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline font-medium">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

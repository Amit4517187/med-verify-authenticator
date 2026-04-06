import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ShieldAlert, BookLock, UserCheck } from "lucide-react";

const PrivacyPage = () => {
  const { t } = useLanguage();

  const sections = [
    { title: t("privacy1Title"), desc: t("privacy1Desc"), icon: ShieldAlert },
    { title: t("privacy2Title"), desc: t("privacy2Desc"), icon: BookLock },
    { title: t("privacy3Title"), desc: t("privacy3Desc"), icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-off-white pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <ScrollReveal>
          <div className="mb-16">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              {t("privacyPolicy")}
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold text-foreground sm:text-5xl">
              {t("privacyTitle")}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {t("privacySubtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="rounded-3xl border border-border/80 bg-white p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <section.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {section.title}
                    </h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {section.desc}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-16 p-8 rounded-2xl bg-muted/30 border border-dashed border-border/60 text-center">
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              At MedVerify, privacy is built into our core code. We focus on medicine authentication, not user surveillance.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default PrivacyPage;

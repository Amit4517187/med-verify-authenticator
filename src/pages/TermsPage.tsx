import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AlertCircle, Scale, ShieldCheck } from "lucide-react";

const TermsPage = () => {
  const { t } = useLanguage();

  const terms = [
    { title: t("terms1Title"), desc: t("terms1Desc"), icon: AlertCircle },
    { title: t("terms2Title"), desc: t("terms2Desc"), icon: Scale },
    { title: t("terms3Title"), desc: t("terms3Desc"), icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-off-white pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <ScrollReveal>
          <div className="mb-16">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              {t("termsOfService")}
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold text-foreground sm:text-5xl">
              {t("termsTitle")}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {t("termsSubtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-8">
          {terms.map((term, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1} direction="right">
              <div className="rounded-3xl border border-border/80 bg-white p-8 md:p-10 shadow-sm hover:border-primary/20 transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <term.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {term.title}
                    </h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {term.desc}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-16 p-8 rounded-2xl bg-primary-dark text-white shadow-xl shadow-primary/20">
            <h4 className="font-display font-bold text-lg mb-2">Legal Disclosure</h4>
            <p className="text-sm text-white/80 leading-relaxed italic">
              By using MedVerify, you acknowledge that our AI analysis is a preliminary screening tool. Authenticity results are based on visual markers and official databases; chemical purity is not tested.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default TermsPage;

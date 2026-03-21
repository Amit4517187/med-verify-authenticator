import { Link } from "react-router-dom";
import { Shield, Target, Heart, Linkedin, Github, Mail, Scan, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const team = [
  {
    name: "Amit Kumar",
    role: "AI & Backend Engineer",
    bio: "Leads the AI model development, OCR pipeline, and API backend powering MedVerify's medicine analysis engine.",
    initials: "AK",
    color: "bg-primary",
  },
  {
    name: "Team Member 2",
    role: "Frontend Developer",
    bio: "Designs and builds the mobile-first React interface for seamless medicine scanning across all devices.",
    initials: "TM",
    color: "bg-teal-600",
  },
  {
    name: "Team Member 3",
    role: "Data & Research",
    bio: "Curates and maintains the verified medicine database and handles integration with CDSCO regulatory records.",
    initials: "TM",
    color: "bg-emerald-600",
  },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "Make medicine verification accessible to every Indian citizen — from urban hospitals to the most remote rural clinics.",
  },
  {
    icon: Heart,
    title: "Why We Built This",
    desc: "India's ₹6,000 Cr counterfeit medicine market kills thousands every year. Technology can and must be part of the solution.",
  },
  {
    icon: Shield,
    title: "Our Promise",
    desc: "We will never store your personal data. All analysis is processed securely and results are shown only to you.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-medical-pattern">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            Our Story
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            About MedVerify
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            We are a team of engineers and researchers on a mission to eliminate counterfeit medicines from India
            using the power of artificial intelligence.
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
            {[
              { value: "₹6,000 Cr", label: "Fake medicine market size" },
              { value: "5 Layers", label: "AI verification depth" },
              { value: "3 Sec", label: "Average scan time" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-primary sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-14 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              The Team
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
              Meet the Builders
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
              A passionate team building technology that saves lives.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <Card
                key={member.name}
                className="group overflow-hidden border-border/60 bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8"
              >
                <CardContent className="p-6">
                  {/* Avatar */}
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${member.color} text-white font-display text-xl font-bold shadow-md`}
                  >
                    {member.initials}
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-display text-base font-semibold text-foreground">{member.name}</h3>
                    <p className="mt-0.5 text-xs font-medium text-primary">{member.role}</p>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                  </div>
                  {/* Social icons */}
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                      <Linkedin className="h-4 w-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                      <Github className="h-4 w-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
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
                Technology
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                How MedVerify Works
              </h2>
            </div>
            <div className="mt-8 space-y-4">
              {[
                {
                  num: "01",
                  title: "Deep Learning OCR",
                  desc: "Extracts text from medicine packaging with high accuracy, even from low-quality photos taken in poor lighting conditions.",
                },
                {
                  num: "02",
                  title: "Verified Medicine Database",
                  desc: "Cross-references extracted data against a curated database of approved medicines, batch numbers, and manufacturers.",
                },
                {
                  num: "03",
                  title: "Visual Authenticity Check",
                  desc: "Analyzes packaging design, hologram patterns, and print quality using computer vision to flag counterfeits.",
                },
                {
                  num: "04",
                  title: "Threat Assessment Report",
                  desc: "Synthesizes all signals into a clear, actionable verdict — Genuine, Suspicious, or Fake — with a detailed explanation.",
                },
              ].map((item) => (
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

      {/* Contact / CTA */}
      <section className="py-14 md:py-20 bg-muted/40">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Want to Collaborate?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            We're looking for healthcare partners, NGOs, and government bodies to help scale MedVerify across India.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href="mailto:team@medverify.in">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90">
                <Mail className="h-4 w-4" />
                Get In Touch
              </Button>
            </a>
            <Link to="/scan">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto gap-2 border-primary/30 text-primary hover:bg-primary/5"
              >
                <Scan className="h-4 w-4" />
                Try MedVerify
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

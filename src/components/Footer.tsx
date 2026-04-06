import React from "react";
import { Link } from "react-router-dom";
import { Shield, MessageSquare, Smartphone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-white/50 backdrop-blur-sm py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          
          {/* Column 1: Brand */}
          <div className="flex items-center gap-3 order-2 md:order-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-foreground leading-none">{t("appName")}</span>
              <span className="text-[10px] text-muted-foreground mt-1 tracking-wider uppercase font-medium">
                © {currentYear}
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 order-1 md:order-2">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("home")}
            </Link>
            <Link to="/scan" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("scan")}
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("about")}
            </Link>
            <Link to="/privacy" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("privacyPolicy")}
            </Link>
            <Link to="/terms" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("termsOfService")}
            </Link>
          </nav>

          {/* Column 3: Secondary Actions/Icons */}
          <div className="flex items-center gap-4 order-3">
            <button className="h-10 w-10 flex items-center justify-center rounded-full border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all group">
              <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-full border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all group">
              <Smartphone className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;

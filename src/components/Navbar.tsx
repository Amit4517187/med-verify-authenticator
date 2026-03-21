import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const { t, toggleLanguage } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMobileOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/30">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden xs:block">
            <span className="font-display text-lg font-bold text-foreground">{t("appName")}</span>
            <p className="text-[10px] leading-none text-muted-foreground">{t("tagline")}</p>
          </div>
          <span className="font-display text-lg font-bold text-foreground xs:hidden">{t("appName")}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          <Link to="/">
            <Button variant={isActive("/") ? "secondary" : "ghost"} size="sm" className="font-medium">
              {t("home")}
            </Button>
          </Link>
          <Link to="/scan">
            <Button
              variant={isActive("/scan") ? "default" : "ghost"}
              size="sm"
              className="font-medium"
            >
              {t("scan")}
            </Button>
          </Link>
          <Link to="/about">
            <Button variant={isActive("/about") ? "secondary" : "ghost"} size="sm" className="font-medium">
              {t("about")}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="ml-2 gap-1.5 border-primary/30 text-primary hover:bg-primary/5 font-medium"
          >
            <Globe className="h-3.5 w-3.5" />
            {t("language")}
          </Button>
        </div>

        {/* Mobile: lang toggle + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="gap-1 border-primary/30 text-primary hover:bg-primary/5 text-xs px-2"
          >
            <Globe className="h-3 w-3" />
            {t("language")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-white px-4 py-3 md:hidden shadow-lg">
          <div className="flex flex-col gap-1">
            <Link to="/" onClick={() => setMobileOpen(false)}>
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                className="w-full justify-start font-medium"
              >
                {t("home")}
              </Button>
            </Link>
            <Link to="/scan" onClick={() => setMobileOpen(false)}>
              <Button
                variant={isActive("/scan") ? "default" : "ghost"}
                className="w-full justify-start font-medium"
              >
                {t("scan")}
              </Button>
            </Link>
            <Link to="/about" onClick={() => setMobileOpen(false)}>
              <Button
                variant={isActive("/about") ? "secondary" : "ghost"}
                className="w-full justify-start font-medium"
              >
                {t("about")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

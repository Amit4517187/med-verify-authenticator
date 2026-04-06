import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import ScanPage from "@/pages/ScanPage";
import ResultsPage from "@/pages/ResultsPage";
import AboutPage from "@/pages/AboutPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Dynamic injection of GSC meta tag as fallback for Vercel caching
  // Task list:
  // - [x] Move GSC meta tag to top of `index.html` <head>
  // - [x] Commit and push to `origin main` to trigger fresh build
  // - [x] Inject GSC tag dynamically in `App.tsx` (Fallback for caching)
  // - [ ] Verify meta tag presence on live site via browser audit
  // - [ ] Final confirmation to user
  useEffect(() => {
    const metaId = "gsc-verify";
    if (!document.getElementById(metaId)) {
      const meta = document.createElement("meta");
      meta.id = metaId;
      meta.name = "google-site-verification";
      meta.content = "_U2w2loHD1AL116lCZsXOgn8QcyKAaYTOzmyuYMBziw";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
// fix: change ); to }; below
};

export default App;

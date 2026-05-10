
import { useState, useEffect } from "react";
import { Hammer, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MaintenanceBanner = () => {
  // SET THIS TO 'true' TO SHOW THE BANNER MANUALLY
  const [isVisible, setIsVisible] = useState(true);
  
  // We'll also check if there's a global error in the session
  useEffect(() => {
    const hasError = sessionStorage.getItem("medverify_global_error");
    if (hasError) setIsVisible(true);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative z-[200] w-full bg-primary/10 border-b border-primary/20 backdrop-blur-md"
        >
          <div className="container mx-auto flex items-center justify-between px-4 py-2.5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <Hammer className="h-4 w-4 text-primary animate-bounce-slow" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-primary sm:text-sm">
                  System Enhancement in Progress
                </p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">
                  We're currently building new features to make your experience even better. Some services might be slow.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="ml-4 rounded-full p-1 hover:bg-primary/10 transition-colors"
            >
              <X className="h-4 w-4 text-primary/60" />
            </button>
          </div>
          {/* Animated progress line at the very bottom */}
          <div className="absolute bottom-0 left-0 h-[1px] w-full overflow-hidden bg-primary/5">
            <motion.div 
              className="h-full bg-primary/40"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MaintenanceBanner;

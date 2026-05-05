import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, ScanLine, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
  onClose: () => void;
}

const SCANNER_ID = "medverify-barcode-scanner";

const BarcodeScanner = ({ onDetected, onClose }: BarcodeScannerProps) => {
  const [status, setStatus] = useState<"starting" | "scanning" | "error">("starting");
  const [errorMsg, setErrorMsg] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasDetected = useRef(false);

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;

    const startScanner = async () => {
      try {
        scanner = new Html5Qrcode(SCANNER_ID, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
          ],
          verbose: false,
        });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" }, // rear camera
          { fps: 10, qrbox: { width: 280, height: 140 } },
          (decodedText) => {
            if (hasDetected.current) return;
            hasDetected.current = true;
            // Haptic feedback if supported
            if (navigator.vibrate) navigator.vibrate(100);
            onDetected(decodedText);
            stopScanner(scanner!);
          },
          () => { /* scan frame error — ignore */ }
        );
        setStatus("scanning");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.toLowerCase().includes("permission") || msg.toLowerCase().includes("denied")) {
          setErrorMsg("Camera permission denied. Please allow camera access in your browser settings.");
        } else {
          setErrorMsg("Could not start camera. Please ensure no other app is using it.");
        }
        setStatus("error");
      }
    };

    // Small delay to let the DOM element mount
    const timer = setTimeout(startScanner, 150);

    return () => {
      clearTimeout(timer);
      stopScanner(scanner);
    };
  }, []);

  const stopScanner = (scanner: Html5Qrcode | null) => {
    scanner?.stop().catch(() => {});
  };

  const handleClose = () => {
    stopScanner(scannerRef.current);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <ScanLine className="w-5 h-5 text-primary" />
          <span className="text-white font-semibold text-sm">Scan Barcode / QR Code</span>
        </div>
        <button
          onClick={handleClose}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Close scanner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Camera viewport */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        {status === "starting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-white/70 text-sm">Starting camera...</p>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 z-10">
            <div className="w-14 h-14 rounded-full bg-destructive/20 flex items-center justify-center">
              <X className="w-7 h-7 text-destructive" />
            </div>
            <p className="text-white text-center text-sm leading-relaxed">{errorMsg}</p>
            <Button variant="outline" onClick={handleClose} className="mt-2 text-white border-white/30">
              Go Back
            </Button>
          </div>
        )}

        {/* html5-qrcode mounts here */}
        <div
          id={SCANNER_ID}
          className="w-full h-full"
          style={{ maxHeight: "calc(100vh - 160px)" }}
        />

        {/* Scan guide overlay — only shown while scanning */}
        {status === "scanning" && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Corner brackets */}
            <div className="relative w-[280px] h-[140px]">
              {/* Top-left */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-sm" />
              {/* Top-right */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-sm" />
              {/* Bottom-left */}
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-sm" />
              {/* Bottom-right */}
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-sm" />
              {/* Animated scan line */}
              <div className="absolute left-2 right-2 h-0.5 bg-primary/80 shadow-[0_0_8px_theme(colors.primary.DEFAULT)] animate-scan-line" />
            </div>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-5 py-4 bg-black/80 text-center">
        <p className="text-white/50 text-xs leading-relaxed">
          Point your camera at the barcode or QR code on the medicine box.
          <br />Hold steady until detected.
        </p>
      </div>
    </div>
  );
};

export default BarcodeScanner;

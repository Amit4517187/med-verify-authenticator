import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Upload, Camera, Loader2, FileImage, WifiOff, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

const API_URL = import.meta.env.VITE_API_URL || "";

const ANALYSIS_STEPS = [
  "analyzingStep1",
  "analyzingStep2",
  "analyzingStep3",
  "analyzingStep4",
] as const;

const ScanPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorType, setErrorType] = useState<"network" | "server" | "api" | "validation">("network");
  const [form, setForm] = useState({
    medicineName: "",
    batchNumber: "",
    barcode: "",
    manufacturer: "",
  });

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  const processFile = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    setImageFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    // Guard: ensure there's actually something to submit
    const trimmedName = form.medicineName.trim();
    const trimmedBatch = form.batchNumber.trim();
    const trimmedBarcode = form.barcode.trim();
    const trimmedMfg = form.manufacturer.trim();

    if (!imageFile && !trimmedName && !trimmedBatch && !trimmedBarcode && !trimmedMfg) {
      setErrorType("validation");
      setErrorMessage("Please upload a medicine image or enter at least the medicine name or batch number.");
      setShowError(true);
      return;
    }

    setLoading(true);
    setCurrentStep(0);

    try {
      const formData = new FormData();

      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        formData.append("medicineName", trimmedName);
        formData.append("batchNumber", trimmedBatch);
        formData.append("barcode", trimmedBarcode);
        formData.append("manufacturer", trimmedMfg);
      }

      const baseApiUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
      const finalUrl = baseApiUrl.endsWith("/analyze") ? baseApiUrl : `${baseApiUrl}/analyze`;

      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "X-API-Key": import.meta.env.VITE_API_KEY || "",
        },
        body: formData,
      });

      if (!response.ok) {
        setErrorType("server");
        throw new Error(`Server returned ${response.status}: ${response.statusText || "Unexpected error"}`);
      }

      const data = await response.json();

      if (data.status === "error") {
        setLoading(false);
        setErrorType("api");
        setErrorMessage(data.message || "An error occurred during analysis.");
        setShowError(true);
        return;
      }

      navigate("/results", {
        state: {
          status: data.status,
          drugName: data.drug_name,
          composition: data.composition,
          message: data.message,
        },
      });
    } catch (err: any) {
      const isNetworkError =
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("NetworkError") ||
        err?.message?.includes("ERR_NETWORK") ||
        err?.message?.includes("net::");

      if (isNetworkError) {
        setErrorType("network");
        setErrorMessage(t("connectionError"));
      } else {
        setErrorType("server");
        setErrorMessage(
          err?.message ||
          "Cannot connect to the MediGuard Engine. Please try again later."
        );
      }
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !!(imageFile ||
    form.medicineName.trim() ||
    form.batchNumber.trim() ||
    form.barcode.trim() ||
    form.manufacturer.trim());

  return (
    <div className="min-h-screen bg-background py-6 md:py-16">
      {/* Full-screen loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/97 backdrop-blur-sm px-4">
          <div className="relative mb-6">
            <div
              className="absolute inset-0 animate-ping rounded-full bg-primary/20"
              style={{ animationDuration: "2s" }}
            />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20 sm:h-24 sm:w-24">
              <Shield className="h-10 w-10 text-primary animate-pulse sm:h-12 sm:w-12" />
            </div>
          </div>
          <h2 className="font-display text-lg font-bold text-foreground text-center sm:text-xl md:text-2xl">
            {t("analyzingDetail")}
          </h2>
          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
              <span className="text-sm font-medium animate-fade-in" key={currentStep}>
                {t(ANALYSIS_STEPS[currentStep])}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              {ANALYSIS_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all duration-500 ${i <= currentStep ? "bg-primary scale-125" : "bg-muted-foreground/30"
                    }`}
                />
              ))}
            </div>
          </div>
          <p className="mt-6 max-w-xs text-center text-xs text-muted-foreground">
            This may take 5–8 seconds. Our AI is analyzing packaging, checking databases, and verifying authenticity.
          </p>
        </div>
      )}

      {/* Error dialog */}
      <Dialog open={showError} onOpenChange={setShowError}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md rounded-2xl mx-auto">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              {errorType === "network" ? (
                <WifiOff className="h-7 w-7 text-destructive" />
              ) : errorType === "validation" ? (
                <Shield className="h-7 w-7 text-warning" />
              ) : (
                <X className="h-7 w-7 text-destructive" />
              )}
            </div>
            <DialogTitle className="text-center font-display">
              {errorType === "network"
                ? t("connectionErrorTitle")
                : errorType === "validation"
                  ? "Missing Information"
                  : errorType === "server"
                    ? "Server Error"
                    : "Analysis Error"}
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              {errorMessage || t("connectionError")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center">
            {errorType !== "validation" && (
              <Button
                variant="default"
                onClick={() => { setShowError(false); handleSubmit(); }}
                className="gap-2 w-full sm:w-auto"
              >
                <Loader2 className="h-4 w-4" />
                {t("tryAgain")}
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowError(false)} className="w-full sm:w-auto">
              {errorType === "validation" ? "OK" : "Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            {t("uploadTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{t("uploadSubtitle")}</p>
        </div>

        {/* Image Upload */}
        <Card className="mt-8 border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-display text-base sm:text-lg">
              <Camera className="h-5 w-5 text-primary" />
              {t("uploadPhoto")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="group relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 transition-colors hover:border-primary/50 hover:bg-primary/3 sm:min-h-[220px]"
            >
              {imagePreview ? (
                <div className="relative w-full overflow-hidden rounded-lg p-2">
                  <img
                    src={imagePreview}
                    alt="Medicine"
                    className="mx-auto max-h-[220px] w-auto object-contain rounded-lg"
                  />
                  {/* Scan line overlay */}
                  <div className="absolute inset-2 rounded-lg pointer-events-none overflow-hidden">
                    <div className="absolute left-0 right-0 h-0.5 bg-primary/60 animate-scan-line" />
                  </div>
                  {/* Clear button */}
                  <button
                    onClick={clearImage}
                    className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-destructive/90 text-white hover:bg-destructive transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-muted-foreground">{t("dragDrop")}</p>
                  <p className="mt-1 text-xs text-muted-foreground/60">PNG, JPG up to 10 MB</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
            </div>
          </CardContent>
        </Card>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs font-medium text-muted-foreground sm:text-sm">{t("orEnterManually")}</span>
          <Separator className="flex-1" />
        </div>

        {/* Manual form */}
        <Card className="border-border/60 shadow-sm">
          <CardContent className="grid gap-4 p-4 sm:gap-5 sm:p-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">{t("medicineName")}</Label>
              <Input
                id="name"
                placeholder="e.g. Paracetamol 500mg"
                value={form.medicineName}
                onChange={(e) => setForm({ ...form, medicineName: e.target.value })}
                className="h-10 text-sm"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 xs:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="batch" className="text-sm font-medium">{t("batchNumber")}</Label>
                <Input
                  id="batch"
                  placeholder="e.g. BN-2024-001"
                  value={form.batchNumber}
                  onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
                  className="h-10 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="barcode" className="text-sm font-medium">{t("barcode")}</Label>
                <Input
                  id="barcode"
                  placeholder="e.g. 8901234567890"
                  value={form.barcode}
                  onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                  className="h-10 text-sm"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mfg" className="text-sm font-medium">{t("manufacturer")}</Label>
              <Input
                id="mfg"
                placeholder="e.g. Cipla Ltd."
                value={form.manufacturer}
                onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                className="h-10 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button
          size="lg"
          className="mt-6 w-full gap-2 text-base shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 h-12"
          disabled={!canSubmit || loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t("analyzing")}
            </>
          ) : (
            <>
              <FileImage className="h-5 w-5" />
              {t("verifyMedicine")}
            </>
          )}
        </Button>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Your data is processed securely and never stored.
        </p>
      </div>
    </div>
  );
};

export default ScanPage;

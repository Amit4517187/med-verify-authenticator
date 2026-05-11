import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');

  useEffect(() => {
    // Detect Platform
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) setPlatform('ios');
    else if (isAndroid) setPlatform('android');

    // Listen for the Chrome/Android install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false);
    }

    // Show for iOS manually since there's no 'beforeinstallprompt'
    if (isIOS && !window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(true);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  if (!showInstall) return null;

  return (
    <Card className="mx-4 mb-6 border-primary/20 bg-primary/5 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-primary">Install MedVerify App</h3>
              <p className="text-sm text-muted-foreground">
                Get full offline access and 300,000+ medicine records on your home screen.
              </p>
              
              {platform === 'ios' ? (
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 p-2 rounded-md">
                  <span>Tap</span> <Share className="h-3 w-3" /> <span>then "Add to Home Screen"</span> <PlusSquare className="h-3 w-3" />
                </div>
              ) : (
                <Button 
                  onClick={handleInstallClick}
                  className="mt-3 h-8 text-xs bg-primary hover:bg-primary/90"
                >
                  Install Now
                </Button>
              )}
            </div>
          </div>
          <button onClick={() => setShowInstall(false)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstallPWA;


import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping rounded-full bg-destructive/10" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 ring-8 ring-destructive/5">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
          </div>
          
          <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
            Oops! Something went wrong
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            Our systems hit a small bump while processing your request. Don't worry, our engineers have been notified and are already looking into it!
          </p>
          
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button 
              onClick={() => window.location.reload()} 
              variant="default"
              className="gap-2 px-8"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.href = "/"} 
              variant="outline"
              className="gap-2 px-8"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
          
          {this.state.error && import.meta.env.DEV && (
            <div className="mt-6 w-full max-w-lg overflow-hidden rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-destructive/70">Technical Diagnostics</p>
              <p className="mt-2 font-mono text-[11px] text-destructive">
                {this.state.error.message}
              </p>
              <pre className="mt-2 max-h-32 overflow-auto font-mono text-[9px] text-destructive/60">
                {this.state.error.stack}
              </pre>
            </div>
          )}
          
          <p className="mt-12 text-[10px] uppercase tracking-widest text-muted-foreground/50">
            MedVerify System Protection Active
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;

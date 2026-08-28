"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function RedirectContent() {
  const searchParams = useSearchParams();
  const targetUrl = searchParams.get("url") || "/"; 
  const jobTitle = searchParams.get("title") || "unknown";
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "job_apply_click", {
        event_category: "engagement",
        job_title: jobTitle,
        target_url: targetUrl,
      });
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = targetUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetUrl, jobTitle]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
      
      <div className="flex flex-col items-center justify-center text-center max-w-md w-full bg-white dark:bg-[#111625] p-10 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all duration-500 animate-in fade-in zoom-in-95">
        
        <div className="mb-8">
          <img 
            src="/logo2.png" 
            alt="HireSkys Logo" 
            className="h-10 md:h-12 w-auto object-contain mx-auto"
          />
        </div>

        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
          Redirecting to vacancy...
        </h2>
        
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
          Please wait a moment. You are being securely routed to the employer's application page.
        </p>

        <div className="relative flex justify-center items-center mb-10">
          <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/20 dark:bg-indigo-500/10 animate-pulse"></div>
          
          <svg className="animate-spin relative z-10 w-16 h-16 text-indigo-600 dark:text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          
          <span className="absolute z-20 text-sm font-bold text-slate-700 dark:text-slate-200">
            {countdown}
          </span>
        </div>

        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
          If nothing happens, you can return to{" "}
          <a href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-500 transition-colors">
            HireSkys Search
          </a>
        </p>

      </div>
    </div>  
  );
}

export default function ApplyRedirectPage() {
  return (
    <Suspense fallback={null}>
      <RedirectContent />
    </Suspense>
  );
}

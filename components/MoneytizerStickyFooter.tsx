"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MoneytizerStickyFooter() {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false); // 👈 NAYA: script load ka gate

  // 🚀 PATHNAME HOOK: Pata lagane ke liye ke user kis page par hai
  const pathname = usePathname();
  const isJobPage = pathname?.includes("/jobs/");

  // 🚀 SPEED FIX: Ad-script ko page ke critical content ke baad load karo.
  // Isse initial page load/LCP is heavy third-party script se compete nahi karega.
  useEffect(() => {
    if (!isVisible) return;

    // Agar browser "idle" detect kar sakta hai (zyada tar modern browsers), to usay use karo —
    // ye tab chalega jab browser free ho (koi zaroori kaam na ho raha ho).
    if ('requestIdleCallback' in window) {
      const idleId = (window as any).requestIdleCallback(() => setShouldLoad(true), { timeout: 2000 });
      return () => (window as any).cancelIdleCallback?.(idleId);
    } else {
      // Fallback (Safari waghera): simple 1.5s delay
      const timer = setTimeout(() => setShouldLoad(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!shouldLoad) return;

    const script1 = document.createElement("script");
    script1.src = "//ads.themoneytizer.com/s/gen.js?type=28";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = "//ads.themoneytizer.com/s/requestform.js?siteId=141745&formatId=28";
    script2.async = true;

    if (adRef.current && adRef.current.innerHTML === "") {
      adRef.current.appendChild(script1);
      adRef.current.appendChild(script2);
    }
  }, [shouldLoad]);

  if (!isVisible) return null;

  // 🔥 DYNAMIC POSITIONING LOGIC
  // Job page par mobile ka bottom offset ab JobClient.tsx se live measure hokar
  // --job-bar-h CSS variable se aayega (hardcoded 80px nahi raha).
  // Desktop ya non-job pages par bottom-0 hi rahega.
  const style =
    isJobPage
      ? ({ bottom: "var(--job-bar-h, 0px)" } as React.CSSProperties)
      : undefined;

  return (
    <div
      style={style}
      className={`fixed left-0 w-full z-[200] flex justify-center bg-transparent pointer-events-none transition-all duration-300 ${
        isJobPage ? "md:bottom-0" : "bottom-0"
      }`}
    >
      <div className="pointer-events-auto relative min-h-[50px] md:min-h-[90px] w-full max-w-[728px] bg-white dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] flex justify-center items-center">
        
        {/* CUSTOM CLOSE BUTTON */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-10 right-2 md:-top-5 md:-right-5 bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95 flex items-center justify-center border-2 border-white dark:border-[#0B0F19]"
          aria-label="Close Ad"
        >
          <X size={16} strokeWidth={3} />
        </button>

        {/* AD CONTAINER */}
        <div id="141745-28" ref={adRef} className="w-full h-full flex items-center justify-center"></div>
      </div>
    </div>
  );
}
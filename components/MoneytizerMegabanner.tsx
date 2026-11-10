"use client";
import { useEffect, useRef } from "react";
import { loadAdsterraAd } from "./adsterra-loader";

export default function MoneytizerMegabanner() {
  const adRef = useRef<HTMLDivElement>(null);

  // Adsterra test (2026-11-10): Megabanner now serves Adsterra 728x90
  // (key 8c981f99e2fdcb758347a9099c888033) instead of Moneytizer 141745-1.
  // Filename kept as-is so the test reverts by restoring this file.
  useEffect(() => {
    loadAdsterraAd(adRef.current, "8c981f99e2fdcb758347a9099c888033", 728, 90);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 py-2 bg-slate-50/50 dark:bg-[#111625] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all">
      <span className="text-[9px] uppercase font-black text-slate-300 dark:text-slate-600 mb-1 tracking-[0.2em]">
        Sponsored
      </span>
      {/* 🚨 CLS FIX: Responsive minimum heights for Megabanner */}
      <div 
        id="adsterra-mega-728x90" 
        ref={adRef} 
        className="min-h-[50px] md:min-h-[90px] w-full flex items-center justify-center overflow-hidden"
      ></div>
    </div>
  );
}
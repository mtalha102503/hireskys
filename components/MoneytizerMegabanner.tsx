"use client";
import { useEffect, useRef } from "react";
import { loadMoneytizerAd } from "./moneytizer-loader";

export default function MoneytizerMegabanner() {
  const adRef = useRef<HTMLDivElement>(null);

  // INSTANT LOAD (user directive 2026-10-20): no lazy gate — load on mount so
  // the ad request starts immediately with the page.
  useEffect(() => {
    // Shared loader: gen.js is fetched only once per page; requestform.js per slot.
    loadMoneytizerAd(adRef.current, 1, 1); // type=1, formatId=1 for Megabanner
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 py-2 bg-slate-50/50 dark:bg-[#111625] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all">
      <span className="text-[9px] uppercase font-black text-slate-300 dark:text-slate-600 mb-1 tracking-[0.2em]">
        Sponsored
      </span>
      {/* 🚨 CLS FIX: Responsive minimum heights for Megabanner */}
      <div 
        id="141745-1" 
        ref={adRef} 
        className="min-h-[50px] md:min-h-[90px] w-full flex items-center justify-center overflow-hidden"
      ></div>
    </div>
  );
}
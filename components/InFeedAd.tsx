"use client";
import { useEffect, useRef } from "react";
import { loadMoneytizerAd } from "./moneytizer-loader";

export default function InFeedAd() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Shared loader: gen.js sirf ek dafa load hoga; requestform.js is slot ke liye.
    // (Loader khud double-injection se bachata hai — Strict Mode safe.)
    loadMoneytizerAd(adRef.current, 19, 19);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 md:my-8 py-5 bg-slate-50/50 dark:bg-[#151b2b] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-[#111625] hover:shadow-xl hover:shadow-indigo-500/5">
      <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 mb-3 tracking-[0.2em]">
        Sponsored
      </span>
      
      {/* 🚨 MONEYTIZER CONTAINER: id="141745-19" is required by the ad network */}
      <div 
        id="141745-19"
        ref={adRef} 
        className="w-full flex items-center justify-center overflow-hidden min-h-[250px] bg-slate-100 dark:bg-slate-900/50 rounded-lg"
      ></div>
    </div>
  );
}

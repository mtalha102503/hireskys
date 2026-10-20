"use client";
import { useEffect, useRef } from "react";
import { loadMoneytizerAd } from "./moneytizer-loader";

export default function MoneytizerInFeed() {
  const adRef = useRef<HTMLDivElement>(null);

  // INSTANT LOAD (user directive 2026-10-20): no lazy gate — load on mount.
  useEffect(() => {
    // Shared loader: gen.js sirf ek dafa load hoga, requestform.js har slot ke liye
    loadMoneytizerAd(adRef.current, 2, 2);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 md:my-8 py-4 bg-slate-50/50 dark:bg-[#111625] rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-[#151b2d] hover:shadow-xl hover:shadow-indigo-500/5">
      <span className="text-[10px] uppercase font-black text-slate-300 dark:text-slate-600 mb-2 tracking-[0.2em]">
        Sponsored
      </span>
      {/* 🚨 CLS FIX: Fixed height aur width taake page jhatka na khaye */}
      <div 
        id="141745-2" 
        ref={adRef} 
        className="w-[300px] h-[250px] flex items-center justify-center"
      ></div>
    </div>
  );
}
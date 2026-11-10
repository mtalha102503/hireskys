"use client";
import { useEffect, useRef } from "react";
import { loadAdsterraAd } from "./adsterra-loader";

export default function MoneytizerHalfPage() {
  const adRef = useRef<HTMLDivElement>(null);

  // Adsterra test (2026-11-10): job-page sidebar now serves Adsterra 160x600
  // (key dabc649e722abaea1a097b00e3945a97) instead of Moneytizer 141745-3.
  // The 300x600 box stays — the 160-wide iframe sits centered inside it.
  useEffect(() => {
    loadAdsterraAd(adRef.current, "dabc649e722abaea1a097b00e3945a97", 160, 600);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center mt-6 p-4 bg-slate-50 dark:bg-[#111625] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all sticky top-24">
      <span className="text-[10px] uppercase font-black text-slate-300 dark:text-slate-600 mb-2 tracking-[0.2em]">
        Sponsored
      </span>
      {/* 🚨 CLS FIX: Half Page ad aam tor par 300x600 ki hoti hai */}
      <div 
        id="adsterra-sidebar-160x600" 
        ref={adRef} 
        className="w-[300px] h-[600px] flex items-center justify-center bg-slate-100/50 dark:bg-slate-800/20 rounded-xl overflow-hidden"
      ></div>
    </div>
  );
}
"use client";
import { useEffect, useRef } from "react";
import { loadAdsterraAd } from "./adsterra-loader";

export default function InFeedAd() {
  const adRef = useRef<HTMLDivElement>(null);

  // Adsterra test (2026-11-10): in-feed slot now serves Adsterra 300x250
  // (key f7d5ee4666e96ebb0a92fe35b326cced) instead of Moneytizer 141745-19.
  useEffect(() => {
    loadAdsterraAd(adRef.current, "f7d5ee4666e96ebb0a92fe35b326cced", 300, 250);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 md:my-8 py-5 bg-slate-50/50 dark:bg-[#151b2b] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-[#111625] hover:shadow-xl hover:shadow-indigo-500/5">
      <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 mb-3 tracking-[0.2em]">
        Sponsored
      </span>
      
      {/* Adsterra container: 300x250 fits the min-h-[250px] box exactly */}
      <div 
        id="adsterra-infeed-300x250"
        ref={adRef} 
        className="w-full flex items-center justify-center overflow-hidden min-h-[250px] bg-slate-100 dark:bg-slate-900/50 rounded-lg"
      ></div>
    </div>
  );
}

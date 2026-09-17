"use client";
import { useEffect, useRef } from "react";

export default function InFeedAd() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // React double render (Strict Mode) mein duplicate scripts load hone se rokay ga
    if (!adRef.current || adRef.current.hasChildNodes()) return;

    // 1. Moneytizer Script 1 (Gen.js)
    const script1 = document.createElement("script");
    script1.src = "//ads.themoneytizer.com/s/gen.js?type=19";
    script1.async = true;

    // 2. Moneytizer Script 2 (RequestForm.js)
    const script2 = document.createElement("script");
    script2.src = "//ads.themoneytizer.com/s/requestform.js?siteId=141745&formatId=19";
    script2.async = true;

    // Inject scripts into the specific Moneytizer container
    adRef.current.appendChild(script1);
    adRef.current.appendChild(script2);
    
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

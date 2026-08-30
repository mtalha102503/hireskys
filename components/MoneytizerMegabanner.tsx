"use client";
import { useEffect, useRef } from "react";

export default function MegaBannerAd() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Agar ad already load ho chuka hai toh dobara inject na kare (React StrictMode fix)
    if (!adRef.current || adRef.current.hasChildNodes()) return;

    // 1. Configure the ad options
    const confScript = document.createElement("script");
    confScript.type = "text/javascript";
    confScript.innerHTML = `
      atOptions = {
        'key' : '8c981f99e2fdcb758347a9099c888033',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    // 2. Inject the external ad network script
    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = "https://environmenttalentrabble.com/8c981f99e2fdcb758347a9099c888033/invoke.js";
    invokeScript.async = true;

    // Append both scripts to the specific ad container
    adRef.current.appendChild(confScript);
    adRef.current.appendChild(invokeScript);
    
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-8 py-4 bg-slate-50/80 dark:bg-[#111625]/80 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all">
      <span className="text-[9px] uppercase font-black text-slate-300 dark:text-slate-600 mb-2 tracking-[0.2em]">
        Advertisement
      </span>
      
      {/* 
        Ad Container: We set a min-height/width here to prevent Layout Shift (CLS) 
        because the script expects a 728x90 area.
      */}
      <div 
        ref={adRef} 
        className="w-[728px] h-[90px] max-w-full flex items-center justify-center overflow-hidden"
      ></div>
    </div>
  );
}

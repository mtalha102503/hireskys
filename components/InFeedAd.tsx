"use client";
import { useEffect, useRef } from "react";

export default function InFeedAd() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // React double render (Strict Mode) mein duplicate ad load hone se rokay ga
    if (!adRef.current || adRef.current.hasChildNodes()) return;

    // 1. Adsterra 300x250 Configuration with your exact key
    const confScript = document.createElement("script");
    confScript.type = "text/javascript";
    confScript.innerHTML = `
      atOptions = {
        'key' : 'f7d5ee4666e96ebb0a92fe35b326cced',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    // 2. Adsterra Invoke Script with your exact URL
    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = "https://environmenttalentrabble.com/f7d5ee4666e96ebb0a92fe35b326cced/invoke.js";
    invokeScript.async = true;

    // Inject scripts into the container
    adRef.current.appendChild(confScript);
    adRef.current.appendChild(invokeScript);
    
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 md:my-8 py-5 bg-slate-50/50 dark:bg-[#151b2b] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-[#111625] hover:shadow-xl hover:shadow-indigo-500/5">
      <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 mb-3 tracking-[0.2em]">
        Sponsored
      </span>
      
      {/* 🚨 CLS FIX: Fixed 300x250 size taake layout break na ho */}
      <div 
        ref={adRef} 
        className="w-[300px] h-[250px] flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-900/50 rounded-lg"
      ></div>
    </div>
  );
}
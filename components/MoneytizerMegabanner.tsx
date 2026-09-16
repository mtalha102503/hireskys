"use client";
import { useEffect, useRef, useState } from "react";

export default function MoneytizerMegabanner() {
  const adRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } 
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && adRef.current && adRef.current.innerHTML === "") {
      const script1 = document.createElement("script");
      script1.src = "//ads.themoneytizer.com/s/gen.js?type=1"; // type=1 for Megabanner
      script1.async = true;

      const script2 = document.createElement("script");
      script2.src = "//ads.themoneytizer.com/s/requestform.js?siteId=141745&formatId=1"; // formatId=1
      script2.async = true;

      adRef.current.appendChild(script1);
      adRef.current.appendChild(script2);
    }
  }, [isInView]);

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
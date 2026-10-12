"use client";
import { useEffect, useRef, useState } from "react";
import { loadMoneytizerAd } from "./moneytizer-loader";

export default function MoneytizerHalfPage() {
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
    // Shared loader: gen.js is fetched only once per page; requestform.js per slot.
    if (isInView) {
      loadMoneytizerAd(adRef.current, 3, 3); // type=3, formatId=3 for Half Page
    }
  }, [isInView]);

  return (
    <div className="w-full flex flex-col items-center justify-center mt-6 p-4 bg-slate-50 dark:bg-[#111625] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all sticky top-24">
      <span className="text-[10px] uppercase font-black text-slate-300 dark:text-slate-600 mb-2 tracking-[0.2em]">
        Sponsored
      </span>
      {/* 🚨 CLS FIX: Half Page ad aam tor par 300x600 ki hoti hai */}
      <div 
        id="141745-3" 
        ref={adRef} 
        className="w-[300px] h-[600px] flex items-center justify-center bg-slate-100/50 dark:bg-slate-800/20 rounded-xl overflow-hidden"
      ></div>
    </div>
  );
}
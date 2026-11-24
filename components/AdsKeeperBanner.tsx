"use client";
import { useEffect, useRef } from "react";
import { loadAdsKeeperWidget } from "./adskeeper-loader";

// AdsKeeper Banner widget "hireskys-banner" (ID 2132178, site 1111804).
// Default layout 300x250. Replaces MoneytizerMegabanner.
export default function AdsKeeperBanner() {
  const adRef = useRef<HTMLDivElement>(null);

  // INSTANT LOAD (user directive 2026-10-20): no lazy gate — load on mount.
  useEffect(() => {
    loadAdsKeeperWidget(adRef.current);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 py-2 bg-slate-50/50 dark:bg-[#111625] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all">
      <span className="text-[9px] uppercase font-black text-slate-300 dark:text-slate-600 mb-1 tracking-[0.2em]">
        Sponsored
      </span>
      {/* CLS FIX: Responsive minimum heights for the banner slot */}
      <div
        data-type="_mgwidget"
        data-widget-id="2132178"
        ref={adRef}
        className="min-h-[50px] md:min-h-[90px] w-full flex items-center justify-center overflow-hidden"
      ></div>
    </div>
  );
}

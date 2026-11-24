"use client";
import { useEffect, useRef } from "react";
import { loadAdsKeeperWidget } from "./adskeeper-loader";

// AdsKeeper Sidebar widget "hireskys-sidebar" (ID 2132180).
// Light layout, 1 column x 5 rows feed. Replaces MoneytizerHalfPage
// (300x600) in the job-page sticky sidebar. Height is auto (the feed
// sets its own rows) with a CLS min-height; the parent keeps the sticky
// positioning, same as before.
export default function AdsKeeperSidebar() {
  const adRef = useRef<HTMLDivElement>(null);

  // INSTANT LOAD (user directive 2026-10-20): no lazy gate — load on mount.
  useEffect(() => {
    loadAdsKeeperWidget(adRef.current);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center mt-6 p-4 bg-slate-50 dark:bg-[#111625] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all sticky top-24">
      <span className="text-[10px] uppercase font-black text-slate-300 dark:text-slate-600 mb-2 tracking-[0.2em]">
        Sponsored
      </span>
      <div
        data-type="_mgwidget"
        data-widget-id="2132180"
        ref={adRef}
        className="w-[300px] max-w-full min-h-[250px] flex items-center justify-center bg-slate-100/50 dark:bg-slate-800/20 rounded-xl overflow-hidden"
      ></div>
    </div>
  );
}

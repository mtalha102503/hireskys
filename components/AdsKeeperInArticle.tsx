"use client";
import { useEffect, useRef } from "react";
import { loadAdsKeeperWidget } from "./adskeeper-loader";

// AdsKeeper In-article widget "hireskys-in-article" (ID 2132179).
// "Cards media" layout, 3 columns x 1 row, responsive feed grid.
// Replaces InFeedAd (Moneytizer format 19) in the homepage job feed.
export default function AdsKeeperInArticle() {
  const adRef = useRef<HTMLDivElement>(null);

  // INSTANT LOAD (user directive 2026-10-20): no lazy gate — load on mount.
  useEffect(() => {
    loadAdsKeeperWidget(adRef.current);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 md:my-8 py-5 bg-slate-50/50 dark:bg-[#151b2b] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-[#111625] hover:shadow-xl hover:shadow-indigo-500/5">
      <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 mb-3 tracking-[0.2em]">
        Sponsored
      </span>
      <div
        data-type="_mgwidget"
        data-widget-id="2132179"
        ref={adRef}
        className="w-full flex items-center justify-center overflow-hidden min-h-[250px] bg-slate-100 dark:bg-slate-900/50 rounded-lg"
      ></div>
    </div>
  );
}

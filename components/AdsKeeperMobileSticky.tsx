"use client";
import { useEffect, useRef } from "react";
import { loadAdsKeeperWidget } from "./adskeeper-loader";

// AdsKeeper Mobile site widget "hireskys-mobile-sticky" (ID 2132181).
// Mobile-only by AdsKeeper's design ("will appear only for the mobile
// device users"). The widget positions itself — sticky mobile placement
// with Toaster ON and drag-down ON — so this component only renders its
// container; no custom close button or positioning wrapper.
// Replaces MoneytizerStickyFooter (site-wide fixed footer).
// Hidden on desktop (lg:hidden); the widget is mobile-only anyway.
export default function AdsKeeperMobileSticky() {
  const adRef = useRef<HTMLDivElement>(null);

  // INSTANT LOAD (user directive 2026-10-20): no lazy gate — load on mount.
  useEffect(() => {
    loadAdsKeeperWidget(adRef.current);
  }, []);

  return (
    <div
      data-type="_mgwidget"
      data-widget-id="2132181"
      ref={adRef}
      className="lg:hidden"
    ></div>
  );
}

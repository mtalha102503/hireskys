"use client";

import { useEffect, useRef } from "react";
import { loadMoneytizerAd } from "./moneytizer-loader";

/**
 * Moneytizer Double Skyrail (site 141745, format 4).
 *
 * Follows the house pattern: the shared loader injects gen.js only once per
 * page (base type=1 build) and loads this slot's requestform.js. The raw
 * Moneytizer tag's gen.js?type=4 is deliberately NOT pasted, so gen.js is
 * never loaded twice on a page that already runs other Moneytizer slots.
 *
 * The positioning <style> below is Moneytizer's own rule from the issued
 * Double Skyrail tag: fixed to the right side, 90px from the top, only on
 * widescreen (min-width 1024px). The slot itself only loads on desktop
 * viewports, so mobile pages never fetch or hide this ad.
 */
export default function MoneytizerSkyrail() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = adRef.current;
    if (!el) return;
    const tryLoad = () => {
      if (window.innerWidth >= 1024) {
        loadMoneytizerAd(el, 4, 4);
        window.removeEventListener("resize", tryLoad);
      }
    };
    tryLoad();
    window.addEventListener("resize", tryLoad);
    return () => window.removeEventListener("resize", tryLoad);
  }, []);

  return (
    <>
      <style>{`@media (min-width: 1024px) { #sas_26324 { position: fixed; right: 0px; top: 90px; z-index: 9999999; } }`}</style>
      <div id="141745-4" ref={adRef} className="hidden lg:block" />
    </>
  );
}

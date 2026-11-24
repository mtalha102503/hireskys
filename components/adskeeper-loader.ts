/**
 * Shared AdsKeeper (MGID) widget loader.
 *
 * AdsKeeper install is two parts: the site script
 * https://jsc.adskeeper.com/site/1111804.js (loaded ONCE in <head>,
 * see app/layout.tsx) and one container div per widget:
 *   <div data-type="_mgwidget" data-widget-id="..."></div>
 * Rendering is triggered by pushing ["_mgc.load"] onto window._mgq —
 * the queue pattern from AdsKeeper's own install code, so the push is
 * safe even before the site script has arrived.
 *
 * INSTANT LOAD (same house rule as Moneytizer, user directive
 * 2026-10-20): callers load on mount, no lazy gate.
 */

declare global {
  interface Window {
    _mgq?: unknown[][];
  }
}

/**
 * Tell the AdsKeeper library to render the widget in this container.
 * Per-container guard (data-ak-loaded) stops React StrictMode's
 * double-effect from pushing twice for the same div. A remount
 * creates a fresh div, so client-side navigation still renders.
 */
export function loadAdsKeeperWidget(container: HTMLElement | null): void {
  if (!container || typeof window === "undefined") return;
  if (container.dataset.akLoaded === "1") return;
  container.dataset.akLoaded = "1";
  window._mgq = window._mgq || [];
  window._mgq.push(["_mgc.load"]);
}

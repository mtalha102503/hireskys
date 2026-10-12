/**
 * Shared Moneytizer ad loader.
 *
 * Deduplicates the Moneytizer `gen.js` library so it is fetched only ONCE per
 * page load, no matter how many ad components are on the page. Previously each
 * of the 5 ad components injected its own copy of gen.js (5 identical library
 * downloads). Now the first ad slot to become visible loads it; the rest skip it.
 *
 * Each ad slot's `requestform.js?siteId=141745&formatId=X` is still loaded
 * per-slot (it is NOT deduplicated) — that script is what renders the specific
 * ad format into its container div.
 *
 * Lazy-loading behavior is unchanged: callers decide WHEN to call this
 * (IntersectionObserver, requestIdleCallback, etc.). This function only handles
 * the script injection itself.
 */

const SITE_ID = 141745;

// Module-level flag: gen.js is fetched once per page lifetime.
let genJsLoaded = false;

/**
 * Inject Moneytizer scripts for one ad slot.
 *
 * @param container - The ad container div (must have the Moneytizer-required
 *                    id like "141745-1"). Scripts are appended here.
 * @param type      - Kept for API compatibility; gen.js always loads with the
 *                    base type=1 (the shared library build).
 * @param formatId  - The ad format id for this slot's requestform.js.
 */
export function loadMoneytizerAd(
  container: HTMLElement | null,
  type: number,
  formatId: number
): void {
  // Guard: never double-inject into the same container (also protects against
  // React StrictMode double-effect invocation in dev).
  if (!container || container.innerHTML !== "") return;

  // Load the shared gen.js library exactly once. First caller wins; every
  // later call skips this block. Appended to the first container, exactly as
  // before, so the DOM structure for that slot is unchanged.
  if (!genJsLoaded) {
    genJsLoaded = true;
    const genScript = document.createElement("script");
    // Base library build (type=1) — shared by all formats on the page.
    void type; // type is part of the public signature; base build is used.
    genScript.src = "//ads.themoneytizer.com/s/gen.js?type=1";
    genScript.async = true;
    container.appendChild(genScript);
  }

  // Per-slot script: renders THIS ad format into THIS container. Always load.
  const requestScript = document.createElement("script");
  requestScript.src = `//ads.themoneytizer.com/s/requestform.js?siteId=${SITE_ID}&formatId=${formatId}`;
  requestScript.async = true;
  container.appendChild(requestScript);
}

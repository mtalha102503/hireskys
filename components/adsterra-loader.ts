/**
 * Adsterra banner loader (serial queue).
 *
 * Adsterra reads a single global `atOptions` when each invoke.js executes.
 * If two zones set atOptions at the same time, the later one can overwrite
 * the earlier zone's key/size before its invoke.js runs — so loads are
 * serialized: set atOptions -> append invoke.js -> wait for load/error -> next.
 * Double-injection guard per element (StrictMode safe).
 */

type AdsterraJob = {
  el: HTMLDivElement;
  key: string;
  width: number;
  height: number;
};

declare global {
  interface Window {
    atOptions?: {
      key: string;
      format: string;
      height: number;
      width: number;
      params: Record<string, unknown>;
    };
  }
}

const queue: AdsterraJob[] = [];
let current: AdsterraJob | null = null;

function runNext() {
  if (current) return;
  const job = queue.shift();
  if (!job) return;
  current = job;

  window.atOptions = {
    key: job.key,
    format: "iframe",
    height: job.height,
    width: job.width,
    params: {},
  };

  const script = document.createElement("script");
  script.src = `https://www.highrevenueformat.com/${job.key}/invoke.js`;
  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    current = null;
    runNext();
  };
  script.onload = done;
  script.onerror = done;
  job.el.appendChild(script);
  // Safety: if neither event fires (e.g. adblock swallows it), unblock the queue.
  setTimeout(() => {
    if (current === job) done();
  }, 8000);
}

export function loadAdsterraAd(
  el: HTMLDivElement | null,
  key: string,
  width: number,
  height: number
) {
  if (!el) return;
  if (el.dataset.adsterraLoaded) return;
  el.dataset.adsterraLoaded = "1";
  queue.push({ el, key, width, height });
  runNext();
}

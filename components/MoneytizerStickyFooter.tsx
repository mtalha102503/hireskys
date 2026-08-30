"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function StickyFooterAd() {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false); 

  // 🚀 PATHNAME HOOK: Pata lagane ke liye ke user kis page par hai
  const pathname = usePathname();
  const isJobPage = pathname?.includes("/jobs/");

  // 🚀 SPEED FIX: Ad-script ko page ke critical content ke baad load karo.
  useEffect(() => {
    if (!isVisible) return;

    if ('requestIdleCallback' in window) {
      const idleId = (window as any).requestIdleCallback(() => setShouldLoad(true), { timeout: 2000 });
      return () => (window as any).cancelIdleCallback?.(idleId);
    } else {
      const timer = setTimeout(() => setShouldLoad(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // 🚀 AD INJECTION LOGIC (New Ad Network)
  useEffect(() => {
    // Agar script load nahi karni, ya container nahi mila, ya ad pehle se inject ho chuka hai, to ruk jao
    if (!shouldLoad || !adRef.current || adRef.current.hasChildNodes()) return;

    // 1. Configure the ad options
    const confScript = document.createElement("script");
    confScript.type = "text/javascript";
    confScript.innerHTML = `
      atOptions = {
        'key' : '8c981f99e2fdcb758347a9099c888033',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    // 2. Inject the external ad network script
    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = "https://environmenttalentrabble.com/8c981f99e2fdcb758347a9099c888033/invoke.js";
    invokeScript.async = true;

    // Append scripts
    adRef.current.appendChild(confScript);
    adRef.current.appendChild(invokeScript);
  }, [shouldLoad]);

  if (!isVisible) return null;

  // 🔥 DYNAMIC POSITIONING LOGIC
  const style =
    isJobPage
      ? ({ bottom: "var(--job-bar-h, 0px)" } as React.CSSProperties)
      : undefined;

  return (
    <div
      style={style}
      className={`fixed left-0 w-full z-[200] flex justify-center bg-transparent pointer-events-none transition-all duration-300 ${
        isJobPage ? "md:bottom-0" : "bottom-0"
      }`}
    >
      <div className="pointer-events-auto relative min-h-[50px] md:min-h-[90px] w-full max-w-[728px] bg-white dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] flex justify-center items-center">
        
        {/* CUSTOM CLOSE BUTTON */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-10 right-2 md:-top-5 md:-right-5 bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95 flex items-center justify-center border-2 border-white dark:border-[#0B0F19]"
          aria-label="Close Ad"
        >
          <X size={16} strokeWidth={3} />
        </button>

        {/* AD CONTAINER */}
        <div ref={adRef} className="w-full h-full flex items-center justify-center overflow-hidden"></div>
      </div>
    </div>
  );
}

"use client";
import { useEffect } from 'react';

export default function IframeAutoResizer() {
  useEffect(() => {
    if (window.self === window.top) return;

    let lastHeight = 0; 

    const sendHeight = () => {
      const rootDiv = document.getElementById('hireskys-embed-root');
      if (!rootDiv) return;

      // 🟢 scrollHeight ki bajaye offsetHeight lo, ye boht strict hota hai
      const currentHeight = rootDiv.offsetHeight;

      // 🟢 THRESHOLD FIX: Sirf tab update bhejo jab height kam az kam 5px change ho! 
      // Is se micro-adjustments wale loops hamesha ke liye block ho jayenge.
      if (Math.abs(currentHeight - lastHeight) > 5 && currentHeight > 0) {
        lastHeight = currentHeight;
        window.parent.postMessage({ type: 'hireskys-resize', height: currentHeight }, '*');
      }
    };

    const triggerResize = () => setTimeout(sendHeight, 50);
    triggerResize();

    const rootDiv = document.getElementById('hireskys-embed-root');
    if (!rootDiv) return;

    const resizeObserver = new ResizeObserver(triggerResize);
    resizeObserver.observe(rootDiv);

    const mutationObserver = new MutationObserver(triggerResize);
    mutationObserver.observe(rootDiv, { childList: true, subtree: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
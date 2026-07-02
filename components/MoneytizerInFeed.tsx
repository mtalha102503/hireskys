"use client";
import { useEffect, useRef, useState } from "react";

export default function MoneytizerInFeed() {
  const adRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Scroll observer: Jab user ad ke 200px qareeb aaye tabhi script chalay ga
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Ek dafa load hone ke baad observer band kar do
        }
      },
      { rootMargin: "200px" } 
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Agar view me aa gaya hai aur ad pehle se load nahi hui, toh ab script inject karo
    if (isInView && adRef.current && adRef.current.innerHTML === "") {
      const script1 = document.createElement("script");
      script1.src = "//ads.themoneytizer.com/s/gen.js?type=2";
      script1.async = true;

      const script2 = document.createElement("script");
      script2.src = "//ads.themoneytizer.com/s/requestform.js?siteId=141745&formatId=2";
      script2.async = true;

      adRef.current.appendChild(script1);
      adRef.current.appendChild(script2);
    }
  }, [isInView]);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 md:my-8 py-4 bg-slate-50/50 dark:bg-[#111625] rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-[#151b2d] hover:shadow-xl hover:shadow-indigo-500/5">
      <span className="text-[10px] uppercase font-black text-slate-300 dark:text-slate-600 mb-2 tracking-[0.2em]">
        Sponsored
      </span>
      {/* 🚨 CLS FIX: Fixed height aur width taake page jhatka na khaye */}
      <div 
        id="141745-2" 
        ref={adRef} 
        className="w-[300px] h-[250px] flex items-center justify-center"
      ></div>
    </div>
  );
}
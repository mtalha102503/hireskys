"use client";
import React, { useRef } from "react";
import Link from "next/link"; 
import { Laptop, ArrowRight, Ticket, Globe, Maximize } from "lucide-react";

export default function SafetyWingSidebarAd() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fullscreen trigger function
  const openFullscreen = () => {
    const elem = videoRef.current;
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) { /* IE11 */
        (elem as any).msRequestFullscreen();
      }
    }
  };

  return (
    <div className="w-full max-w-[320px] flex flex-col mt-6 mx-auto bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all sticky top-24 overflow-hidden group/ad">
      
      {/* 🎬 TOP SECTION: Video Background with Click-to-Expand */}
      <div 
        onClick={openFullscreen}
        className="relative h-[180px] w-full flex flex-col justify-between p-5 overflow-hidden cursor-pointer group/video"
      >
        {/* Background Video */}
        <video 
          ref={videoRef}
          src="/safetywing-guide.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover group-hover/video:scale-105 transition-transform duration-700"
        />
        {/* Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/10 transition-opacity duration-300 group-hover/video:bg-slate-900/40"></div>

        {/* Expand Icon (Shows on Hover in Center) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md p-3 rounded-full opacity-0 group-hover/video:opacity-100 transition-all duration-300 z-20 hover:scale-110 shadow-lg">
          <Maximize size={24} className="text-white" />
        </div>

        {/* Brand & Partner Badge */}
        <div className="relative z-10 flex items-center justify-between w-full pointer-events-none">
          <h2 className="text-xl font-black tracking-tight text-white drop-shadow-md">
            SafetyWing
          </h2>
          <span className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-300 uppercase tracking-wider bg-black/30 backdrop-blur-md border border-emerald-400/30 px-2.5 py-1 rounded-md">
            Partner
          </span>
        </div>

        {/* Headline over Video */}
        <div className="relative z-10 w-full pointer-events-none">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            <span className="text-pink-400 font-bold text-[10px] uppercase tracking-widest drop-shadow-md">Exclusive Offer</span>
          </div>
          <h3 className="text-white font-black text-[22px] leading-[1.1] drop-shadow-lg">
            8-Weeks Free<br />Coverage.
          </h3>
        </div>
      </div>

      {/* 📝 BOTTOM SECTION: Content & CTA */}
      <div className="p-5 flex flex-col items-center">

        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center mb-5 leading-relaxed px-1">
          Global health & travel insurance built for nomads. Protect your <strong className="text-slate-800 dark:text-slate-200">Laptop & Phone</strong> worldwide.
        </p>

        {/* Feature Grid (Side by side) */}
        <div className="grid grid-cols-2 gap-3 w-full mb-5">
           <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <Globe size={18} className="text-indigo-500 mb-1.5" />
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center uppercase tracking-wider">180+ Countries</span>
           </div>
           <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <Laptop size={18} className="text-indigo-500 mb-1.5" />
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center uppercase tracking-wider">Theft Covered</span>
           </div>
        </div>

        {/* Promo Code Box */}
        <div className="w-full bg-pink-50 dark:bg-pink-500/10 border border-dashed border-pink-300 dark:border-pink-500/30 rounded-xl py-3 px-4 flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Ticket size={16} className="text-pink-500" />
            <span className="text-[11px] text-pink-700 dark:text-pink-400 font-bold uppercase tracking-wider">Promo Code:</span>
          </div>
          <code className="text-pink-700 dark:text-pink-300 font-black tracking-[0.15em] text-base">HIRESKYS</code>
        </div>

        {/* Action Button */}
        <Link 
          href="https://safetywing.com/nomad-insurance" 
          className="group w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-gray-100 transition-all duration-300 text-white dark:text-slate-900 rounded-xl py-3.5 flex flex-col items-center justify-center shadow-lg active:scale-95 mb-3"
        >
          <span className="font-black tracking-wide text-[15px] flex items-center gap-2">
            Unlock Your Code <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
        
        {/* Rating Trust Signal */}
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span className="flex text-amber-400 drop-shadow-sm text-sm">★★★★★</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            Top rated by Nomads
          </span>
        </div>

      </div>
    </div>
  );
}

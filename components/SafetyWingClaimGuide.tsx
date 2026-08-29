"use client";
import React, { useRef } from 'react';
import { Camera, Gift, Maximize } from 'lucide-react';

export default function SafetyWingClaimGuide() {
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
    <div className="bg-gradient-to-br from-slate-50 to-white dark:from-[#151b2b] dark:to-[#0f1420] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 mt-4 shadow-sm w-full">
      
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-pink-100 dark:bg-pink-500/20 rounded-2xl">
          <Gift className="text-pink-600 dark:text-pink-400" size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            How to claim your 8-Weeks Free
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Follow these quick steps before creating your account.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* The Steps */}
        <div className="lg:col-span-5 space-y-8">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black flex items-center justify-center shrink-0 text-lg">1</div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">Find the Pink Camera</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Scroll down on the SafetyWing page until you see the people on the train. Click the hidden pink camera.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black flex items-center justify-center shrink-0 text-lg">2</div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">Enter Promo Code</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">When the modal pops up, type in our exclusive code:</p>
              <div className="inline-block bg-white dark:bg-[#0b0f19] border-2 border-dashed border-pink-300 dark:border-pink-500/50 rounded-xl px-4 py-2 shadow-sm">
                <code className="text-pink-600 dark:text-pink-400 font-black tracking-[0.2em] text-lg md:text-xl">HIRESKYS</code>
              </div>
            </div>
          </div>
        </div>

        {/* The Clickable MP4 Video Container */}
        <div 
          onClick={openFullscreen}
          className="lg:col-span-7 relative rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-black aspect-video group w-full cursor-pointer"
        >
          <video 
            ref={videoRef}
            src="/safetywing-guide.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          
          {/* Expand Icon (Shows on Hover) */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 hover:scale-105 shadow-lg">
            <Maximize size={18} className="text-white" />
          </div>

          {/* Subtle overlay hint */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <span className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-transform group-hover:scale-105">
              <Camera size={14} className="text-pink-400" /> Click to enlarge
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

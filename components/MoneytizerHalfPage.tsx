"use client";
import React from "react";
import Link from "next/link"; 

export default function NsaveSidebarAd() {
  return (
    <div className="w-full max-w-[320px] flex flex-col mt-6 bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all sticky top-24 overflow-hidden">
      
      {/* Main Content Area */}
      <div className="p-5 flex flex-col items-center">
        
        {/* Top Header */}
        <div className="text-center mb-3">
          <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
            nsave
          </h2>
          <span className="text-[11px] font-bold text-[#C70000] uppercase tracking-widest bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-sm">
            Partner Offer
          </span>
        </div>

        {/* Main Headline */}
        <h3 className="text-[22px] font-black text-center text-gray-900 dark:text-white leading-[1.15] mb-2 uppercase">
          Don't just receive salary—protect it.
        </h3>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <div className="flex text-black dark:text-white">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            Trusted Swiss Banking App
          </span>
        </div>

        {/* Features List (Hybrid Copy) */}
        <div className="space-y-4 mb-6 w-full">
          {/* Feature 1 */}
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-tight">
              <strong className="text-gray-900 dark:text-white">Swiss Account (Beat Devaluation):</strong> Get a personal USD/EUR IBAN. Protect your wealth offshore instead of a virtual wallet.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-tight">
              <strong className="text-gray-900 dark:text-white">5% Better Rates & Zero Fees:</strong> The perfect Payoneer alternative. Receive payments free and send money home cheaper.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-tight">
              <strong className="text-gray-900 dark:text-white">Earn 3.2% & Invest:</strong> Get rewards on your USD balance and invest directly in US stocks and ETFs.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link 
          href="https://web.nsave.com/invite/muhamma_talha6" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-[#C70000] hover:bg-red-700 transition-colors duration-200 text-white rounded-lg py-3 flex flex-col items-center justify-center shadow-md mb-2"
        >
          <span className="font-black tracking-wide text-[17px] leading-tight uppercase">Claim 1 Free Month</span>
          <span className="font-bold text-xs uppercase opacity-90">Of Nsave Pro (Exclusive)</span>
        </Link>
        
        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium text-center">
          Available for remote workers in Asia & emerging markets.
        </span>
      </div>

    </div>
  );
}

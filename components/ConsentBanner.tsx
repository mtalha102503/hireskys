"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie, ShieldCheck } from 'lucide-react';

export default function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check karo ke user ne pehle se decision liya hua hai ya nahi
    const consent = localStorage.getItem('site_consent');
    if (!consent) {
      // Agar koi decision nahi hai, to banner dikhao (thodi der baad taake smooth lage)
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('site_consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('site_consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-6 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#111625] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:flex items-center justify-between gap-6">
        
        {/* Text Section */}
        <div className="flex-1 mb-4 md:mb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full">
                <Cookie size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              We value your privacy
            </h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you agree to our 
            <Link href="/privacy" className="text-indigo-600 hover:underline mx-1 font-medium">Privacy Policy</Link> 
            and 
            <Link href="/terms" className="text-indigo-600 hover:underline mx-1 font-medium">Terms of Service</Link>.
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={handleReject}
            className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-sm"
          >
            Reject All
          </button>
          <button 
            onClick={handleAccept}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition text-sm flex items-center gap-2"
          >
            <ShieldCheck size={16} /> Accept
          </button>
        </div>

        {/* Close Icon (Optional) */}
        <button 
            onClick={handleReject}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 md:hidden"
        >
            <X size={20} />
        </button>

      </div>
    </div>
  );
}
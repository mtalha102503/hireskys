'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ScanSearch, Loader2, X, ShieldCheck, ExternalLink } from 'lucide-react';
export default function VerifyMagicButton({ companyName }: { companyName: string }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [sources, setSources] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleVerify = async () => {
    setIsOpen(true);
    setLoading(true);
    setAnalysis('');
    setSources([]);

    const query = `Investigate if "${companyName}" is a legitimate company. Search for recent reviews on Trustpilot, Glassdoor, and Reddit. Check for any scam reports. Is it safe to apply?`;

    try {
      const res = await fetch('/api/hyrizon', { 
        method: 'POST',
        body: JSON.stringify({ query: query }),
      });

      const data = await res.json();
      
      if (data.answer) setAnalysis(data.answer);
      if (data.sources) {
          setSources(data.sources);
      }

    } catch (e) {
      setAnalysis("⚠️ Could not verify at this moment. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 'relative' sirf desktop ke liye zaroori hai, mobile par hum fixed use karenge
    <div className="md:relative inline-block">
      <style>{`
        @keyframes neon-flow {
            0%, 100% { box-shadow: 0 0 2px rgba(124, 58, 237, 0.1); border-color: rgba(124, 58, 237, 0.2); }
            50% { box-shadow: 0 0 10px rgba(124, 58, 237, 0.4); border-color: rgba(124, 58, 237, 0.8); }
        }
      `}</style>

      {/* BUTTON */}
      {!isOpen && (
        <button 
            onClick={handleVerify}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#0B0F19] text-violet-700 dark:text-white rounded-full text-[10px] font-bold active:scale-95 transition-all border border-violet-200 dark:border-violet-600/30 animate-[neon-flow_3s_ease-in-out_infinite] hover:bg-violet-50 dark:hover:bg-violet-900/20 shadow-sm whitespace-nowrap"
        >
            <ScanSearch size={14} className="text-violet-600 dark:text-violet-400" />
            <span>Verify This Company</span>
        </button>
      )}

      {/* POPUP WINDOW */}
      {isOpen && (
        <>
            {/* 🌑 MOBILE BACKDROP (Background Dim karega) */}
            <div 
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" 
                onClick={() => setIsOpen(false)}
            />

            {/* 📦 THE CONTAINER */}
            <div className={`
                // MOBILE STYLES (Fixed Center)
                fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none md:pointer-events-auto
                
                // DESKTOP STYLES (Absolute Dropdown)
                md:absolute md:inset-auto md:top-full md:left-0 md:mt-2 md:block md:p-0
            `}>
                <div className={`
                    // COMMON STYLES
                    bg-white dark:bg-[#111625] border border-violet-100 dark:border-violet-500/20 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto
                    
                    // SIZE CONTROLS
                    w-full max-w-sm md:w-80
                    
                    // ANIMATION
                    animate-in fade-in zoom-in-95 duration-200
                `}>
                    
                    {/* HEADER */}
                    <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                        <h3 className="text-xs font-black uppercase tracking-widest text-violet-600 dark:text-violet-400 flex items-center gap-2">
                        <ShieldCheck size={14} /> HYRIZON Report
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors">
                        <X size={16} />
                        </button>
                    </div>

                    {/* BODY */}
                    <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="py-8 text-center space-y-3">
                                <Loader2 className="h-8 w-8 text-violet-500 animate-spin mx-auto" />
                                <p className="text-xs text-slate-500 animate-pulse">Scanning live reputation...</p>
                            </div>
                        ) : (
                            <div>
                                {/* 🤖 AI ANSWER */}
                                <div className="prose prose-sm prose-violet dark:prose-invert text-xs leading-relaxed">
                                    <ReactMarkdown>{analysis}</ReactMarkdown>
                                </div>

                                {/* 🔗 LIVE SOURCES */}
                                {sources.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase flex items-center gap-1">
                                            <ExternalLink size={10} /> Verified Sources
                                        </p>
                                        <div className="flex flex-wrap gap-2">
    {/* Slice badha kar 5 kar diya */}
    {sources.slice(0, 5).map((src, i) => {
        const hostname = new URL(src.url).hostname;
        return (
        <a 
            key={i} 
            href={src.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 text-[10px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 hover:text-violet-600 hover:border-violet-200 transition-colors truncate max-w-[160px]"
        >
            {/* 🔥 ASLI FAVICON IMAGE */}
            <img 
                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`} 
                alt="icon" 
                className="w-3.5 h-3.5 rounded-sm flex-shrink-0"
                onError={(e) => e.currentTarget.style.display = 'none'} 
            />
            <span className="truncate">{hostname.replace('www.','')}</span>
        </a>
    )})}
</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
      )}
    </div>
  );
}
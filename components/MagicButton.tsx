'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Loader2, Bot, X, Zap, Cpu } from 'lucide-react';

export default function MagicButton({ jobDescription, jobTitle, userProfile }: any) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAnalyze = async () => {
    setIsOpen(true);
    setLoading(true);
    setAnalysis(''); 
    
    try {
      // ⚡ Super Fast (0.3s delay only)
      const [res, _] = await Promise.all([
        fetch('/api/ai-summary', {
          method: 'POST',
          body: JSON.stringify({ 
  jobDescription, 
  jobTitle,
  // 👇 Ye 2 cheezein nayi hain (Plan B)
  userProfile, 
  userStatus: userProfile ? "FULL" : "GUEST" 
}),
        }),
        new Promise(resolve => setTimeout(resolve, 300)) 
      ]);

      const data = await res.json();
      setAnalysis(data.analysis);

    } catch (e) {
      setAnalysis("Hyrizon server is busy. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6 w-full flex justify-center md:justify-start">
      {!isOpen ? (
        // --- 🔥 HYRIZON BUTTON ---
        <button
          onClick={handleAnalyze}
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-50 group w-full md:w-auto transition-all active:scale-95 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40"
        >
          {/* Animated Horizon Gradient Border */}
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#A78BFA_0%,#4C1D95_50%,#A78BFA_100%)]" />

          {/* Button Face */}
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white dark:bg-[#0F172A] px-8 py-1 text-sm font-medium backdrop-blur-3xl transition-colors group-hover:bg-slate-50 dark:group-hover:bg-slate-900">
            
            {/* Icon Logic */}
            <div className="relative flex items-center justify-center mr-2">
               {loading ? (
                 <Loader2 className="h-5 w-5 animate-spin text-violet-600 dark:text-violet-400" />
               ) : (
                 <>
                   <Cpu className="h-5 w-5 text-violet-600 dark:text-violet-400 absolute group-hover:scale-0 transition-transform duration-300" />
                   <Zap className="h-5 w-5 text-amber-500 absolute scale-0 group-hover:scale-100 transition-transform duration-300" />
                   <div className="h-5 w-5"></div>
                 </>
               )}
            </div>
            
            {/* Hyrizon Text Branding */}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-white dark:to-violet-200 bg-clip-text text-transparent font-bold tracking-wide group-hover:from-violet-500 group-hover:to-fuchsia-500 transition-all uppercase text-xs md:text-sm">
              {loading ? "Connecting to Hyrizon..." : "AI Summary & Match"}
            </span>
          </span>
        </button>
      ) : (
        // --- 🌌 HYRIZON INTERFACE CARD ---
        <div className="w-full bg-white dark:bg-[#111625] border border-violet-100 dark:border-violet-500/20 rounded-2xl p-6 shadow-2xl shadow-violet-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          {/* Hyrizon Header */}
          <div className="flex justify-between items-start mb-6 relative z-10 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
                <h3 className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center gap-2">
                <Bot className="text-violet-500 h-6 w-6" /> 
                HYRIZON
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold ml-8">Career Intelligence</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-violet-50 dark:bg-violet-900/20 rounded-full flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-violet-500 animate-spin" />
                </div>
                <div className="h-4 bg-violet-50 dark:bg-violet-900/20 rounded w-1/3"></div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-4/6"></div>
              </div>
              <p className="text-xs text-violet-500 font-medium mt-4 text-center">
                Hyrizon is analyzing job fit...
              </p>
            </div>
          ) : (
            <div className="prose prose-violet dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              <ReactMarkdown 
                components={{
                  a: ({node, ...props}) => (
                    <a {...props} className="text-violet-600 dark:text-violet-400 font-bold hover:underline" target="_blank" />
                  ),
                  strong: ({node, ...props}) => (
                    <strong {...props} className="text-slate-900 dark:text-white font-extrabold" />
                  ),
                  ul: ({node, ...props}) => (
                    <ul {...props} className="list-disc pl-4 space-y-2 my-4 marker:text-violet-500" />
                  ),
                  h3: ({node, ...props}) => (
                    <h3 {...props} className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-2 border-l-4 border-violet-500 pl-3" />
                  )
                }}
              >
                {analysis}
              </ReactMarkdown>
              
              {/* Footer Branding */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    Powered by <span className="font-bold text-violet-500">Hyrizon Engine 1.0</span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function JobFeedback({ jobId, userId }: { jobId: string, userId?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [counts, setCounts] = useState({ awesome: 0, good: 0, not_relevant: 0 });
  const [loading, setLoading] = useState(true);

  // 🟢 PAGE LOAD HOTE HI DATABASE SE PURANE VOTES MANGWAO
  useEffect(() => {
    async function fetchCounts() {
      const { data, error } = await supabase
        .from('job_feedback')
        .select('rating')
        .eq('job_id', jobId);

      if (!error && data) {
        const newCounts = { awesome: 0, good: 0, not_relevant: 0 };
        data.forEach((item) => {
          if (item.rating === 'awesome') newCounts.awesome++;
          if (item.rating === 'good') newCounts.good++;
          if (item.rating === 'not_relevant') newCounts.not_relevant++;
        });
        setCounts(newCounts);
      }
      setLoading(false);
    }
    
    fetchCounts();
  }, [jobId]);

  const handleFeedback = async (rating: 'awesome' | 'good' | 'not_relevant') => {
    if (submitted) return; // Agar pehle daba diya hai toh dobara na dabay
    
    setSubmitted(true); 
    
    // 🚀 OPTIMISTIC UI: Database ka wait kiye bina number foran badha do taake maza aaye
    setCounts(prev => ({ ...prev, [rating]: prev[rating] + 1 }));
    
    // Background mein database ko save karne bhej do
    const { error } = await supabase.from('job_feedback').insert({ 
        job_id: jobId, 
        user_id: userId || 'guest', 
        rating: rating 
    });

    if (error) console.error("Feedback Error:", error);
  };

  return (
    <div className={`mt-8 p-5 bg-white dark:bg-[#151b2d] border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm transition-all duration-500 ${submitted ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-800'}`}>
      
      <div className="text-center sm:text-left">
        <h4 className={`font-bold text-sm ${submitted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
          {submitted ? '🎉 Thanks for your feedback!' : 'How would you rate this job post?'}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {submitted ? 'Your vote helps our AI rank jobs better.' : 'See what other professionals think about this role.'}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* 🔥 AWESOME BUTTON */}
        <button 
            onClick={() => handleFeedback('awesome')} 
            disabled={submitted || loading}
            className={`flex flex-col items-center justify-center min-w-[50px] h-14 rounded-xl border transition-all ${submitted ? 'opacity-70 cursor-default bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700' : 'bg-slate-50 hover:bg-orange-50 dark:bg-slate-800 dark:hover:bg-orange-500/10 border-slate-200 hover:border-orange-200 dark:border-slate-700 dark:hover:border-orange-500/30 hover:scale-105 hover:shadow-md cursor-pointer'}`}
            title="Awesome"
        >
          <span className="text-lg leading-none">🔥</span>
          <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 mt-1">{loading ? '-' : counts.awesome}</span>
        </button>

        {/* 👍 GOOD BUTTON */}
        <button 
            onClick={() => handleFeedback('good')} 
            disabled={submitted || loading}
            className={`flex flex-col items-center justify-center min-w-[50px] h-14 rounded-xl border transition-all ${submitted ? 'opacity-70 cursor-default bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700' : 'bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-500/10 border-slate-200 hover:border-emerald-200 dark:border-slate-700 dark:hover:border-emerald-500/30 hover:scale-105 hover:shadow-md cursor-pointer'}`}
            title="Good Match"
        >
          <span className="text-lg leading-none">👍</span>
          <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 mt-1">{loading ? '-' : counts.good}</span>
        </button>

        {/* 👎 NOT RELEVANT BUTTON */}
        <button 
            onClick={() => handleFeedback('not_relevant')} 
            disabled={submitted || loading}
            className={`flex flex-col items-center justify-center min-w-[50px] h-14 rounded-xl border transition-all ${submitted ? 'opacity-50 cursor-default bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700' : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600 hover:scale-105 hover:shadow-md cursor-pointer'}`}
            title="Not Relevant"
        >
          <span className="text-lg leading-none opacity-80">👎</span>
          <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 mt-1">{loading ? '-' : counts.not_relevant}</span>
        </button>
      </div>

    </div>
  );
}
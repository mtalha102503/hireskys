"use client"; // 👈 Ye Client Component hai
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Heart, Share2, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function JobActions({ job, userId, isSavedInitial }: any) {
  const [saved, setSaved] = useState(isSavedInitial);
  const router = useRouter();

  // Save Logic
  const toggleSave = async () => {
    if (!userId) { router.push('/login'); return; }
    
    // Optimistic UI (Turant color change karo, background me save hoga)
    const newStatus = !saved;
    setSaved(newStatus);

    if (saved) {
        await supabase.from('saved_jobs').delete().match({ user_id: userId, job_id: job.id });
    } else {
        await supabase.from('saved_jobs').insert({ user_id: userId, job_id: job.id });
    }
  };

  // Share Logic
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="flex gap-3 w-full md:w-auto mt-6 md:mt-0">
        {/* Save Button */}
        <button onClick={toggleSave} className={`flex-shrink-0 p-3 rounded-xl border transition ${saved ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>
            <Heart size={24} className={saved ? 'fill-current' : ''} />
        </button>
        
        {/* Share Button */}
        <button onClick={handleShare} className="flex-shrink-0 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600">
            <Share2 size={24} />
        </button>
        
        {/* Apply Button */}
        <a 
            href={job.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 md:flex-none px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform text-sm md:text-base h-auto"
        >
            <span className="md:hidden">Apply Now</span>
            <span className="hidden md:inline">Apply on Site</span>
            <ExternalLink size={18} className="flex-shrink-0"/>
        </a>
    </div>
  );
}
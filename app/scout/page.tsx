"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { 
  Twitter, Facebook, Linkedin, Globe, Save, 
  Zap, CheckCircle, LogOut 
} from 'lucide-react';
import Navbar from '@/components/Navbar';

// --- CATEGORIES (Same as everywhere) ---
const CATEGORIES = {
  "Development": ["React", "Next.js", "Node.js", "Python", "Shopify", "WordPress", "Web3"],
  "Mobile App": ["React Native", "Flutter", "iOS", "Android"],
  "Video & Motion": ["Video Editor", "Premiere Pro", "After Effects", "Thumbnail Artist"],
  "Design & UI": ["UI/UX", "Figma", "Web Design", "Graphic Design"],
  "Marketing": ["SEO", "Facebook Ads", "Google Ads", "Copywriter"],
  "Writing": ["Ghostwriter", "Scriptwriter", "Content Writer"]
};

export default function ScoutEntry() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    link: '',
    platform: 'Twitter', // Default
    category: '',
    tags: [] as string[]
  });

  // Security Check (Optional: Agar chaho to email check laga dena)
  // filhal khula rakha hai taake dost easily use kar sake.

  const toggleTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    } else {
      if (formData.tags.length < 3) setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.link || !formData.category) {
      alert("Basic details missing!");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('jobs').insert([
      {
        title: formData.title,
        source: formData.company || "Private Client", // Agar company nahi mili to generic
        link: formData.link,
        category: formData.category,
        tags: formData.tags,
        platform: formData.platform, // <--- NEW FIELD
        date_posted: new Date().toISOString(),
        approved: false, // Tum admin se approve karoge
        is_verified: true
      }
    ]);

    setLoading(false);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setMsg('Job Added! Ready for next.');
      // Form Reset for Speed
      setFormData({ 
        title: '', company: '', link: '', 
        platform: formData.platform, // Platform wahi rakho shayad wo lagatar twitter se daal raha ho
        category: '', tags: [] 
      });
      setTimeout(() => setMsg(''), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl border border-indigo-100 dark:border-slate-800 shadow-xl">
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-extrabold flex items-center gap-2">
                <Zap className="text-yellow-500 fill-yellow-500"/> Scout Entry Mode
            </h1>
            <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Internal Tool</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. PLATFORM SELECTOR */}
            <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Source Platform</label>
                <div className="flex gap-2">
                    {['Twitter', 'Facebook', 'LinkedIn', 'Web'].map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setFormData({...formData, platform: p})}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border transition ${
                                formData.platform === p 
                                ? 'bg-indigo-600 text-white border-transparent' 
                                : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700'
                            }`}
                        >
                            {p === 'Twitter' && <Twitter size={14}/>}
                            {p === 'Facebook' && <Facebook size={14}/>}
                            {p === 'LinkedIn' && <Linkedin size={14}/>}
                            {p === 'Web' && <Globe size={14}/>}
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. JOB DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Job Title</label>
                    <input type="text" placeholder="e.g. Video Editor Needed" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" required />
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Company / Client</label>
                    <input type="text" placeholder="e.g. Agency Name" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
            </div>

            <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Job Link (URL)</label>
                <input type="url" placeholder="https://twitter.com/..." value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono" required />
            </div>

            {/* 3. CATEGORY & TAGS */}
            <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Category</label>
                <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value, tags: []})}
                    className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-sm mb-3"
                >
                    <option value="">Select Category...</option>
                    {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {formData.category && (
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES[formData.category as keyof typeof CATEGORIES].map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`px-2 py-1 rounded text-xs font-bold border transition ${
                                    formData.tags.includes(tag)
                                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 border-indigo-200'
                                    : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
                {loading ? 'Saving...' : <><Save size={18}/> Submit & Clear</>}
            </button>
            
            {msg && <div className="text-center text-green-600 font-bold animate-pulse">{msg}</div>}

          </form>
        </div>
      </div>
    </div>
  );
}
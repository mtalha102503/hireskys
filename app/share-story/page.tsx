"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';
import { Star, Send, User, Briefcase, Building, MessageSquare, CheckCircle, PartyPopper } from 'lucide-react';
import Link from 'next/link';

export default function ShareStory() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(5); // Default 5 Stars
  const [hoverRating, setHoverRating] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('stories')
      .insert([
        {
          name: formData.name,
          role: formData.role,
          company: formData.company,
          message: formData.message,
          rating: rating
        }
      ]);

    setLoading(false);

    if (error) {
      alert('Error sending story. Please try again.');
      console.error(error);
    } else {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
        <Navbar />
        <main className="container mx-auto px-4 py-20 max-w-2xl text-center">
            <div className="bg-white dark:bg-[#111625] p-12 rounded-3xl shadow-xl border border-green-100 dark:border-green-900/30 animate-fade-in-up">
                <div className="inline-flex p-4 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 mb-6">
                    <PartyPopper size={48} />
                </div>
                <h1 className="text-3xl font-bold mb-4">Story Received! 🎉</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
                    Thank you, <strong>{formData.name}</strong>! Your success inspires us. We will review your story and feature it soon.
                </p>
                <Link href="/" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition">
                    Back to Radar
                </Link>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-16 max-w-2xl">
        
        {/* HEADER */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Did you get <span className="text-indigo-600 dark:text-indigo-400">Hired?</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Share your win with the community. Your story helps others believe.
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white dark:bg-[#111625] p-6 md:p-10 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* NAME & ROLE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-2">
                        <User size={14}/> Your Name
                    </label>
                    <input 
                        type="text" 
                        required
                        placeholder="e.g. Ali Khan"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-2">
                        <Briefcase size={14}/> Job Role Won
                    </label>
                    <input 
                        type="text" 
                        required
                        placeholder="e.g. Video Editor"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>
            </div>

            {/* COMPANY */}
            <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-2">
                    <Building size={14}/> Company / Client Name
                </label>
                <input 
                    type="text" 
                    placeholder="e.g. TechFlow Agency (or Private Client)"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
            </div>

            {/* RATING STARS */}
            <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">
                    Rate Your Experience
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star 
                                size={32} 
                                className={`
                                    ${(hoverRating || rating) >= star 
                                        ? 'fill-yellow-400 text-yellow-400' 
                                        : 'text-slate-300 dark:text-slate-600'}
                                    transition-colors duration-200
                                `} 
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* MESSAGE */}
            <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-2">
                    <MessageSquare size={14}/> Your Story
                </label>
                <textarea 
                    rows={5}
                    required
                    placeholder="Tell us how you found the job! How long did it take? Any tips for others?"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                />
            </div>

            {/* SUBMIT BUTTON */}
            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? 'Submitting...' : <><Send size={20} /> Submit My Story</>}
            </button>

            <p className="text-xs text-center text-slate-400 mt-4">
                By submitting, you allow HireSkys to feature your story anonymously or with your name.
            </p>

          </form>
        </div>

      </main>
    </div>
  );
}
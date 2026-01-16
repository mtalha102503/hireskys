"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2, Tag, Check } from 'lucide-react';
import { notFound } from 'next/navigation';
import { articles } from '../articles'; // Import data

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params safely
  const { slug } = React.use(params);
  const article = articles[slug];
  
  // State for Copy/Share Feedback
  const [copied, setCopied] = React.useState(false);

  if (!article) {
    return notFound();
  }

  // --- SHARE HANDLER ---
  const handleShare = async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: article.title,
                text: `Check out this career guide: ${article.title}`,
                url: window.location.href,
            });
        } catch (error) {
            console.log("Error sharing", error);
        }
    } else {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/career-advice" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition">
            <ArrowLeft size={18} /> Back to Guides
        </Link>

        <article className="bg-white dark:bg-[#111625] p-8 md:p-12 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
            
            {/* Header */}
            <div className="mb-10">
                <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-indigo-500 mb-4">
                    <span className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                        <Tag size={12}/> {article.category}
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight text-slate-900 dark:text-white">
                    {article.title}
                </h1>
                <div className="flex items-center gap-6 text-slate-500 text-sm border-y border-slate-100 dark:border-slate-800 py-4">
                    <span className="flex items-center gap-2"><Calendar size={16}/> {article.date}</span>
                    <span className="flex items-center gap-2"><Clock size={16}/> {article.readTime}</span>
                    
                    {/* Share Button */}
                    <button 
                        onClick={handleShare}
                        className={`ml-auto flex items-center gap-2 transition-all font-medium ${
                            copied 
                            ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-lg' 
                            : 'hover:text-indigo-500 active:scale-95'
                        }`}
                    >
                        {copied ? <Check size={18} /> : <Share2 size={18} />}
                        {copied ? 'Copied!' : 'Share'}
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div>
                {article.content}
            </div>

            {/* Author Box */}
            <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="h-14 w-14 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
                    HS
                </div>
                <div>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">HireSkys Editorial Team</p>
                    <p className="text-sm text-slate-500">Curated by elite recruiters & developers.</p>
                </div>
            </div>

        </article>
      </main>
    </div>
  );
}
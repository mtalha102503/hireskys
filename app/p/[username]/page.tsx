"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import { 
  MapPin, Mail, Briefcase, GraduationCap, 
  ExternalLink, CheckCircle, Share2, 
  Globe, Code, Zap, Calendar, ArrowRight
} from 'lucide-react';

export default function SmartPortfolio({ params }: { params: Promise<{ username: string }> }) {
  const { username } = React.use(params);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('profiles')
        .select(`*, user_skills (*)`)
        .eq('username', username)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }
      setProfile(data);
      document.title = `${data.full_name} | HireSkys`;
      setLoading(false);
    }
    fetchData();
  }, [username]);

  const handleCopyLink = () => {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!profile) return notFound();

  // Skills ko sirf sort kiya hai taake best pehle aayen, lekin score dikhayenge nahi
  const displaySkills = profile.user_skills?.sort((a:any, b:any) => b.proficiency_score - a.proficiency_score) || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100 flex flex-col">
      
      <main className="flex-grow pb-24">
        
        {/* --- 🌟 PREMIUM HERO HEADER --- */}
        <div className="w-full bg-white dark:bg-[#111625] border-b border-slate-200 dark:border-slate-800 relative">
            
            {/* Sleek Cover Banner */}
            <div className="h-32 md:h-48 w-full bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-indigo-950 dark:to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative pb-8 md:pb-12">
                
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                    
                    {/* Overlapping Avatar */}
                    <div className="-mt-16 md:-mt-24 relative z-10 shrink-0">
                        <div className="bg-white dark:bg-[#111625] p-1.5 rounded-3xl shadow-sm">
                            <img 
                                src={profile.avatar_url || 'https://via.placeholder.com/150'} 
                                alt={profile.full_name} 
                                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800"
                            />
                        </div>
                        {profile.is_available && (
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border-4 border-white dark:border-[#111625] shadow-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Available
                            </div>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="pt-2 md:pt-4 flex-1 w-full">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                    {profile.full_name}
                                    {profile.profile_score >= 80 && <CheckCircle size={20} className="text-indigo-500" />}
                                </h1>
                                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mt-1">
                                    {profile.primary_role || 'Professional'}
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    {profile.location && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin size={16} className="text-slate-400"/> {profile.location}
                                        </span>
                                    )}
                                    {profile.hourly_rate && (
                                        <span className="flex items-center gap-1.5">
                                            <Zap size={16} className="text-amber-500"/> ${profile.hourly_rate}/hr
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                                <button onClick={handleCopyLink} className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors">
                                    {copied ? <CheckCircle size={20} className="text-emerald-500"/> : <Share2 size={20} />} 
                                </button>
                                <a href={`mailto:${profile.email}`} className="flex-1 md:flex-none px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-50 rounded-xl font-bold transition-all text-sm text-center">
                                    Contact
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- 📌 MAIN CONTENT GRID --- */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* ⬅️ LEFT COLUMN (About, Skills, Socials) */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* About Section */}
                    {profile.bio && (
                        <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">About</h3>
                            <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                                {profile.bio}
                            </p>
                        </div>
                    )}

                    {/* Clean Skills Tags */}
                    {displaySkills.length > 0 && (
                        <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
                                Expertise
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {displaySkills.map((s:any) => (
                                    <span key={s.id} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                                        {s.skill_name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Connect / Links */}
                    {profile.custom_links?.length > 0 && (
                        <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                             <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">Links</h3>
                            <div className="space-y-3">
                                {profile.custom_links.map((link:any, i:number) => (
                                    <a key={i} href={link.url} target="_blank" className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all group">
                                        <span className="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{link.label}</span>
                                        <ExternalLink size={16} className="text-slate-400 group-hover:text-indigo-500" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ➡️ RIGHT COLUMN (Experience, Projects, Education) */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Experience List */}
                    {profile.experience?.length > 0 && (
                        <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                             <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                                <Briefcase size={20} className="text-indigo-500"/> Work Experience
                            </h3>
                            
                            <div className="space-y-8">
                                {profile.experience.map((exp:any, i:number) => (
                                    <div key={i} className="flex gap-4 group">
                                        {/* Simple Timeline line */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded-full group-hover:bg-indigo-500 transition-colors mt-1.5"></div>
                                            {i !== profile.experience.length - 1 && <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-800 mt-2"></div>}
                                        </div>
                                        
                                        <div className="pb-2">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{exp.role}</h4>
                                                <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md w-fit">
                                                    {exp.year}
                                                </span>
                                            </div>
                                            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-3">{exp.company}</p>
                                            <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                                                {exp.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects Grid */}
                    {profile.projects?.length > 0 && (
                        <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Code size={20} className="text-pink-500"/> Featured Projects
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {profile.projects.map((proj:any, i:number) => (
                                    <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col h-full hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors group">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {proj.title}
                                            </h4>
                                            {proj.link && (
                                                <a href={proj.link} target="_blank" className="p-1.5 bg-white dark:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 shadow-sm">
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{proj.role}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 flex-grow">
                                            {proj.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education List */}
                     {profile.education?.length > 0 && (
                        <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <GraduationCap size={20} className="text-blue-500"/> Education
                            </h3>
                            <div className="space-y-4">
                                {profile.education.map((edu:any, i:number) => (
                                    <div key={i} className="flex justify-between items-start p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{edu.school}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{edu.degree}</p>
                                        </div>
                                        <span className="text-xs font-bold bg-white dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-md shadow-sm border border-slate-100 dark:border-slate-700">
                                            {edu.year}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-8 text-center text-slate-400 text-sm font-medium">
          <a href="https://www.hireskys.com" target="_blank" className="hover:text-indigo-500 transition-colors inline-flex items-center gap-1.5">
              Powered by <span className="font-bold text-slate-700 dark:text-slate-200">HireSkys</span>
          </a>
      </footer>
    </div>
  );
}

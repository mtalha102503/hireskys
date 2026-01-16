"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { notFound } from 'next/navigation';
import { 
  MapPin, Mail, Phone, Award, Briefcase, GraduationCap, 
  ExternalLink, CheckCircle, User, Download, Share2, 
  Globe, Code, Star, Copy, Zap
} from 'lucide-react';

export default function SmartPortfolio({ params }: { params: Promise<{ username: string }> }) {
  const { username } = React.use(params);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // Username se Profile dhoondo
      const { data, error } = await supabase
        .from('profiles')
        .select(`
            *,
            user_skills (*)
        `)
        .eq('username', username) // Make sure DB column is 'username'
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }
      setProfile(data);
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
        <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-24 w-24 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
    </div>
  );
  
  if (!profile) return notFound();

  // Sort skills: Verified first
  const sortedSkills = profile.user_skills.sort((a:any, b:any) => b.proficiency_score - a.proficiency_score);
  const verifiedCount = sortedSkills.filter((s:any) => s.proficiency_score >= 9).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      <Navbar />

      <div className="container mx-auto px-4 py-24 max-w-6xl">
        
        {/* --- HERO HEADER --- */}
        <div className="bg-[#111625] text-white rounded-3xl overflow-hidden shadow-2xl relative mb-10 border border-slate-800">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start">
                
                {/* Avatar Area */}
                <div className="shrink-0 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                    <img 
                        src={profile.avatar_url || 'https://via.placeholder.com/150'} 
                        alt={profile.full_name} 
                        className="relative w-40 h-40 rounded-full border-4 border-[#111625] object-cover shadow-2xl"
                    />
                    {verifiedCount > 0 && (
                        <div className="absolute bottom-2 right-2 bg-white text-indigo-600 p-1.5 rounded-full shadow-lg border-2 border-[#111625]" title="Verified Talent">
                            <CheckCircle size={20} fill="currentColor" className="text-green-500" />
                        </div>
                    )}
                </div>

                {/* Info Area */}
                <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{profile.full_name}</h1>
                            <p className="text-xl text-slate-400 font-medium mt-2 flex items-center gap-2">
                                {profile.bio ? profile.bio.split('\n')[0] : 'Digital Professional'}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-slate-400 mt-4">
                                {profile.location && <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/50 rounded-full"><MapPin size={14}/> {profile.location}</span>}
                                {profile.is_available && (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-900/30 text-green-400 border border-green-800 rounded-full font-bold uppercase text-xs tracking-wide">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Available for work
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-3 w-full md:w-auto mt-6 md:mt-0">
                            <a href={`mailto:${profile.email}`} className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition transform hover:-translate-y-1">
                                <Mail size={18} /> Hire Me
                            </a>
                            {profile.whatsapp && (
                                <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" className="flex-1 md:flex-none px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition transform hover:-translate-y-1">
                                    <Phone size={18} /> WhatsApp
                                </a>
                            )}
                            <button onClick={handleCopyLink} className="p-3 border border-slate-700 hover:bg-slate-800 rounded-xl transition text-slate-400 hover:text-white" title="Copy Profile Link">
                                {copied ? <CheckCircle size={20} className="text-green-500"/> : <Share2 size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- LEFT SIDEBAR --- */}
            <div className="lg:col-span-1 space-y-8">
                
                {/* SKILLS CARD */}
                <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold flex items-center gap-2 mb-6 text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                        <Award size={20} className="text-yellow-500"/> Skill Ratings
                    </h3>
                    <div className="space-y-4">
                        {sortedSkills.length > 0 ? (
                            sortedSkills.map((s:any) => {
                                const isVerified = s.proficiency_score >= 9;
                                return (
                                    <div key={s.id}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`font-bold text-sm ${isVerified ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {s.skill_name}
                                                {isVerified && <span className="ml-1 text-[10px] bg-green-500 text-white px-1.5 rounded-full">VERIFIED</span>}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400">{s.proficiency_score}/10</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${isVerified ? 'bg-green-500' : 'bg-indigo-500'}`} 
                                                style={{ width: `${s.proficiency_score * 10}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-slate-400 text-sm italic">No verified skills yet.</p>
                        )}
                    </div>
                </div>

                {/* SOCIALS */}
                {profile.custom_links && profile.custom_links.length > 0 && (
                    <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-lg"><Globe size={20} className="text-indigo-500"/> Connect</h3>
                        <div className="space-y-3">
                            {profile.custom_links.map((link:any, i:number) => (
                                <a key={i} href={link.url} target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{link.label}</span>
                                    <ExternalLink size={16} className="text-slate-400 group-hover:text-indigo-500"/>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* EDUCATION */}
                {profile.education && profile.education.length > 0 && (
                    <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-lg"><GraduationCap size={20} className="text-indigo-500"/> Education</h3>
                        <div className="space-y-4">
                            {profile.education.map((edu:any, i:number) => (
                                <div key={i} className="pl-3 border-l-2 border-slate-200 dark:border-slate-700">
                                    <h4 className="font-bold text-slate-900 dark:text-white">{edu.school}</h4>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{edu.degree}</p>
                                    <p className="text-xs text-slate-400 mt-1">{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* --- RIGHT CONTENT --- */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* ABOUT */}
                <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><User size={20} className="text-indigo-500"/> About Me</h3>
                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {profile.bio || "This user hasn't added a bio yet."}
                    </div>
                </div>

                {/* EXPERIENCE (TIMELINE) */}
                {profile.experience && profile.experience.length > 0 && (
                    <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Briefcase size={20} className="text-indigo-500"/> Experience</h3>
                        <div className="relative border-l-2 border-slate-100 dark:border-slate-700 ml-3 space-y-10">
                            {profile.experience.map((exp:any, i:number) => (
                                <div key={i} className="relative pl-8">
                                    <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-[#111625]"></span>
                                    
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{exp.role}</h3>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-2 mt-1">
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{exp.company}</span>
                                        <span>•</span>
                                        <span>{exp.year}</span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                                        {exp.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PROJECTS (GRID) */}
                {profile.projects && profile.projects.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Code size={20} className="text-indigo-500"/> Featured Projects</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {profile.projects.map((proj:any, i:number) => (
                                <div key={i} className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-xl transition group flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition">
                                            <Zap size={24} />
                                        </div>
                                        {proj.link && (
                                            <a href={proj.link} target="_blank" className="p-2 text-slate-400 hover:text-indigo-600 transition">
                                                <ExternalLink size={18} />
                                            </a>
                                        )}
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition">
                                        {proj.title}
                                    </h4>
                                    <p className="text-xs font-bold uppercase text-slate-400 mb-3">{proj.role}</p>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow">
                                        {proj.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
}
"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { 
  MapPin, Briefcase, GraduationCap, Link as LinkIcon, 
  Download, Mail, CheckCircle, Code, FolderGit, Calendar,
  User, ExternalLink, Trophy, Award, Star, Phone, AtSign, Globe
} from 'lucide-react';
import { notFound } from 'next/navigation';

export default function PublicProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  const [profile, setProfile] = useState<any>(null);
  const [skillRatings, setSkillRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'experience'>('overview');

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    // 1. Fetch Profile Data
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error("Profile not found");
      setLoading(false);
      return;
    }
    setProfile(data);

    // 2. Fetch Skill Ratings
    const { data: skillsData } = await supabase
        .from('user_skills')
        .select('skill_name, proficiency_score')
        .eq('user_id', id);

    const ratingsMap: Record<string, number> = {};
    if (skillsData) {
        skillsData.forEach((s: any) => ratingsMap[s.skill_name] = s.proficiency_score);
    }
    setSkillRatings(ratingsMap);

    setLoading(false);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19]">
        <div className="animate-pulse flex flex-col items-center">
            <div className="h-24 w-24 bg-slate-200 dark:bg-slate-800 rounded-full mb-6"></div>
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
            <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
    </div>
  );

  if (!profile) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* --- HERO HEADER --- */}
        <div className="bg-white dark:bg-[#111625] rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl mb-8 relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />

             <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-10 items-start">
                
                {/* Avatar */}
                <div className="shrink-0 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-1000"></div>
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.full_name} className="relative w-32 h-32 md:w-44 md:h-44 rounded-full object-cover border-4 border-white dark:border-[#111625]" />
                    ) : (
                        <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 border-4 border-white dark:border-[#111625]">
                            <User size={60} />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-5 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                                {profile.full_name || 'Anonymous'}
                            </h1>
                            {profile.username && (
                                <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 mt-1">
                                    <AtSign size={16}/> {profile.username}
                                </p>
                            )}
                            <p className="text-lg text-slate-500 dark:text-slate-400 mt-3 max-w-xl leading-relaxed">
                                {profile.bio ? profile.bio.split('\n')[0] : 'Digital Professional ready to work.'}
                            </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 w-full md:w-auto mt-4 md:mt-0">
                            {/* WhatsApp Button (New) */}
                            {profile.whatsapp && (
                                <a 
                                    href={`https://wa.me/${profile.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition transform hover:-translate-y-1"
                                >
                                    <Phone size={18} fill="currentColor" /> <span className="hidden sm:inline">WhatsApp</span>
                                </a>
                            )}
                            
                            <a href={`mailto:${profile.email || ''}?subject=Hiring Inquiry from HireSkys`} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 transition transform hover:-translate-y-1">
                                <Mail size={18} /> Hire Me
                            </a>

                            {profile.resume_url && (
                                <a href={profile.resume_url} target="_blank" rel="noreferrer" className="px-5 py-3 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold flex items-center justify-center gap-2 transition text-slate-700 dark:text-slate-300">
                                    <Download size={18} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Meta Badges */}
                    <div className="flex flex-wrap gap-3 pt-2">
                        {profile.is_available && (
                            <span className="flex items-center gap-2 px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-bold text-xs uppercase tracking-wide border border-green-200 dark:border-green-800">
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                Available for Work
                            </span>
                        )}
                        {profile.location && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium">
                                <MapPin size={14}/> {profile.location}
                            </span>
                        )}
                        {profile.hourly_rate && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full text-sm font-bold">
                                💵 ${profile.hourly_rate}/hr
                            </span>
                        )}
                    </div>
                </div>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- LEFT SIDEBAR (Skills & Links) --- */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* SKILLS CARD */}
                <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold flex items-center gap-2 mb-5 text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                        <Code size={20} className="text-indigo-500"/> Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills && profile.skills.length > 0 ? (
                            profile.skills.map((skill: string) => {
                                const rating = skillRatings[skill] || 0;
                                const isCertified = rating > 3;

                                return isCertified ? (
                                    // CERTIFIED BADGE (Green)
                                    <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg text-sm font-bold shadow-sm">
                                        <Trophy size={13} className="text-yellow-500 fill-yellow-500" />
                                        {skill}
                                        {rating >= 9 && <span className="ml-1 text-[10px] bg-green-600 text-white px-1 rounded">PRO</span>}
                                    </span>
                                ) : (
                                    // NORMAL BADGE (Gray)
                                    <span key={skill} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium">
                                        {skill}
                                    </span>
                                );
                            })
                        ) : (
                            <p className="text-slate-400 text-sm italic">No skills listed yet.</p>
                        )}
                    </div>
                </div>

                {/* SOCIAL LINKS */}
                {profile.custom_links && profile.custom_links.length > 0 && (
                    <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold flex items-center gap-2 mb-5 text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                            <Globe size={20} className="text-indigo-500"/> Socials
                        </h3>
                        <div className="space-y-3">
                            {profile.custom_links.map((link: any, i: number) => (
                                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800">
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
                        <h3 className="font-bold flex items-center gap-2 mb-5 text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                            <GraduationCap size={20} className="text-indigo-500"/> Education
                        </h3>
                        <div className="space-y-4">
                            {profile.education.map((edu: any, i: number) => (
                                <div key={i} className="pl-3 border-l-2 border-slate-200 dark:border-slate-700">
                                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{edu.school}</h4>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{edu.degree}</p>
                                    <p className="text-xs text-slate-400 mt-1">{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* --- MAIN CONTENT (Tabs) --- */}
            <div className="lg:col-span-8">
                
                {/* TABS HEADER */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto scrollbar-hide">
                    {['overview', 'projects', 'experience'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-4 font-bold capitalize text-sm md:text-base transition border-b-2 whitespace-nowrap ${
                                activeTab === tab 
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* TAB: OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><User size={20} className="text-indigo-500"/> About Me</h3>
                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {profile.bio || "This user hasn't written a bio yet."}
                        </div>
                    </div>
                )}

                {/* TAB: PROJECTS */}
                {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        {profile.projects && profile.projects.length > 0 ? (
                            profile.projects.map((proj: any, i: number) => (
                                <div key={i} className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-lg transition group flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition">
                                            <FolderGit size={24} />
                                        </div>
                                        {proj.link && (
                                            <a href={proj.link} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 transition">
                                                <ExternalLink size={18} />
                                            </a>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition">
                                        {proj.title}
                                    </h3>
                                    <p className="text-xs font-bold uppercase text-slate-400 mb-3">{proj.role}</p>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow">
                                        {proj.desc}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-16 bg-white dark:bg-[#111625] rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <FolderGit className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                <p className="text-slate-500">No projects added yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: EXPERIENCE */}
                {activeTab === 'experience' && (
                    <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in">
                        <div className="relative border-l-2 border-slate-100 dark:border-slate-700 ml-3 space-y-10">
                            {profile.experience && profile.experience.length > 0 ? (
                                profile.experience.map((exp: any, i: number) => (
                                    <div key={i} className="relative pl-8">
                                        {/* Timeline Dot */}
                                        <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-[#111625]"></span>
                                        
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{exp.role}</h3>
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-3 mt-1">
                                            <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded">{exp.company}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1"><Calendar size={12}/> {exp.year}</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                                            {exp.desc}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="pl-8 text-slate-500">No work history listed.</p>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>

      </main>
    </div>
  );
}
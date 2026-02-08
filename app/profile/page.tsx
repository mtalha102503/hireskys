"use client";

/**
 * 💎 PREMIUM PROFILE EDITING SUITE
 * ------------------------------------------------
 * This component handles user profile management with a 
 * High-Fidelity UI inspired by top-tier SaaS platforms.
 * * Logic preserved explicitly for:
 * - Supabase Data Flow
 * - State Management
 * - Array/Object Manipulation
 */

import { useEffect, useState, useRef, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LocationInput from '@/components/LocationInput';
import { CATEGORIES } from '@/lib/categories';
import Link from 'next/link';
import { 
  Save, LogOut, Upload, Plus, Trash2, X, ChevronDown, ChevronUp,
  GraduationCap, Link as LinkIcon, User, MapPin, Briefcase, Code, 
  FolderGit, FileText, CheckCircle, Eye, DollarSign, Heart, ExternalLink,
  Zap, Play, Trophy, AlertTriangle, Star, Award, Mail, Phone, AtSign, 
  Calendar, Globe, Shield, Sparkles, Layout, Layers
} from 'lucide-react';

// --- HELPER COMPONENT: PREMIUM INPUT FIELD ---
const PremiumInput = ({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  disabled = false,
  className = ""
}: any) => (
  <div className={`group relative ${className}`}>
    <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 flex items-center gap-1.5 transition-colors group-focus-within:text-indigo-500">
      {label}
    </label>
    <div className={`
      relative flex items-center bg-white dark:bg-[#0F1218] 
      border border-slate-200 dark:border-slate-800 rounded-xl 
      transition-all duration-300 ease-out
      group-focus-within:border-indigo-500 group-focus-within:ring-4 group-focus-within:ring-indigo-500/10 
      group-hover:border-slate-300 dark:group-hover:border-slate-600
      ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-900' : 'shadow-sm'}
    `}>
      {Icon && (
        <div className="pl-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Icon size={16} />
        </div>
      )}
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        disabled={disabled}
        className={`
          w-full bg-transparent p-3 text-sm font-medium text-slate-900 dark:text-slate-100 
          placeholder:text-slate-400 outline-none
          ${!Icon ? 'pl-3.5' : 'pl-2.5'}
        `}
        placeholder={placeholder} 
      />
    </div>
  </div>
);

// --- HELPER COMPONENT: SECTION HEADER ---
const SectionHeader = ({ title, subtitle, icon: Icon, action }: any) => (
  <div className="flex justify-between items-end mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/50">
    <div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
        {Icon && <span className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400"><Icon size={20}/></span>}
        {title}
      </h2>
      {subtitle && <p className="text-sm text-slate-500 mt-1 pl-[3.25rem]">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // --- STATE MANAGEMENT (LOGIC PRESERVED) ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  // --- UI STATES ---
  const [activeTab, setActiveTab] = useState<'details' | 'portfolio' | 'experience' | 'saved'>('details');
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [skillRatings, setSkillRatings] = useState<Record<string, number>>({}); 

  // --- FORM DATA (STRUCTURE PRESERVED) ---
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    whatsapp: '',
    birth_date: '',
    bio: '',
    location: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    hourly_rate: '',
    avatar_url: '',
    resume_url: '',
    is_available: true,
    skills: [] as string[],
    education: [] as { school: string; degree: string; year: string }[],
    custom_links: [] as { label: string; url: string }[],
    projects: [] as { title: string; desc: string; link: string; role: string }[],
    experience: [] as { company: string; role: string; year: string; desc: string }[]
  });

  // --- EFFECTS (LOGIC PRESERVED) ---
  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['details', 'portfolio', 'experience', 'saved'].includes(tabFromUrl)) {
        setActiveTab(tabFromUrl as any);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === 'saved' && user) {
        fetchSavedJobs();
    }
  }, [activeTab]);

  // --- CORE FUNCTIONS (LOGIC PRESERVED) ---
  async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    setUser(user);

    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    
    if (data || user) {
      let currentUsername = data?.username || user.user_metadata?.username || '';

      if (!currentUsername) {
          const baseName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'user';
          const randomNum = Math.floor(100 + Math.random() * 900);
          
          currentUsername = baseName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '')
            + '_' + randomNum;
      }

      setFormData({
        full_name: data?.full_name || user.user_metadata?.full_name || '',
        username: currentUsername,
        whatsapp: data?.whatsapp || user.user_metadata?.whatsapp || '',
        email: user.email || '', 
        birth_date: data?.birth_date || '',
        bio: data?.bio || '',
        location: data?.location || '',
        city: data?.city || '',
        state: data?.state || '',
        country: data?.country || '',
        postal_code: data?.postal_code || '',
        hourly_rate: data?.hourly_rate || '',
        avatar_url: data?.avatar_url || '',
        resume_url: data?.resume_url || '',
        is_available: data?.is_available ?? true,
        skills: data?.skills || [],
        education: data?.education || [],
        custom_links: data?.custom_links || [],
        projects: data?.projects || [],
        experience: data?.experience || []
      });

      const { data: skillsData } = await supabase
        .from('user_skills')
        .select('skill_name, proficiency_score')
        .eq('user_id', user.id);
      
      const ratingsMap: Record<string, number> = {};
      if (skillsData) {
        skillsData.forEach((s: any) => ratingsMap[s.skill_name] = s.proficiency_score);
      }
      setSkillRatings(ratingsMap);
    }
    setLoading(false);
  }

  const startTest = async (skill: string) => {
    const { error } = await supabase.from('user_skills').upsert({
        user_id: user.id,
        skill_name: skill,
        proficiency_score: 3 
    }, { onConflict: 'user_id, skill_name' });
    if (!error) router.push(`/test/${encodeURIComponent(skill)}`);
  };

  const viewCertificate = (skill: string) => {
      router.push(`/test/${encodeURIComponent(skill)}`); 
  }

  async function fetchSavedJobs() {
      const { data: savedIds } = await supabase.from('saved_jobs').select('job_id').eq('user_id', user.id);
      if (savedIds && savedIds.length > 0) {
          const ids = savedIds.map(item => item.job_id);
          const { data: jobs } = await supabase.from('jobs').select('*').in('id', ids);
          setSavedJobs(jobs || []);
      } else {
          setSavedJobs([]);
      }
  }

  async function unsaveJob(jobId: number) {
      setSavedJobs(savedJobs.filter(job => job.id !== jobId));
      await supabase.from('saved_jobs').delete().match({ user_id: user.id, job_id: jobId });
  }

  const uploadAvatar = async (event: any) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      const fileName = `${user.id}-${Math.random()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('avatars').upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setFormData({ ...formData, avatar_url: data.publicUrl });
    } catch (error) {
      alert('Error uploading image!');
    } finally {
      setUploading(false);
    }
  };

  const uploadResume = async (event: any) => {
    try {
        setResumeUploading(true);
        if (!event.target.files || event.target.files.length === 0) return;
        const file = event.target.files[0];
        const fileName = `resume-${user.id}-${Math.random()}.pdf`;
        const { error } = await supabase.storage.from('avatars').upload(fileName, file); 
        if (error) throw error;
        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        setFormData({ ...formData, resume_url: data.publicUrl });
    } catch (error) {
        alert('Error uploading resume!');
    } finally {
        setResumeUploading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const addItem = (field: 'projects' | 'experience' | 'education' | 'custom_links', item: any) => {
    setFormData({ ...formData, [field]: [...formData[field], item] });
  };
  const removeItem = (field: 'projects' | 'experience' | 'education' | 'custom_links', index: number) => {
    const newArr = [...formData[field]];
    newArr.splice(index, 1);
    setFormData({ ...formData, [field]: newArr });
  };
  const updateItem = (field: 'projects' | 'experience' | 'education' | 'custom_links', index: number, key: string, value: string) => {
    const newArr = [...formData[field]] as any[];
    newArr[index][key] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const updateProfile = async () => {
    setSaving(true);
    setMsg('');
    const { error } = await supabase.from('profiles').update({
        full_name: formData.full_name,
        username: formData.username,
        whatsapp: formData.whatsapp,
        birth_date: formData.birth_date,
        bio: formData.bio,
        location: formData.location,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postal_code: formData.postal_code,
        hourly_rate: formData.hourly_rate,
        avatar_url: formData.avatar_url,
        resume_url: formData.resume_url,
        is_available: formData.is_available,
        skills: formData.skills,
        education: formData.education,
        custom_links: formData.custom_links,
        projects: formData.projects,
        experience: formData.experience,
        updated_at: new Date().toISOString(),
    }).eq('id', user.id);
    setSaving(false);
    if (!error) {
      setMsg('Profile Updated Successfully!');
      setTimeout(() => setMsg(''), 3000);
    } else {
      alert(`Error: ${error.message}`);
    }
  };

  // --- RENDER: LOADING STATE ---
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading Your Studio...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-600">
      <Navbar />

      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 dark:bg-indigo-500/10 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 dark:bg-blue-500/10 mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl relative z-10">
        
        {/* --- 1. HEADER AREA (PREMIUM) --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                    Studio Settings
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                    <Sparkles size={18} className="text-yellow-500"/>
                    Manage your professional presence and portfolio.
                </p>
            </div>
            <div className="flex flex-wrap gap-3">
                <Link 
                    href={`/profile/${user.id}`} 
                    className="
                        group relative overflow-hidden px-6 py-3 bg-white dark:bg-[#151b2d] 
                        border border-slate-200 dark:border-slate-700 rounded-xl 
                        text-slate-700 dark:text-slate-200 font-bold text-sm
                        transition-all hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10
                    "
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <ExternalLink size={18} /> View Public Profile
                    </span>
                </Link>
                
                <button 
                    onClick={async () => { await supabase.auth.signOut(); router.push('/'); }} 
                    className="
                        px-6 py-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30
                        text-red-600 dark:text-red-400 rounded-xl font-bold text-sm
                        hover:bg-red-100 dark:hover:bg-red-900/20 transition-all flex items-center gap-2
                    "
                >
                    <LogOut size={18}/> Sign Out
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* --- 2. LEFT SIDEBAR (STICKY & POWERFUL) --- */}
            <div className="lg:col-span-4 space-y-8">
                
                {/* IDENTITY CARD */}
                <div className="
                    bg-white dark:bg-[#111625] rounded-3xl p-8 
                    border border-slate-200/60 dark:border-slate-800 
                    shadow-xl shadow-slate-200/40 dark:shadow-black/20
                    relative overflow-hidden
                ">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                    
                    {/* AVATAR UPLOADER */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group mb-4">
                            <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 shadow-inner">
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-white dark:border-[#111625] shadow-sm" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-slate-100 dark:bg-[#0B0F19] flex items-center justify-center text-slate-300 dark:text-slate-600">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>
                            
                            {/* Upload Button Overlay */}
                            <label className="
                                absolute bottom-1 right-1 bg-indigo-600 text-white p-3 rounded-full 
                                shadow-lg shadow-indigo-600/30 cursor-pointer 
                                transition-all transform hover:scale-110 hover:rotate-12 hover:bg-indigo-500
                            ">
                                <Upload size={18} />
                                <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} disabled={uploading} />
                            </label>
                        </div>

                        {/* Status Toggle */}
                        <div className="bg-slate-50 dark:bg-[#0F1218] p-1.5 rounded-full border border-slate-200 dark:border-slate-800 flex items-center gap-3 pr-4">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all
                                ${formData.is_available ? 'bg-green-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500'}
                            `}>
                                {formData.is_available ? <CheckCircle size={16} /> : <X size={16} />}
                            </div>
                            <label className="flex items-center cursor-pointer select-none">
                                <span className={`text-xs font-bold uppercase tracking-wide mr-2 ${formData.is_available ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                                    {formData.is_available ? 'Available' : 'Unavailable'}
                                </span>
                                <input 
                                    type="checkbox" 
                                    checked={formData.is_available} 
                                    onChange={(e) => setFormData({...formData, is_available: e.target.checked})} 
                                    className="hidden" 
                                />
                            </label>
                        </div>
                    </div>

                    {/* BASIC INFO FIELDS */}
                    <div className="space-y-5">
                        <PremiumInput 
                            label="Full Name" 
                            icon={User} 
                            value={formData.full_name} 
                            onChange={(e: any) => setFormData({...formData, full_name: e.target.value})} 
                            placeholder="e.g. Sarah Connor" 
                        />
                        
                        <PremiumInput 
                            label="Username" 
                            icon={AtSign} 
                            value={formData.username} 
                            onChange={(e: any) => setFormData({...formData, username: e.target.value})} 
                            placeholder="username" 
                            className="lowercase"
                        />

                        <PremiumInput 
                            label="Email Address" 
                            icon={Mail} 
                            value={formData.email} 
                            disabled={true} 
                        />

                        <PremiumInput 
                            label="WhatsApp" 
                            icon={Phone} 
                            value={formData.whatsapp} 
                            onChange={(e: any) => setFormData({...formData, whatsapp: e.target.value})} 
                            placeholder="+1 234 567 890" 
                        />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
    <PremiumInput 
        label="Date of Birth" 
        type="date"
        value={formData.birth_date} 
        onChange={(e: any) => setFormData({...formData, birth_date: e.target.value})} 
    />
    <PremiumInput 
        label="Hourly ($)" 
        icon={DollarSign}
        value={formData.hourly_rate} 
        onChange={(e: any) => setFormData({...formData, hourly_rate: e.target.value})} 
        placeholder="50" 
    />
</div>
                    </div>

                    {/* ADDRESS SECTION */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-3 flex items-center gap-2">
                           <MapPin size={12}/> Location Details
                        </label>
                        
                        <div className="mb-4 relative z-20">
                            <LocationInput 
                                defaultValue={formData.location}
                                onLocationSelect={(data: any) => {
                                    setFormData({
                                        ...formData,
                                        location: data.display,
                                        city: data.city,
                                        state: data.state,
                                        country: data.country,
                                        postal_code: data.postal_code
                                    });
                                }} 
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <PremiumInput value={formData.city} placeholder="City" onChange={(e: any) => setFormData({...formData, city: e.target.value})} />
    <PremiumInput value={formData.country} placeholder="Country" onChange={(e: any) => setFormData({...formData, country: e.target.value})} />
</div>
                    </div>
                </div>

                {/* RESUME CARD */}
                <div className="bg-white dark:bg-[#111625] rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText size={80} className="text-indigo-500 transform rotate-12"/>
                    </div>
                    
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                        <FileText size={20} className="text-indigo-500"/> Resume / CV
                    </h3>
                    
                    {formData.resume_url ? (
                        <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">Resume Uploaded</p>
                                    <p className="text-xs text-indigo-600/70 dark:text-indigo-300/70">Ready for employers</p>
                                </div>
                            </div>
                            <button onClick={() => setFormData({...formData, resume_url: ''})} className="p-2 hover:bg-white/50 rounded-full text-red-500 transition">
                                <Trash2 size={18}/>
                            </button>
                        </div>
                    ) : (
                        <label className="
                            flex flex-col items-center justify-center w-full h-32 
                            border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl 
                            cursor-pointer hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 
                            transition-all group-hover:shadow-inner
                        ">
                            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                                <Upload size={20}/>
                            </div>
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                {resumeUploading ? "Processing..." : "Drop PDF here or Browse"}
                            </span>
                            <input type="file" accept=".pdf" className="hidden" onChange={uploadResume} disabled={resumeUploading} />
                        </label>
                    )}
                </div>

                {/* STICKY SAVE BUTTON */}
                <div className="sticky top-24 z-30">
                    <button 
                        onClick={updateProfile} 
                        disabled={saving} 
                        className="
                            w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 
                            hover:from-indigo-700 hover:to-violet-700 
                            text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 
                            transition-all transform hover:scale-[1.02] active:scale-[0.98]
                            flex items-center justify-center gap-2
                            disabled:opacity-70 disabled:cursor-not-allowed
                        "
                    >
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={20}/> Save Changes
                            </>
                        )}
                    </button>
                </div>

            </div>

            {/* --- 3. RIGHT CONTENT AREA (TABS & CONTENT) --- */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* MODERN TAB NAVIGATION */}
                <div className="sticky top-0 z-20 bg-[#F8FAFC]/90 dark:bg-[#0B0F19]/90 backdrop-blur-md pt-2 pb-2">
                    <div className="flex p-1.5 bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
                        {['details', 'portfolio', 'experience', 'saved'].map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`
                                        flex-1 px-6 py-3 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all
                                        flex items-center justify-center gap-2
                                        ${isActive 
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                        }
                                    `}
                                >
                                    {tab === 'details' && <Layout size={16} />}
                                    {tab === 'portfolio' && <FolderGit size={16} />}
                                    {tab === 'experience' && <Briefcase size={16} />}
                                    {tab === 'saved' && <Heart size={16} className={isActive ? 'fill-current' : ''}/>} 
                                    {tab === 'saved' ? 'Saved Jobs' : tab}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* --- TAB CONTENT: DETAILS --- */}
                {activeTab === 'details' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* BIO SECTION */}
                        <div className="bg-white dark:bg-[#111625] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <SectionHeader title="Professional Bio" subtitle="Your elevator pitch to the world." icon={Sparkles} />
                            <div className="relative">
                                <textarea 
                                    rows={6} 
                                    value={formData.bio} 
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                                    className="
                                        w-full p-5 rounded-2xl bg-slate-50 dark:bg-[#0F1218] 
                                        border border-slate-200 dark:border-slate-800 
                                        outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                                        text-slate-700 dark:text-slate-200 leading-relaxed
                                        transition-all resize-y
                                    "
                                    placeholder="I am a passionate developer with 5+ years of experience in..." 
                                />
                                <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-400 bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md backdrop-blur">
                                    {formData.bio.length} chars
                                </div>
                            </div>
                        </div>

                        {/* EDUCATION SECTION */}
                        <div className="bg-white dark:bg-[#111625] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <SectionHeader 
                                title="Education History" 
                                icon={GraduationCap} 
                                action={
                                    <button onClick={() => addItem('education', { school: '', degree: '', year: '' })} className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1">
                                        <Plus size={16}/> Add School
                                    </button>
                                }
                            />
                            
                            <div className="space-y-4">
                                {formData.education.map((edu, i) => (
                                    <div key={i} className="group relative p-6 bg-slate-50 dark:bg-[#0F1218] rounded-2xl border border-slate-200 dark:border-slate-800 transition-all hover:border-indigo-300 dark:hover:border-indigo-800">
                                        <button onClick={() => removeItem('education', i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition"><Trash2 size={16}/></button>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            <div className="md:col-span-6">
                                                <PremiumInput 
                                                    label="School / University" 
                                                    value={edu.school} 
                                                    onChange={(e: any) => updateItem('education', i, 'school', e.target.value)}
                                                    className="bg-white dark:bg-black"
                                                />
                                            </div>
                                            <div className="md:col-span-4">
                                                <PremiumInput 
                                                    label="Degree" 
                                                    value={edu.degree} 
                                                    onChange={(e: any) => updateItem('education', i, 'degree', e.target.value)}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <PremiumInput 
                                                    label="Year" 
                                                    value={edu.year} 
                                                    onChange={(e: any) => updateItem('education', i, 'year', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {formData.education.length === 0 && (
                                    <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400">
                                        <GraduationCap size={32} className="mx-auto mb-2 opacity-50"/>
                                        <p className="text-sm">No education added yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* UNIFIED SKILLS & CERTIFICATES HUB (Merged & Fixed) */}
                        <div className="bg-white dark:bg-[#111625] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                             
                             <SectionHeader 
                                title="Skills & Achievements" 
                                subtitle="Manage your expertise, take assessments, and earn badges."
                                icon={Trophy} 
                             />

                             {/* ACTIVE SKILLS LIST (Cards) */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                                {formData.skills.length === 0 && (
                                    <div className="col-span-2 text-center py-12 bg-slate-50 dark:bg-[#0F1218] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                        <Award size={40} className="mx-auto text-slate-300 mb-3"/>
                                        <h3 className="text-slate-900 dark:text-white font-bold">No Skills Added</h3>
                                        <p className="text-slate-500 text-sm">Select from the categories below to showcase your talent.</p>
                                    </div>
                                )}
                                
                                {formData.skills.map(skill => {
                                    const rating = skillRatings[skill] || 0;
                                    const isResume = rating === 3;
                                    const isCertified = rating > 3;

                                    return (
                                        <div key={skill} className={`
                                            group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg
                                            ${isCertified 
                                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800' 
                                                : isResume
                                                    ? 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border-yellow-200 dark:border-yellow-800'
                                                    : 'bg-white dark:bg-[#151b2d] border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                                            }
                                        `}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                                        {skill}
                                                        {isCertified && <CheckCircle size={16} className="text-green-500 fill-current"/>}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`
                                                            text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                                                            ${isCertified ? 'bg-green-200 text-green-800' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}
                                                        `}>
                                                            {isCertified ? 'Verified' : 'Pending'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button onClick={() => toggleSkill(skill)} className="text-slate-300 hover:text-red-500 p-1 rounded-md hover:bg-white/50 transition"><X size={18}/></button>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-4">
                                                {isCertified ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 bg-white/80 dark:bg-black/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 py-2.5 px-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm">
                                                            <Award size={16}/> {rating}/10
                                                        </div>
                                                        <button onClick={() => viewCertificate(skill)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-3 rounded-xl text-sm font-bold shadow-md shadow-green-500/20 transition flex items-center justify-center gap-2">
                                                            <Eye size={16}/> View
                                                        </button>
                                                    </div>
                                                ) : isResume ? (
                                                    <button onClick={() => startTest(skill)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-yellow-500/20 transition flex items-center justify-center gap-2">
                                                        <Play size={18} fill="currentColor" /> Resume Assessment
                                                    </button>
                                                ) : (
                                                    <button onClick={() => startTest(skill)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2 group-hover:scale-[1.02]">
                                                        <Zap size={18} fill="currentColor" /> Take Skill Test
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                             </div>

                             {/* CATEGORY SELECTOR (Modern) */}
                             <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Browse Skills Directory</h4>
                                
                                <div className="flex flex-wrap gap-2.5 mb-6">
                                    {Object.entries(CATEGORIES).map(([catName, catData]: [string, any]) => {
                                        const isActive = openCategory === catName;
                                        const Icon = catData.icon;
                                        return (
                                            <button 
                                                key={catName}
                                                onClick={() => setOpenCategory(isActive ? null : catName)}
                                                className={`
                                                    flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border
                                                    ${isActive 
                                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg transform scale-105' 
                                                        : 'bg-white dark:bg-[#151b2d] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-500'
                                                    }
                                                `}
                                            >
                                                {Icon && <Icon size={14} />} 
                                                {catName}
                                            </button>
                                        );
                                    })}
                                </div>

                                {openCategory && (
                                    <div className="bg-slate-50 dark:bg-[#0F1218] p-6 rounded-2xl border border-indigo-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
                                        <div className="flex justify-between items-center mb-4">
                                            <h5 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                                <span className="text-indigo-500">Add</span> {openCategory} Skills
                                            </h5>
                                            <button onClick={() => setOpenCategory(null)} className="text-xs text-slate-400 hover:text-slate-600"><X size={14}/></button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {((CATEGORIES as any)[openCategory]?.sub || []).map((skill: string) => {
                                                const isSelected = formData.skills.includes(skill);
                                                return (
                                                    <button 
                                                        key={skill} 
                                                        onClick={() => toggleSkill(skill)}
                                                        disabled={isSelected}
                                                        className={`
                                                            px-4 py-2 text-sm rounded-lg border transition-all flex items-center gap-2 font-medium
                                                            ${isSelected
                                                                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 cursor-default'
                                                                : 'bg-white dark:bg-[#151b2d] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-md'
                                                            }
                                                        `}
                                                    >
                                                        {skill}
                                                        {isSelected && <CheckCircle size={14} className="fill-current"/>}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                             </div>
                        </div>

                    </div>
                )}

                {/* --- TAB CONTENT: PORTFOLIO --- */}
                {activeTab === 'portfolio' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white dark:bg-[#111625] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <SectionHeader 
                                title="Project Portfolio" 
                                subtitle="Showcase your best work. Add live links or GitHub repos." 
                                icon={FolderGit}
                                action={
                                    <button onClick={() => addItem('projects', { title: '', desc: '', link: '', role: '' })} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition">
                                        <Plus size={16}/> New Project
                                    </button>
                                }
                            />

                            <div className="grid grid-cols-1 gap-6">
                                {formData.projects.map((proj, i) => (
                                    <div key={i} className="group p-6 bg-slate-50 dark:bg-[#0F1218] rounded-2xl border border-slate-200 dark:border-slate-800 transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 relative">
                                        <button onClick={() => removeItem('projects', i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
                                        
                                        <div className="space-y-4">
                                            <input 
                                                type="text" 
                                                placeholder="Project Title" 
                                                value={proj.title} 
                                                onChange={(e) => updateItem('projects', i, 'title', e.target.value)} 
                                                className="w-full bg-transparent text-xl font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none border-b border-transparent focus:border-indigo-500 transition-colors" 
                                            />
                                            
                                            <textarea 
                                                rows={2} 
                                                placeholder="Describe what you built..." 
                                                value={proj.desc} 
                                                onChange={(e) => updateItem('projects', i, 'desc', e.target.value)} 
                                                className="w-full bg-white dark:bg-[#151b2d] p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-indigo-500 transition-colors" 
                                            />
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <PremiumInput 
        label="Your Role" 
        icon={User}
        value={proj.role} 
        onChange={(e: any) => updateItem('projects', i, 'role', e.target.value)}
        className="bg-white dark:bg-black"
    />
    <PremiumInput 
        label="Project Link" 
        icon={LinkIcon}
        value={proj.link} 
        onChange={(e: any) => updateItem('projects', i, 'link', e.target.value)}
    />
</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB CONTENT: EXPERIENCE --- */}
                {activeTab === 'experience' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white dark:bg-[#111625] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <SectionHeader 
                                title="Work Experience" 
                                subtitle="Your career timeline and roles." 
                                icon={Briefcase}
                                action={
                                    <button onClick={() => addItem('experience', { company: '', role: '', year: '', desc: '' })} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition">
                                        <Plus size={16}/> Add Role
                                    </button>
                                }
                            />

                            {/* TIMELINE VIEW */}
                            <div className="space-y-8 pl-4 relative border-l-2 border-slate-200 dark:border-slate-800 ml-4">
                                {formData.experience.map((exp, i) => (
                                    <div key={i} className="relative pl-8">
                                        {/* Timeline Dot */}
                                        <div className="absolute top-6 -left-[9px] w-4 h-4 rounded-full bg-indigo-600 border-4 border-white dark:border-[#111625]" />
                                        
                                        <div className="group p-6 bg-slate-50 dark:bg-[#0F1218] rounded-2xl border border-slate-200 dark:border-slate-800 transition-all hover:border-indigo-500/30 hover:shadow-lg relative">
                                            <button onClick={() => removeItem('experience', i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition"><Trash2 size={18}/></button>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <PremiumInput 
                                                    label="Company Name" 
                                                    value={exp.company} 
                                                    onChange={(e: any) => updateItem('experience', i, 'company', e.target.value)}
                                                    className="font-bold"
                                                />
                                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
    <div className="w-full sm:flex-1">
        <PremiumInput 
            label="Job Title" 
            value={exp.role} 
            onChange={(e: any) => updateItem('experience', i, 'role', e.target.value)}
            className="w-full"
        />
    </div>
    <div className="w-full sm:w-32">
        <PremiumInput 
            label="Year(s)" 
            value={exp.year} 
            onChange={(e: any) => updateItem('experience', i, 'year', e.target.value)}
        />
    </div>
</div>
                                            </div>
                                            <textarea 
                                                rows={3} 
                                                placeholder="Key responsibilities and achievements..." 
                                                value={exp.desc} 
                                                onChange={(e) => updateItem('experience', i, 'desc', e.target.value)} 
                                                className="w-full bg-white dark:bg-[#151b2d] p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-indigo-500 transition-colors" 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CUSTOM LINKS */}
                        <div className="bg-white dark:bg-[#111625] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                             <SectionHeader 
                                title="Social & External Links" 
                                icon={Globe} 
                                action={
                                    <button onClick={() => addItem('custom_links', { label: '', url: '' })} className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"><Plus size={18}/></button>
                                }
                             />
                             <div className="space-y-4">
                                {formData.custom_links.map((link, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row gap-3 items-end bg-slate-50 dark:bg-[#0F1218] p-3 rounded-xl border border-slate-100 dark:border-slate-800">
    <div className="w-full sm:w-1/3">
        <PremiumInput value={link.label} placeholder="Label (e.g. GitHub)" onChange={(e: any) => updateItem('custom_links', i, 'label', e.target.value)} />
    </div>
    <div className="w-full sm:w-2/3 flex gap-2 items-end">
        <div className="flex-1">
            <PremiumInput value={link.url} placeholder="https://..." icon={LinkIcon} onChange={(e: any) => updateItem('custom_links', i, 'url', e.target.value)} />
        </div>
        <button onClick={() => removeItem('custom_links', i)} className="mb-[3px] p-3 text-slate-400 hover:text-red-500 transition bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
            <Trash2 size={18}/>
        </button>
    </div>
</div>
                                ))}
                             </div>
                         </div>
                    </div>
                )}

                {/* --- TAB CONTENT: SAVED JOBS --- */}
                {activeTab === 'saved' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SectionHeader title="Saved Opportunities" subtitle="Jobs you have bookmarked for later." icon={Heart} />
                        
                        {savedJobs.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-[#111625] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Heart className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No jobs saved yet</h3>
                                <p className="text-slate-500 font-medium mb-6">Go back to the feed and find your next role.</p>
                                <Link href="/" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-1">
                                    Browse Jobs
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {savedJobs.map((job) => (
                                    <div key={job.id} className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group relative">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-slate-50 dark:bg-[#0F1218] rounded-xl">
                                                <Briefcase size={24} className="text-indigo-600"/>
                                            </div>
                                            <button onClick={() => unsaveJob(job.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition">
                                                <Heart size={20} className="fill-current"/>
                                            </button>
                                        </div>
                                        
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{job.title}</h3>
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                                            <span>{job.category}</span>
                                            <span>•</span>
                                            <span>{job.source}</span>
                                        </div>
                                        
                                        <a href={job.link} target="_blank" rel="noopener noreferrer" className="block w-full py-2.5 text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:opacity-90 transition">
                                            Apply Now
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>

        {/* TOAST NOTIFICATION (Premium) */}
        {msg && (
            <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
                    <div className="bg-green-500 rounded-full p-1">
                        <CheckCircle size={16} className="text-white"/>
                    </div>
                    <div>
                        <p className="font-bold text-sm">Success</p>
                        <p className="text-xs opacity-90">{msg}</p>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B0F19]">
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    }>
       <ProfileContent />
    </Suspense>
  );
}

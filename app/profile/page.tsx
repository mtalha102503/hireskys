"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LocationInput from '@/components/LocationInput';
import { 
  Save, LogOut, Upload, Plus, Trash2, X, ChevronDown, ChevronUp,
  GraduationCap, Link as LinkIcon, User, MapPin, Briefcase, Code, 
  FolderGit, FileText, CheckCircle, Eye, DollarSign, Heart, ExternalLink,
  Zap, Play, Trophy, AlertTriangle, Star, Award, Mail, Phone, AtSign, Calendar
} from 'lucide-react';
import Link from 'next/link';

// --- CATEGORIES LIST ---
const CATEGORIES = {
  "Development": ["React", "Next.js", "Node.js", "Python", "Shopify", "WordPress", "Web3", "Frontend", "Backend"],
  "Mobile App": ["React Native", "Flutter", "iOS", "Swift", "Android", "Kotlin"],
  "Video & Motion": ["Video Editor", "Premiere Pro", "After Effects", "3D Artist", "Thumbnail Artist", "Short Form"],
  "Design & UI": ["UI/UX", "Figma", "Web Design", "Logo Design", "Graphic Design"],
  "Marketing": ["SEO", "Facebook Ads", "Google Ads", "Email Marketing", "Copywriter", "Growth"],
  "Writing": ["Ghostwriter", "Technical Writer", "Scriptwriter", "Content Writer"],
  "New Era (AI)": ["AI Engineer", "Automation", "LLM", "Python Script"]
};

export default function Profile() {
  const router = useRouter();
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

  // --- FORM DATA ---
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',    // 👈 Added
    email: '',       // 👈 Added
    whatsapp: '',    // 👈 Added
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

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'saved' && user) {
        fetchSavedJobs();
    }
  }, [activeTab]);

  async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    setUser(user);

    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    
    // 👇 SMART DATA FETCHING (Table OR Metadata)
    if (data || user) {
      
      // 🌟 LOGIC START: Username Auto-Generation
      let currentUsername = data?.username || user.user_metadata?.username || '';

      // Agar Username khali hai (Naya Google User), to khud banao
      if (!currentUsername) {
          const baseName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'user';
          const randomNum = Math.floor(100 + Math.random() * 900); // 3 digit random
          
          currentUsername = baseName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '_')       // Spaces ko underscore banao
            .replace(/[^a-z0-9_]/g, '') // Special chars hatao
            + '_' + randomNum;
      }
      // 🌟 LOGIC END

      setFormData({
        // Pehle Table check karo, agar khali hai to Auth Metadata se uthao
        full_name: data?.full_name || user.user_metadata?.full_name || '',
        
        username: currentUsername, // 👈 Yahan wo generated variable use kiya
        
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
  // ... (Test Logic Functions same as before) ...
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
        whatsapp: formData.whatsapp, // Save whatsapp to DB
        birth_date: formData.birth_date, // 👈 Ye Line Add karo
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19]">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-extrabold">Professional Profile</h1>
                <p className="text-slate-500">Manage your public presence and portfolio.</p>
            </div>
            <div className="flex gap-3">
                <Link href={`/profile/${user.id}`} className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition">
                    <Eye size={18} /> View Public
                </Link>
                <button onClick={async () => { await supabase.auth.signOut(); router.push('/'); }} className="px-4 py-2 text-red-500 border border-red-200 bg-red-50 dark:bg-red-900/10 rounded-lg hover:bg-red-100 transition flex items-center gap-2">
                    <LogOut size={18}/> Sign Out
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- LEFT SIDEBAR --- */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* 1. IDENTITY CARD */}
                <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                    {/* AVATAR Section Same as before */}
                    <div className="relative inline-block mb-4">
                        {formData.avatar_url ? (
                            <img src={formData.avatar_url} alt="Profile" className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md" />
                        ) : (
                            <div className="h-32 w-32 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-4xl text-slate-400">
                                <User size={40} />
                            </div>
                        )}
                        <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 text-white shadow-lg transition transform hover:scale-110">
                            <Upload size={16} />
                            <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} disabled={uploading} />
                        </label>
                    </div>
                    
                    <div className="mb-4">
                        <label className="inline-flex items-center cursor-pointer gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
                            <input type="checkbox" checked={formData.is_available} onChange={(e) => setFormData({...formData, is_available: e.target.checked})} className="accent-green-600 w-4 h-4" />
                            <span className="text-sm font-bold text-green-700 dark:text-green-400">Open to Work</span>
                        </label>
                    </div>

                    <div className="space-y-3 text-left">
                        {/* FULL NAME */}
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400">Full Name</label>
                            <input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none" placeholder="e.g. John Doe" />
                        </div>
                        
                        {/* USERNAME (Added) */}
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400">Username</label>
                            <div className="relative">
                                <AtSign size={14} className="absolute left-3 top-3 text-slate-400"/>
                                <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full mt-1 pl-8 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none lowercase" placeholder="username" />
                            </div>
                        </div>

                        {/* EMAIL (Read Only usually) */}
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400">Email Address</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-3 text-slate-400"/>
                                <input type="text" value={formData.email} disabled className="w-full mt-1 pl-8 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-500 cursor-not-allowed" />
                            </div>
                        </div>

                        {/* WHATSAPP (Added) */}
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400">WhatsApp</label>
                            <div className="relative">
                                <Phone size={14} className="absolute left-3 top-3 text-slate-400"/>
                                <input type="text" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full mt-1 pl-8 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none" placeholder="+92..." />
                            </div>
                        </div>
{/* BIRTH DATE FIELD */}
<div>
    <label className="text-xs font-bold uppercase text-slate-400">Date of Birth</label>
    <div className="relative">
        <Calendar size={14} className="absolute left-3 top-3 text-slate-400"/>
        <input 
            type="date" 
            value={formData.birth_date} 
            onChange={(e) => setFormData({...formData, birth_date: e.target.value})} 
            className="w-full mt-1 pl-8 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300" 
        />
    </div>
</div>
                        {/* HOURLY RATE */}
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400">Hourly Rate ($)</label>
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-3 top-3 text-slate-400"/>
                                <input type="text" value={formData.hourly_rate} onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})} className="w-full mt-1 pl-8 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none" placeholder="e.g. 50" />
                            </div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Address Details</label>
                            <div className="mb-3">
                                <label className="text-[10px] text-slate-500">Search City (Auto-fill)</label>
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
                            {/* Address Grid Same as before */}
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-[10px] text-slate-500">City</label><input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-2 text-sm rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-slate-800" /></div>
                                <div><label className="text-[10px] text-slate-500">Country</label><input type="text" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full p-2 text-sm rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-slate-800" /></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. RESUME CARD */}
                <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold flex items-center gap-2 mb-4"><FileText size={18} className="text-indigo-500"/> Resume / CV</h3>
                    {formData.resume_url ? (
                        <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                            <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium truncate w-40">Resume Uploaded</span>
                            <button onClick={() => setFormData({...formData, resume_url: ''})} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                        </div>
                    ) : (
                        <label className="block w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center cursor-pointer hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                            <Upload size={24} className="mx-auto text-slate-400 mb-2"/>
                            <span className="text-sm text-slate-500">{resumeUploading ? "Uploading..." : "Upload PDF Resume"}</span>
                            <input type="file" accept=".pdf" className="hidden" onChange={uploadResume} disabled={resumeUploading} />
                        </label>
                    )}
                </div>

                {/* 3. SAVE BUTTON (Sticky) */}
                <button onClick={updateProfile} disabled={saving} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-2 sticky top-24">
                    {saving ? 'Saving...' : <><Save size={18}/> Save Changes</>}
                </button>

            </div>

            {/* --- RIGHT CONTENT AREA (Details, Portfolio etc) --- */}
            {/* ... Right Content is same as previous, no logic change needed there ... */}
            <div className="lg:col-span-8 space-y-6">
                {/* TABS NAVIGATION */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4 overflow-x-auto">
                    {['details', 'portfolio', 'experience', 'saved'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 font-bold capitalize whitespace-nowrap border-b-2 transition flex items-center gap-2 ${
                                activeTab === tab 
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                            }`}
                        >
                            {tab === 'saved' && <Heart size={16} className={activeTab === 'saved' ? 'fill-current' : ''}/>} 
                            {tab === 'saved' ? 'Saved Jobs' : tab}
                        </button>
                    ))}
                </div>

                {/* TAB 1: DETAILS */}
                {activeTab === 'details' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* BIO */}
                        <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <label className="font-bold mb-2 block">Professional Bio</label>
                            <textarea rows={5} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Tell clients about your expertise, years of experience, and what you bring to the table..." />
                        </div>

                        {/* SKILLS SECTION (NEW CARD LAYOUT) */}
                        <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                             <div className="flex justify-between items-center mb-6">
                                <h2 className="font-bold flex items-center gap-2 text-xl"><Trophy size={20} className="text-yellow-500"/> Skill Achievements</h2>
                                <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">Get Verified Badge</span>
                             </div>

                             {/* --- ACTIVE SKILLS GRID --- */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {formData.skills.length === 0 && <p className="text-slate-400 text-sm italic col-span-2 text-center py-4">No skills added yet. Add from below to take assessments.</p>}
                                
                                {formData.skills.map(skill => {
                                    const rating = skillRatings[skill] || 0;
                                    const isResume = rating === 3;
                                    const isCertified = rating > 3;

                                    return (
                                        <div key={skill} className={`relative p-5 rounded-2xl border-2 transition-all group ${
                                            isCertified 
                                            ? 'border-green-500/30 bg-green-50/50 dark:bg-green-900/10' 
                                            : isResume
                                                ? 'border-yellow-500/30 bg-yellow-50/50 dark:bg-yellow-900/10'
                                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#151b2d] hover:border-indigo-500/50'
                                        }`}>
                                            {/* Header */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{skill}</h3>
                                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">
                                                        {isCertified ? 'Verified Expert' : isResume ? 'In Progress' : 'Unverified'}
                                                    </p>
                                                </div>
                                                <button onClick={() => toggleSkill(skill)} className="text-slate-300 hover:text-red-500 transition"><X size={18}/></button>
                                            </div>

                                            {/* Action Area */}
                                            {isCertified ? (
                                                // CERTIFIED STATE
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm">
                                                        <Award size={16}/> {rating}/10 Score
                                                    </div>
                                                    <button onClick={() => viewCertificate(skill)} className="flex-1 bg-white dark:bg-black border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 py-2 px-3 rounded-lg text-sm font-bold hover:bg-green-50 dark:hover:bg-green-900/30 transition flex items-center justify-center gap-2">
                                                        <Eye size={16}/> Certificate
                                                    </button>
                                                </div>
                                            ) : isResume ? (
                                                // RESUME STATE
                                                <button 
                                                    onClick={() => startTest(skill)}
                                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 rounded-lg text-sm font-bold shadow-sm transition flex items-center justify-center gap-2"
                                                >
                                                    <Play size={16} fill="currentColor" /> Resume Assessment
                                                </button>
                                            ) : (
                                                // START STATE
                                                <button 
                                                    onClick={() => startTest(skill)}
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                                                >
                                                    <Zap size={16} fill="currentColor" /> Take Assessment
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                             </div>

                             {/* --- ADD SKILLS ACCORDION --- */}
                             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Add More Skills</h3>
                             <div className="space-y-2">
                                {Object.entries(CATEGORIES).map(([catName, skills]) => (
                                    <div key={catName} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                            <button onClick={() => setOpenCategory(openCategory === catName ? null : catName)} className="w-full flex justify-between p-3 text-sm font-bold bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                                {catName} {openCategory === catName ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                            </button>
                                            {openCategory === catName && (
                                                <div className="p-3 flex flex-wrap gap-2 bg-white dark:bg-[#111625]">
                                                        {skills.map(skill => (
                                                            <button 
                                                                key={skill} 
                                                                onClick={() => toggleSkill(skill)} 
                                                                disabled={formData.skills.includes(skill)}
                                                                className={`px-3 py-1 text-xs rounded-full border transition ${
                                                                    formData.skills.includes(skill) 
                                                                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                                                                    : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700'
                                                                }`}
                                                            >
                                                                {skill} {formData.skills.includes(skill) && "✓"}
                                                            </button>
                                                        ))}
                                                </div>
                                            )}
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* EDUCATION */}
                        <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold flex items-center gap-2"><GraduationCap size={18} className="text-indigo-500"/> Education</h2>
                                <button onClick={() => addItem('education', { school: '', degree: '', year: '' })} className="text-sm font-bold text-indigo-600">+ Add</button>
                            </div>
                            {formData.education.map((edu, i) => (
                                <div key={i} className="mb-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 relative">
                                    <button onClick={() => removeItem('education', i)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><X size={14}/></button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <input type="text" placeholder="School" value={edu.school} onChange={(e) => updateItem('education', i, 'school', e.target.value)} className="p-2 bg-white dark:bg-black rounded border border-slate-200 dark:border-slate-700 outline-none text-sm" />
                                            <div className="flex gap-2">
                                                <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateItem('education', i, 'degree', e.target.value)} className="flex-1 p-2 bg-white dark:bg-black rounded border border-slate-200 dark:border-slate-700 outline-none text-sm" />
                                                <input type="text" placeholder="Year" value={edu.year} onChange={(e) => updateItem('education', i, 'year', e.target.value)} className="w-20 p-2 bg-white dark:bg-black rounded border border-slate-200 dark:border-slate-700 outline-none text-sm" />
                                            </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 2: PORTFOLIO */}
                {activeTab === 'portfolio' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2"><FolderGit className="text-indigo-500"/> Projects</h2>
                                    <p className="text-sm text-slate-500">Showcase your best work. Add links to live sites or GitHub.</p>
                                </div>
                                <button onClick={() => addItem('projects', { title: '', desc: '', link: '', role: '' })} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold flex items-center gap-2">
                                    <Plus size={16}/> Add Project
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.projects.map((proj, i) => (
                                    <div key={i} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 relative">
                                            <button onClick={() => removeItem('projects', i)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>
                                            
                                            <div className="space-y-3 pr-8">
                                                <input type="text" placeholder="Project Title" value={proj.title} onChange={(e) => updateItem('projects', i, 'title', e.target.value)} className="w-full p-2 font-bold bg-white dark:bg-black rounded border border-slate-200 dark:border-slate-700 outline-none" />
                                                <textarea rows={2} placeholder="Description" value={proj.desc} onChange={(e) => updateItem('projects', i, 'desc', e.target.value)} className="w-full p-2 text-sm bg-white dark:bg-black rounded border border-slate-200 dark:border-slate-700 outline-none" />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input type="text" placeholder="Your Role" value={proj.role} onChange={(e) => updateItem('projects', i, 'role', e.target.value)} className="p-2 text-sm bg-white dark:bg-black rounded border border-slate-200 dark:border-slate-700 outline-none" />
                                                    <input type="text" placeholder="Link" value={proj.link} onChange={(e) => updateItem('projects', i, 'link', e.target.value)} className="p-2 text-sm bg-white dark:bg-black rounded border border-slate-200 dark:border-slate-700 outline-none" />
                                                </div>
                                            </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: EXPERIENCE */}
                {activeTab === 'experience' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                             <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2"><Briefcase className="text-indigo-500"/> Work Experience</h2>
                                    <p className="text-sm text-slate-500">Your past roles and employment history.</p>
                                </div>
                                <button onClick={() => addItem('experience', { company: '', role: '', year: '', desc: '' })} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold flex items-center gap-2">
                                    <Plus size={16}/> Add Role
                                </button>
                             </div>

                             <div className="space-y-4">
                                {formData.experience.map((exp, i) => (
                                    <div key={i} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 relative">
                                            <button onClick={() => removeItem('experience', i)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                <input type="text" placeholder="Company Name" value={exp.company} onChange={(e) => updateItem('experience', i, 'company', e.target.value)} className="p-2 font-bold bg-white dark:bg-black rounded border border-slate-200 dark:border-slate-700 outline-none" />
                                                <div className="flex gap-2">
                                                    <input type="text" placeholder="Role / Title" value={exp.role} onChange={(e) => updateItem('experience', i, 'role', e.target.value)} className="flex-1 p-2 text-sm bg-white dark:bg-black rounded border border-slate-200 dark:border-slate-700 outline-none" />
                                                    <input type="text" placeholder="Years" value={exp.year} onChange={(e) => updateItem('experience', i, 'year', e.target.value)} className="w-32 p-2 text-sm bg-white dark:bg-black rounded border border-slate-200 dark:border-slate-700 outline-none" />
                                                </div>
                                            </div>
                                            <textarea rows={2} placeholder="Description" value={exp.desc} onChange={(e) => updateItem('experience', i, 'desc', e.target.value)} className="w-full p-2 text-sm bg-white dark:bg-black rounded border border-slate-200 dark:border-slate-700 outline-none" />
                                    </div>
                                ))}
                             </div>
                        </div>
                         {/* CUSTOM LINKS */}
                         <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold flex items-center gap-2"><LinkIcon size={16}/> Social & External Links</h3>
                                <button onClick={() => addItem('custom_links', { label: '', url: '' })} className="p-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 rounded-full hover:bg-indigo-200"><Plus size={16}/></button>
                             </div>
                             <div className="space-y-3">
                                {formData.custom_links.map((link, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                            <input type="text" placeholder="Label" value={link.label} onChange={(e) => updateItem('custom_links', i, 'label', e.target.value)} className="w-1/3 p-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none" />
                                            <input type="text" placeholder="URL" value={link.url} onChange={(e) => updateItem('custom_links', i, 'url', e.target.value)} className="w-2/3 p-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none" />
                                            <button onClick={() => removeItem('custom_links', i)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                             </div>
                         </div>
                    </div>
                )}

                {/* TAB 4: SAVED JOBS */}
                {activeTab === 'saved' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-bold flex items-center gap-2"><Heart className="text-red-500 fill-current"/> My Saved Jobs</h2>
                        
                        {savedJobs.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-[#111625] rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <Heart className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                                <p className="text-slate-500 font-medium">No saved jobs yet. Go to Home and heart some!</p>
                                <Link href="/" className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Browse Jobs</Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {savedJobs.map((job) => (
                                    <div key={job.id} className="bg-white dark:bg-[#111625] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
                                                <p className="text-sm text-slate-500">{job.category} • {job.source}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <a href={job.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold">Apply</a>
                                                <button onClick={() => unsaveJob(job.id)} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-red-50 hover:text-red-500 transition">
                                                    <Trash2 size={18}/>
                                                </button>
                                            </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>

        {/* Success Message Toast */}
        {msg && (
            <div className="fixed bottom-10 right-10 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce flex items-center gap-2 z-50">
                <CheckCircle size={20}/> {msg}
            </div>
        )}

      </div>
    </div>
  );
}



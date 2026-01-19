"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { 
  User, Phone, CheckCircle, ArrowRight, Loader2, 
  LayoutGrid, Calendar 
} from 'lucide-react';
import Link from 'next/link';

// 👇 TUMHARA GLOBAL NAVBAR (Path check kar lena)
import Navbar from '@/components/Navbar';

const CATEGORIES = {
  "Development": ["React", "Next.js", "Node.js", "Python", "Shopify", "WordPress", "Web3", "Frontend", "Backend"],
  "Mobile App": ["React Native", "Flutter", "iOS", "Swift", "Android", "Kotlin"],
  "Video & Motion": ["Video Editor", "Premiere Pro", "After Effects", "3D Artist", "Thumbnail Artist", "Short Form"],
  "Design & UI": ["UI/UX", "Figma", "Web Design", "Logo Design", "Graphic Design"],
  "Marketing": ["SEO", "Facebook Ads", "Google Ads", "Email Marketing", "Copywriter", "Growth"],
  "Writing": ["Ghostwriter", "Technical Writer", "Scriptwriter", "Content Writer"],
  "New Era (AI)": ["AI Engineer", "Automation", "LLM", "Python Script"]
};

export default function CompleteProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    whatsapp: '',
    birth_date: '',
    primary_role: '' 
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getSession();
      if (!user) { router.push('/login'); return; }
      
      setUser(user);
      
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) {
         setFormData({
            full_name: profile.full_name || user.user_metadata.full_name || '',
            username: profile.username || user.user_metadata.full_name?.toLowerCase().replace(/\s/g, '_').replace(/[^a-z0-9_]/g, '') || '',
            whatsapp: profile.whatsapp || '',
            birth_date: profile.birth_date || '',
            primary_role: profile.primary_role || '' 
         });
      }
      setLoading(false);
    };
    getUser();
  }, [router]);

  const handleSave = async () => {
    if (!formData.username || !formData.whatsapp || !formData.primary_role || !formData.birth_date) {
        alert("Please fill all fields to complete your profile.");
        return;
    }
    setSaving(true);
    
    const { error } = await supabase.from('profiles').update({
        username: formData.username,
        whatsapp: formData.whatsapp,
        full_name: formData.full_name,
        birth_date: formData.birth_date,
        primary_role: formData.primary_role, 
        onboarding_step: 4, 
        updated_at: new Date().toISOString()
    }).eq('id', user.id);

    setSaving(false);

    if (!error) {
        setShowSuccess(true);
    } else {
        alert("Error saving profile: " + error.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0F19]">
        <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={40}/>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
      
      {/* 🟢 GLOBAL NAVBAR */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      {/* --- SUCCESS POPUP --- */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#151B2B] border border-gray-200 dark:border-gray-700 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl transform scale-100 animate-in zoom-in-95 duration-300">
                
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                </div>
                
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">You're All Set! 🚀</h2>
                <p className="text-gray-500 dark:text-slate-400 mb-8 text-sm">
                    We will send <b>{formData.primary_role}</b> jobs to your WhatsApp: <span className="font-mono text-gray-700 dark:text-slate-300">{formData.whatsapp}</span>
                </p>
                
                <Link href="/" replace className="block w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2">
                    Go to Jobs Feed <ArrowRight size={20} />
                </Link>
            </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="flex items-center justify-center min-h-screen pt-24 pb-12 px-4 relative">
        
        {/* Ambient Background (Visible in Dark Mode mainly) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] dark:opacity-40 opacity-20" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] dark:opacity-40 opacity-20" />
        </div>

        <div className="max-w-xl w-full relative z-10">
            
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
                    Finish Setting Up
                </h1>
                <p className="text-gray-500 dark:text-slate-400">
                    Complete your profile to get verified job alerts.
                </p>
            </div>

            {/* CARD */}
            <div className="bg-white dark:bg-[#151B2B] border border-gray-200 dark:border-gray-800 p-8 md:p-10 rounded-3xl shadow-xl">
                
                <div className="space-y-5">
                    
                    {/* 1. Full Name */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input 
                                type="text" 
                                value={formData.full_name}
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pl-11 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    {/* 2. Username */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">Username</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500 font-bold group-focus-within:text-indigo-500 transition-colors">@</span>
                            <input 
                                type="text" 
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '_')})}
                                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pl-10 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600"
                                placeholder="username"
                            />
                        </div>
                    </div>

                    {/* 3. Skill Selector */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">Your Main Expertise</label>
                        <div className="relative group">
                            <LayoutGrid className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <select 
                                value={formData.primary_role}
                                onChange={(e) => setFormData({...formData, primary_role: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pl-11 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled className="text-gray-500">Select your primary skill...</option>
                                {Object.entries(CATEGORIES).map(([category, skills]) => (
                                    <optgroup key={category} label={category} className="bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white font-bold">
                                        {skills.map(skill => (
                                            <option key={skill} value={skill} className="text-gray-700 dark:text-slate-300 font-normal py-1">
                                                {skill}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                            {/* Arrow */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 dark:text-slate-500">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         {/* 4. WhatsApp */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">WhatsApp</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500 group-focus-within:text-green-500 transition-colors" size={18} />
                                <input 
                                    type="tel" 
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pl-11 p-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600"
                                    placeholder="+92 300..."
                                />
                            </div>
                        </div>

                        {/* 5. Birth Date */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">Birth Date</label>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input 
                                    type="date" 
                                    value={formData.birth_date}
                                    onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pl-11 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-200 font-bold text-lg rounded-xl mt-6 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="animate-spin"/> : <>Complete Setup <ArrowRight size={20}/></>}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
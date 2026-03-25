"use client";
import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic'; 
import { CATEGORIES } from '@/lib/categories'; 

// --- ICONS ---
import { 
  Briefcase, Globe, Link as LinkIcon, CheckCircle, 
  Layers, DollarSign, MapPin, Mail, FileText, Loader2, Clock, ArrowRight, ArrowLeft, Zap, Sparkles, Wand2, Lock, Unlock, UploadCloud, Building, X, Award, AtSign, Send
} from 'lucide-react';
import Link from 'next/link';

import 'react-quill-new/dist/quill.snow.css'; 

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
const EXP_LEVELS = ["Not Specified", "Entry-Level", "Junior", "Mid-Level", "Senior", "Lead", "Executive"];

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }], 
    ['bold', 'italic', 'underline', 'strike'], 
    [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
    ['link', 'code-block', 'blockquote'], 
    ['clean'] 
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'link', 'code-block', 'blockquote'
];

// 🎨 MAGIC COLOR EXTRACTOR FUNCTION
const getAverageColor = (dataUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve('#6366f1'); return; } 
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count = 0;
        
        for (let i = 0; i < data.length; i += 40) {
          if (data[i + 3] > 0) { 
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
        
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        
        const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        resolve(hex);
      } catch (e) {
        resolve('#6366f1'); 
      }
    };
  });
};

export default function PostJob() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🚀 NAYA: Multi-Step State
  const [currentStep, setCurrentStep] = useState(1);

  // 🪄 THE CONCIERGE STATES
  const [magicLink, setMagicLink] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  // 🖼️ UPLOAD STATES
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    applicationLink: '', // 👈 Naya
    location: '',
    salary: '',
    jobType: 'Full-time',
    experienceLevel: 'Not Specified', // 👈 Naya
    description: '',
    category: '',
    tags: [] as string[],
    companyName: '',
    companyEmail: '',
    companyWebsite: '',
    companySocial: '', // 👈 Naya
    companyLogoUrl: '',
    brandColor: '#6366f1'
  });

  const handleMagicLock = () => {
    if (!magicLink) {
      alert("Bro, please paste a link first! 😅");
      return;
    }
    setIsLocked(true);
    window.scrollBy({ top: 300, behavior: 'smooth' });
  };

  const handleManualUnlock = () => {
    setIsLocked(false);
    setMagicLink('');
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc).');
      return;
    }

    setUploadingLogo(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        const hexColor = await getAverageColor(dataUrl);
        setFormData(prev => ({ ...prev, brandColor: hexColor }));
      };
      reader.readAsDataURL(file);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('company-logos') 
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('company-logos')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, companyLogoUrl: publicUrlData.publicUrl }));

    } catch (err: any) {
      console.error(err);
      alert("Error uploading logo: " + err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, companyLogoUrl: '', brandColor: '#6366f1' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    } else {
      if (formData.tags.length < 3) {
        setFormData({ ...formData, tags: [...formData.tags, tag] });
      }
    }
  };

  const handleNextStep = () => {
    if (!isLocked) {
      const isDescriptionEmpty = formData.description.replace(/<(.|\n)*?>/g, '').trim().length === 0;
      if (!formData.title || !formData.applicationLink || isDescriptionEmpty || !formData.category) {
        alert("Please fill Title, Application Link, Description, and select a Category! 😅");
        return;
      }
    }
    
    setCurrentStep(2);
    window.scrollTo(0, 0); 
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.companyName || !formData.companyEmail) {
      alert("Company Name and Email are required! 😅");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('job_submissions').insert([
        {
          magic_link: isLocked ? magicLink : null,
          title: isLocked ? null : formData.title,
          application_link: isLocked ? magicLink : formData.applicationLink, // 👈 Link set
          experience_level: formData.experienceLevel, // 👈 Naya
          description: isLocked ? null : formData.description,
          location: formData.location,
          salary_range: formData.salary,
          job_type: formData.jobType,
          category: isLocked ? null : formData.category, 
          tags: isLocked ? null : formData.tags,
          company_name: formData.companyName,
          company_email: formData.companyEmail,
          company_website: formData.companyWebsite,
          company_social: formData.companySocial, // 👈 Naya
          company_logo_url: formData.companyLogoUrl, 
          brand_color: formData.brandColor,          
          status: 'pending'
        }
      ]);

      if (error) throw error;

      setSuccess(true);
      setFormData({ 
        title: '', applicationLink: '', location: '', salary: '', jobType: 'Full-time', experienceLevel: 'Not Specified', description: '', 
        category: '', tags: [], companyName: '', companyEmail: '', companyWebsite: '', companySocial: '', companyLogoUrl: '', brandColor: '#6366f1'
      });
      setMagicLink('');
      setIsLocked(false);
      setCurrentStep(1); 
      window.scrollTo(0, 0);

    } catch (error: any) {
      alert('Error submitting job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100 pb-20">
       <Navbar />

      <style jsx global>{`
        .ql-toolbar.ql-snow { border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; border-color: #e2e8f0; background-color: #f8fafc; }
        .ql-container.ql-snow { border-bottom-left-radius: 0.75rem; border-bottom-right-radius: 0.75rem; border-color: #e2e8f0; background-color: white; font-family: inherit; font-size: 1rem; }
        .ql-editor { min-height: 250px; }
        .dark .ql-toolbar.ql-snow { background-color: #1e293b; border-color: #334155; }
        .dark .ql-container.ql-snow { background-color: #0f172a; border-color: #334155; color: #e2e8f0; }
        .dark .ql-stroke { stroke: #94a3b8 !important; }
        .dark .ql-fill { fill: #94a3b8 !important; }
        .dark .ql-picker { color: #94a3b8 !important; }
      `}</style>

      <div className="container mx-auto px-4 py-12 max-w-3xl pt-24">
        
        {!success && (
          <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={14} /> 100% Free For Now
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
              Hire Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">Remote Talent</span>
            </h1>
            
            {/* 🚀 STEP INDICATOR (WIZARD) */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className={`flex items-center gap-2 font-bold ${currentStep === 1 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentStep === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>1</div>
                Job Details
              </div>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full">
                <div className={`h-full bg-indigo-600 rounded-full transition-all duration-500 ${currentStep === 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className={`flex items-center gap-2 font-bold ${currentStep === 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>2</div>
                Company Profile
              </div>
            </div>

          </div>
        )}

        {success ? (
          <div className="bg-white dark:bg-[#111625] p-10 rounded-3xl border border-emerald-200 dark:border-emerald-900/50 text-center shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="h-24 w-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-black mb-3">Job Submitted Successfully! 🎉</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed text-lg">
              Your listing has been sent to our expert team. We will format it perfectly and make it live shortly!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setSuccess(false)} 
                className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Submit Another Job
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* =========================================================
                ===================== STEP 1 ==========================
                ========================================================= */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                {/* 🪄 PHASE 0: THE MAGIC LINK BOX */}
                <div className={`bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/10 p-6 md:p-8 rounded-3xl border ${isLocked ? 'border-emerald-400 dark:border-emerald-500' : 'border-indigo-200 dark:border-indigo-800/30'} mb-8 shadow-sm relative overflow-hidden transition-colors duration-500`}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-black flex items-center gap-2 text-indigo-900 dark:text-indigo-300 mb-2">
                      <Wand2 size={24} className={isLocked ? 'text-emerald-500' : 'text-indigo-600 dark:text-indigo-400'} />
                      {isLocked ? 'Magic Link Accepted! ✨' : 'Paste & Relax'}
                    </h3>
                    <p className="text-sm text-indigo-700/80 dark:text-indigo-300/70 mb-5 font-medium">
                      {isLocked 
                        ? "We've locked the job details. Our expert team will manually extract and format your job post from this link." 
                        : "Save time! Paste your ATS link (Workable, Lever, Greenhouse) and we'll manually format everything for you."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={18}/>
                        <input 
                          type="url" 
                          placeholder="https://jobs.lever.co/your-company/..." 
                          className="w-full pl-12 p-4 rounded-xl bg-white dark:bg-[#0B0F19] border border-indigo-200 dark:border-indigo-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-800 dark:text-white placeholder:text-slate-400 shadow-inner"
                          value={magicLink}
                          onChange={(e) => setMagicLink(e.target.value)}
                          readOnly={isLocked}
                        />
                      </div>
                      {!isLocked ? (
                        <button 
                          type="button"
                          onClick={handleMagicLock}
                          className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[140px]"
                        >
                          <Lock size={18} /> Lock Form
                        </button>
                      ) : (
                        <button 
                          type="button"
                          onClick={handleManualUnlock}
                          className="px-6 py-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[140px]"
                        >
                          <Unlock size={18} /> Edit Link
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 🔒 WRAPPER FOR JOB DETAILS, DESCRIPTION & CATEGORY */}
                <div className="relative mb-8">
                  {isLocked && (
                    <div className="absolute inset-[-10px] bg-slate-50/60 dark:bg-[#0B0F19]/60 backdrop-blur-sm z-20 rounded-3xl flex flex-col items-center justify-center border border-slate-200/50 dark:border-slate-700/50">
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl text-center mb-4 border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 max-w-sm">
                        <CheckCircle className="text-emerald-500 w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">We've Got This! 🚀</h3>
                        <p className="text-sm text-slate-500 mb-4 leading-relaxed">Our team will extract the title, description, and perfectly categorize this job from your link.</p>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-200 dark:border-emerald-800/30">
                          Move to Step 2 below ⬇️
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={handleManualUnlock}
                        className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 bg-white/50 dark:bg-slate-900/50 px-4 py-2 rounded-full"
                      >
                        <Unlock size={14} /> I want to write manually instead
                      </button>
                    </div>
                  )}

                  <div className={`space-y-6 transition-opacity duration-500 ${isLocked ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                    
                    {/* SECTION 1: JOB DETAILS */}
                    <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h2 className="text-xl font-black flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                          <Briefcase size={20}/> 
                        </div>
                        Job Details
                      </h2>

                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Job Title {!isLocked && '*'}</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Senior React Developer" 
                              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-[#151b2d] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium transition-all"
                              value={formData.title}
                              onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">How to Apply (Link or Email) {!isLocked && '*'}</label>
                            <div className="relative">
                              <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                              <input 
                                type="text" 
                                placeholder="https://... or jobs@..." 
                                className="w-full pl-12 p-4 rounded-xl bg-slate-50 dark:bg-[#151b2d] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium transition-all"
                                value={formData.applicationLink}
                                onChange={(e) => setFormData({...formData, applicationLink: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Location</label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                              <input 
                                type="text" 
                                placeholder="Worldwide"
                                className="w-full pl-10 p-4 rounded-xl bg-slate-50 dark:bg-[#151b2d] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Job Type</label>
                            <div className="relative">
                              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                              <select 
                                className="w-full pl-10 p-4 rounded-xl bg-slate-50 dark:bg-[#151b2d] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer font-medium text-sm"
                                value={formData.jobType}
                                onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                              >
                                {JOB_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          {/* 🌟 NAYA: EXPERIENCE LEVEL */}
                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Experience</label>
                            <div className="relative">
                              <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                              <select 
                                className="w-full pl-10 p-4 rounded-xl bg-slate-50 dark:bg-[#151b2d] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer font-medium text-sm"
                                value={formData.experienceLevel}
                                onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})}
                              >
                                {EXP_LEVELS.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Salary</label>
                            <div className="relative">
                              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                              <input 
                                type="text" 
                                placeholder="$50k - $80k" 
                                className="w-full pl-10 p-4 rounded-xl bg-slate-50 dark:bg-[#151b2d] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm"
                                value={formData.salary}
                                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: DESCRIPTION */}
                    <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h2 className="text-xl font-black flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                          <FileText size={20}/> 
                        </div>
                        Job Description {!isLocked && '*'}
                      </h2>
                      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                          <ReactQuill 
                              theme="snow"
                              value={formData.description}
                              onChange={(value) => setFormData({...formData, description: value})}
                              modules={modules}
                              formats={formats}
                              placeholder="Describe the role responsibilities, requirements..."
                              readOnly={isLocked}
                          />
                      </div>
                    </div>

                    {/* SECTION 3: CATEGORY & SKILLS */}
                    <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h2 className="text-xl font-black flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                          <Layers size={20}/> 
                        </div>
                        Category & Skills {!isLocked && '*'}
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Object.entries(CATEGORIES).map(([catName, data]) => {
                              const Icon = data.icon;
                              const isSelected = formData.category === catName;
                              return (
                                <button
                                  key={catName}
                                  type="button"
                                  onClick={() => setFormData({...formData, category: catName, tags: []})}
                                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                                    isSelected 
                                      ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-500/30 scale-[1.02]' 
                                      : 'bg-slate-50 dark:bg-[#151b2d] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-800'
                                  }`}
                                >
                                  <Icon size={24} className="mb-2"/>
                                  <span className="text-sm font-bold text-center">{catName}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {formData.category && (
                          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-3">
                              Select Skills (Max 3)
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {CATEGORIES[formData.category as keyof typeof CATEGORIES].sub.map(tag => {
                                const isSelected = formData.tags.includes(tag);
                                return (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all duration-200 ${
                                      isSelected
                                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700'
                                        : 'bg-slate-50 dark:bg-[#151b2d] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500'
                                    }`}
                                  >
                                    {tag} {isSelected && '✓'}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* NEXT BUTTON */}
                <button 
                  type="button" 
                  onClick={handleNextStep}
                  className="w-full py-5 bg-indigo-600 text-white text-xl font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  Next: Company Profile <ArrowRight />
                </button>
              </div>
            )}

            {/* =========================================================
                ===================== STEP 2 ==========================
                ========================================================= */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                {/* 🏢 SECTION 3: COMPANY DETAILS (PAGE 2) */}
                <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
                  <h2 className="text-xl font-black flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                      <Building size={20}/> 
                    </div>
                    Company Profile
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Company Name *</label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                          <input 
                            type="text" 
                            placeholder="e.g. Acme Corp" 
                            className="w-full pl-12 p-4 rounded-xl bg-slate-50 dark:bg-[#151b2d] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Company Website</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                          <input 
                            type="url" 
                            placeholder="https://acme.com" 
                            className="w-full pl-12 p-4 rounded-xl bg-slate-50 dark:bg-[#151b2d] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                            value={formData.companyWebsite}
                            onChange={(e) => setFormData({...formData, companyWebsite: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* 🌟 NAYA: COMPANY SOCIALS */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Twitter / LinkedIn</label>
                        <div className="relative">
                          <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                          <input 
                            type="text" 
                            placeholder="@company or linkedin.com/..." 
                            className="w-full pl-12 p-4 rounded-xl bg-slate-50 dark:bg-[#151b2d] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                            value={formData.companySocial}
                            onChange={(e) => setFormData({...formData, companySocial: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Your Private Email * <span className="text-indigo-500 font-normal normal-case">- Hidden from public</span></label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                          <input 
                            type="email" 
                            placeholder="founder@acme.com" 
                            className="w-full pl-12 p-4 rounded-xl bg-slate-50 dark:bg-[#151b2d] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                            value={formData.companyEmail}
                            onChange={(e) => setFormData({...formData, companyEmail: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* 🖼️ LOGO & BRAND COLOR EXTRACTOR */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Company Logo</label>
                        
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          ref={fileInputRef}
                          onChange={handleLogoUpload}
                        />

                        {formData.companyLogoUrl ? (
                          <div className="relative border-2 border-slate-200 dark:border-slate-700 rounded-xl p-2 flex items-center justify-center bg-white dark:bg-[#0B0F19] h-[88px] group">
                            <img src={formData.companyLogoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                            <button 
                              type="button" 
                              onClick={removeLogo}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingLogo}
                            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#151b2d] text-slate-500 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all h-[88px]"
                          >
                            {uploadingLogo ? (
                              <Loader2 size={24} className="animate-spin text-indigo-500" />
                            ) : (
                              <>
                                <UploadCloud size={24} className="mb-1 text-indigo-500"/>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to Upload Logo</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Brand Color <span className="font-normal normal-case text-indigo-500">(Auto-Extracted)</span></label>
                        <div className="flex items-center gap-3 h-[88px]">
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden shadow-inner border-2 border-slate-200 dark:border-slate-700">
                            <input 
                              type="color" 
                              value={formData.brandColor}
                              onChange={(e) => setFormData({...formData, brandColor: e.target.value})}
                              className="absolute -top-2 -left-2 w-24 h-24 cursor-pointer border-0 p-0"
                            />
                          </div>
                          <div className="flex-1 bg-slate-50 dark:bg-[#151b2d] p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 font-mono flex items-center justify-center h-16">
                            {formData.brandColor.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VIP FREE INFO BOX */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/30 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left mb-6">
                  <div className="bg-emerald-100 dark:bg-emerald-800/50 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400 flex-shrink-0 shadow-sm">
                     <Zap size={28} className="fill-current" />
                  </div>
                  <div>
                     <h3 className="font-black text-emerald-900 dark:text-emerald-300 text-lg">Post for Free (Early Adopter Benefit) 🚀</h3>
                     <p className="text-sm text-emerald-700 dark:text-emerald-400/80 mt-1.5 font-medium leading-relaxed">
                       Normal price is <span className="line-through opacity-70">$29/post</span>, but as an early user, your post is <strong className="text-emerald-800 dark:text-emerald-300">100% Free</strong>.
                     </p>
                  </div>
                </div>

                {/* 🚀 BUTTONS FOR STEP 2 */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    type="button" 
                    onClick={handlePrevStep}
                    className="py-5 px-8 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-lg font-bold rounded-2xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={20} /> Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xl font-black rounded-2xl hover:bg-indigo-600 dark:hover:bg-slate-200 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><Loader2 className="animate-spin" /> Submitting to Admin...</>
                    ) : (
                      <>Submit Job for Free <CheckCircle size={20} /></>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>
        )}
      </div>
    </div>
  );
}

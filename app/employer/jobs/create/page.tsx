"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic'; 
import { CATEGORIES } from '@/lib/categories';
import { 
  Briefcase, FileText, Layers, Loader2, MapPin, Sparkles,
  Clock, DollarSign, ArrowLeft, CheckCircle, AlertCircle, Award,
  Zap, AlertOctagon, HelpCircle, Plus, Trash2, Lock // 👈 Lock add kiya
} from 'lucide-react';
import Link from 'next/link';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
const EXP_LEVELS = ["Entry Level", "Junior", "Mid-Level", "Senior", "Lead", "Executive"];

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, false] }], // Better heading options
    ['bold', 'italic', 'underline', 'strike'], // Basic formatting
    [{ 'color': [] }, { 'background': [] }], // Text & Highlight colors
    [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Lists
    [{ 'indent': '-1'}, { 'indent': '+1' }], // Indentation
    [{ 'align': [] }], // Text alignment (Center, Right, etc)
    ['link', 'code-block', 'blockquote'], // Links & Quotes
    ['clean'] // Remove formatting button
  ],
};

export default function CreateInternalJob() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [postedJobId, setPostedJobId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    description: '',
    category: '',
    experience: 'Mid-Level',
    tags: [] as string[],
    screeningQuestions: [] as string[]
  });
  const [newQuestion, setNewQuestion] = useState('');
  const hasPremiumFeatures = ['Scale', 'Urgent', 'Bulk 5 Pack', 'Bulk 10 Pack'].includes(company?.plan_tier);
  // 1. Page load hotay hi User aur Company details fetch karo
  useEffect(() => {
    async function initAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login');
        return;
      }
      setUser(session.user);

      // Company check karo (Credits bhi isme aa jayenge auto)
      const { data: compData } = await supabase
        .from('companies')
        .select('*')
        .eq('employer_id', session.user.id)
        .single();
      
      setCompany(compData);
      setPageLoading(false);
    }
    initAuth();
  }, [router]);

  const toggleTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    } else {
      if (formData.tags.length < 3) {
        setFormData({ ...formData, tags: [...formData.tags, tag] });
      }
    }
  };
  // 🟢 VIP JADOO: Add/Remove Screening Questions
  const addQuestion = () => {
    if (newQuestion.trim()) {
      setFormData({ ...formData, screeningQuestions: [...formData.screeningQuestions, newQuestion.trim()] });
      setNewQuestion(''); // clear input
    }
  };

  const removeQuestion = (index: number) => {
    const updated = [...formData.screeningQuestions];
    updated.splice(index, 1);
    setFormData({ ...formData, screeningQuestions: updated });
  };
  // 🟢 NAYA JADOO: URL Slug Generator (Title ko URL-friendly banayega)
  const generateSlug = (title: string) => {
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const randomId = Math.floor(Math.random() * 10000); // Unique number add kar rahe hain (e.g. graphic-designer-897)
    return `${baseSlug}-${randomId}`;
  };
 // 🟢 VIP JADOO: Live AI Generator powered by Groq
  const generateAIJD = async () => {
    if (!formData.title) {
        alert("Pehle Job Title likhein taake AI description likh sakay!");
        return;
    }
    
    setIsGeneratingAI(true);
    
    try {
        const res = await fetch('/api/generate-jd', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: formData.title })
        });

        const data = await res.json();

        if (data.description) {
            // Groq ne jo HTML diya hai, usay direct Quill Editor mein set kardo!
            setFormData({...formData, description: data.description});
        } else {
            alert("AI Error: " + (data.error || "Generation failed"));
        }
    } catch (error) {
        console.error(error);
        alert("Server se connect nahi ho saka. Internet check karein!");
    } finally {
        setIsGeneratingAI(false);
    }
  };
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isDescriptionEmpty = formData.description.replace(/<(.|\n)*?>/g, '').trim().length === 0;

    if (!formData.title || !formData.category || isDescriptionEmpty) {
      alert("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (!company || company.job_credits <= 0) {
      alert("You are out of credits! Please buy a plan.");
      setLoading(false);
      return;
    }

    try {
      // 🟢 THE MAGIC FIX: Cleaning pasted inline styles!
      // Ye regex automatically saare 'background-color' aur 'color' nikal dega
      // Taake site ka apna Dark/Light mode color smoothly apply ho sake.
      const sanitizedDescription = formData.description
        .replace(/background-color\s*:[^;]+;/gi, '')
        .replace(/background\s*:[^;]+;/gi, '')
        .replace(/color\s*:[^;]+;/gi, '');

      const newSlug = generateSlug(formData.title);
      const applyLink = `https://hireskys.com/jobs/${newSlug}/apply`; 

      const { error } = await supabase.from('jobs').insert([
        {
          employer_id: user.id, 
          title: formData.title,
          source: company?.name || 'Confidential', 
          link: applyLink, 
          slug: newSlug,   
          category: formData.category,
          tags: formData.tags,
          // 🟢 Yahan formData.description ki jagah sanitizedDescription use kiya ha
          description: sanitizedDescription, 
          screening_questions: formData.screeningQuestions,
          location: formData.location || 'Remote',
          salary_range: formData.salary,
          job_type: formData.jobType,
          experience_level: formData.experience,
          contact_email: user.email, 
          date_posted: new Date().toISOString(),
          approved: false, 
          is_verified: true    
        }
      ]);

      if (error) throw error;

      // 🟢 2. DEDUCT CREDIT: Job post hone ke baad 1 credit minus kardo!
      const newCreditBalance = company.job_credits - 1;
      const { error: deductError } = await supabase
        .from('companies')
        .update({ job_credits: newCreditBalance })
        .eq('employer_id', user.id);
      
      if (deductError) console.error("Error deducting credit:", deductError);

      // Update local state so if they post another, it reflects correctly
      setCompany({ ...company, job_credits: newCreditBalance });
      
      setSuccess(true);
      window.scrollTo(0, 0);

    } catch (error: any) {
      alert('Error posting job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Setting up your workspace...</p>
      </div>
    );
  }

  // Agar company set nahi hai, toh pehle Settings page par bhejo
  if (!company) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-8 rounded-2xl text-center max-w-lg mx-auto mt-10">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-amber-900 mb-2">Company Profile Missing</h2>
        <p className="text-amber-700 text-sm mb-6">You need to set up your company details before posting a job.</p>
        <Link href="/employer/settings" className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors">
          Go to Settings
        </Link>
      </div>
    );
  }

  // 🟢 NEW BLOCK: Agar Credits 0 hain
  if (company.job_credits <= 0) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-3xl text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertOctagon size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Out of Job Credits!</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          You need at least 1 job credit to post a new opening. Get a plan to continue hiring.
        </p>
        <Link href="/employer/billing" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-500/30">
          <Zap size={20} /> Buy Credits Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10 animate-in fade-in duration-500">
      
      {/* 📌 Header - Updated to include Credit Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/employer/jobs" className="p-2.5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Post a New Job</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
              Posting as <strong className="text-indigo-600 dark:text-indigo-400">{company.name}</strong>
            </p>
          </div>
        </div>

        {/* 🟢 NEW: Credit Availability Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 px-4 py-2 rounded-xl">
          <Zap className="text-indigo-500" size={18} />
          <span className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
            {company.job_credits} Credit{company.job_credits !== 1 ? 's' : ''} Available
          </span>
        </div>
      </div>

      {success ? (
        <div className="bg-white dark:bg-[#111625] p-10 rounded-3xl border border-emerald-200 dark:border-emerald-900/50 text-center shadow-xl">
          <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">Job Posted Successfully!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Your job listing is now live. 1 Credit has been deducted from your account.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setSuccess(false)} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 transition-colors">
              Post Another
            </button>
            <Link href="/employer/jobs" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              View My Jobs
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: JOB DETAILS */}
          <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Briefcase size={20}/> 
              </div>
              Job Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Job Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior React Developer" 
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 font-medium text-lg transition-all text-slate-900 dark:text-white"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              {/* 🟢 VIP JADOO: 2x2 Balanced Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                
                {/* 1. Location */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-slate-400" size={18}/>
                    <input 
                      type="text" 
                      placeholder="e.g. Remote (PST)"
                      className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>

                {/* 2. Job Type */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Job Type</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-4 text-slate-400" size={18}/>
                    <select 
                      className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all appearance-none text-slate-900 dark:text-white"
                      value={formData.jobType}
                      onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                    >
                      {JOB_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                </div>

                {/* 3. Salary Range */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Salary Range</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-4 text-slate-400" size={18}/>
                    <input 
                      type="text" 
                      placeholder="e.g. $80k - $120k" 
                      className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    />
                  </div>
                </div>

                {/* 4. Experience Level (NEW!) */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Experience Level</label>
                  <div className="relative">
                    <Award className="absolute left-4 top-4 text-slate-400" size={18}/>
                    <select 
                      className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all appearance-none text-slate-900 dark:text-white"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    >
                      {EXP_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                  </div>
                </div>
               </div>
               </div>
              </div>

          {/* SECTION 2: DESCRIPTION (UPGRADED PRO VERSION) */}
          <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 relative z-10">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-pink-900/30 rounded-lg text-pink- pink-600 dark:text-pink-400">
                    <FileText size={20}/> 
                  </div>
                  Job Description *
                </h2>
            </div>

            {/* Premium Editor Wrapper */}
            <div className="rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300 bg-white dark:bg-[#0B0F19]">
              <ReactQuill 
                theme="snow"
                value={formData.description}
                onChange={(value) => setFormData({...formData, description: value})}
                modules={modules}
                placeholder="Write a detailed job description. Mention responsibilities, requirements, and perks..."
                className="text-slate-900 dark:text-white"
              />
            </div>
            
            {/* Helper Text */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium flex items-center gap-1 ml-1">
              💡 Tip: Use bullet points and headings to make the job appealing to candidates.
            </p>

          </div>
          {/* SECTION 2.5: SCREENING QUESTIONS (OPTIONAL) */}
          <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-2 relative z-10">
              <div className="p-2 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-lg text-fuchsia-600 dark:text-fuchsia-400">
                <HelpCircle size={20}/> 
              </div>
              Screening Questions <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 uppercase tracking-wider ml-1">Optional</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              Ask specific questions to filter candidates (e.g. "How many years of Next.js experience do you have?").
            </p>

            {/* Input & Add Button */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input 
                type="text" 
                placeholder="Type your question here..." 
                className="flex-1 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addQuestion(); } }}
              />
              <button 
                type="button"
                onClick={addQuestion}
                disabled={!newQuestion.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} /> Add
              </button>
            </div>

            {/* Questions List Display */}
            {formData.screeningQuestions.length > 0 && (
              <div className="space-y-3 animate-in fade-in duration-300">
                {formData.screeningQuestions.map((q, index) => (
                  <div key={index} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                    <div className="flex gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {q}
                      </p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeQuestion(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Remove Question"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
         {/* SECTION 3: CATEGORIZATION (UPGRADED PRO VERSION) */}
          <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none"></div>

            <h2 className="text-xl font-bold flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 relative z-10">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                <Layers size={20}/> 
              </div>
              Category & Skills *
            </h2>
            
            {/* 🌟 Premium Category Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
              {Object.entries(CATEGORIES).map(([catName, data]) => {
                const Icon = data.icon;
                const isSelected = formData.category === catName;
                
                return (
                  <button
                    key={catName} 
                    type="button"
                    onClick={() => setFormData({...formData, category: catName, tags: []})}
                    className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 group overflow-hidden ${
                      isSelected 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 shadow-md transform -translate-y-1' 
                      : 'bg-slate-50 dark:bg-[#0B0F19] border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:-translate-y-1 hover:shadow-sm'
                    }`}
                  >
                    {/* Selected Checkmark Indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-indigo-500 animate-in zoom-in duration-300">
                        <CheckCircle size={16} strokeWidth={3} />
                      </div>
                    )}
                    
                    <Icon size={28} className={`mb-3 transition-colors duration-300 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-500'}`}/>
                    <span className={`text-sm font-bold text-center ${isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-600 dark:text-slate-400'}`}>
                      {catName}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* 🌟 Premium Skill Pills (Tags) */}
            {formData.category && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-50 dark:bg-[#0B0F19] p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    Select Core Skills
                  </label>
                  {/* Smart Counter */}
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${formData.tags.length === 3 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                    {formData.tags.length} / 3 Selected
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {(CATEGORIES as any)[formData.category]?.sub?.map((tag: string) => {
                    const isSelected = formData.tags.includes(tag);
                    const isMaxReached = formData.tags.length >= 3;
                    const isDisabled = !isSelected && isMaxReached;

                    return (
                      <button
                        key={tag} 
                        type="button" 
                        onClick={() => toggleTag(tag)}
                        disabled={isDisabled}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-all duration-300 ${
                          isSelected 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]' 
                            : 'bg-white dark:bg-[#111625] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500'
                        } ${isDisabled ? 'opacity-40 cursor-not-allowed hover:border-slate-200 dark:hover:border-slate-700' : ''}`}
                      >
                        {tag} 
                        {isSelected && <CheckCircle size={16} className="animate-in zoom-in" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 🟢 NEW: Credit Warning Message */}
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-amber-700 dark:text-amber-400 text-sm font-medium mb-6">
            <Zap size={18} className="shrink-0" /> Posting this job will consume 1 credit from your balance.
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Post Job (-1 Credit)'}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
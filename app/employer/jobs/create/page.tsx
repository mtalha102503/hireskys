"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic'; 
import { CATEGORIES } from '@/lib/categories';
import { 
  Briefcase, FileText, Layers, Loader2, MapPin, Sparkles,
  Clock, DollarSign, ArrowLeft, CheckCircle, AlertCircle, Award,
  Zap, AlertOctagon, HelpCircle, Plus, Globe,Trash2, Lock // 👈 Lock add kiya
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
  // 🟢 VIP JADOO: Urgent Job State
  const [isUrgentCheckbox, setIsUrgentCheckbox] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    description: '',
    category: '',
    experience: 'Mid-Level',
    tags: [] as string[],
    screeningQuestions: [] as string[],
    // 🟢 VIP JADOO: Nayi Form Configuration State Add Ki
    formConfig: {
      coverLetter: 'optional', // options: 'required', 'optional', 'off'
      portfolio: 'optional',
      linkedin: 'required'
    }
  });
  const [newQuestion, setNewQuestion] = useState('');
  const hasPremiumFeatures = ['Scale', 'Urgent', 'Bulk 5 Pack', 'Bulk 10 Pack'].includes(company?.plan_tier);
  // 1. Page load hotay hi User aur Company details fetch karo
  const [showPopup, setShowPopup] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false); // Checkbox state

  // 🟢 VIP JADOO: First-time user check logic
  useEffect(() => {
    const isPolicyAccepted = localStorage.getItem('hireskys_remote_policy_accepted');
    if (!isPolicyAccepted) {
      setShowPopup(true); // Agar pehle accept nahi kiya, toh popup dikhao
    }
  }, []);

  
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
const handleAcceptPolicy = () => {
    localStorage.setItem('hireskys_remote_policy_accepted', 'true');
    setShowPopup(false); // Popup band kar do
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
  // 🟢 NAYA FUNCTION: Sirf check karega aur popup kholega
const handleReviewClick = (e: React.FormEvent) => {
  e.preventDefault();
  
  const isDescriptionEmpty = formData.description.replace(/<(.|\n)*?>/g, '').trim().length === 0;

  if (!formData.title || !formData.category || isDescriptionEmpty) {
    alert("Please fill in all required fields.");
    return;
  }

  if (!company || company.job_credits <= 0) {
    alert("You are out of credits! Please buy a plan.");
    return;
  }

  // Agar form theek hai, toh Popup show karo
  setShowReviewPopup(true);
};
const formatLocation = (loc: string) => {
  if (!loc || loc.trim() === '') return 'Remote';
  let cleanLoc = loc.replace(/remote/ig, '').replace(/[()\-]/g, '').trim();
  if (cleanLoc === '') return 'Remote';
  return `Remote (${cleanLoc})`;
};
// 🟢 VIP JADOO: Secure API Calling Function
  const confirmAndSubmit = async () => {
    setShowReviewPopup(false); 
    setLoading(true); 

    const isDescriptionEmpty = formData.description.replace(/<(.|\n)*?>/g, '').trim().length === 0;

    if (!formData.title || !formData.category || isDescriptionEmpty) {
      alert("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const sanitizedDescription = formData.description
        .replace(/background-color\s*:[^;]+;/gi, '')
        .replace(/background\s*:[^;]+;/gi, '')
        .replace(/color\s*:[^;]+;/gi, '');

      // Temporary Slug
      const tempSlug = generateSlug(formData.title);

      // 🚀 YAHAN API CALL JAYEGI
      const response = await fetch('/api/jobs/post-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employerId: user.id, 
          companyName: company?.name || 'Confidential',
          contactEmail: user.email,
          isUrgent: isUrgentCheckbox, // 👈 Ab dynamic ho gaya!
          jobData: {
            ...formData,
            description: sanitizedDescription,
            slug: tempSlug,
            location: formatLocation(formData.location)
          }
        })
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to post job.");
      }

      // 🟢 OPTIMISTIC UI UPDATE: Front-end par temporarily total credits minus kardo taake reload kiye bina UI theek dikhay
      const newCreditBalance = Math.max(0, company.job_credits - 1); 
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
    <div className="max-w-4xl mx-auto pb-10 relative">

      {/* 🔒 VIP POPUP MODAL: Strictly Remote Policy */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#111625] max-w-lg w-full p-6 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Globe Icon */}
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Globe size={32} />
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
              100% Remote Policy
            </h2>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed font-medium">
              HireSkys is strictly a remote-only platform. We do not allow any hybrid or on-site job postings that require physical commuting.
            </p>

            {/* 🔗 LEARN MORE LINK */}
            <div className="mb-8">
              <Link 
                href="/blog/how-hireskys-ats-works#strictly-remote" 
                target="_blank"
                className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-full"
              >
                Read Policy Guidelines &rarr;
              </Link>
            </div>

            {/* CHECKBOX BOX */}
            <div className="bg-slate-50 dark:bg-[#0B0F19] p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-left mb-6 transition-all group hover:border-blue-300 dark:hover:border-blue-900/50">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={hasAccepted} 
                    onChange={(e) => setHasAccepted(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" 
                  />
                  <CheckCircle size={14} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-normal select-none">
                  I acknowledge that this job is 100% remote. I understand that hybrid or on-site listings will be automatically rejected.
                </span>
              </label>
            </div>

            {/* CONTINUE BUTTON */}
            <button
              type="button"
              disabled={!hasAccepted}
              onClick={handleAcceptPolicy}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white font-black rounded-2xl transition-all shadow-lg disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              I Agree & Continue
            </button>

          </div>
        </div>
      )}
     
      {/* ------------ APKA PURANA FORM KA CODE YAHAN SE SHURU HOGA ------------ */}
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
  <div className="bg-white dark:bg-[#111625] p-10 rounded-3xl border border-emerald-200 dark:border-emerald-900/50 text-center shadow-xl animate-in zoom-in duration-500">
    <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
      <CheckCircle size={40} />
    </div>
    
    <h2 className="text-3xl font-black mb-3 text-slate-900 dark:text-white">Job Submitted! 🎉</h2>
    
    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 max-w-md mx-auto">
      <p className="text-slate-600 dark:text-slate-300 mb-4 font-medium">
        Your job is currently <strong>Pending Review</strong>. Our team will verify it within 2 hours to ensure quality.
      </p>
      
      {/* 🟢 LEARN MORE LINK (Jumping to Pending Section) */}
      <Link 
        href="/blog/how-hireskys-ats-works#pending-approval" 
        target="_blank"
        className="inline-flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-sm"
      >
        <HelpCircle size={16} /> Learn about our approval process
      </Link>
    </div>

    <div className="flex justify-center gap-4">
      <button onClick={() => { setSuccess(false); setFormData({...formData, title: '', description: ''}); }} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 transition-colors">
        Post Another
      </button>
      <Link href="/employer/jobs" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
        View My Postings
      </Link>
    </div>
  </div>
) : (
        <form onSubmit={handleReviewClick} className="space-y-8">
          
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
                const Icon = (data as any).icon;
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
          {/* SECTION 4: ⚙️ APPLICATION FORM SETTINGS (Greenhouse/Lever Style) */}
          <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 relative z-10">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
                    <FileText size={20}/> 
                  </div>
                  Application Form Settings
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 ml-1">
                  Customize what candidates see when they apply for this role.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Cover Letter Setting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0B0F19]/50 hover:border-teal-200 dark:hover:border-teal-900/50 transition-colors gap-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Cover Letter</h4>
                  <p className="text-[11px] text-slate-500">Ask candidates to write a custom cover letter.</p>
                </div>
                <select 
                  className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-teal-500 cursor-pointer"
                  value={formData.formConfig.coverLetter}
                  onChange={(e) => setFormData({
                    ...formData, 
                    formConfig: { ...formData.formConfig, coverLetter: e.target.value }
                  })}
                >
                  <option value="required">Required</option>
                  <option value="optional">Optional</option>
                  <option value="off">Off (Hidden)</option>
                </select>
              </div>

              {/* Portfolio Setting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0B0F19]/50 hover:border-teal-200 dark:hover:border-teal-900/50 transition-colors gap-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Portfolio / Website</h4>
                  <p className="text-[11px] text-slate-500">Useful for design, dev, or writing roles.</p>
                </div>
                <select 
                  className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-teal-500 cursor-pointer"
                  value={formData.formConfig.portfolio}
                  onChange={(e) => setFormData({
                    ...formData, 
                    formConfig: { ...formData.formConfig, portfolio: e.target.value }
                  })}
                >
                  <option value="required">Required</option>
                  <option value="optional">Optional</option>
                  <option value="off">Off (Hidden)</option>
                </select>
              </div>

              {/* LinkedIn Setting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0B0F19]/50 hover:border-teal-200 dark:hover:border-teal-900/50 transition-colors gap-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">LinkedIn Profile</h4>
                  <p className="text-[11px] text-slate-500">Link to candidate's professional profile.</p>
                </div>
                <select 
                  className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-teal-500 cursor-pointer"
                  value={formData.formConfig.linkedin}
                  onChange={(e) => setFormData({
                    ...formData, 
                    formConfig: { ...formData.formConfig, linkedin: e.target.value }
                  })}
                >
                  <option value="required">Required</option>
                  <option value="optional">Optional</option>
                  <option value="off">Off (Hidden)</option>
                </select>
              </div>

            </div>
          </div>
         {/* 🚨 VIP JADOO: URGENT POST BANNER */}
          <div 
            onClick={() => setIsUrgentCheckbox(!isUrgentCheckbox)}
            className={`p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-start gap-4 mb-6 group ${
              isUrgentCheckbox 
              ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/20 scale-[1.01]' 
              : 'bg-white dark:bg-[#111625] border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700'
            }`}
          >
            <div className="relative flex items-center justify-center mt-1 shrink-0">
              <input 
                type="checkbox" 
                checked={isUrgentCheckbox} 
                readOnly 
                className="peer appearance-none w-6 h-6 border-2 border-slate-300 dark:border-slate-600 rounded-lg checked:bg-amber-500 checked:border-amber-500 transition-all cursor-pointer" 
              />
              <CheckCircle size={16} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
            </div>
            <div>
              <h4 className="text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                <Zap size={20} className={isUrgentCheckbox ? "text-amber-500 animate-pulse" : "text-slate-400 group-hover:text-amber-500"} fill={isUrgentCheckbox ? "currentColor" : "none"} />
                Make this an Urgent Post
              </h4>
              <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Highlight your job at the top of the board with a special badge to get applicants 5x faster. Consumes <strong className="text-amber-600 dark:text-amber-400">1 Urgent Credit</strong>.
              </p>
            </div>
          </div>

          {/* 🟢 DYNAMIC Credit Warning Message */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm font-medium mb-6">
            <Layers size={18} className="text-slate-400 shrink-0" /> 
            Posting this job will consume {isUrgentCheckbox ? <strong className="text-amber-600 dark:text-amber-400">1 Urgent Credit</strong> : <strong className="text-indigo-600 dark:text-indigo-400">1 Standard Credit</strong>} from your balance.
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`px-8 py-4 text-white text-lg font-bold rounded-2xl transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-70 w-full sm:w-auto ${
                isUrgentCheckbox ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
              }`}
            >
              {loading ? <Loader2 className="animate-spin" /> : (isUrgentCheckbox ? 'Post Urgent Job' : 'Post Job')}
            </button>
          </div>
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
      {/* 🟢 VIP JADOO: REVIEW CONFIRMATION POPUP */}
      {showReviewPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#111625] rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 transform animate-in zoom-in-95 duration-300 relative overflow-hidden">
            
            {/* Background warning glow */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-amber-500/20 blur-[50px] rounded-full"></div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <AlertOctagon size={32} />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                Review Before Posting
              </h3>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6 text-sm text-slate-600 dark:text-slate-300 font-medium">
                <p className="mb-2">Are you sure the details are correct?</p>
                <p>
                  To maintain platform quality, the <strong className="text-slate-900 dark:text-white">Job Title</strong> and <strong className="text-slate-900 dark:text-white">Category</strong> will be <span className="text-red-500 font-bold">permanently locked</span> once posted.
                </p>
                
                {/* 🔗 Deep Link to the Blog Article */}
<Link 
  href="/blog/how-hireskys-ats-works#locked-fields" 
  target="_blank"
  className="inline-flex items-center justify-center gap-1.5 mt-4 px-4 py-2 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all shadow-sm group"
>
  <HelpCircle size={14} className="text-indigo-500 group-hover:scale-110 transition-transform" /> 
  <span>Learn why we lock these fields</span>
</Link>
              </div>
              
              <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-wider">
                This will consume 1 Job Credit
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button 
                  type="button"
                  onClick={() => setShowReviewPopup(false)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-transparent"
                >
                  Edit Details
                </button>
                <button 
                  type="button"
                  onClick={confirmAndSubmit}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
                >
                  Confirm & Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
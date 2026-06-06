"use client";

import { useEffect, useState, useRef } from 'react'; // 👈 useRef add kiya
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { 
  Briefcase, Loader2, ArrowLeft, UploadCloud, 
  CheckCircle, FileText, Link as LinkIcon, User, Mail,
  Phone, Linkedin, MapPin, Globe, HelpCircle // 👈 HelpCircle add kiya
} from 'lucide-react';
import Link from 'next/link';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    country: '',        // 👈 Naya
    city: '',           // 👈 Naya
    portfolioUrl: '',
    coverLetter: '',
    legalAuth: '',
    authorizedCountry: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false); // 👈 Checkbox ke liye state
  const [countryOptions, setCountryOptions] = useState<string[]>([]);
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchJob() {
      // 1. Pehle Job ka data nikalo
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('slug', params.slug)
        .single();
        
      if (jobError || !jobData) {
        console.error("Job nahi mili:", jobError);
        setLoading(false);
        return;
      }

      // 🟢 VIP JADOO MISSING THA: Company ka Logo Fetch karo!
      if (jobData.source) {
        const { data: companyData } = await supabase
          .from('companies')
          .select('name, logo_url, slug')
          .ilike('name', jobData.source.trim()) // Case-insensitive fetch
          .limit(1)
          .maybeSingle(); 
          
        jobData.companies = companyData || { name: jobData.source, logo_url: null };
      }

      // 🟢 Dynamic Country Options Parser
      if (jobData.location) {
        const locString = jobData.location.trim();
        const match = locString.match(/Remote\s*\((.*?)\)/i);
        const extractedLoc = match ? match[1].trim() : locString.replace(/Remote/i, '').trim();

        const parsedCountries = extractedLoc
  .split(/[,&]|\band\b/i)
  .map((c: string) => c.trim()) // 👈 Type define kar di
  .filter(Boolean);

        if (parsedCountries.length > 0) {
          setCountryOptions(parsedCountries); 
        }
      }
      // 🟢 VIP JADOO: Questions ki empty state banao
      if (jobData.screening_questions && jobData.screening_questions.length > 0) {
        const initialAnswers: Record<string, string> = {};
        jobData.screening_questions.forEach((q: string) => {
          initialAnswers[q] = '';
        });
        setScreeningAnswers(initialAnswers);
      }

      setJob(jobData);
      setLoading(false);
    }
    fetchJob();
  }, [params.slug]);
// 🟢 VIP JADOO: Smart Location Parser
  let showLegalAuth = false;
  let legalAuthQuestion = "";

  if (job?.location) {
    const locString = job.location.trim();
    // Extract text inside brackets if it exists (e.g., "Remote (India)" -> "India")
    const match = locString.match(/Remote\s*\((.*?)\)/i);
    const extractedLoc = match ? match[1].trim() : locString.replace(/Remote/i, '').trim();

    const isGlobal = extractedLoc.toLowerCase() === 'global' || extractedLoc.toLowerCase() === 'anywhere' || extractedLoc === '';

    if (!isGlobal) {
      showLegalAuth = true;
      // Check if it's multiple countries (contains comma or 'and' or '&')
      const isMultiple = extractedLoc.includes(',') || extractedLoc.includes('&') || extractedLoc.toLowerCase().includes(' and ');

      if (isMultiple) {
        legalAuthQuestion = `Are you located in any of these regions (${extractedLoc}) and legally authorized to work there? *`;
      } else {
        legalAuthQuestion = `Are you legally authorized to work in ${extractedLoc}? *`;
      }
    }
  }
  // 🟢 VIP JADOO: Live Submission & Storage Upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!resumeFile) {
      alert("Bro! Resume toh upload karo pehle! 📄");
      setSubmitting(false);
      return;
    }

    try {
      if (!job) throw new Error("Job not found");

      // 1️⃣ Supabase Storage mein Resume Upload karo
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `applications/${job.id}/${fileName}`; // Folder structure: applications/job_id/file

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, resumeFile);

      if (uploadError) {
        console.error("Storage Error:", uploadError);
        throw new Error("Resume upload failed!");
      }

      // 2️⃣ Uploaded Resume ka Public Link hasil karo
      const { data: publicUrlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      const realResumeUrl = publicUrlData.publicUrl;

      // 🟢 VIP JADOO: Check karo job remote hai ya specific location ki
      const isRemote = !job.location || job.location.toLowerCase().includes('remote') || job.location.toLowerCase().includes('anywhere');

      // 3️⃣ Database mein Application Entry daalo
      const { error: appError } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          cover_letter: formData.coverLetter,
          resume_url: realResumeUrl,
          portfolio_link: formData.portfolioUrl,
          phone: formData.phone, 
          linkedin_url: formData.linkedinUrl,
          country: formData.country, 
          city: formData.city, 
          legal_authorization: showLegalAuth ? formData.legalAuth : 'Not Required',
          status: 'New', 
          authorized_country: formData.authorizedCountry,
          screening_answers: screeningAnswers, // 👈 NAYA JADOO: Answers DB mein save hongay!
          ai_match_score: Math.floor(Math.random() * 40) + 50 
        });

      if (appError) throw appError;

      setSuccess(true);
      window.scrollTo(0, 0);

    } catch (error: any) {
      alert("Application failed: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-slate-50 dark:bg-[#0B0F19]"><Loader2 className="animate-spin text-indigo-600 w-10 h-10" /> <p className="text-slate-500 font-bold animate-pulse">Loading Application...</p></div>;
  }

  if (!job) {
    return <div className="min-h-screen flex justify-center items-center text-2xl font-black text-slate-800 dark:text-white bg-slate-50 dark:bg-[#0B0F19]">Job Not Found 😢</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] animate-in fade-in duration-500">
      
      {/* 🟢 VIP PROPER NAVBAR */}
      <header className="bg-white dark:bg-[#111625] border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Left Side: Logo + Name + Badge */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <img src="/logo2.png" alt="HireSkys Logo" className="h-8 object-contain" />
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">HireSkys</span>
            </Link>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-sm"></span>
              Secure Application
            </div>
          </div>

          {/* Right Side: Back Button (Desktop) */}
          <Link 
            href={`/jobs/${params.slug}`} 
            className="hidden md:flex text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 font-bold text-sm items-center gap-2 transition-all bg-slate-100 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <ArrowLeft size={16} /> Back to Job Description
          </Link>
          
          {/* Right Side: Back Button (Mobile - Icon Only) */}
          <Link 
            href={`/jobs/${params.slug}`} 
            className="md:hidden flex text-slate-600 dark:text-slate-300 hover:text-indigo-600 items-center justify-center bg-slate-100 dark:bg-slate-800/50 w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <ArrowLeft size={18} />
          </Link>

        </div>
      </header>

      {/* MAIN FORM CONTAINER */}
      <div className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          
          {success ? (
          <div className="bg-white dark:bg-[#111625] p-12 rounded-3xl border border-emerald-200 dark:border-emerald-900/50 text-center shadow-2xl animate-in zoom-in-95">
            <div className="h-24 w-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-black mb-4 text-slate-900 dark:text-white">Application Submitted! 🎉</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">
              Great job! Your profile has been sent to the employer. We'll notify you when they review it.
            </p>
            <Link href="/jobs" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-500/30">
              Explore More Jobs
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            
            {/* 🎨 VIP NAYA CENTRAL ELITE Header Section */}
            <div className="p-8 md:p-12 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/10 flex flex-col items-center text-center">
              
              {/* 🟢 VIP JADOO: Logo is now a Clickable Link */}
              <Link 
                href={`/companies/${job.companies?.slug || (job.source || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`}
                className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center border-2 border-slate-100 dark:border-slate-700 mb-6 group transition-all hover:scale-105 hover:shadow-2xl overflow-hidden cursor-pointer"
              >
                {job.companies && job.companies.logo_url ? (
                  <img src={job.companies.logo_url} alt={`${job.companies.name} Logo`} className="w-16 h-16 object-contain p-2" />
                ) : (
                  <div className="w-full h-full bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center">
                    <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 uppercase">
                      {job.source ? job.source.charAt(0) : (job.companies?.name ? job.companies.name.charAt(0) : 'C')}
                    </span>
                  </div>
                )}
              </Link>

              <div className="flex flex-col items-center text-center mt-2">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                  {job.title}
                </h1>
                
                {/* 🟢 VIP JADOO: Stacked Layout for Company Name */}
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">
                    Applying for a role at
                  </span>
                  <Link 
                    href={`/companies/${job.companies?.slug || (job.source || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`}
                    className="text-2xl md:text-3xl text-indigo-600 dark:text-indigo-400 font-black hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline cursor-pointer transition-colors"
                  >
                    {job.companies?.name || job.source || 'Company'}
                  </Link>
                </div>
              </div>
            </div>
            {/* 📝 Form Section */}
            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
              
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 text-slate-400" size={18}/>
                    <input 
                      type="text" required
                      placeholder="John Doe" 
                      className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-400" size={18}/>
                    <input 
                      type="email" required
                      placeholder="john@example.com" 
                      className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Phone & LinkedIn (Required) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Phone / WhatsApp *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-slate-400" size={18}/>
                    <input 
                      type="tel" required
                      placeholder="+1 (555) 000-0000" 
                      className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">LinkedIn Profile *</label>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-4 text-slate-400" size={18}/>
                    <input 
                      type="url" required
                      placeholder="https://linkedin.com/in/yourprofile" 
                      className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Country & City (Required) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Country of Residence *</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-4 text-slate-400" size={18}/>
                    <input 
                      type="text" required
                      placeholder="e.g. United States" 
                      className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">City of Residence *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-slate-400" size={18}/>
                    <input 
                      type="text" required
                      placeholder="e.g. New York" 
                      className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* 📁 Upload Resume UI */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Resume / CV *</label>
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer group ${resumeFile ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  {resumeFile ? (
                    <div className="flex flex-col items-center animate-in zoom-in duration-300">
                      <FileText className="text-indigo-500 mb-2" size={40} />
                      <p className="font-bold text-slate-700 dark:text-slate-200">{resumeFile.name}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Click to change</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud size={40} className="text-slate-400 group-hover:text-indigo-500 transition-colors mb-3 group-hover:-translate-y-1 duration-300" />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500 font-medium">PDF, DOCX up to 5MB</p>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
                </div>
              </div>

              {/* Row 4: Portfolio & Dynamic Smart Legal Auth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 relative z-20">
                
                {/* 1. Portfolio Link (Peche se agaya) */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between leading-none">
                    Portfolio / Website <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">Optional</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-4 text-slate-400" size={18}/>
                    <input 
                      type="url" 
                      placeholder="https://github.com/yourprofile" 
                      className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium shadow-inner"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                    />
                  </div>
                </div>

                {/* 🟢 VIP JADOO: Elite Smart Conditional Logic Block */}
                {showLegalAuth && (
                  <div className="space-y-6"> {/* Parent Div inside grid column */}
                    
                    {/* Q1: Forced Dropdown (Legally authorized? Yes/No) */}
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                      <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                        {legalAuthQuestion}
                      </label>
                      <select 
                        className={`w-full p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800 outline-none focus:border-indigo-500 transition-all font-bold cursor-pointer appearance-none ${formData.legalAuth === '' ? 'text-indigo-400 dark:text-indigo-500/50' : 'text-slate-900 dark:text-white'}`}
                        value={formData.legalAuth}
                        onChange={(e) => setFormData({...formData, legalAuth: e.target.value, authorizedCountry: ''})} // 👈 Naya: clear second dropdown when changing Q1
                        required
                      >
                        <option value="" disabled>Select...</option>
                        <option value="Yes">Yes, I am authorized</option>
                        <option value="No">No, I require sponsorship</option>
                      </select>
                    </div>

                    {/* Q2: Second Dropdown: Sirf tab ayega jb Q1 Yes ho OR job me multiple countries hon */}
                    {countryOptions.length > 1 && formData.legalAuth === 'Yes' && (
                      <div className="animate-in fade-in zoom-in duration-500 bg-white dark:bg-[#111625] p-5 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/30 shadow-lg relative z-10">
                        {/* smart background glow */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-20 h-20 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none"></div>
                        
                        <label className="block text-sm font-bold text-slate-800 dark:text-white mb-3">
                          In which country are you authorized? *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-4 text-indigo-500" size={18} />
                          <select 
                            className={`w-full pl-12 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800 outline-none focus:border-indigo-500 transition-all font-bold cursor-pointer appearance-none ${formData.authorizedCountry === '' ? 'text-indigo-400 dark:text-indigo-500/50' : 'text-slate-900 dark:text-white'}`}
                            value={formData.authorizedCountry}
                            onChange={(e) => setFormData({...formData, authorizedCountry: e.target.value})}
                            required
                          >
                            <option value="" disabled>Select Country...</option>
                            {countryOptions.map(country => (
                              <option key={country} value={country}>{country}</option>
                            ))}
                          </select>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium">Please select your primary work authorization country.</p>
                      </div>
                    )}

                  </div>
                )}
              </div>
              {/* 🟢 VIP JADOO: Dynamic Screening Questions (Agar employer ne dale hon) */}
              {job.screening_questions && job.screening_questions.length > 0 && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-sm font-black uppercase text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <div className="p-1.5 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-lg text-fuchsia-600 dark:text-fuchsia-400">
                      <HelpCircle size={16} />
                    </div>
                    Employer Questions
                  </label>
                  
                  <div className="space-y-6">
                    {job.screening_questions.map((question: string, index: number) => (
                      <div key={index} className="animate-in fade-in duration-500 bg-slate-50/50 dark:bg-[#111625]/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                          {question} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          placeholder="Type your answer here..."
                          className="w-full p-3.5 rounded-xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-fuchsia-500 transition-all text-slate-900 dark:text-white font-medium min-h-[100px] resize-y custom-scrollbar shadow-sm"
                          value={screeningAnswers[question] || ''}
                          onChange={(e) => setScreeningAnswers({...screeningAnswers, [question]: e.target.value})}
                        ></textarea>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                  Cover Letter <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">Optional</span>
                </label>
                <div className="relative">
                  <textarea 
                    placeholder="Tell the employer why you're a great fit..." 
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium min-h-[140px] resize-none custom-scrollbar"
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                  ></textarea>
                </div>
              </div>

              {/* 🟢 VIP CHECKBOX: Terms and Conditions */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      type="checkbox" 
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                    />
                    <CheckCircle size={14} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    I acknowledge that my application data will be processed in accordance with HireSkys's <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</Link>.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={submitting || !termsAccepted}
                  className="px-10 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : 'Submit Application'}
                </button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
   </div>
  );
}

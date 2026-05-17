"use client";

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, UploadCloud, CheckCircle, FileText, Link as LinkIcon, User, Mail, Phone, Linkedin, MapPin, Globe, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; // 🟢 FIX: Image import kiya Powered By logo ke liye

// Component ke Props define kar rahe hain
interface ApplyFormProps {
  job: any;
  onBack?: () => void; // Optional back button function
}

export default function ApplyForm({ job, onBack }: ApplyFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', linkedinUrl: '', 
    country: '', city: '', portfolioUrl: '', coverLetter: '', 
    legalAuth: '', authorizedCountry: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({});
  const [countryOptions, setCountryOptions] = useState<string[]>([]);

  // Setup initial data based on Job Prop
  useEffect(() => {
    if (!job) return;

    if (job.screening_questions?.length > 0) {
      const initialAnswers: Record<string, string> = {};
      job.screening_questions.forEach((q: string) => { initialAnswers[q] = ''; });
      setScreeningAnswers(initialAnswers);
    }

    if (job.location) {
      const locString = job.location.trim();
      const match = locString.match(/Remote\s*\((.*?)\)/i);
      const extractedLoc = match ? match[1].trim() : locString.replace(/Remote/i, '').trim();
      const parsedCountries = extractedLoc.split(/[,&]|\band\b/i).map((c: string) => c.trim()).filter(Boolean);
      if (parsedCountries.length > 0) setCountryOptions(parsedCountries);
    }
  }, [job]);

  if (!job) return null;

  // Legal Auth Logic
  let showLegalAuth = false;
  let legalAuthQuestion = "";
  if (job.location) {
    const locString = job.location.trim();
    const match = locString.match(/Remote\s*\((.*?)\)/i);
    const extractedLoc = match ? match[1].trim() : locString.replace(/Remote/i, '').trim();
    const isGlobal = extractedLoc.toLowerCase() === 'global' || extractedLoc.toLowerCase() === 'anywhere' || extractedLoc === '';
    
    if (!isGlobal) {
      showLegalAuth = true;
      const isMultiple = extractedLoc.includes(',') || extractedLoc.includes('&') || extractedLoc.toLowerCase().includes(' and ');
      legalAuthQuestion = isMultiple ? `Are you located in any of these regions (${extractedLoc}) and legally authorized to work there? *` : `Are you legally authorized to work in ${extractedLoc}? *`;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!resumeFile) {
      alert("Please upload your resume.");
      setSubmitting(false);
      return;
    }

    try {
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `applications/${job.id}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, resumeFile);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(filePath);
      
      const { error: appError } = await supabase.from('applications').insert({
        job_id: job.id,
        cover_letter: formData.coverLetter,
        resume_url: publicUrlData.publicUrl,
        portfolio_link: formData.portfolioUrl,
        phone: formData.phone,
        linkedin_url: formData.linkedinUrl,
        country: formData.country,
        city: formData.city,
        legal_authorization: showLegalAuth ? formData.legalAuth : 'Not Required',
        status: 'New',
        authorized_country: formData.authorizedCountry,
        screening_answers: screeningAnswers,
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

  if (success) {
    return (
      <div className="bg-white dark:bg-[#111625] p-12 rounded-3xl border border-emerald-200 dark:border-emerald-900/50 text-center shadow-xl max-w-2xl mx-auto">
        <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-black mb-4 text-slate-900 dark:text-white">Application Submitted! 🎉</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">Your profile has been sent. We'll notify you when they review it.</p>
        {onBack ? (
          <button onClick={onBack} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Back to Jobs</button>
        ) : (
          <Link href="/jobs" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Explore More Jobs</Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden max-w-3xl mx-auto">
      {/* HEADER SECTION */}
      <div className="p-8 md:p-12 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/10 flex flex-col items-center text-center relative">
        {onBack && (
          <button onClick={onBack} className="absolute left-6 top-6 text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2">
             &larr; Back
          </button>
        )}

        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center border-2 border-slate-100 dark:border-slate-700 mb-6 overflow-hidden">
          {job.companies?.logo_url ? (
            <img src={job.companies.logo_url} alt="Logo" className="w-16 h-16 object-contain p-2" />
          ) : (
            <span className="text-4xl font-black text-indigo-600">{job.source?.charAt(0) || 'C'}</span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">{job.title}</h1>
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Applying at <span className="text-indigo-600 dark:text-indigo-400">{job.companies?.name || job.source}</span></span>
      </div>

      {/* FORM SECTION */}
      <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
        
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Full Name *</label>
            <div className="relative">
              <User className="absolute left-4 top-4 text-slate-400" size={18}/>
              <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} 
                className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-white" 
                placeholder="John Doe" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-slate-400" size={18}/>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-white" 
                placeholder="john@example.com" />
            </div>
          </div>
        </div>

        {/* Row 2: Phone & LinkedIn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Phone / WhatsApp *</label>
            <div className="relative">
              <Phone className="absolute left-4 top-4 text-slate-400" size={18}/>
              <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} 
                className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-white" 
                placeholder="+1 (555) 000-0000" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">LinkedIn Profile *</label>
            <div className="relative">
              <Linkedin className="absolute left-4 top-4 text-slate-400" size={18}/>
              <input type="url" required value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} 
                className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-white" 
                placeholder="https://linkedin.com/in/..." />
            </div>
          </div>
        </div>

        {/* Row 3: Country & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Country of Residence *</label>
            <div className="relative">
              <Globe className="absolute left-4 top-4 text-slate-400" size={18}/>
              <input type="text" required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} 
                className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-white" 
                placeholder="e.g. United States" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">City of Residence *</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-slate-400" size={18}/>
              <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} 
                className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-white" 
                placeholder="e.g. New York" />
            </div>
          </div>
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Resume / CV *</label>
          <div onClick={() => fileInputRef.current?.click()} 
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${resumeFile ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/20' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#0B0F19]/50'}`}>
            {resumeFile ? (
              <div className="flex flex-col items-center">
                <FileText className="text-indigo-500 mb-2" size={40} />
                <p className="font-bold text-slate-700 dark:text-slate-200">{resumeFile.name}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud size={40} className="text-slate-400 mb-3" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to upload (PDF/DOCX)</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files?.[0] || null)} />
          </div>
        </div>

        {/* Portfolio & Legal Auth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
              Portfolio Link <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">Optional</span>
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-4 text-slate-400" size={18}/>
              <input type="url" value={formData.portfolioUrl} onChange={e => setFormData({...formData, portfolioUrl: e.target.value})} 
                className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-white" 
                placeholder="https://..." />
            </div>
          </div>

          {showLegalAuth && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">{legalAuthQuestion}</label>
                <select required value={formData.legalAuth} onChange={e => setFormData({...formData, legalAuth: e.target.value, authorizedCountry: ''})} 
                  className="w-full p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800 font-bold outline-none focus:border-indigo-500 text-slate-900 dark:text-white">
                  <option value="" disabled>Select...</option>
                  <option value="Yes">Yes, I am authorized</option>
                  <option value="No">No, I require sponsorship</option>
                </select>
              </div>
              {countryOptions.length > 1 && formData.legalAuth === 'Yes' && (
                <div className="bg-white dark:bg-[#111625] p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2">Which country? *</label>
                  <select required value={formData.authorizedCountry} onChange={e => setFormData({...formData, authorizedCountry: e.target.value})} 
                    className="w-full p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800 outline-none text-slate-900 dark:text-white">
                    <option value="" disabled>Select Country...</option>
                    {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Screening Questions */}
        {job.screening_questions?.length > 0 && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
            <h3 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white"><HelpCircle size={18} className="text-fuchsia-500"/> Employer Questions</h3>
            {job.screening_questions.map((q: string, i: number) => (
              <div key={i} className="bg-slate-50 dark:bg-[#0B0F19]/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{q} *</label>
                <textarea required value={screeningAnswers[q] || ''} onChange={e => setScreeningAnswers({...screeningAnswers, [q]: e.target.value})} 
                  className="w-full p-3.5 rounded-xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-fuchsia-500 min-h-[80px] text-slate-900 dark:text-white" 
                  placeholder="Your answer..."></textarea>
              </div>
            ))}
          </div>
        )}

        {/* Cover Letter */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
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

        {/* Terms */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input 
                type="checkbox" required checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} 
                className="peer appearance-none w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer" 
              />
              <CheckCircle size={14} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              I acknowledge that my application data will be processed in accordance with HireSkys's <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</Link>.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-6 flex justify-end">
          <button type="submit" disabled={submitting || !termsAccepted} className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
            {submitting ? <Loader2 className="animate-spin" /> : 'Submit Application'}
          </button>
        </div>

      </form>
      
      {/* 🟢 VIP ADDITION: Powered by HireSkys Badge */}
      <div className="px-8 pb-8 flex justify-center border-t border-slate-100 dark:border-slate-800 pt-6 mt-2 bg-slate-50/50 dark:bg-[#111625]">
        <a 
          href={`https://hireskys.com?utm_source=embed_widget_form&utm_medium=powered_by_badge&utm_campaign=${job?.companies?.slug || 'unknown'}`} 
          target="_blank" 
          rel="noopener" 
          className="group inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all px-4 py-2 rounded-full hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm"
        >
          <span>Powered by</span>
          <div className="flex items-center gap-1.5">
            <Image src="/logo2.png" alt="HireSkys" width={20} height={20} className="object-contain group-hover:scale-110 transition-transform" />
            <span className="text-slate-900 dark:text-white font-black tracking-tight text-sm">HireSkys</span>
          </div>
        </a>
      </div>

    </div>
  );
}
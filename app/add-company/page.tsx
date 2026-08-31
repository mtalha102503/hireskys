"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient'; 
import { 
  Building2, Globe, MapPin, Briefcase, AlignLeft, Send, 
  CheckCircle, ArrowLeft, Rocket, ShieldCheck, Users, TrendingUp, AlertCircle, ImageIcon
} from 'lucide-react';

export default function AddCompanyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // 🌟 NAYA: Live Logo Preview State
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  // 📝 Form States
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    location: '',
    industry: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🌟 NAYA: Jab user website type karke input se bahar click karega
  const handleWebsiteBlur = () => {
    if (!formData.website) {
      setPreviewLogo(null);
      return;
    }

    try {
      let domain = '';
      // Agar user ne http nahi lagaya toh URL parser fail na ho
      const validUrl = formData.website.startsWith('http') ? formData.website : `https://${formData.website}`;
      const urlObj = new URL(validUrl);
      domain = urlObj.hostname.replace(/^www\./, ''); 
      
      if (domain) {
        setPreviewLogo(`https://img.logo.dev/${domain}?token=pk_aH9IPqwYQqW08DI-epK7yw&size=200&format=png`);
      }
    } catch (err) {
      // Regex Fallback
      const fallbackDomain = formData.website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
      if (fallbackDomain) {
        setPreviewLogo(`https://img.logo.dev/${fallbackDomain}?token=pk_aH9IPqwYQqW08DI-epK7yw&size=200&format=png`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // SLUG GENERATOR
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // SUPABASE INSERT
      const { error } = await supabase
        .from('companies')
        .insert([
          {
            name: formData.name,
            slug: generatedSlug,
            website: formData.website,
            location: formData.location,
            industry: formData.industry,
            description: formData.description,
            logo_url: previewLogo, // 👈 Preview wala logo hi database me jayega
            verified: false
          }
        ]);

      if (error) throw error;

      setIsSuccess(true);
      
    } catch (error: any) {
      console.error("Error inserting company:", error);
      setErrorMsg(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30">
      <Navbar />

      <main className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 container mx-auto max-w-6xl">
        
        {/* 🔙 Back Button */}
        <div className="mb-6 md:mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
          <Link href="/companies" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft size={16} /> Back to Companies
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start">
          
          {/* 📝 LEFT SIDE: THE FORM */}
          <div className="lg:col-span-7 bg-white dark:bg-[#151b2d] rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-2xl shadow-indigo-500/5 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-12 md:py-16">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-[#151b2d] shadow-lg shadow-emerald-500/20">
                  <CheckCircle className="text-emerald-500 w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Company Submitted! 🎉</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto mb-8">
                  Thanks for choosing HireSkys. Our team will review your company profile and get it live shortly.
                </p>
                <button onClick={() => { setIsSuccess(false); setFormData({name: '', website: '', location: '', industry: '', description: ''}); setPreviewLogo(null); }} className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-transform hover:-translate-y-1">
                  Submit Another
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                    Add Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Company</span>
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Join our verified directory of remote-first organizations and reach thousands of top-tier professionals.
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
                    <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* 🌟 NAYA: LIVE LOGO PREVIEW UI */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 flex-shrink-0 bg-white dark:bg-[#0B0F19] rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-sm">
                      {previewLogo ? (
                        <img src={previewLogo} alt="Company Logo" className="w-12 h-12 object-contain" />
                      ) : (
                        <Building2 className="text-slate-300 dark:text-slate-600" size={28} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Company Logo Preview</h4>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Automatically fetched from your website URL.
                      </p>
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Company Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 size={18} className="text-slate-400" />
                      </div>
                      <input name="name" value={formData.name} onChange={handleChange} required type="text" placeholder="e.g. HireSkys" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-400" />
                    </div>
                  </div>

                  {/* Website */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Website URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Globe size={18} className="text-slate-400" />
                      </div>
                      <input 
                        name="website" 
                        value={formData.website} 
                        onChange={handleChange} 
                        onBlur={handleWebsiteBlur} // 👈 NAYA: Yahan hum blur event pakar rahe hain
                        required 
                        type="url" 
                        placeholder="https://www.company.com" 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-400" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Headquarters / Location */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Headquarters</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MapPin size={18} className="text-slate-400" />
                        </div>
                        <input name="location" value={formData.location} onChange={handleChange} required type="text" placeholder="e.g. San Francisco, CA" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-400" />
                      </div>
                    </div>

                    {/* Industry */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Industry</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Briefcase size={18} className="text-slate-400" />
                        </div>
                        <input name="industry" value={formData.industry} onChange={handleChange} required type="text" placeholder="e.g. Software Development" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Company Description</label>
                    <div className="relative">
                      <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                        <AlignLeft size={18} className="text-slate-400" />
                      </div>
                      <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} placeholder="Tell us about what you build and your company culture..." className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-400 resize-none"></textarea>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button disabled={isSubmitting} type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-black text-lg rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit for Review <Send size={18} />
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs font-semibold text-slate-400 mt-4">
                      By submitting, you agree to our Terms of Service.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* 🌟 RIGHT SIDE: WHY JOIN US? */}
          <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10">
                  <Rocket size={14} /> HireSkys Partner
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                  Hire top 1% <span className="text-indigo-200">remote talent</span>.
                </h3>
                <p className="text-indigo-100 font-medium mb-8">
                  Get your company in front of thousands of active job seekers, developers, designers, and marketers globally.
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={20} className="text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Verified Badge</h4>
                      <p className="text-sm text-indigo-100/80">Build trust with candidates instantly.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp size={20} className="text-amber-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">SEO Boost</h4>
                      <p className="text-sm text-indigo-100/80">Rank higher on Google with a dedicated company page.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Users size={20} className="text-pink-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Inbound Leads</h4>
                      <p className="text-sm text-indigo-100/80">Receive direct applications from pre-vetted professionals.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Briefcase, MapPin, Loader2, AlertCircle, DollarSign } from 'lucide-react';
import ApplyForm from '@/components/ApplyForm'; 
import { useTheme } from 'next-themes';
export default function EmbedJobBoard() {
  const { setTheme } = useTheme(); 

  // 🟢 2. YE EFFECT ADD KAR (Widget load hote hi theme light ho jayegi)
  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  const [jobs, setJobs] = useState<any[]>([]);
  const params = useParams();
  const slug = params?.slug ? (params.slug as string).trim() : "";
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  // 🟢 1st useEffect: Jobs Fetch, Anti-Theft, aur Employer Check
  useEffect(() => {
    async function fetchCompanyJobs() {
      if (!slug) return;
      try {
        // 🟢 UPDATE: select mein 'employer_id' bhi mangwa liya
        const { data: company, error: compError } = await supabase
          .from('companies')
          .select('slug, name, logo_url, allowed_domain, embed_views, employer_id')
          .eq('slug', slug)
          .single();
          
        if (compError) throw new Error(`Database Error: ${compError.message}`);

        // ==========================================
        // 🔒 VIP CHECK: Sirf unko ijazat do jinke paas employer_id ho
        // ==========================================
        if (!company || !company.employer_id) {
          throw new Error("Unauthorized Board 🛑. This job board is not configured or lacks an active employer profile.");
        }

        // ==========================================
        // 🔒 DOMAIN PROTECTION (ANTI-THEFT)
        // ==========================================
        if (company.allowed_domain) {
          const parentUrl = document.referrer; 
          
          if (parentUrl) {
            const parentDomain = new URL(parentUrl).hostname; 
            
            if (!parentDomain.includes(company.allowed_domain)) {
              throw new Error(`Unauthorized Domain 🛑. This widget is strictly protected and only allowed to run on ${company.allowed_domain}. Please contact HireSkys support.`);
            }
          }
        }

        // Active aur Approved Jobs fetch karo
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('source', company.name)
          .eq('ats_approved', true) 
          .order('created_at', { ascending: false });

        if (jobsError) throw new Error(`Jobs Error: ${jobsError.message}`);

        const fullJobs = jobsData?.map(job => ({ ...job, companies: company })) || [];
        setJobs(fullJobs);
      } catch (error: any) {
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanyJobs();
  }, [slug]);

  // 🟢 2nd useEffect: Widget Tracker (Top Level par perfectly aligned)
  useEffect(() => {
    // 👈 yahan id ki jagah slug aayega
    if (jobs.length > 0 && jobs[0]?.companies?.slug) { 
      const compSlug = jobs[0].companies.slug;
      
      const trackWidgetView = async () => {
        if (sessionStorage.getItem(`viewed_widget_${compSlug}`)) return;
        
        const currentViews = jobs[0].companies.embed_views || 0;
        await supabase
          .from('companies')
          .update({ embed_views: currentViews + 1 })
          .eq('slug', compSlug); // 👈 yahan update bhi slug ke through hoga
          
        sessionStorage.setItem(`viewed_widget_${compSlug}`, 'true');
      };

      trackWidgetView();
    }
  }, [jobs]);


  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>;
  if (errorMsg) return <div className="text-red-500 text-center p-10 bg-red-50 font-bold rounded-2xl border border-red-200 max-w-2xl mx-auto mt-10">{errorMsg}</div>;

  if (selectedJob) {
    return (
      <div className="w-full bg-transparent p-4">
        <ApplyForm job={selectedJob} onBack={() => setSelectedJob(null)} />
      </div>
    );
  }

  return (
    <div className="w-full bg-transparent font-sans p-2 sm:p-4"> 
      <div className="space-y-4">
        {jobs.map((job) => (
          <div 
            key={job.id} 
            className="group flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 p-5 sm:p-6 bg-white border border-slate-200/70 rounded-2xl hover:border-indigo-300 hover:shadow-lg transition-all relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="flex-1 min-w-0 pl-2 sm:pl-1">
              <h3 className="text-[1.1rem] sm:text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                {job.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-slate-500">
                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100 text-xs font-semibold max-w-full">
                  <MapPin size={14} className="text-indigo-400 shrink-0"/> 
                  <span className="line-clamp-1 break-all">{job.location || 'Remote'}</span>
                </span>
                
                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100 text-xs font-semibold whitespace-nowrap">
                  <Briefcase size={14} className="text-indigo-400 shrink-0"/> {job.job_type || 'Full-time'}
                </span>

                <span className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-100 text-xs font-semibold tracking-wide">
                 <DollarSign size={14} className="text-emerald-400" /> {job.salary_range || 'Not Disclosed'}
                </span>
              </div>
            </div>
            
            {/* 🟢 VIP JADOO: Click karne par Parent ko Top par scroll karne ka message bhejo */}
            <button 
              onClick={() => {
                setSelectedJob(job);
                if (window.self !== window.top) {
                  window.parent.postMessage({ type: 'hireskys-scroll-to-top' }, '*');
                }
              }} 
              className="w-full md:w-auto shrink-0 px-6 py-3.5 bg-slate-900 text-white hover:bg-indigo-600 font-bold rounded-xl transition-all shadow-sm hover:shadow-indigo-500/20 active:scale-95 text-sm flex items-center justify-center"
            >
              Apply Now 
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 flex justify-center border-t border-slate-200/60">
        <a 
          href={`https://www.hireskys.com?utm_source=embed_widget&utm_medium=powered_by_badge&utm_campaign=${slug || 'unknown'}`}
          target="_blank" 
          rel="noopener" 
          className="group inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all px-4 py-2 rounded-full hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm"
        >
          <span>Powered by</span>
          <div className="flex items-center gap-1.5">
            <Image src="/logo2.png" alt="HireSkys" width={20} height={20} className="object-contain group-hover:scale-110 transition-transform" />
            <span className="text-slate-900 font-black tracking-tight text-sm">HireSkys</span>
          </div>
        </a>
      </div>
    </div>
  );
}
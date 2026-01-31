"use client"; // FIX 1: Removed extra quote here
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { createSlug } from '@/lib/utils'; // 👈 Ye zaroori hai
import Navbar from '@/components/Navbar';
import ReportJob from '@/components/ReportJob';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, MapPin, Clock, DollarSign, 
  Briefcase, ExternalLink, Share2, Heart, CheckCircle, Building, User, Mail, Globe, ShieldCheck
} from 'lucide-react';

export default function JobClient({ initialJob }: { initialJob: any }) { 
  const params = useParams();
  const router = useRouter();
  
  // States
  const [job, setJob] = useState<any>(initialJob);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [relatedJobs, setRelatedJobs] = useState<any[]>([]); 
  const [companyDetails, setCompanyDetails] = useState<any>(null);

  useEffect(() => {
    fetchJobDetails();
  }, []);

  // 👇 Helper functions ko yahan define kiya taake wo fetchJobDetails ke andar bhi milein
  const getCompanySlug = (name: string) => {
    if (!name) return '#';
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-') // Special chars ko dash bana do
        .replace(/^-+|-+$/g, '');    // Start/End se dash hata do
  };

  async function fetchJobDetails() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    // 👇 URL se ID nikalo (slug ka last part)
    // Example: "senior-react-dev-692" -> "692"
    const slug = params.slug as string; 
    const jobId = slug ? slug.split('-').pop() : null; // Last wala hissa uthao

    if (jobId) {
        // 👇 Ab ID se search karo
        const { data } = await supabase.from('jobs').select('*').eq('id', jobId).single();
        
        // 🔒 SECURITY CHECK: Agar job Approved nahi hai, to load mat karo
        if (data && data.approved === false) {
            setJob(null); // Job ko null hi rakho
            setLoading(false);
            return; // Yahan se wapis chale jao, neeche ka code run nahi hoga
        }
        
        // 👇 Purana "if (data)" block replace karo is naye block se:
        if (data) {
            setJob(data);

            // 🌟 NEW: Company Data Fetch Logic
            // Logic: Job ka company name uthao, usay slug banao, aur companies table mein dhoondo
            const companyNameForSearch = data.company || 
                (!['reddit', 'hacker news', 'yc', 'upwork'].some(s => data.source?.toLowerCase().includes(s)) ? data.source : null);

            if (companyNameForSearch) {
                const slugToFind = getCompanySlug(companyNameForSearch);
                
                // Supabase se company data mangwao
                const { data: companyInfo } = await supabase
                    .from('companies')
                    .select('*')
                    .eq('slug', slugToFind)
                    .single();
                    
                if (companyInfo) {
                    setCompanyDetails(companyInfo); // ✅ State mein save kar liya
                }
            }

            // Related Jobs Fetch (Ye waisa hi rahega)
            const { data: related } = await supabase
                .from('jobs')
                .select('id, title, company, location, salary_range, date_posted, category')
                .eq('category', data.category) 
                .neq('id', data.id)            
                .eq('approved', true)          
                .order('date_posted', { ascending: false })
                .limit(3);                     
            
            if (related) setRelatedJobs(related);

            // Saved check (Waisa hi rahega)
            if (user) {
                const { data: savedJob } = await supabase.from('saved_jobs').select('*').match({ user_id: user.id, job_id: data.id }).single();
                if (savedJob) setSaved(true);
            }
        }
    } // FIX: Closing brace for if (jobId)
  } // FIX: Closing brace for fetchJobDetails function

  function getRelativeTime(dateString: string) {
    const jobDate = new Date(dateString);
    const now = new Date();
    const diffHrs = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${diffDays}d ago`;
  }

  const toggleSave = async () => {
    if (!user) { router.push('/login'); return; }
    if (saved) {
        await supabase.from('saved_jobs').delete().match({ user_id: user.id, job_id: job.id });
        setSaved(false);
    } else {
        await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: job.id });
        setSaved(true);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: job.title,
      text: `Check out this job: ${job.title} at ${job.company || 'Remote'}`,
      url: window.location.href,
    };

    // Agar browser support karta hai (mostly mobile browsers)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled or failed", err);
      }
    } else {
      // Desktop Fallback: Copy to clipboard with a better UI logic
      navigator.clipboard.writeText(window.location.href);
      // Yahan alert ki jagah tum koi Toast use kar sakte ho
      alert("✨ Link copied! Share it with your friends.");
    }
  };

  // --- 🔥 SMART RENDERERS ---

  const getSourceStyle = (source: string) => {
      const s = source?.toLowerCase() || "";
      if (s.includes('reddit')) return { name: 'Reddit', color: 'bg-orange-100 text-orange-700', icon: <User size={14}/> };
      if (s.includes('hacker') || s.includes('yc')) return { name: 'Y Combinator', color: 'bg-orange-500 text-white', icon: <Globe size={14}/> };
      if (s.includes('upwork')) return { name: 'Upwork', color: 'bg-green-100 text-green-700', icon: <ShieldCheck size={14}/> };
      return { name: source, color: 'bg-indigo-100 text-indigo-700', icon: <Briefcase size={14}/> };
  };

  const getCleanHTML = (html: string) => {
    if (!html) return "No description provided.";
    
    // Agar DB mein encoded hai to usay wapis normal HTML banao
    return html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ');
  };

  const renderAuthorSection = () => {
      const source = job.source?.toLowerCase() || "";

      // CASE A: REDDIT
      if (source.includes('reddit') && job.author_id) {
          return (
            <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-800">
                <h3 className="font-bold mb-4 text-sm uppercase text-orange-500 tracking-wider">Reddit Poster</h3>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-orange-600">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Username</p>
                        <a href={`https://www.reddit.com/user/${job.author_id}`} target="_blank" className="font-bold text-slate-900 dark:text-white hover:underline">
                            u/{job.author_id}
                        </a>
                    </div>
                </div>
            </div>
          );
      }

      // CASE B: HACKER NEWS
      if (source.includes('hacker') || source.includes('yc')) {
          return (
            <div className="bg-orange-50 dark:bg-[#ff6600]/10 p-6 rounded-2xl border border-orange-200 dark:border-orange-800">
                <h3 className="font-bold mb-4 text-sm uppercase text-orange-600 tracking-wider">Startup Details</h3>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-orange-600">
                        <Building size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Company Type</p>
                        <p className="font-bold text-slate-900 dark:text-white">YC Backed Startup 🚀</p>
                    </div>
                </div>
                {(job.company || companyDetails) && (
                <Link 
                    href={`/companies/${getCompanySlug(job.company || companyDetails?.name)}`}
                    className="flex items-center gap-2 group/company transition-all"
                >
                    {/* Agar Asli Logo hai to wo dikhao, nahi to Icon */}
                    {companyDetails?.logo_url ? (
                        <img 
                            src={companyDetails.logo_url} 
                            alt={companyDetails.name} 
                            className="w-8 h-8 object-contain rounded-md bg-white border border-slate-200 p-0.5"
                        />
                    ) : (
                        <Building size={18} className="text-indigo-500 group-hover/company:text-indigo-600"/> 
                    )}
                    
                    <span className="font-bold text-slate-700 dark:text-slate-200 group-hover/company:text-indigo-600 group-hover/company:underline">
                        {job.company || companyDetails?.name}
                    </span>
                    <ExternalLink size={12} className="opacity-0 group-hover/company:opacity-100 transition-opacity text-indigo-500"/>
                </Link>
            )}
            </div>
          );
      }

      // CASE C: UPWORK
      if (source.includes('upwork')) {
        return (
            <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-green-800">
                <h3 className="font-bold mb-4 text-sm uppercase text-green-600 tracking-wider">Client Info</h3>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-green-600">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Verification Status</p>
                        <p className="font-bold text-slate-900 dark:text-white">Payment Verified ✅</p>
                    </div>
                </div>
            </div>
        );
      }

      // CASE D: DEFAULT
      if (job.contact_info && job.contact_info !== "Reddit DM" && job.contact_info !== "See Link") {
        return (
            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                <h3 className="font-bold mb-4 text-sm uppercase text-indigo-500 tracking-wider">Direct Contact</h3>
                <div className="flex items-center gap-3">
                    <Mail size={20} className="text-indigo-600"/>
                    <p className="font-bold text-slate-900 dark:text-white break-all">{job.contact_info}</p>
                </div>
            </div>
        );
      }

      return null; 
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] text-slate-500">Loading details...</div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] text-slate-500">Job not found.</div>;

  const sourceStyle = getSourceStyle(job.source);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans">
      <Navbar />

      <div className="bg-white dark:bg-[#111625] border-b border-slate-200 dark:border-slate-800 pb-12 pt-24 px-4">
        <div className="container mx-auto max-w-5xl">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 font-medium transition"><ArrowLeft size={16}/> Back to Jobs</Link>

            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="w-full md:w-auto">
                    {/* Source Badge */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full flex items-center gap-2 ${sourceStyle.color}`}>
                            {sourceStyle.icon} {sourceStyle.name}
                        </span>
                        
                        {job.category && (
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase rounded-full">
                                {job.category}
                            </span>
                        )}
                        <span className="text-slate-400 text-sm flex items-center gap-1">
                            <Clock size={14}/> {getRelativeTime(job.date_posted)}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight break-words">{job.title}</h1>
                    
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        {/* 👇 UPDATED HEADER: Asli Logo aur Link ke sath */}
                        {(job.company || companyDetails) && (
                            <Link 
                                href={`/companies/${getCompanySlug(job.company || companyDetails?.name)}`}
                                className="flex items-center gap-2 group/company transition-all"
                            >
                                {/* Agar DB se Logo mila to wo dikhao, nahi to Icon */}
                                {companyDetails?.logo_url ? (
                                    <img 
                                        src={companyDetails.logo_url} 
                                        alt={companyDetails.name} 
                                        className="w-8 h-8 object-contain rounded-md bg-white border border-slate-200 p-0.5"
                                    />
                                ) : (
                                    <Building size={18} className="text-indigo-500 group-hover/company:text-indigo-600"/> 
                                )}
                                
                                <span className="font-bold text-slate-700 dark:text-slate-200 group-hover/company:text-indigo-600 group-hover/company:underline">
                                    {job.company || companyDetails?.name}
                                </span>
                                <ExternalLink size={12} className="opacity-0 group-hover/company:opacity-100 transition-opacity text-indigo-500"/>
                            </Link>
                        )}

                        {job.location && (
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className={job.location === 'Remote' ? "text-green-500" : "text-indigo-500"}/> 
                                {job.location}
                            </div>
                        )}
                        {job.job_type && (
                            <div className="flex items-center gap-2">
                                <Briefcase size={18} className="text-blue-500"/> 
                                {job.job_type}
                            </div>
                        )}
                        {job.salary_range && job.salary_range !== "N/A" && (
                            <div className="flex items-center gap-2">
                                <DollarSign size={18} className="text-green-500"/> 
                                {job.salary_range}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Copy this into your Action Buttons Row --- */}
                <div className="flex gap-3 w-full md:w-auto mt-6 md:mt-0 items-center">
                  
                  {/* Heart & Share Group */}
                  <div className="flex bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1 shadow-sm">
                      {/* Save Button */}
                      <button 
                        onClick={toggleSave} 
                        className={`p-2.5 rounded-lg transition-all ${saved ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                      >
                          <Heart size={22} className={saved ? 'fill-current' : ''} />
                      </button>

                      {/* Vertical Divider */}
                      <div className="w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 my-2"></div>

                      {/* Modern Share Button */}
                      <button 
                        onClick={handleShare} 
                        className="p-2.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all flex items-center gap-2"
                        title="Share Job"
                      >
                          <Share2 size={22} />
                          <span className="text-xs font-bold pr-1 hidden sm:inline">SHARE</span>
                      </button>
                  </div>

                  {/* Apply Button (Refined) */}
                  <a 
                      href={job.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 md:flex-none px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-[0px] transition-all"
                  >
                      <span>Apply Now</span>
                      <ExternalLink size={18} />
                  </a>
                </div>
            </div>
        </div>
      </div> 
      {/* 🌟 FIX 2: Added these closing tags to close the Header section properly before starting the Grid */}

      <div className="container mx-auto max-w-5xl px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Briefcase className="text-indigo-500"/> Job Description</h2>
                    
                    <div 
                        className="prose prose-slate dark:prose-invert max-w-none prose-a:text-indigo-600 prose-headings:text-slate-900 dark:prose-headings:text-white"
                        dangerouslySetInnerHTML={{ __html: getCleanHTML(job.description) }}
                    />
                </div>
                
                <ReportJob jobId={job.id} />
                
                {/* 🌟 RELATED JOBS SECTION */}
                {relatedJobs.length > 0 && (
                  <div className="mt-12">
                      <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                        <Briefcase size={20} className="text-indigo-500" /> Similar Opportunities
                      </h3>
                      <div className="space-y-4">
                        {relatedJobs.map((rJob) => (
                           <Link 
                              key={rJob.id} 
                              href={`/jobs/${createSlug(rJob.title, rJob.id)}`}
                              className="block group bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-md"
                           >
                              <div className="flex justify-between items-start">
                                  <div>
                                      <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                        {rJob.title}
                                      </h4>
                                      <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                          {rJob.company && <span className="flex items-center gap-1"><Building size={14}/> {rJob.company}</span>}
                                          <span className="flex items-center gap-1"><MapPin size={14}/> {rJob.location || 'Remote'}</span>
                                          <span className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{getRelativeTime(rJob.date_posted)}</span>
                                      </div>
                                  </div>
                                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 text-slate-400 group-hover:text-indigo-600 transition-colors">
                                      <ArrowRight size={20} />
                                  </div>
                              </div>
                           </Link>
                        ))}
                      </div>
                  </div>
                )}
            </div>

            <div className="space-y-6">
                
                {/* SMART AUTHOR SECTION */}
                {renderAuthorSection()}
                
                {/* 🏢 COMPANY PROFILE CARD (Updated) */}
                {(job.company || companyDetails) && (
                    <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 relative overflow-hidden">
                        
                        {/* Banner Background (Agar hai to) */}
                        {companyDetails?.banner_url && (
                            <div className="absolute top-0 left-0 w-full h-16 bg-slate-100">
                                <img src={companyDetails.banner_url} className="w-full h-full object-cover opacity-50" alt="banner" />
                            </div>
                        )}

                        <div className={`relative flex items-center gap-4 mb-4 ${companyDetails?.banner_url ? 'mt-8' : ''}`}>
                            <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                {companyDetails?.logo_url ? (
                                    <img src={companyDetails.logo_url} alt="logo" className="w-full h-full object-contain p-1" />
                                ) : (
                                    (job.company || "C").charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                                    {companyDetails?.name || job.company}
                                </h3>
                                <Link href={`/companies/${getCompanySlug(job.company || companyDetails?.name)}`} className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
                                    View Company Profile <ArrowRight size={12}/>
                                </Link>
                            </div>
                        </div>
                        
                        {/* Description from DB or Generic */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                            {companyDetails?.description || `See all active remote openings and hiring details for ${job.company}.`}
                        </p>
                    </div>
                )}
                
                <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold mb-4 text-sm uppercase text-slate-400 tracking-wider">Safety First</h3>
                    <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 flex-shrink-0"/> Never pay for a job application.</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 flex-shrink-0"/> Do not share sensitive bank info.</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 flex-shrink-0"/> Verify the client before starting work.</li>
                    </ul>
                </div>
            </div>
      </div>
    </div>
  );
}

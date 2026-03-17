"use client"; // FIX 1: Removed extra quote here
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { createSlug } from '@/lib/utils'; // 👈 Ye zaroori hai
import Navbar from '@/components/Navbar';
import ReportJob from '@/components/ReportJob';
import MagicButton from '@/components/MagicButton';
import VerifyMagicButton from '@/components/VerifyMagicButton';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, MapPin, Clock, DollarSign, 
  Briefcase, ExternalLink, Share2, Heart, CheckCircle, Building, User, Mail, Globe, ShieldCheck,ScanSearch,AlertTriangle, X
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
  const [userProfile, setUserProfile] = useState<any>(null);
const [applyCount, setApplyCount] = useState(job.application_count || 0);
// 🌍 GEO-LOCATION STATES
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [showGeoWarning, setShowGeoWarning] = useState(false);

  // 👇 LOCATION DETECTION LOGIC (Auto Run)
  useEffect(() => {
    const detectLocation = async () => {
      // 1. Agar user Login hai to Profile se Country lo
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('country').eq('id', user.id).single();
        if (profile?.country) {
          setUserCountry(profile.country);
          return;
        }
      }
      // 2. Agar Guest hai to IP se Country lo
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.country_name) setUserCountry(data.country_name);
      } catch (e) { console.error("IP Error", e); setUserCountry("Unknown"); }
    };
    detectLocation();
  }, []);
  useEffect(() => {
    fetchJobDetails();
  }, []);
// 🟢 NAYA: Job page khulte hi isko 'Seen' mark kar do
  useEffect(() => {
    // Check karo ke job load ho chuki hai
    if (job && job.id) {
       const seen = JSON.parse(localStorage.getItem('seenJobs') || '[]');
       // Agar is job ki ID pehle se list mein nahi hai, to add kar do
       if (!seen.includes(job.id)) {
           localStorage.setItem('seenJobs', JSON.stringify([...seen, job.id]));
       }
    }
  }, [job]);
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
if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, bio, skills, projects, experience')
            .eq('id', user.id)
            .maybeSingle();
            
        if (profile) setUserProfile(profile);
    }
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
        if (data) {
        setJob(data);
        if (data.application_count) {
            setApplyCount(data.application_count);
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
  const ApplicantStatus = ({ count }: { count: number }) => {
  if (count === 0) {
    return (
      <div className="mt-2 flex items-center justify-center md:justify-end gap-2 text-xs font-medium text-slate-500 dark:text-slate-300 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
        Be the first applicant! 🚀
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center justify-center md:justify-end gap-3 animate-in fade-in slide-in-from-top-1">
      {/* Avatar Stack */}
      <div className="flex -space-x-2 overflow-hidden">
        {[...Array(Math.min(count, 3))].map((_, i) => (
          <img 
            key={i}
            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#111625]"
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${count + i}`} 
            alt="applicant"
          />
        ))}
        {count > 3 && (
          <div className="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#111625] bg-slate-100 dark:bg-slate-700 text-[9px] font-bold text-slate-500 dark:text-slate-300">
            +{count > 99 ? '99' : count - 3}
          </div>
        )}
      </div>

      {/* Text - Added dark:text-slate-300 for visibility */}
      <div className="text-xs text-slate-600 dark:text-slate-300">
        <span className="font-bold text-slate-900 dark:text-white">{count} people</span> applied
      </div>
    </div>
  );
};
const handleApply = async () => {
    // 🚀 SMART APPLY LOGIC
  
    // --- 1. USER CHECK (Logic: Agar login hai to duplicate roko) ---
    if (user) {
        // Database se pucho: "Kya is user ne is job id par pehle apply kiya?"
        const { data: existingApplication } = await supabase
            .from('application_history')
            .select('id')
            .eq('user_id', user.id)
            .eq('job_id', job.id)
            .single();

        // Agar Entry mil gayi, to yahi se wapis bhag jao!
        // Na counter badhega, na history duplicate hogi.
        if (existingApplication) {
            console.log("Already applied! Skipping counter increment.");
            return; 
        }
    }

    // --- 2. COUNT INCREMENT (Ye ab sirf tab chalega agar User naya hai ya Guest hai) ---
    
    // UI Update (Foran number badha do)
    setApplyCount((prev: number) => prev + 1);

    // Database Counter Update
    const { error: countError } = await supabase
      .rpc('increment_job_applications', { job_id_input: job.id.toString() });

    if (countError) console.error("Counter Error:", countError);

    // --- 3. HISTORY SAVE (Sirf Logged-in Users ke liye) ---
    if (user) {
        await supabase.from('application_history').insert({
            user_id: user.id,
            job_id: job.id,
            job_title: job.title,
            // Source Logic wahi purani wali
            company_name: job.company || companyDetails?.name || job.source || 'Unknown Company'
        });
        console.log("User History Saved!");
    }
  };
  const handleCheckAndApply = (e: any) => {
    e.preventDefault(); 

    const jobDate = new Date(job.date_posted);
  const diffDays = Math.ceil(Math.abs(new Date().getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
  // 🟢 NAYA: job.active ko false check kar rahe hain
  if (diffDays > 60 || job.active === false) return;

    // 🟢 NEW LOGIC: GUEST BYPASS
    // Agar User login nahi hai -> To Geo-Check mat karo, seedha jane do.
    if (!user) {
        proceedToApply();
        return; 
    }

    // --- 🌍 GEO LOGIC START (Sirf Logged-in Users ke liye) ---
    
    // Sab kuch lowercase mein convert karo
    const jobLoc = job.location ? job.location.toLowerCase().trim() : "";
    const userLoc = userCountry ? userCountry.toLowerCase().trim() : "";

    // CASE 1: Direct Country Match
    if (userLoc && jobLoc.includes(userLoc)) {
        proceedToApply();
        return;
    }

    // CASE 2: Truly Global Keywords
    const globalKeywords = ["worldwide", "global", "anywhere", "distributed", "everywhere"];
    const isTrulyGlobal = globalKeywords.some(w => jobLoc.includes(w));

    // CASE 3: Pure "Remote"
    const isPureRemote = jobLoc === "remote" || jobLoc === "remote only";

    // 🛑 DECISION TIME
    if (isTrulyGlobal || isPureRemote || !userCountry || userCountry === "Unknown") {
       proceedToApply();
    } else {
       // Match Fail hua -> Popup dikhao
       console.log("⚠️ Geo Mismatch detected for Logged-in User!");
       setShowGeoWarning(true); 
    }
  };
  // Asli Apply Function (Jo link kholega aur Count badhayega)
  const proceedToApply = () => {
     // 🟢 NAYA: Button dabte hi isko 'Applied' mark kar do
     const applied = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
     if (!applied.includes(job.id)) {
         localStorage.setItem('appliedJobs', JSON.stringify([...applied, job.id]));
     }

     handleApply(); // Database count badhao
     // Link open karo
     const link = job.link.includes('@') && !job.link.startsWith('mailto:') ? `mailto:${job.link}` : job.link;
     window.open(link, job.link.includes('@') ? '_self' : '_blank');
     setShowGeoWarning(false); // Popup band
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

  const jobDate = new Date(job.date_posted);
  const today = new Date();
  const diffDays = Math.ceil(Math.abs(today.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // 🟢 NAYA: isExpired ab dono cheezein dekhega (Date OR Database Status)
  const isExpired = diffDays > 60 || job.active === false; 
  
  const sourceStyle = getSourceStyle(job.source);

  return (
    <div className="min-h-screen pb-24 md:pb-0 bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans">
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
                        {/* 🛑 GEO-WARNING POPUP */}
      {showGeoWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white dark:bg-[#151B2B] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-red-100 dark:border-red-900/30 animate-in zoom-in-95 relative">
              
              <button onClick={() => setShowGeoWarning(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2">
                 <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-red-500">
                    <AlertTriangle size={32} />
                 </div>

                 <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    Location Mismatch 🌍
                 </h3>

                 <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                    You are in <strong>{userCountry}</strong>, but this job is in <strong>{job.location}</strong>. 
                    <br/> Employers often reject applications from outside their target region.
                 </p>

                 <div className="flex flex-col w-full gap-3">
                    <button 
                       onClick={() => setShowGeoWarning(false)}
                       className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                       Cancel & Find Local Jobs
                    </button>

                    <button 
                       onClick={proceedToApply} // 👈 Zabardasti apply karne ke liye
                       className="w-full py-3 text-red-500 hover:text-red-600 dark:text-red-400 font-semibold text-sm flex items-center justify-center gap-2"
                    >
                       I understand, Apply Anyway <ExternalLink size={14} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
                    </div>
                    {isExpired && (
  <div className="mb-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
       <Briefcase size={18} className="text-red-600 dark:text-red-400" />
    </div>
    <div>
      <strong className="font-bold block">Applications Closed</strong>
      <span className="text-sm opacity-90">This job is no longer accepting applications.</span>
    </div>
  </div>
)}     
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight break-words">{job.title}</h1>
                    
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        
                        {(job.company || companyDetails) && (
                            <> {/* 👈 Ye add karna zaroori hai agar error aye */}
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
                           <div className="md:hidden ml-2">
    <VerifyMagicButton 
        companyName={job.company || companyDetails?.name || job.source || "the company"} 
    />
</div>
        </>
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

                {/* --- ACTION BUTTONS ROW START --- */}
                <div className="flex justify-between md:justify-end items-center md:items-start gap-4 w-full md:w-auto mt-8 md:mt-0">
                  
                  {/* 1. Share & Save Group (Left Side on Mobile) */}
                  <div className="h-[54px] flex items-center">
                    <div className="flex bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1 shadow-sm h-fit">
                      <button onClick={toggleSave} className={`p-2.5 rounded-lg transition-all ${saved ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                          <Heart size={22} className={saved ? 'fill-current' : ''} />
                      </button>
                      <div className="w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 my-2"></div>
                      <button onClick={handleShare} className="p-2.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all flex items-center gap-2">
                          <Share2 size={22} />
                      </button>
                    </div>
                  </div>

                  {/* 2. Apply Button & Counter (Right Side on Mobile) */}
                  <div className="flex flex-col items-end justify-center w-auto">
                      
                      {/* 👇 Desktop Apply Button (Mobile pe hidden hai) */}
                      <button 
                        onClick={handleCheckAndApply} 
                        disabled={isExpired}
                        className={`hidden md:flex w-fit md:w-auto px-6 h-[54px] font-bold rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] items-center justify-center gap-2 transition-all whitespace-nowrap
                          ${isExpired 
                            ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none" 
                            : "bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02] active:scale-[0.98]"
                          }`}
                      >
                        <span>{isExpired ? "Applications Closed" : (job.link.includes('@') ? "Apply via Email" : "Apply Now")}</span>
                        {!isExpired && (job.link.includes('@') ? <Mail size={18} /> : <ExternalLink size={18} />)} 
                      </button>

                      {/* 👇 Counter (Mobile par Save/Share ke saamne, Desktop par Button ke neechay) */}
                      <div className="mt-0 md:mt-2">
                         <ApplicantStatus count={applyCount} />
                      </div>
                  </div>

                </div>
                {/* --- ACTION BUTTONS ROW END --- */}
            </div>
        </div>
      </div> 
      <div className="container mx-auto max-w-5xl px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-8">
        <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            
            {/* 👇 Description Heading */}
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="text-indigo-500"/> Job Description
            </h2>
            
            {/* 🔥🔥🔥 AI BUTTON YAHAN LAGA DIYA 🔥🔥🔥 */}
            <MagicButton 
    jobDescription={job.description} 
    jobTitle={job.title} 
    userProfile={userProfile} // 👈 Ye naya prop add karo
/>

            {/* 👇 Original Description Text */}
            <div 
                className="job-content prose prose-slate dark:prose-invert max-w-none prose-a:text-indigo-600 prose-headings:text-slate-900 dark:prose-headings:text-white mt-6"
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
                {/* 👇 DESKTOP VERIFY CARD (Only shows on desktop) */}
<div className="hidden md:block p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-[#151b2d] dark:to-[#1e2433] border border-violet-100 dark:border-white/5 mb-6">
    <div className="flex items-start gap-3">
        <div className="p-2 bg-white dark:bg-white/5 rounded-lg shadow-sm text-violet-600 dark:text-violet-400">
            <ShieldCheck size={20} />
        </div>
        <div className="flex-1">
    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
        Is this company safe?
    </h3>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
        Ask Hyrizon AI to scan {job.company || 'this company'} for potential red flags.
    </p>
    
    {/* ✨ UPDATED DESKTOP BUTTON (Same Neon Look) */}
    <VerifyMagicButton 
    companyName={job.company || companyDetails?.name || job.source || "the company"} 
/>
</div>
    </div>
</div>
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
      {/* 📱 STICKY MOBILE APPLY FOOTER (Sirf Mobile par dikhega) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          
          {/* 🔖 Save Button */}
          <button 
            onClick={toggleSave} 
            className={`p-3.5 rounded-xl border transition-all flex items-center justify-center ${saved ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-900/30 text-red-500' : 'bg-slate-100 dark:bg-[#1a2333] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
          >
            <Heart size={22} className={saved ? 'fill-current' : ''} />
          </button>

          {/* 🚀 Main Apply Button (Uses same exact logic as desktop) */}
          <button 
            onClick={handleCheckAndApply} 
            disabled={isExpired}
            className={`flex-1 py-3.5 text-[15px] text-center font-extrabold rounded-xl transition-all flex justify-center items-center gap-2
              ${isExpired 
                ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 active:scale-95"
              }`}
          >
            {isExpired ? "Closed" : (job.link.includes('@') ? "Apply via Email" : "Apply Now")}
            {!isExpired && (job.link.includes('@') ? <Mail size={18} /> : <ExternalLink size={18} />)}
          </button>
          
        </div>
      </div>
    </div>
  );
}

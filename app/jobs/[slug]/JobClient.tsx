"use client"; // FIX 1: Removed extra quote here
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { createSlug } from '@/lib/utils'; // 👈 Ye zaroori hai
import ReactMarkdown from 'react-markdown';
import Navbar from '@/components/Navbar';
import remarkBreaks from 'remark-breaks';
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

  useEffect(() => {
    fetchJobDetails();
  }, []);

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
        if (data) {
            setJob(data);

            // Related Jobs Fetch
            const { data: related } = await supabase
                .from('jobs')
                .select('id, title, company, location, salary_range, date_posted, category')
                .eq('category', data.category) 
                .neq('id', data.id)            
                .eq('approved', true)          
                .order('date_posted', { ascending: false })
                .limit(3);                     
            
            if (related) setRelatedJobs(related);

            // 2. Saved Status Check
            if (user) {
                const { data: savedJob } = await supabase.from('saved_jobs').select('*').match({ user_id: user.id, job_id: data.id }).single();
                if (savedJob) setSaved(true);
            }
        }
    }
    setLoading(false);
  }

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  // --- 🔥 SMART RENDERERS ---

  const getSourceStyle = (source: string) => {
      const s = source?.toLowerCase() || "";
      if (s.includes('reddit')) return { name: 'Reddit', color: 'bg-orange-100 text-orange-700', icon: <User size={14}/> };
      if (s.includes('hacker') || s.includes('yc')) return { name: 'Y Combinator', color: 'bg-orange-500 text-white', icon: <Globe size={14}/> };
      if (s.includes('upwork')) return { name: 'Upwork', color: 'bg-green-100 text-green-700', icon: <ShieldCheck size={14}/> };
      return { name: source, color: 'bg-indigo-100 text-indigo-700', icon: <Briefcase size={14}/> };
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
                {job.company && (
                    <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            <strong>Hiring:</strong> {job.company}
                        </p>
                    </div>
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
                        {job.company && (
                            <div className="flex items-center gap-2">
                                <Building size={18} className="text-indigo-500"/> 
                                {job.company}
                            </div>
                        )}

                        {job.location && (
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className={job.location === 'Remote' ? "text-green-500" : "text-indigo-500"}/> 
                                {job.location}
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

                {/* 🌟 ACTION BUTTONS ROW */}
                <div className="flex gap-3 w-full md:w-auto mt-6 md:mt-0">
                    
                    {/* Save Button */}
                    <button onClick={toggleSave} className={`flex-shrink-0 p-3 rounded-xl border transition ${saved ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                        <Heart size={24} className={saved ? 'fill-current' : ''} />
                    </button>
                    
                    {/* Share Button */}
                    <button onClick={handleShare} className="flex-shrink-0 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600">
                        <Share2 size={24} />
                    </button>
                    
                    {/* Apply Button */}
                    <a 
                        href={job.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 md:flex-none px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform text-sm md:text-base h-auto"
                    >
                        <span className="md:hidden">Apply Now</span>
                        <span className="hidden md:inline">Apply on {sourceStyle.name}</span>
                        <ExternalLink size={18} className="flex-shrink-0"/>
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
                    
<article className="prose prose-slate dark:prose-invert max-w-none">
    <ReactMarkdown 
        remarkPlugins={[remarkBreaks]}
        components={{
            // 1. Headings ko Bold aur Bada karo
            h1: ({node, ...props}) => <h1 className="text-2xl font-extrabold mb-4 mt-6" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-5" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
            
            // 2. Lists ko proper style do
            ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
            
            // 3. Bold text ko waqayi Bold karo
            strong: ({node, ...props}) => <strong className="font-extrabold text-indigo-600" {...props} />,
            
            // 4. Links ko blue aur underline karo
            a: ({node, ...props}) => <a className="text-blue-600 hover:underline" target="_blank" {...props} />
        }}
    >
        {job.description || "No description provided."}
    </ReactMarkdown>
</article>
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



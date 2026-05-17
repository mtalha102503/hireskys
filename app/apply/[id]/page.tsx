"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { 
  Briefcase, 
  MapPin, 
  AlertTriangle, 
  Send, 
  Link as LinkIcon, 
  Clock, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id; // URL se Job ID mil jayegi

  const [job, setJob] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // 🔴 Tumhara Master Idea: Country Mismatch State
  const [countryMismatch, setCountryMismatch] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    resumeUrl: '',
    portfolioLink: '',
    coverLetter: '',
    timezone: ''
  });

  useEffect(() => {
    fetchJobAndUser();
  }, [jobId]);

  async function fetchJobAndUser() {
    try {
      // 1. Job details fetch karo
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      // 2. Current User (Candidate) check karo
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        
        // 3. User ki profile fetch karo taake uski country pata chale
        const { data: profileData } = await supabase
          .from('profiles')
          .select('country')
          .eq('id', session.user.id)
          .single();

        // 🧠 The Magic Logic: Country Mismatch Check
        if (jobData.location && profileData?.country) {
          // Agar job USA ki hai aur user Pakistan ka hai, toh warning on kardo
          const jobLoc = jobData.location.toLowerCase();
          const userLoc = profileData.country.toLowerCase();
          
          if (!jobLoc.includes('worldwide') && !jobLoc.includes('anywhere') && !jobLoc.includes(userLoc)) {
            setCountryMismatch(true);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login to apply!");
      router.push('/login');
      return;
    }

    setSubmitting(true);

    try {
      // 🟢 ATS (applications table) mein candidate ka data insert karna
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          candidate_id: currentUser.id,
          employer_id: job.employer_id, // HR ka ID taake uske dashboard mein show ho
          resume_url: formData.resumeUrl,
          portfolio_link: formData.portfolioLink,
          cover_letter: formData.coverLetter,
          candidate_timezone: formData.timezone,
          status: 'New',
          ai_match_score: Math.floor(Math.random() * (99 - 60 + 1)) + 60 // Abhi fake score 60-99 de rahe hain
        });

      if (error) throw error;
      
      setSuccess(true);
    } catch (error: any) {
      console.error("Error submitting application:", error);
      alert("Failed to submit: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
      </div>
    );
  }

  if (!job) return <div className="text-center mt-20 text-xl font-bold">Job not found.</div>;

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center"><CheckCircle2 size={80} className="text-emerald-500" /></div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">Application Sent!</h1>
        <p className="text-slate-500 dark:text-slate-400">Your application has been delivered to the employer's HireSkys ATS.</p>
        <Link href="/history" className="inline-block mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all">
          View Application History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 font-sans animate-in fade-in duration-500">
      
      {/* 📌 Header: Job Info */}
      <div className="mb-8">
        <Link href={`/jobs/${job.id}`} className="text-sm font-bold text-indigo-600 hover:underline mb-2 inline-block">&larr; Back to Job</Link>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Apply for {job.title}
        </h1>
        <div className="flex items-center gap-4 mt-3 text-sm font-medium text-slate-500">
          <span className="flex items-center gap-1"><Briefcase size={16} /> {job.company_name || 'Company'}</span>
          <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
        </div>
      </div>

      {/* ⚠️ TUMHARA MASTER IDEA: Country Mismatch Warning */}
      {countryMismatch && (
        <div className="mb-8 p-4 bg-orange-50 dark:bg-orange-500/10 border-l-4 border-orange-500 rounded-r-xl flex items-start gap-3">
          <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-orange-800 dark:text-orange-400">Location Mismatch Detected</h3>
            <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
              This job requires candidates from <strong>{job.location}</strong>, but your profile indicates you are located elsewhere. You can still apply, but the employer may prioritize local candidates.
            </p>
          </div>
        </div>
      )}

      {/* 📌 Application Form */}
      <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resume URL (Google Drive / Dropbox link for now, UI simple rakhne k liye) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <LinkIcon size={16} className="text-indigo-500" /> Resume / CV Link
              </label>
              <input 
                type="url" 
                required
                placeholder="Google Drive, Dropbox, or Notion link..." 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:text-white transition-colors"
                value={formData.resumeUrl}
                onChange={(e) => setFormData({...formData, resumeUrl: e.target.value})}
              />
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Clock size={16} className="text-indigo-500" /> Your Timezone
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. GMT+5 (Pakistan)" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:text-white transition-colors"
                value={formData.timezone}
                onChange={(e) => setFormData({...formData, timezone: e.target.value})}
              />
            </div>
          </div>

          {/* Portfolio/GitHub Link */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Portfolio / GitHub Link (Optional)</label>
            <input 
              type="url" 
              placeholder="https://github.com/yourusername" 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:text-white transition-colors"
              value={formData.portfolioLink}
              onChange={(e) => setFormData({...formData, portfolioLink: e.target.value})}
            />
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Cover Letter / Note to Employer</label>
            <textarea 
              rows={5} 
              required
              placeholder="Tell the employer why you are a great fit for this remote role..." 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:text-white transition-colors resize-none"
              value={formData.coverLetter}
              onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full flex justify-center items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30 text-lg"
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
          
        </form>
      </div>

    </div>
  );
}
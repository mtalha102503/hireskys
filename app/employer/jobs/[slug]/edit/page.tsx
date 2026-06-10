"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic'; 
import { CATEGORIES } from '@/lib/categories';
import { 
  Briefcase, FileText, Layers, Loader2, MapPin, 
  Clock, DollarSign, ArrowLeft, CheckCircle, Award,
  HelpCircle, Plus, Trash2, Lock
} from 'lucide-react';
import Link from 'next/link';
import 'react-quill-new/dist/quill.snow.css';

// ReactQuill ko dynamic import karna zaroori hai Next.js mein
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
const EXP_LEVELS = ["Entry Level", "Junior", "Mid-Level", "Senior", "Lead", "Executive"];

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, false] }], 
    ['bold', 'italic', 'underline', 'strike'], 
    [{ 'color': [] }, { 'background': [] }], 
    [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
    [{ 'indent': '-1'}, { 'indent': '+1' }], 
    [{ 'align': [] }], 
    ['link', 'code-block', 'blockquote'], 
    ['clean'] 
  ],
};

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);

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
    // 🟢 VIP JADOO: Nayi Form Configuration State
    formConfig: {
      coverLetter: 'optional', 
      portfolio: 'optional',
      linkedin: 'required'
    }
  });
  const [newQuestion, setNewQuestion] = useState('');

  // 🟢 1. Page load hote hi Job ka purana data fetch karo
  useEffect(() => {
    async function fetchJobToEdit() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login');
        return;
      }
      setUser(session.user);

      // Slug ki base par job nikalo (Aur ensure karo ke ye sirf isi employer ki job ho)
      const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('slug', params.slug)
        .eq('employer_id', session.user.id) 
        .single();

      if (error || !job) {
        alert("Job not found or you don't have permission to edit it.");
        router.push('/employer/jobs');
        return;
      }

      // Data form mein bhar do
      setFormData({
        title: job.title || '',
        location: job.location || '',
        salary: job.salary_range || '',
        jobType: job.job_type || 'Full-time',
        description: job.description || '',
        category: job.category || '',
        experience: job.experience_level || 'Mid-Level',
        tags: job.tags || [],
        screeningQuestions: job.screening_questions || [],
        // 🟢 VIP JADOO: Database se purani setting nikalo, agar na ho tou default
        formConfig: job.form_config || {
          coverLetter: 'optional',
          portfolio: 'optional',
          linkedin: 'required'
        }
      });
      setLoading(false);
    }

    fetchJobToEdit();
  }, [params.slug, router]);

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setFormData({ ...formData, screeningQuestions: [...formData.screeningQuestions, newQuestion.trim()] });
      setNewQuestion(''); 
    }
  };

  const removeQuestion = (index: number) => {
    const updated = [...formData.screeningQuestions];
    updated.splice(index, 1);
    setFormData({ ...formData, screeningQuestions: updated });
  };
const formatLocation = (loc: string) => {
  if (!loc || loc.trim() === '') return 'Remote';
  let cleanLoc = loc.replace(/remote/ig, '').replace(/[()\-]/g, '').trim();
  if (cleanLoc === '') return 'Remote';
  return `Remote (${cleanLoc})`;
};
  // 🟢 2. Update Function (Dhyan rahay yahan title aur category update NAHI honge)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const isDescriptionEmpty = formData.description.replace(/<(.|\n)*?>/g, '').trim().length === 0;

    if (isDescriptionEmpty) {
      alert("Job description cannot be empty.");
      setSaving(false);
      return;
    }

    try {
      // Clean inline styles from pasted text
      const sanitizedDescription = formData.description
        .replace(/background-color\s*:[^;]+;/gi, '')
        .replace(/background\s*:[^;]+;/gi, '')
        .replace(/color\s*:[^;]+;/gi, '');

      const { error } = await supabase
        .from('jobs')
        .update({
          location: formatLocation(formData.location),
          salary_range: formData.salary,
          job_type: formData.jobType,
          experience_level: formData.experience,
          description: sanitizedDescription, 
          screening_questions: formData.screeningQuestions,
          // 🟢 VIP JADOO: Nayi Settings Database me Update karo
          form_config: formData.formConfig
          // 🚫 VIP: Title, Category, aur Tags jaan boojh kar update nahi kar rahe
        })
        .eq('slug', params.slug)
        .eq('employer_id', user.id);

      if (error) throw error;

      setSuccess(true);
      window.scrollTo(0, 0);
      
      // Thori der baad wapis postings page par bhej do
      setTimeout(() => {
        router.push('/employer/jobs');
      }, 2000);

    } catch (error: any) {
      alert('Error updating job: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10 animate-in fade-in duration-500">
      
      {/* 📌 Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/employer/jobs" className="p-2.5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Edit Job 
            <span className="text-xs font-bold bg-amber-100 text-amber-600 px-3 py-1 rounded-full uppercase tracking-wider ml-2 border border-amber-200">Edit Mode</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
            Update your job details below. Core details are locked to prevent abuse.
          </p>
        </div>
      </div>

      {success ? (
        <div className="bg-white dark:bg-[#111625] p-10 rounded-3xl border border-emerald-200 dark:border-emerald-900/50 text-center shadow-xl">
          <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">Job Updated Successfully!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Your changes have been saved and are now live. Redirecting back to your postings...
          </p>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-8">
          
          {/* SECTION 1: JOB DETAILS */}
          <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Briefcase size={20}/> 
              </div>
              Job Details
            </h2>

            <div className="space-y-6">
              {/* 🔒 LOCKED TITLE */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 flex justify-between items-center">
                  <span>Job Title *</span>
                  <span className="flex items-center gap-1 text-[10px] bg-red-50 text-red-500 border border-red-200 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                    <Lock size={10} /> Locked
                  </span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.title}
                    disabled={true}
                    className="w-full p-4 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed dark:bg-[#0a0d16] dark:border-slate-800 dark:text-slate-500 font-medium text-lg"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[10px] text-red-500 font-medium ml-1">
                    To prevent system abuse, Job Title cannot be changed after posting.
                  </p>
                  <Link 
                    href="/blog/how-hireskys-ats-works#locked-fields" 
                    target="_blank"
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    Learn why
                  </Link>
                </div>
              </div>

              {/* Editable Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
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

          {/* SECTION 2: DESCRIPTION (Editable) */}
          <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 relative z-10">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                    <FileText size={20}/> 
                  </div>
                  Job Description *
                </h2>
            </div>

            <div className="rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 transition-all duration-300 bg-white dark:bg-[#0B0F19]">
              <ReactQuill 
                theme="snow"
                value={formData.description}
                onChange={(value) => setFormData({...formData, description: value})}
                modules={modules}
                className="text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* SECTION 2.5: SCREENING QUESTIONS (Editable) */}
          <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-2">
              <div className="p-2 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-lg text-fuchsia-600 dark:text-fuchsia-400">
                <HelpCircle size={20}/> 
              </div>
              Screening Questions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              Add or remove screening questions for candidates.
            </p>

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
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50"
              >
                <Plus size={18} /> Add
              </button>
            </div>

            {formData.screeningQuestions.length > 0 && (
              <div className="space-y-3 animate-in fade-in duration-300">
                {formData.screeningQuestions.map((q, index) => (
                  <div key={index} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700">
                    <div className="flex gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{q}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeQuestion(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 3: 🔒 LOCKED CATEGORY & SKILLS */}
          <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <h2 className="text-xl font-bold flex items-center justify-between gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                  <Layers size={20}/> 
                </div>
                Category & Skills
              </div>
              <span className="flex items-center gap-1 text-[10px] bg-red-50 text-red-500 border border-red-200 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                <Lock size={10} /> Locked
              </span>
            </h2>
            
            {/* Locked Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10 opacity-60">
              {Object.entries(CATEGORIES).map(([catName, data]) => {
                const Icon = (data as any).icon; // TypeScript fix yahan bhi
                const isSelected = formData.category === catName;
                
                return (
                  <button
                    key={catName} 
                    type="button"
                    disabled={true}
                    className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all cursor-not-allowed ${
                      isSelected 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 shadow-sm' 
                      : 'bg-slate-50 dark:bg-[#0B0F19] border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-indigo-500">
                        <CheckCircle size={16} strokeWidth={3} />
                      </div>
                    )}
                    <Icon size={28} className={`mb-3 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}/>
                    <span className={`text-sm font-bold text-center ${isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-600 dark:text-slate-400'}`}>
                      {catName}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Locked Tags */}
            <div className="bg-slate-50 dark:bg-[#0B0F19] p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 opacity-70">
              <label className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-4 block">
                Selected Skills (Locked)
              </label>
              <div className="flex flex-wrap gap-3">
                {formData.tags.map((tag) => (
                  <div key={tag} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-indigo-600 border border-indigo-600 text-white cursor-not-allowed">
                    {tag} <CheckCircle size={16} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* SECTION 4: ⚙️ APPLICATION FORM SETTINGS */}
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
          {/* SUBMIT BUTTON */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={saving}
              className="px-10 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {saving ? <Loader2 className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
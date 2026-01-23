"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic'; 

// --- ICONS ---
import { 
  Briefcase, Globe, Link as LinkIcon, CheckCircle, 
  Layout, Code, Video, Edit3, Smartphone, Cpu, 
  ArrowRight, Layers, DollarSign, MapPin, Mail, FileText, Loader2, Info
} from 'lucide-react';
import Link from 'next/link';

// 👈 CSS abhi bhi wahi use hogi, tension not
import 'react-quill-new/dist/quill.snow.css'; 

// 👈 IMPORT CHANGE: 'react-quill' ki jagah 'react-quill-new'
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// --- CATEGORIES CONFIGURATION ---
const CATEGORIES = {
  "Development": {
    icon: Code,
    sub: ["React", "Next.js", "Node.js", "Python", "Shopify", "WordPress", "Web3", "Frontend", "Backend"]
  },
  "Mobile App": {
    icon: Smartphone,
    sub: ["React Native", "Flutter", "iOS", "Swift", "Android", "Kotlin"]
  },
  "Video & Motion": {
    icon: Video,
    sub: ["Video Editor", "Premiere Pro", "After Effects", "3D Artist", "Thumbnail Artist", "Short Form"]
  },
  "Design & UI": {
    icon: Layout,
    sub: ["UI/UX", "Figma", "Web Design", "Logo Design", "Graphic Design"]
  },
  "Marketing": {
    icon: Globe,
    sub: ["SEO", "Facebook Ads", "Google Ads", "Email Marketing", "Copywriter", "Growth"]
  },
  "Writing": {
    icon: Edit3,
    sub: ["Ghostwriter", "Technical Writer", "Scriptwriter", "Content Writer"]
  },
  "New Era (AI)": {
    icon: Cpu,
    sub: ["AI Engineer", "Automation", "LLM", "Python Script"]
  }
};

// --- EDITOR TOOLBAR SETTINGS ---
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }], 
    ['bold', 'italic', 'underline', 'strike'], 
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'code-block', 'blockquote'], 
    ['clean'] 
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', // List hi bullets aur numbers dono ko handle karega
  'link', 'code-block', 'blockquote'
];

export default function PostJob() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    email: '', 
    link: '',
    location: '',
    salary: '',
    description: '',
    category: '',
    tags: []
  });

  const toggleTag = (tag) => {
    if (formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    } else {
      if (formData.tags.length < 3) {
        setFormData({ ...formData, tags: [...formData.tags, tag] });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Quill empty check
    const isDescriptionEmpty = formData.description.replace(/<(.|\n)*?>/g, '').trim().length === 0;

    if (!formData.title || !formData.company || !formData.link || !formData.category || isDescriptionEmpty) {
      alert("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('jobs').insert([
        {
          title: formData.title,
          source: formData.company,
          link: formData.link,
          category: formData.category,
          tags: formData.tags,
          description: formData.description,
          location: formData.location || 'Remote',
          salary_range: formData.salary,
          contact_email: formData.email,
          date_posted: new Date().toISOString(),
          approved: false,
          is_verified: true    
        }
      ]);

      if (error) throw error;

      setSuccess(true);
      setFormData({ 
        title: '', company: '', email: '', link: '', 
        location: '', salary: '', description: '', 
        category: '', tags: [] 
      });
      window.scrollTo(0, 0);

    } catch (error) {
      alert('Error posting job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100 pb-20">
       <Navbar />

      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          border-color: #e2e8f0;
          background-color: #f8fafc;
        }
        .ql-container.ql-snow {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          border-color: #e2e8f0;
          background-color: white;
          font-family: inherit;
          font-size: 1rem;
        }
        .ql-editor {
          min-height: 250px;
        }
        .dark .ql-toolbar.ql-snow {
          background-color: #1e293b;
          border-color: #334155;
        }
        .dark .ql-container.ql-snow {
          background-color: #0f172a;
          border-color: #334155;
          color: #e2e8f0;
        }
        .dark .ql-stroke {
          stroke: #94a3b8 !important;
        }
        .dark .ql-fill {
          fill: #94a3b8 !important;
        }
        .dark .ql-picker {
          color: #94a3b8 !important;
        }
      `}</style>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        
        {!success && (
          <div className="text-center mb-10 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
              Hire Top Talent
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              Post your job to thousands of verified developers, designers, and creators.
            </p>
          </div>
        )}

        {success ? (
          <div className="bg-white dark:bg-[#111625] p-10 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-2xl animate-scale-in">
            <div className="h-24 w-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-bold mb-3">Job Submitted!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
              Your listing is now under review. Once our admin team approves it, it will go live instantly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setSuccess(false)} 
                className="px-8 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Post Another
              </button>
              <Link href="/" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20">
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <>
          <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-4 mb-8 rounded-r-xl shadow-sm animate-fade-in-up">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Globe className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
                  Remote & Freelance Only
                </h3>
                <div className="mt-1 text-sm text-amber-700 dark:text-amber-500 leading-relaxed">
                  <p>
                    HireSkys is a <strong>strictly remote</strong> platform. Please ensure your listing is for 
                    <strong> 100% remote work</strong> or freelance contracts.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up delay-100">
            
            <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Briefcase size={20}/> 
                </div>
                Job Details
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Job Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Senior Video Editor" 
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-lg transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Company Name *</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-4 text-slate-400" size={18}/>
                      <input 
                        type="text" 
                        placeholder="e.g. Acme Studio" 
                        className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Application Link *</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-4 text-slate-400" size={18}/>
                      <input 
                        type="url" 
                        placeholder="https:// or mailto:" 
                        className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={formData.link}
                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-slate-400" size={18}/>
                      <input 
                        type="text" 
                        placeholder="e.g. Remote (Worldwide)"
                        className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Salary Range (Optional)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-4 text-slate-400" size={18}/>
                      <input 
                        type="text" 
                        placeholder="e.g. $50k - $80k or Hourly" 
                        className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={formData.salary}
                        onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Your Email (Private) *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-400" size={18}/>
                    <input 
                      type="email" 
                      placeholder="For admin use only" 
                      className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: DESCRIPTION (REACT QUILL NEW 🚀) */}
            <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                  <FileText size={20}/> 
                </div>
                Description
              </h2>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Job Description *</label>
                
                {/* 🌟 REACT QUILL NEW EDITOR */}
                <div className="rounded-xl overflow-hidden">
                    <ReactQuill 
                        theme="snow"
                        value={formData.description}
                        onChange={(value) => setFormData({...formData, description: value})}
                        modules={modules}
                        formats={formats}
                        placeholder="Describe the role responsibilities, requirements, and benefits..."
                    />
                </div>
                
                <p className="text-xs mt-2 italic text-slate-400 flex items-center gap-1">
                    <Info size={12}/> Pro tip: Shortcuts like Ctrl+B (Bold) and Ctrl+I (Italic) work now!
                </p>

              </div>
            </div>

            {/* SECTION 3: CATEGORIZATION */}
            <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                  <Layers size={20}/> 
                </div>
                Category & Skills
              </h2>

              <div className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-3">Select Category *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(CATEGORIES).map(([catName, data]) => {
                      const Icon = data.icon;
                      const isSelected = formData.category === catName;
                      return (
                        <button
                          key={catName}
                          type="button"
                          onClick={() => setFormData({...formData, category: catName, tags: []})}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                            isSelected 
                              ? 'bg-indigo-600 text-white border-transparent shadow-lg scale-[1.02]' 
                              : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon size={24} className="mb-2"/>
                          <span className="text-sm font-bold">{catName}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Sub-Tags Selection */}
                {formData.category && (
                  <div className="animate-fade-in-up">
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-3">
                      Select Tags (Max 3) <span className="text-indigo-500 font-normal">- Helps in matching</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES[formData.category].sub.map(tag => {
                        const isSelected = formData.tags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                              isSelected
                                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                            }`}
                          >
                            {tag} {isSelected && '✓'}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PRICING INFO */}
            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 flex items-start gap-4">
              <div className="bg-indigo-100 dark:bg-indigo-800 p-2.5 rounded-full text-indigo-600 dark:text-indigo-300 flex-shrink-0">
                 <DollarSign size={20} />
              </div>
              <div>
                 <h3 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm md:text-base">Standard Listing (Currently Free)</h3>
                 <p className="text-xs md:text-sm text-indigo-700 dark:text-indigo-400 mt-1 leading-relaxed">
                   During our beta period, all verified listings are completely free. Post now to lock in your visibility.
                 </p>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xl font-bold rounded-2xl hover:bg-indigo-600 dark:hover:bg-slate-200 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  Post Job Now <ArrowRight />
                </>
              )}
            </button>

          </form>
          </>
        )}
      </div>
    </div>
  );
}

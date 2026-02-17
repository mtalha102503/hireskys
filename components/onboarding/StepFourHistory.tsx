"use client";
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Plus, Trash2, Globe, Linkedin, CheckCircle, ArrowLeft } from 'lucide-react';

interface StepProps {
  data: any;
  update: (data: any) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

export default function StepFourHistory({ data, update, onSubmit, onBack, loading }: StepProps) {
  
  // Validation: Education ya Experience mein se koi ek hona chahiye
  const isFormValid = data.experience.length > 0 || data.education.length > 0;

  // --- EXPERIENCE HANDLERS ---
  const addExperience = () => {
    update((prev: any) => ({ ...prev, experience: [...prev.experience, { company: '', role: '', year: '' }] }));
  };
  const removeExperience = (index: number) => {
    const newExp = [...data.experience];
    newExp.splice(index, 1);
    update((prev: any) => ({ ...prev, experience: newExp }));
  };
  const updateExperience = (index: number, field: string, value: string) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    update((prev: any) => ({ ...prev, experience: newExp }));
  };

  // --- EDUCATION HANDLERS ---
  const addEducation = () => {
    update((prev: any) => ({ ...prev, education: [...prev.education, { school: '', degree: '', year: '' }] }));
  };
  const removeEducation = (index: number) => {
    const newEdu = [...data.education];
    newEdu.splice(index, 1);
    update((prev: any) => ({ ...prev, education: newEdu }));
  };
  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    update((prev: any) => ({ ...prev, education: newEdu }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="bg-white dark:bg-[#151b2d] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2">History & Education 🎓</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Last step! Tell us where you've been. This builds trust with clients.
        </p>
      </div>

      {/* 1. WORK EXPERIENCE */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Briefcase size={16} className="text-indigo-500"/> Work Experience
          </label>
          <button onClick={addExperience} className="text-indigo-600 font-bold text-xs flex items-center gap-1 hover:underline">
            <Plus size={14} /> Add Role
          </button>
        </div>

        {data.experience.map((item: any, index: number) => (
          <div key={index} className="p-4 mb-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 relative">
            <button onClick={() => removeExperience(index)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Company Name" value={item.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} className="p-2 bg-white dark:bg-slate-800 border rounded-lg text-sm outline-none focus:border-indigo-500" />
              <input type="text" placeholder="Job Title" value={item.role} onChange={(e) => updateExperience(index, 'role', e.target.value)} className="p-2 bg-white dark:bg-slate-800 border rounded-lg text-sm outline-none focus:border-indigo-500" />
              <input type="text" placeholder="Years (e.g. 2021-2023)" value={item.year} onChange={(e) => updateExperience(index, 'year', e.target.value)} className="col-span-2 p-2 bg-white dark:bg-slate-800 border rounded-lg text-sm outline-none focus:border-indigo-500" />
            </div>
          </div>
        ))}
        {data.experience.length === 0 && <div className="text-xs text-slate-400 text-center py-4 border border-dashed rounded-xl">No experience added (Optional for entry level)</div>}
      </div>

      {/* 2. EDUCATION */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <GraduationCap size={16} className="text-indigo-500"/> Education
          </label>
          <button onClick={addEducation} className="text-indigo-600 font-bold text-xs flex items-center gap-1 hover:underline">
            <Plus size={14} /> Add School
          </button>
        </div>

        {data.education.map((item: any, index: number) => (
          <div key={index} className="p-4 mb-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 relative">
            <button onClick={() => removeEducation(index)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
            <div className="grid grid-cols-1 gap-3">
              <input type="text" placeholder="School / University" value={item.school} onChange={(e) => updateEducation(index, 'school', e.target.value)} className="p-2 bg-white dark:bg-slate-800 border rounded-lg text-sm outline-none focus:border-indigo-500" />
              <div className="grid grid-cols-3 gap-3">
                <input type="text" placeholder="Degree" value={item.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} className="col-span-2 p-2 bg-white dark:bg-slate-800 border rounded-lg text-sm outline-none focus:border-indigo-500" />
                <input type="text" placeholder="Year" value={item.year} onChange={(e) => updateEducation(index, 'year', e.target.value)} className="p-2 bg-white dark:bg-slate-800 border rounded-lg text-sm outline-none focus:border-indigo-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. SOCIAL LINKS */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Social Links (Optional)</label>
        <div className="space-y-3">
          <div className="relative">
            <Linkedin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="LinkedIn URL" 
              value={data.social_links?.linkedin || ''}
              onChange={(e) => update((prev: any) => ({ ...prev, social_links: { ...prev.social_links, linkedin: e.target.value } }))}
              className="w-full pl-9 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="relative">
            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Portfolio / GitHub / Website" 
              value={data.social_links?.website || ''}
              onChange={(e) => update((prev: any) => ({ ...prev, social_links: { ...prev.social_links, website: e.target.value } }))}
              className="w-full pl-9 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* FOOTER - FINAL SUBMIT */}
      <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
          <ArrowLeft size={20} /> Back
        </button>

        <button 
          onClick={onSubmit}
          disabled={!isFormValid || loading}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
            isFormValid && !loading
              ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30 hover:-translate-y-1' 
              : 'bg-slate-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Saving Profile...' : 'Finish Setup'} 
          {!loading && <CheckCircle size={20} />}
        </button>
      </div>
    </motion.div>
  );
}
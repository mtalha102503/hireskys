"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, UploadCloud, Plus, Trash2, Link as LinkIcon, ArrowRight, ArrowLeft } from 'lucide-react';

interface StepProps {
  data: any;
  update: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepThreeProof({ data, update, onNext, onBack }: StepProps) {
  
  // Validation: Resume hona chahiye YA kam se kam 1 project ho
  const isFormValid = data.resume || data.projects.length > 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      update((prev: any) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const addProject = () => {
    const newProject = { title: '', role: '', link: '' };
    update((prev: any) => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const removeProject = (index: number) => {
    const newProjects = [...data.projects];
    newProjects.splice(index, 1);
    update((prev: any) => ({ ...prev, projects: newProjects }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    const newProjects = [...data.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    update((prev: any) => ({ ...prev, projects: newProjects }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="bg-white dark:bg-[#151b2d] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2">Proof of Work 📂</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Show us you're the real deal. Upload your CV and add your best projects.
        </p>
      </div>

      {/* 1. RESUME UPLOAD SECTION */}
      <div className="mb-10">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
          Upload Resume / CV (PDF)
        </label>
        
        <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${data.resume ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center gap-3">
            {data.resume ? (
              <>
                <div className="p-4 bg-green-100 text-green-600 rounded-full">
                  <FileText size={32} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-lg">{data.resume.name}</p>
                  <p className="text-green-600 text-sm font-medium">Ready to upload ✅</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-indigo-50 dark:bg-slate-800 text-indigo-500 rounded-full">
                  <UploadCloud size={32} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-lg">Drop your PDF here</p>
                  <p className="text-slate-500 text-sm">or click to browse</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. PORTFOLIO PROJECTS */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
            Featured Projects
          </label>
          <button onClick={addProject} className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
            <Plus size={16} /> Add Project
          </button>
        </div>

        <div className="space-y-4">
          {data.projects.map((project: any, index: number) => (
            <div key={index} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 relative group">
              <button onClick={() => removeProject(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Project Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. E-commerce App"
                    value={project.title}
                    onChange={(e) => updateProject(index, 'title', e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Your Role</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Lead Developer"
                    value={project.role}
                    onChange={(e) => updateProject(index, 'role', e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Project Link</label>
                  <div className="relative">
                    <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={project.link}
                      onChange={(e) => updateProject(index, 'link', e.target.value)}
                      className="w-full pl-8 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {data.projects.length === 0 && (
            <div className="text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-sm">
              No projects added yet. Adding one increases your hiring chance by 40%.
            </div>
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <button 
          onClick={onNext}
          disabled={!isFormValid}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
            isFormValid 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transform hover:-translate-y-1' 
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          Continue <ArrowRight size={20} />
        </button>
      </div>

    </motion.div>
  );
}
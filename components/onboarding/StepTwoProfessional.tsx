"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, DollarSign, Briefcase, Star, Zap, Award, ArrowRight, Camera, Upload } from 'lucide-react';
import Image from 'next/image';

interface StepProps {
  data: any;
  update: (data: any) => void;
  onNext: () => void;
}

export default function StepTwoProfessional({ data, update, onNext }: StepProps) {
  
  // Local preview state for immediate feedback
  const [preview, setPreview] = useState<string | null>(data.avatar_url || null);
useEffect(() => {
    if (data.avatar_url) {
      setPreview(data.avatar_url);
    }
  }, [data.avatar_url]);
  // Validation Logic
  const isFormValid = data.experience_level && data.hourly_rate && data.bio.length > 50;

  const handleUpdate = (field: string, value: any) => {
    update((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Parent ko file bhejo upload ke liye
      update((prev: any) => ({ ...prev, avatar_file: file }));
      // Local preview dikhao
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const LEVELS = [
    { id: 'Entry Level', label: 'Junior / Entry', icon: Zap, desc: 'I am just starting (< 2 yrs)' },
    { id: 'Mid Level', label: 'Mid-Level', icon: Briefcase, desc: 'I have solid experience (2-5 yrs)' },
    { id: 'Senior Level', label: 'Senior / Expert', icon: Award, desc: 'I am a pro leader (5+ yrs)' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="bg-white dark:bg-[#151b2d] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl"
    >
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-black mb-2">Professional Identity 🆔</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Upload a photo & set your rates. Faces build trust!
        </p>
      </div>

      {/* 📸 AVATAR UPLOAD SECTION (NEW) */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative group cursor-pointer">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarChange}
            className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
          />
          
          <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all relative ${preview ? 'border-indigo-600' : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'}`}>
            {preview ? (
              <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-slate-300 dark:text-slate-600" />
            )}
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Camera className="text-white" size={24} />
            </div>
          </div>

          <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-[#151b2d] z-10">
             <Upload size={14} />
          </div>
        </div>
        <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-wide">Tap to Upload</p>
      </div>

      {/* 1. Experience Level */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
          Experience Level
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => handleUpdate('experience_level', level.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col gap-3 ${
                data.experience_level === level.id
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <div className={`p-2 rounded-full w-fit ${data.experience_level === level.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <level.icon size={20} />
              </div>
              <div>
                <div className="font-bold text-sm">{level.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight">{level.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Hourly Rate */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          Hourly Rate ($)
        </label>
        <div className="relative max-w-xs">
          <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="number" 
            placeholder="e.g. 25"
            value={data.hourly_rate}
            onChange={(e) => handleUpdate('hourly_rate', e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">/ hr</span>
        </div>
      </div>

      {/* 3. Professional Bio */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          Professional Bio (Elevator Pitch)
        </label>
        <textarea 
          rows={4}
          placeholder="I am a Full Stack Developer with a passion for building scalable web applications..."
          value={data.bio}
          onChange={(e) => handleUpdate('bio', e.target.value)}
          className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
        ></textarea>
        <div className="flex justify-between mt-2 text-xs">
          <span className={`${data.bio.length < 50 ? 'text-red-500' : 'text-green-500'}`}>
            {data.bio.length < 50 ? 'Write at least 50 characters' : 'Looks good!'}
          </span>
          <span className="text-slate-400">{data.bio.length}/500</span>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
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
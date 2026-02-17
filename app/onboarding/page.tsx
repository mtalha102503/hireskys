"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, LogOut, Sparkles } from 'lucide-react'; 
import Link from 'next/link';
import Image from 'next/image';

// Import Components
import StepTwoProfessional from '@/components/onboarding/StepTwoProfessional';
import StepThreeProof from '@/components/onboarding/StepThreeProof';
import StepFourHistory from '@/components/onboarding/StepFourHistory';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Master State
  const [formData, setFormData] = useState({
    experience_level: '',
    hourly_rate: '',
    bio: '',
    resume: null as File | null,
    resume_url: null as string | null,
    projects: [] as any[],
    experience: [] as any[],
    education: [] as any[],
    social_links: { linkedin: '', website: '' }
  });

  // Data Load Logic (SAME AS BEFORE)
  useEffect(() => {
    const loadExistingData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFormData((prev) => ({
            ...prev,
            experience_level: profile.experience_level || '',
            hourly_rate: profile.hourly_rate || '',
            bio: profile.bio || '',
            resume_url: profile.resume_url || null,
            projects: profile.projects || [],
            avatar_url: profile.avatar_url || null,
            experience: profile.experience || [],
            education: profile.education || [],
            social_links: profile.custom_links || { linkedin: '', website: '' }
          }));
        }
      }
    };
    loadExistingData();
  }, []);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 2));

  // Submit Logic (SAME AS BEFORE)
  const handleSubmitProfile = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let resumeUrl = formData.resume_url;

      if (formData.resume) {
        const fileExt = formData.resume.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('resumes').upload(fileName, formData.resume);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(fileName);
        resumeUrl = publicUrlData.publicUrl;
      }

      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          experience_level: formData.experience_level,
          hourly_rate: formData.hourly_rate,
          bio: formData.bio,
          custom_links: formData.social_links,
          resume_url: resumeUrl,
          projects: formData.projects,
          experience: formData.experience,
          education: formData.education,
          is_onboarded: true
        })
        .eq('id', user.id);

      if (dbError) throw dbError;
      router.push('/profile');

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for dynamic headers
  const getStepHeader = () => {
    switch(currentStep) {
        case 2: return { title: "Professional Identity", sub: "Let's define your expertise and rates." };
        case 3: return { title: "Showcase Your Work", sub: "Add projects that prove your skills." };
        case 4: return { title: "History & Education", sub: "Your background tells your story." };
        default: return { title: "Welcome", sub: "Let's get started." };
    }
  };

  const headerInfo = getStepHeader();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white dark:from-[#0f172a] dark:via-[#0B0F19] dark:to-[#0B0F19] text-slate-900 dark:text-white flex flex-col items-center selection:bg-indigo-500/30">
      
      {/* 🔵 NAVBAR (Untouched) */}
      <nav className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          
          <Link href="/" className="flex items-center gap-5 md:gap-5 pointer-events-none">
            <Image 
              src="/logo2.png" 
              alt="HireSkys Logo"
              width={0}
              height={0}
              sizes="100vw"
              className="h-9 w-auto md:h-9 object-contain -mr-2 md:-mr-3" 
              priority
            />

            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                HireSkys
              </span>
              <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 w-fit">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                </span>
                <span className="text-[8px] md:text-[9px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest leading-none">
                  Onboarding
                </span>
              </div>
            </div>
          </Link>

          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
            className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 transition-all bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-full border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden sm:inline">Sign Out</span>
          </button>

        </div>
      </nav>

      {/* 🟢 CONTENT SECTION */}
      <main className="w-full flex-1 flex flex-col items-center py-12 px-4 md:px-6 max-w-5xl">
        
        {/* Dynamic Header Text */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentStep}
            className="text-center mb-10 space-y-2"
        >
            <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                {headerInfo.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-md mx-auto">
                {headerInfo.sub}
            </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full max-w-3xl mb-12">
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full mx-2"></div>
            
            <motion.div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] mx-2"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            ></motion.div>

            {[
              { id: 1, label: 'Basics', completed: true },
              { id: 2, label: 'Identity', completed: currentStep > 2 },
              { id: 3, label: 'Proof', completed: currentStep > 3 },
              { id: 4, label: 'History', completed: false }
            ].map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-3 relative group cursor-default">
                <motion.div 
                    initial={false}
                    animate={{ 
                        scale: currentStep === step.id ? 1.15 : 1,
                        backgroundColor: (step.completed || step.id === 1) ? '#10B981' : currentStep === step.id ? '#4F46E5' : 'var(--bg-inactive)'
                    }}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold border-4 transition-colors duration-300 z-10 text-sm md:text-base relative
                    ${(step.completed || step.id === 1) 
                        ? 'border-green-500 text-white shadow-lg shadow-green-500/20' 
                        : currentStep === step.id 
                          ? 'border-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-4 ring-indigo-100 dark:ring-indigo-900/30'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                >
                  {(step.completed || step.id === 1) ? <Check size={20} strokeWidth={3} /> : step.id}
                  
                  {currentStep === step.id && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-indigo-500 opacity-20"></span>
                  )}
                </motion.div>
                
                <span className={`text-[10px] md:text-xs font-bold tracking-wider uppercase transition-colors duration-300 ${currentStep >= step.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 🛠 FIX: Removed the "Glass Card" styling (bg-white, shadow, border) from this wrapper.
            Now it's just a transparent layout holder, so your inner component (StepTwo) 
            is the only "Card" visible. 
        */}
        <div className="w-full max-w-3xl relative">
            <motion.div 
                layout
                className="relative w-full" // Removed bg-white, shadow, border, padding
            >
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative z-10"
                    >
                        {currentStep === 2 && (
                            <StepTwoProfessional key="step2" data={formData} update={setFormData} onNext={nextStep} />
                        )}
                        {currentStep === 3 && (
                            <StepThreeProof key="step3" data={formData} update={setFormData} onNext={nextStep} onBack={prevStep} />
                        )}
                        {currentStep === 4 && (
                            <StepFourHistory key="step4" data={formData} update={setFormData} onSubmit={handleSubmitProfile} onBack={prevStep} loading={isSubmitting} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>

      </main>
    </div>
  );
}
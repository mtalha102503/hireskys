"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Briefcase, UserCheck, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function RoleSelection() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // 🚨 SEESION GUARD: Page load hote hi pehle session check karo
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Agar session nahi hai to wapis login par bhejo
        router.push('/login');
      } else {
        setCheckingSession(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleRoleSelection = async (role: 'seeker' | 'employer') => {
    try {
      setLoading(role);

      // Dobara double check karlete hain safe rehne ke liye
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Your session has expired. Please login again.");
        router.push('/login');
        return;
      }

      // 1. Supabase Auth mein user ke metadata mein role save karein
      const { error } = await supabase.auth.updateUser({
        data: { role: role }
      });

      if (error) throw error;

      // 2. Role ke mutabiq sahi page par redirect karein 🎉
      if (role === 'employer') {
        router.push('/employer/settings');
      } else {
        router.push('/complete-profile');
      }
    } catch (error: any) {
      alert("Error saving role: " + error.message);
      setLoading(null);
    }
  };

  // Jab tak session check ho raha hai loader dikhao
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <h2 className="text-xl font-bold">Checking session...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex flex-col justify-center items-center p-6 font-sans">
      
      {/* LOGO */}
      <div className="flex items-center gap-3 mb-10 animate-fade-in">
        <Image src="/logo2.png" alt="HireSkys Logo" width={50} height={50} className="rounded-2xl shadow-lg" />
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">HireSkys</h1>
      </div>

      <div className="max-w-2xl w-full bg-white dark:bg-[#111625] rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-8 animate-scale-up">
        
        <div className="space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome! Tell us about yourself
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
            How do you plan to use HireSkys? Select your account type below.
          </p>
        </div>

        {/* CARDS CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* JOB SEEKER CARD */}
          <button
            onClick={() => handleRoleSelection('seeker')}
            disabled={loading !== null}
            className="group flex flex-col items-center justify-center p-8 border-2 border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#161B2C] hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 text-center space-y-4 disabled:opacity-50 relative overflow-hidden"
          >
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <UserCheck size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">I'm a Job Seeker</h3>
              <p className="text-xs text-slate-400 mt-1">I want to find verified remote & freelance opportunities.</p>
            </div>
            {loading === 'seeker' && (
              <div className="absolute inset-0 bg-white/80 dark:bg-[#111625]/80 flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={24} />
              </div>
            )}
          </button>

          {/* EMPLOYER CARD */}
          <button
            onClick={() => handleRoleSelection('employer')}
            disabled={loading !== null}
            className="group flex flex-col items-center justify-center p-8 border-2 border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#161B2C] hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 text-center space-y-4 disabled:opacity-50 relative overflow-hidden"
          >
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Briefcase size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">I'm an Employer</h3>
              <p className="text-xs text-slate-400 mt-1">I want to post remote roles and utilize the Free ATS.</p>
            </div>
            {loading === 'employer' && (
              <div className="absolute inset-0 bg-white/80 dark:bg-[#111625]/80 flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-500" size={24} />
              </div>
            )}
          </button>

        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          Don't worry, you can access features or manage preferences later from your profile.
        </p>

      </div>
    </div>
  );
}

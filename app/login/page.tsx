"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { ArrowLeft, Loader2, Globe, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26-.19-.58z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = async () => {
    try {
        setLoading(true);
        setErrorMsg('');
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` }
        });
        if (error) throw error;
    } catch (error: any) { 
        setErrorMsg(error.message);
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0B0F19]">
      
      {/* LEFT SIDE: LOGIN OPTIONS */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 md:p-12 lg:p-24 relative animate-fade-in pt-20 md:pt-12">
        
        <Link href="/" className="absolute top-6 left-6 text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition font-medium text-xs md:text-sm z-10">
             <ArrowLeft size={16}/> Back to Home
        </Link>

        <div className="max-w-md mx-auto w-full">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-10 mt-4 flex items-center gap-3">
                <Image src="/logo2.png" alt="HireSkys Logo" width={40} height={40} className="rounded-xl shadow-md" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">HireSkys</h2>
            </div>

            <div className="mb-10">
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
                    Your next big role <br/>awaits.
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                    Join the elite network of remote professionals. Just one-click access to verified global opportunities.
                </p>
            </div>

            {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 dark:border-red-900/30 dark:bg-red-900/10">
                    {errorMsg}
                </div>
            )}

            <button 
                onClick={handleGoogleLogin} 
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 font-extrabold text-lg text-slate-700 dark:text-white bg-white dark:bg-[#111625] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
                {loading ? <Loader2 className="animate-spin text-indigo-500" /> : (
                    <>
                        <GoogleIcon />
                        <span>Continue with Google</span>
                        {/* Hover effect arrow */}
                        <ArrowLeft className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all absolute right-6 rotate-180" />
                    </>
                )}
            </button>

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                <Zap className="text-amber-500 w-4 h-4" /> Lightning fast onboarding. Takes less than 10 seconds.
            </div>
            
            <p className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                By continuing, you agree to HireSkys' <Link href="/terms" className="underline hover:text-indigo-500">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-indigo-500">Privacy Policy</Link>.
            </p>
        </div>
      </div>

      {/* RIGHT SIDE: BRANDING (Untouched) */}
      <div className="hidden lg:flex w-1/2 bg-[#0B0F19] relative overflow-hidden items-center justify-center p-12">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
           
           <div className="relative z-10 max-w-lg text-white space-y-8">
               <div className="flex items-center gap-4 mb-6">
                   <Image src="/logo2.png" alt="HireSkys Logo" width={80} height={80} className="rounded-2xl shadow-2xl shadow-indigo-500/50" />
                   <span className="text-4xl font-extrabold text-white tracking-tight">HireSkys</span>
               </div>
               <h2 className="text-5xl font-extrabold leading-tight">Find the unseen.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Build the future.</span></h2>
               <p className="text-lg text-slate-400 leading-relaxed">Join thousands of elite freelancers and developers accessing verified remote jobs before they go viral.</p>
               <div className="flex gap-4 pt-4">
                   <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-lg text-sm font-medium"><Globe className="text-indigo-400" size={16}/> Global Remote</div>
                   <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-lg text-sm font-medium"><ShieldCheck className="text-green-400" size={16}/> Verified Roles</div>
               </div>
           </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { resolveEmployerAccess, markAsEmployer } from '@/lib/account';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, Lock, Briefcase, ArrowRight, LogOut, GitBranch, Star, Wallet } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26-.19-.58z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);

// ============================================================
// AtsAuthForm — the ATS's OWN login/signup (separate from the
// job board's /login). Google OAuth only, same as the board,
// but it marks the flow with localStorage 'auth_intent=ats' so
// /auth/callback routes the user as an employer, and a session
// that already exists is handled right here:
//   employer -> dashboard, seeker -> explicit choice card.
// ============================================================

export default function AtsAuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [view, setView] = useState<'checking' | 'form' | 'seeker'>('checking');
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setView('form');
        return;
      }
      const access = await resolveEmployerAccess(session.user);
      if (access.isEmployer) {
        router.replace('/employer/dashboard');
      } else {
        setView('seeker');
      }
    })();
  }, [router]);

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      // Marker for /auth/callback: this flow belongs to the ATS.
      localStorage.setItem('auth_intent', 'ats');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (error: any) {
      localStorage.removeItem('auth_intent');
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  async function handleSwitch() {
    try {
      setSwitching(true);
      await markAsEmployer();
      router.replace('/employer/dashboard');
    } catch (e: any) {
      setErrorMsg(e.message || 'Could not switch this account.');
      setSwitching(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setView('form');
  }

  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0B0F19]">
      {/* LEFT: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 md:p-12 lg:p-24 relative pt-20 md:pt-12">
        <a href="https://ats.hireskys.com/" className="absolute top-6 left-6 text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition font-medium text-xs md:text-sm z-10">
          <ArrowLeft size={16} /> Back to ATS Home
        </a>

        <div className="max-w-md mx-auto w-full">
          <div className="lg:hidden mb-10 mt-4 flex items-center gap-3">
            <Image src="/logo.webp" alt="HireSkys ATS" width={40} height={40} className="rounded-xl shadow-md" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">HireSkys <span className="text-indigo-600">ATS</span></h2>
          </div>

          {view === 'checking' ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <Loader2 className="animate-spin text-indigo-600" size={36} />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Checking your session…</p>
            </div>
          ) : view === 'seeker' ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center">
                <Lock className="text-indigo-600 dark:text-indigo-400" size={28} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">You&apos;re signed in as a job seeker</h1>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                This Google account is a HireSkys <strong className="text-slate-700 dark:text-slate-200">job-seeker account</strong>.
                The ATS is a separate, employer-only area. Switch this account to an employer account,
                or sign out and use the Google account you hire with.
              </p>
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 dark:border-red-900/30 dark:bg-red-900/10">{errorMsg}</div>
              )}
              <div className="space-y-3">
                <button onClick={handleSwitch} disabled={switching} className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-60">
                  {switching ? <Loader2 className="animate-spin" size={18} /> : <Briefcase size={18} />} Use this account as an Employer account
                </button>
                <a href="https://www.hireskys.com/" className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all">
                  Go to the Job Board <ArrowRight size={16} />
                </a>
                <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 py-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-bold transition-colors">
                  <LogOut size={15} /> Sign out &amp; use a different account
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900/40 mb-4">
                  Employer Access Only
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
                  {isLogin ? <>Welcome back,<br />employer.</> : <>Hire smarter<br />with the ATS.</>}
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isLogin
                    ? 'Sign in to your HireSkys ATS — your pipeline, candidates and jobs, separate from the job board.'
                    : 'Create your employer account — post jobs, track every candidate in your own pipeline, and pay per post, never monthly.'}
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 dark:border-red-900/30 dark:bg-red-900/10">{errorMsg}</div>
              )}

              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 font-extrabold text-lg text-slate-700 dark:text-white bg-white dark:bg-[#111625] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin text-indigo-500" /> : (<><GoogleIcon /><span>{isLogin ? 'Continue with Google' : 'Create account with Google'}</span></>)}
              </button>

              <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                {isLogin ? (
                  <>New to HireSkys ATS? <Link href="/ats-signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Create an employer account</Link></>
                ) : (
                  <>Already have an employer account? <Link href="/ats-login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Sign in</Link></>
                )}
              </p>
              <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                Looking for a job instead? <a href="https://www.hireskys.com/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Job-seeker login →</a>
              </p>

              <p className="mt-10 text-center text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                By continuing, you agree to HireSkys&apos; <Link href="/terms" className="underline hover:text-indigo-500">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-indigo-500">Privacy Policy</Link>.
              </p>
            </>
          )}
        </div>
      </div>

      {/* RIGHT: ATS BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-[#0B0F19] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="flex items-center gap-4 mb-6">
            <Image src="/logo.webp" alt="HireSkys ATS" width={80} height={80} className="rounded-2xl shadow-2xl shadow-indigo-500/50" />
            <span className="text-4xl font-extrabold text-white tracking-tight">HireSkys <span className="text-indigo-400">ATS</span></span>
          </div>
          <h2 className="text-5xl font-extrabold leading-tight">Your hiring pipeline,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">finally separate.</span></h2>
          <p className="text-lg text-slate-400 leading-relaxed">An employer-only workspace — no job-seeker clutter, no mixed-up accounts. Just your jobs, your stages, your candidates.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-lg text-sm font-medium"><GitBranch className="text-indigo-400" size={16} /> Custom Stages</div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-lg text-sm font-medium"><Star className="text-amber-400" size={16} /> AI Match Scores</div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-lg text-sm font-medium"><Wallet className="text-emerald-400" size={16} /> No Monthly Fees</div>
          </div>
        </div>
      </div>
    </div>
  );
}

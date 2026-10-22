"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { resolveEmployerAccess, markAsEmployer } from '@/lib/account';
import { Loader2, Lock, Briefcase, ArrowRight, LogOut } from 'lucide-react';

// ============================================================
// EmployerGate — the strict wall around /employer/* (ATS area)
// - No session            -> /ats-login (the ATS login, not the board's)
// - Employer (role flag OR real employer data: company / active
//   team membership / posted jobs) -> through
// - Anyone else (job-seeker accounts) -> an explicit wall:
//   switch this account to employer, go to the job board, or
//   sign out and use a different account. Nothing renders behind it.
// ============================================================

export default function EmployerGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'ok' | 'wall'>('checking');
  const [switching, setSwitching] = useState(false);
  const [switchError, setSwitchError] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/ats-login');
        return;
      }
      const access = await resolveEmployerAccess(session.user);
      setState(access.isEmployer ? 'ok' : 'wall');
    })();
  }, [router]);

  async function handleSwitch() {
    try {
      setSwitching(true);
      setSwitchError('');
      await markAsEmployer();
      setState('ok');
      router.replace('/employer/dashboard');
    } catch (e: any) {
      setSwitchError(e.message || 'Could not switch this account. Please try again.');
      setSwitching(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/ats-login');
  }

  if (state === 'ok') return <>{children}</>;

  if (state === 'checking') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Verifying employer access…</p>
      </div>
    );
  }

  // state === 'wall'
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-lg w-full bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-xl text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center">
          <Lock className="text-indigo-600 dark:text-indigo-400" size={28} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">This is the Employer Area</h1>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
          You&apos;re signed in with a <strong className="text-slate-700 dark:text-slate-200">job-seeker account</strong>.
          HireSkys ATS is for employers only — candidate accounts can&apos;t open this dashboard.
          That separation keeps both sides un-mixed.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mb-8">
          Note: switching makes this an employer account everywhere on HireSkys.
          If you also apply for jobs, keep a separate account for that.
        </p>

        {switchError && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium">
            {switchError}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleSwitch}
            disabled={switching}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-60"
          >
            {switching ? <Loader2 className="animate-spin" size={18} /> : <Briefcase size={18} />}
            Use this account as an Employer account
          </button>
          <a
            href="https://www.hireskys.com/"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all"
          >
            Go to the Job Board <ArrowRight size={16} />
          </a>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-bold transition-colors"
          >
            <LogOut size={15} /> Sign out &amp; use a different account
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, CheckCircle } from 'lucide-react';

export default function UpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg('');

    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
        setMsg(`Error: ${error.message}`);
    } else {
        setMsg('Success! Redirecting to login...');
        setTimeout(() => {
            router.push('/login');
        }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] p-4">
        <div className="w-full max-w-md bg-white dark:bg-[#111625] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl text-center">
            <h1 className="text-2xl font-bold mb-2 dark:text-white">Set New Password</h1>
            <p className="text-slate-500 mb-6">Enter your new secure password below.</p>

            <form onSubmit={handleUpdate} className="space-y-4">
                <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input type="password" placeholder="New Password" required minLength={6} className="w-full pl-12 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                {msg && <div className={`p-3 rounded-lg text-sm font-medium ${msg.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>{msg}</div>}

                <button disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
                </button>
            </form>
        </div>
    </div>
  );
}
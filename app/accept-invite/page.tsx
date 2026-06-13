"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Users, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token'); // URL se token (ID) nikalenge

  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState<any>(null);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchInviteDetails();
    } else {
      setError("Invalid or missing invite link.");
      setLoading(false);
    }
  }, [token]);

  const fetchInviteDetails = async () => {
    try {
      // Invite ki details fetch karo
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', token)
        .single();

      if (error || !data) throw new Error("Invite not found or expired.");
      if (data.status === 'active') throw new Error("This invite has already been accepted.");

      setInviteData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    setAccepting(true);
    try {
      // 1. Check karo ke user logged in hai ya nahi
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Agar account nahi hai, toh pehle signup page par bhejo (token sath le kar)
        router.push(`/login?redirect=/accept-invite?token=${token}`);
        return;
      }

      // 2. Agar logged in hai, toh invite accept karwao
      const { error: updateError } = await supabase
        .from('team_members')
        .update({ 
          status: 'active', 
          user_id: session.user.id 
        })
        .eq('id', token);

      if (updateError) throw updateError;

      alert("🎉 Welcome to the team!");
      router.push('/employer/dashboard'); // Dashboard par bhej do
      
    } catch (err: any) {
      alert("Failed to accept invite: " + err.message);
      setAccepting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#111625] rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center animate-in zoom-in-95 duration-500">
        
        {error ? (
          <div>
            <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Oops!</h1>
            <p className="text-slate-500">{error}</p>
            <button onClick={() => router.push('/')} className="mt-6 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all">Go Home</button>
          </div>
        ) : (
          <div>
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">You've been invited!</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              You have been invited to join the workspace as an <strong className="text-indigo-600 dark:text-indigo-400 capitalize">{inviteData.role}</strong>.
            </p>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-8 border border-slate-100 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Invited Email:</p>
              <p className="text-base font-bold text-slate-900 dark:text-white">{inviteData.email}</p>
            </div>

            <button 
              onClick={handleAcceptInvite}
              disabled={accepting}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
            >
              {accepting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
              {accepting ? 'Accepting...' : 'Accept Invitation'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
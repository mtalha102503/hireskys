"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  useEffect(() => {
    const handleCallback = async () => {
      addLog("1. Callback Started...");
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!session) {
        addLog("❌ No Session Found. Redirecting to Login...");
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      addLog(`2. User Logged In: ${session.user.email}`);

      // Database check
      const { data: profile, error: dbError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      addLog(`3. Database Result: ${JSON.stringify(profile)}`);

      if (dbError) {
         addLog(`❌ DB Error: ${dbError.message}`);
         addLog("👉 Decision: GO TO PROFILE");
         setTimeout(() => router.push('/profile'), 4000);
         return;
      }

      // STRICT CHECKS
      const isUsernameMissing = !profile?.username || profile?.username.trim() === "";
      const isWhatsappMissing = !profile?.whatsapp || profile?.whatsapp.trim() === "";

      if (isUsernameMissing || isWhatsappMissing) {
         addLog(`⚠️ Missing Data -> Username: '${profile?.username}', WA: '${profile?.whatsapp}'`);
         addLog("👉 Decision: GO TO PROFILE (Incomplete)");
         // 4 second wait karo taake tum log parh sako
         setTimeout(() => router.push('/profile'), 4000);
      } else {
         addLog("✅ All Data Present.");
         addLog("👉 Decision: GO TO HOME");
         setTimeout(() => router.push('/'), 4000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-green-400 p-10 font-mono text-sm">
      <h1 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">🔍 DEBUG MODE</h1>
      <div className="space-y-2">
        {logs.map((log, i) => (
            <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}

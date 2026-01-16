"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Supabase automatically URL hash (#access_token) detect kar lega
    // 2. Session set hone ke baad hum user ko redirect kar denge
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Login successful -> Profile par bhejo
        router.push('/profile'); 
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F19] text-white">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
      <h2 className="text-xl font-bold">Verifying Login...</h2>
      <p className="text-slate-400">Please wait while we set up your session.</p>
    </div>
  );
}
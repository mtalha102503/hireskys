"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // 👇 SMART CHECK START
        const user = session.user;
        const metadata = user.user_metadata;

        // Agar WhatsApp ya Username missing hai (New Google User)
        if (!metadata.whatsapp || !metadata.username) {
            router.push('/profile'); 
        } else {
            // Agar sab kuch hai (Old User), to Home page jane do
            router.push('/'); 
        }
        // 👆 SMART CHECK END
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
      <p className="text-slate-400">Checking your profile status.</p>
    </div>
  );
}

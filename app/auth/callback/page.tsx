"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // 1. Check karo user session hai ya nahi
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const user = session.user;

        // 2. 🔍 DATABASE CHECK (Metadata par bharosa mat karo)
        // Profiles table se data mangwao
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username, whatsapp, birth_date')
          .eq('id', user.id)
          .single();

        if (error || !profile) {
          // Agar profile table mein entry hi nahi hai -> Profile Page
          router.push('/profile');
        } 
        else if (!profile.username || !profile.whatsapp || !profile.birth_date) {
          // Agar entry hai lekin Username ya WhatsApp missing hai -> Profile Page
          router.push('/profile');
        } 
        else {
          // Sab kuch set hai -> Home Page
          router.push('/');
        }
      } else {
        // Agar session nahi mila (Login fail) -> Login Page
        router.push('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F19] text-white">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
      <h2 className="text-xl font-bold">Verifying Profile...</h2>
      <p className="text-slate-400">Please wait while we direct you.</p>
    </div>
  );
}

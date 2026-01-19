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

        // 1. Pehle 'data' ko 'data' hi rehne do
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // 2. Ab 'data' ko 'profile' mein convert karo
        const profile = data as any;

        // 👇 UPDATED LOGIC HERE
        if (error || !profile) {
          // 1. Agar profile exist hi nahi karti -> Naye Setup Page par bhejo
          router.push('/complete-profile');
        } 
        // 2. Agar Profile hai lekin INCOMPLETE hai
        else if (
            !profile.username || 
            !profile.whatsapp || 
            !profile.birth_date || 
            !profile.primary_role 
        ) {
          router.push('/complete-profile');
        } 
        else {
          // 3. Sab kuch set hai -> Home Page
          router.push('/');
        }
      } else {
        // 🛑 YE MISSING THA: Agar session nahi hai to Login par bhejo
        router.push('/login');
      }
    }; // 👈 YE BRACKET MISSING THA

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

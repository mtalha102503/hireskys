"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const user = session.user;
        let userRole = user.user_metadata?.role;

        // 🚨 NEW FIX: Auto-generated khali profiles ka catch
        if (!userRole) {
          // 1. Pehle check karo kya ye purana Employer hai? (Companies table mein data hai)
          const { data: employerProfile } = await supabase
            .from('companies')
            .select('id')
            .eq('employer_id', user.id)
            .single();

          if (employerProfile) {
            userRole = 'employer';
            await supabase.auth.updateUser({ data: { role: 'employer' } });
          } else {
            // 2. Check karo kya ye purana Seeker hai jisne profile waqai COMPLETE ki hui hai?
            const { data: seekerProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            if (seekerProfile && 
                seekerProfile.username && 
                seekerProfile.whatsapp && 
                seekerProfile.birth_date && 
                seekerProfile.primary_role) {
              userRole = 'seeker';
              await supabase.auth.updateUser({ data: { role: 'seeker' } });
            }
          }
        }

        // 🎯 FINAL ROUTING LOGIC

        // A. Agar bilkul naya user hai (ya khali auto-generated profile hai) -> Role Selection
        if (!userRole) {
          router.push('/role-selection');
          return;
        }

        // B. If Employer
        if (userRole === 'employer') {
          router.push('/employer/settings');
          return;
        }

        // C. If Seeker -> Unki completeness check karo
        if (userRole === 'seeker') {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error || !profile || !profile.username || !profile.whatsapp || !profile.birth_date || !profile.primary_role) {
            router.push('/complete-profile');
          } else {
            router.push('/');
          }
        }

      } else {
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

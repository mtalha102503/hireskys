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

        // 🚨 PURANE USERS KA CATCH: Agar metadata mein role nahi hai
        if (!userRole) {
          // 1. Pehle check karo kya ye purana Seeker hai?
          const { data: seekerProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

          if (seekerProfile) {
            userRole = 'seeker';
            // Chupke se metadata bhi update kar dete hain taake next time fast ho jaye
            await supabase.auth.updateUser({ data: { role: 'seeker' } });
          } else {
            // 2. Agar profile mein nahi mila, toh check karo kya purana Employer hai?
            const { data: employerProfile } = await supabase
              .from('companies')
              .select('id')
              .eq('employer_id', user.id)
              .single();

            if (employerProfile) {
              userRole = 'employer';
              await supabase.auth.updateUser({ data: { role: 'employer' } });
            }
          }
        }

        // 🎯 AB ROUTING BILKUL SAFE HAI

        // A. Agar bilkul naya banda hai (na metadata hai na database mein record)
        if (!userRole) {
          router.push('/role-selection');
          return;
        }

        // B. If Employer (Chahe naya ho ya purana)
        if (userRole === 'employer') {
          router.push('/employer/setting');
          return;
        }

        // C. If Seeker (Chahe naya ho ya purana)
        if (userRole === 'seeker') {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          const profile = data as any;

          if (error || !profile) {
            router.push('/complete-profile');
          } 
          else if (
              !profile.username || 
              !profile.whatsapp || 
              !profile.birth_date || 
              !profile.primary_role 
          ) {
            router.push('/complete-profile');
          } 
          else {
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

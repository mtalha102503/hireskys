"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ensureEmployerCompany } from '@/lib/account';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // 🚨 OAuth ERROR: Google ne error bheja ho (500 page, consent cancel,
      //    ya user ke screenshot wala Error 500) to khamosh /login ki bajaye
      //    wajah ke saath wapas bhejo — login page use dikhayega.
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const oauthError = searchParams.get('error') || hashParams.get('error');
      if (oauthError) {
        const desc = searchParams.get('error_description') || hashParams.get('error_description')
          || 'Google sign-in failed. Please try again.';
        router.push(`/login?error=${encodeURIComponent(desc)}`);
        return;
      }

      let { data: { session } } = await supabase.auth.getSession();

      // ⏳ SESSION RACE: OAuth return par session kabhi kabhi chand second
      //    der se establish hota hai. Agar URL OAuth-return jaisa hai (code/
      //    state/access_token mojood) to fauri /login dhakay ki bajaye
      //    onAuthStateChange ka ~4 second tak intezar karo.
      if (!session) {
        const looksLikeOAuthReturn = searchParams.has('code') || searchParams.has('state') || hashParams.has('access_token');
        if (looksLikeOAuthReturn) {
          session = await new Promise<any>((resolve) => {
            let settled = false;
            const { data: authSub } = supabase.auth.onAuthStateChange((_event, newSession) => {
              if (newSession && !settled) {
                settled = true;
                authSub.subscription.unsubscribe();
                resolve(newSession);
              }
            });
            setTimeout(() => {
              if (!settled) {
                settled = true;
                authSub.subscription.unsubscribe();
                resolve(null);
              }
            }, 4000);
          });
        }
      }

      if (session) {
        const user = session.user;
        let userRole = user.user_metadata?.role;

        // 🎯 RETURN URL: login se pehle user jahan tha (auth_next) — sirf
        //    neeche wali role routing me istemal hoga; parhte hi hata do
        //    taake agli login par purani manzil na lag jaye.
        const authNext = localStorage.getItem('auth_next');
        if (authNext) localStorage.removeItem('auth_next');

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

        // 🟢 ATS INTENT: user ATS ke apne login/signup se aya hai
        const atsIntent = typeof window !== 'undefined' ? localStorage.getItem('auth_intent') : null;
        if (atsIntent) {
          localStorage.removeItem('auth_intent');
          if (atsIntent === 'ats') {
            if (!userRole) {
              // Bilkul naya user seedha ATS se — role-selection ka chakkar nahi,
              // employer mark karke onboarding par bhejo
              await supabase.auth.updateUser({ data: { role: 'employer' } });
              // Naye employer ki companies row foran bana do — billing aur
              // job posting usi row par chalte hain, warna .single() errors
              await ensureEmployerCompany(user);
              router.push('/employer/settings');
              return;
            }
            // Employer ho ya seeker — employer area par bhejo. Seeker ko wahan
            // EmployerGate wazeh choice dega (switch ya board par wapas) —
            // koi silent mixup nahi hoga.
            if (userRole === 'employer') {
              await ensureEmployerCompany(user);
            }
            router.push('/employer/dashboard');
            return;
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
          await ensureEmployerCompany(user);
          // auth_next sirf employer area ke andar hi izzat payega
          if (authNext && authNext.startsWith('/employer')) {
            router.push(authNext);
          } else {
            router.push('/employer/settings');
          }
          return;
        }

        // C. If Seeker -> Unki completeness check karo
        if (userRole === 'seeker') {
          // Login se pehle wali manzil (maslan kisi job ka page) — wapas wahin
          if (authNext && authNext.startsWith('/')) {
            router.push(authNext);
            return;
          }

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

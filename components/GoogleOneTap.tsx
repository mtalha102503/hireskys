"use client";

import Script from "next/script";
import { supabase } from "@/lib/supabaseClient"; 
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const GoogleOneTap = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  // 1. Session Check (Ye wesa hi rahega)
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.log("❌ User logged out (Ready for One Tap)");
        setShow(true);
      }
    };
    checkSession();
  }, []);

  // 2. Google Login Handle karne wala Function
  const handleCredentialResponse = async (response: any) => {
    try {
      console.log("🔄 Verifying Google Token...");
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) throw error;
      
      console.log("✅ Login Success! Redirecting...");
      router.push('/complete-profile'); 
      setShow(false);
    } catch (error) {
      console.error("⚠️ Login Error:", error);
    }
  };

  // 3. Initialize Function (Jo ab onLoad par chalega)
  const initializeGoogleOneTap = () => {
    if (!(window as any).google) {
      console.log("⚠️ Google Script not found yet.");
      return;
    }

    console.log("🚀 Initializing Google One Tap...");
    
    (window as any).google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      cancel_on_tap_outside: false, // Bahar click karne se band na ho
      use_fedcm_for_prompt: false,  // Error rokne ke liye
    });

    (window as any).google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed()) {
        console.log("❌ Popup Hidden Reason:", notification.getNotDisplayedReason());
      } else {
        console.log("🎉 Popup Displayed Successfully!");
      }
    });
  };

  // Agar 'show' false hai to Script load hi mat karo
  if (!show) return null;

  return (
    <Script 
      src="https://accounts.google.com/gsi/client" 
      strategy="afterInteractive"
      // 👇 MAGIC FIX: Jaise hi script load hogi, ye function chalega
      onLoad={initializeGoogleOneTap} 
    />
  );
};

export default GoogleOneTap;

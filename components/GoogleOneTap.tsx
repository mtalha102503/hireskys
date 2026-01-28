"use client";

import Script from "next/script";
import { supabase } from "@/lib/supabaseClient"; 
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const GoogleOneTap = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  // 👇 Check karo User Logged In hai ya nahi
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        console.log("✅ User already logged in (Google One Tap Hidden)");
      } else {
        console.log("❌ User logged out (Showing Google One Tap)");
        setShow(true);
      }
    };
    checkSession();
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      console.log("Google Token Received, verifying...");
      
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) throw error;
      
      console.log("Login Success! Redirecting to Complete Profile...");
      
      // 👇 YAHAN CHANGE KIYA HAI (Refresh ki jagah Redirect)
      router.push('/complete-profile'); 
      
      setShow(false);

    } catch (error) {
      console.error("One Tap Login Error:", error);
    }
  };

  useEffect(() => {
    if (!show) return;

    const initializeGoogleOneTap = () => {
      if (!(window as any).google) return;

      (window as any).google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        cancel_on_tap_outside: false,
        use_fedcm_for_prompt: false, // Error hatane ke liye
      });

      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.log("One Tap hidden reason:", notification.getNotDisplayedReason());
        }
      });
    };

    const timeout = setTimeout(initializeGoogleOneTap, 1000);
    return () => clearTimeout(timeout);
  }, [show]);

  if (!show) return null;

  return (
    <Script 
      src="https://accounts.google.com/gsi/client" 
      strategy="afterInteractive"
    />
  );
};

export default GoogleOneTap;

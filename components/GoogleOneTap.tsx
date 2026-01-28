"use client";

import Script from "next/script";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const GoogleOneTap = () => {
  const router = useRouter();
  const [show, setShow] = useState(false); // Default hidden rakhna hai

  // 👇 Check karo User Logged In hai ya nahi
 useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      // Agar user logged in hai to console me batao aur popup mat dikhao
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
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) throw error;
      
      // Login Success -> Page Refresh
      router.refresh(); 
      setShow(false); // Popup band kar do

    } catch (error) {
      console.error("One Tap Error:", error);
    }
  };

  useEffect(() => {
    if (!show) return; // Agar show false hai to kuch mat karo

    const initializeGoogleOneTap = () => {
      if (!(window as any).google) return;

      (window as any).google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        cancel_on_tap_outside: false,
      });

      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          // 👇 Ye line reason print karegi console mein
          console.log("❌ One Tap nahi dikha kyunki:", notification.getNotDisplayedReason());
        } else {
          console.log("✅ One Tap Dikh gaya!");
        }
      });
    };

    const timeout = setTimeout(initializeGoogleOneTap, 1000);
    return () => clearTimeout(timeout);
  }, [show]); // Jab 'show' true hoga tab chalega

  // Agar user logged in hai, to ye component render hi nahi hoga
  if (!show) return null;

  return (
    <Script 
      src="https://accounts.google.com/gsi/client" 
      strategy="afterInteractive"
    />
  );
};

export default GoogleOneTap;
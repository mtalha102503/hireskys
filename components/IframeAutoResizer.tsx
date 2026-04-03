"use client";

import { useEffect } from 'react';

export default function IframeAutoResizer() {
  useEffect(() => {
    // 1. Agar page direct open hua hai (iframe mein nahi hai), toh kuch mat karo
    if (window.self === window.top) return;

    // 2. Height measure karke Parent Window ko bhejney ka function
    const sendHeight = () => {
      // documentElement.scrollHeight poore page ki actual height nikalta hai
      const height = document.documentElement.scrollHeight || document.body.scrollHeight;
      
      // Parent window (Employer ki site) ko message bhejo
      window.parent.postMessage({ type: 'hireskys-resize', height: height }, '*');
    };

    // 3. Pehli dafa height bhejo
    sendHeight();

    // 4. ResizeObserver lagao: Yeh DOM mein hone wali har tabdeeli (jaise naya form khulna) ko dekhta hai
    const resizeObserver = new ResizeObserver(() => {
      sendHeight();
    });

    // Body ko observe karna shuru karo
    resizeObserver.observe(document.body);

    // Cleanup function
    return () => resizeObserver.disconnect();
  }, []);

  return null; // Yeh component screen par kuch nahi dikhata
}
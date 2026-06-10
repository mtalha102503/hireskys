"use client";

import { usePathname } from 'next/navigation';
import SupportChat from './SupportChat'; // Apni sahi location ke hisaab se import theek kar lena

export default function ConditionalChat() {
  const pathname = usePathname();

  // Agar user ka path '/embed' se start ho raha hai, to kuch na dikhao (null return karo)
  if (pathname?.startsWith('/embed')) {
    return null;
  }

  // Warna normal SupportChat component dikha do
  return <SupportChat />;
}
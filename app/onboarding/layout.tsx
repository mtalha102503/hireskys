import type { Metadata } from "next";

// 👇 Ye hai wo MAGIC CODE jo Google ko rokega
export const metadata: Metadata = {
  title: "Complete Your Profile | StealthGigs",
  description: "Finish setting up your profile to join the elite network.",
  
  // 🚫 Robots ko mana kar rahe hain
  robots: {
    index: false,  // Search engine mein mat dikhao
    follow: false, // Is page ke links ko follow mat karo
    nocache: true, // Cache mat karo
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Is div mein tum background color ya common styling de sakte ho
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19]">
      {children}
    </div>
  );
}

import type { Metadata } from "next";

// ✅ Sirf SEO/Browser Tab ke liye settings
export const metadata: Metadata = {
  title: "Complete Your Profile | HireSkys",
  description: "Finalize your account setup to access premium remote jobs.",
  // 🔒 Google ko bolo is page ko ignore kare (Security)
  robots: {
    index: false,
    follow: false,
  },
};

// ✅ Ye bilkul simple wrapper hai
export default function CompleteProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Hum yahan koi styling nahi de rahe, taake tumhara page.tsx wese hi dikhe jaisa abhi hai */}
      {children}
    </>
  );
}
// app/redirect/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redirecting... | HireSkys",
  description: "You are being redirected to the employer's application page.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  alternates: {
    canonical: undefined, // no canonical needed, page won't be indexed
  },
  openGraph: {
    title: "Redirecting...",
    description: "You are being redirected to the employer's application page.",
  },
};

export default function RedirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
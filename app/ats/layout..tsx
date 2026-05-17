import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HireSkys ATS | Premium Candidate Management Without Monthly Fees',
  description: 'Stop paying $299/mo just to keep your ATS active. HireSkys is the ultimate pay-per-post hiring platform for startups. Buy credits, post jobs whenever you need, and manage candidates forever with ZERO recurring subscriptions.',
  keywords: [
    'ATS for startups',
    'no monthly fee ATS',
    'pay per post applicant tracking system',
    'remote hiring software',
    'candidate management system',
    'HireSkys',
    'alternative to workable',
    'affordable ATS',
    'startup hiring tools'
  ],
  authors: [{ name: 'HireSkys' }],
  openGraph: {
    title: 'HireSkys ATS | Stop Paying Monthly Hiring Subscriptions',
    description: 'Why pay $299/month when you are not hiring? Buy job credits, post whenever you want, and keep your candidate pipeline forever. The ultimate ATS for lean startups.',
    url: 'https://www.hireskys.com',
    siteName: 'HireSkys',
    images: [
      {
        url: '/logo2.png', // 👈 Apne public folder mein ek mast si image daal dena is naam se
        width: 1200,
        height: 630,
        alt: 'HireSkys ATS Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HireSkys ATS | No Monthly Subscriptions',
    description: 'Ditch the $299/mo ATS trap. Manage candidates with AI, Kanban pipelines, and zero recurring fees. Pay once per job post.',
    images: ['/logo2.png'], // Same image yahan bhi aayegi
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ATSLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Agar page ke head mein koi specific script dalni ho toh yahan daal sakte ho */}
      {children}
    </>
  );
}
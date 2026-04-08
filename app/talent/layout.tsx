import { Metadata } from 'next';

// 🚀 THE SEO MASTER ENGINE FOR TALENT PAGE
export const metadata: Metadata = {
  title: 'Hire Elite Remote Talent | HireSkys',
  description: 'Browse our curated directory of top-tier, verified remote developers, designers, and marketers. Hire the best freelance talent directly on HireSkys.',
  keywords: [
    'hire remote talent',
    'remote developers',
    'freelance designers',
    'top digital marketers',
    'HireSkys talent directory',
    'hire freelancers',
    'remote work professionals'
  ],
  alternates: {
    canonical: 'https://hireskys.com/talent', // Apni real domain se replace kar lena if different
  },
  openGraph: {
    title: 'Hire Elite Remote Talent | HireSkys',
    description: 'Find and hire the top 1% of verified remote professionals from around the globe.',
    url: 'https://hireskys.com/talent',
    siteName: 'HireSkys',
    type: 'website',
    images: [
      {
        url: '/og-talent.jpg', // Public folder mein ek achi si image rakh dena is naam se
        width: 1200,
        height: 630,
        alt: 'HireSkys Talent Directory Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hire Elite Remote Talent | HireSkys',
    description: 'Find and hire the top 1% of verified remote professionals from around the globe.',
    images: ['/og-talent.jpg'],
  },
};

export default function TalentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Hum yahan directly children render kar rahe hain kyunke main UI page.tsx mein hai */}
      {children}
    </>
  );
}
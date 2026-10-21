import type { Metadata } from 'next';

// 🔍 ATS subdomain (ats.hireskys.com) ki ALAG SEO pehchan:
// canonical, OG aur title — sab is domain ke naam par.
// (title "absolute" hai taake asal site ka "%s | HireSkys" template na lage.)
export const metadata: Metadata = {
  title: {
    absolute: 'HireSkys ATS | Hiring Software Without Monthly Fees',
  },
  description:
    'Post jobs, track candidates on a visual pipeline, and hire remote talent — pay per post, no $299/mo subscription. Built for startups and remote-first teams.',
  keywords: [
    'applicant tracking system',
    'ATS for startups',
    'no monthly fee ATS',
    'pay per post ATS',
    'remote hiring software',
    'candidate management',
    'Greenhouse alternative',
    'Ashby alternative',
    'Workable alternative',
  ],
  alternates: {
    canonical: 'https://ats.hireskys.com/',
  },
  openGraph: {
    type: 'website',
    url: 'https://ats.hireskys.com/',
    siteName: 'HireSkys ATS',
    title: 'HireSkys ATS | Hiring Software Without Monthly Fees',
    description:
      'Pay per post, no monthly subscription. Visual candidate pipelines, AI match scoring and team hiring — built for remote-first companies.',
    images: [
      {
        url: 'https://ats.hireskys.com/logo2.png',
        width: 1200,
        height: 630,
        alt: 'HireSkys ATS — Hiring Software for Remote Teams',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HireSkys ATS | Hiring Software Without Monthly Fees',
    description:
      'Pay per post, no $299/mo subscription. Post jobs and manage candidates on a visual pipeline.',
    images: ['https://ats.hireskys.com/logo2.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// SoftwareApplication schema — baghair kisi jhooti rating ke,
// sirf asal product aur asal pay-per-post qeemat ke sath.
const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'HireSkys ATS',
  url: 'https://ats.hireskys.com/',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Applicant tracking system for remote-first teams. Post jobs, track candidates on a visual pipeline, and manage hiring without a monthly subscription.',
  offers: {
    '@type': 'Offer',
    price: '49',
    priceCurrency: 'USD',
    description: 'Pay per job post. No monthly subscription — credits never expire.',
  },
  publisher: {
    '@type': 'Organization',
    name: 'HireSkys',
    url: 'https://www.hireskys.com',
  },
};

export default function ATSHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      {children}
    </>
  );
}

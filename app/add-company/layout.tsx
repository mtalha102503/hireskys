import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Your Company',
  description: 'Join our verified directory of remote-first organizations. Add your company to HireSkys and hire the top 1% of global remote talent.',
  keywords: ['add company', 'post remote jobs', 'hire remote developers', 'employer profile', 'HireSkys partners'],
  alternates: {
    canonical: 'https://www.hireskys.com/add-company',
  },
  openGraph: {
    title: 'Add Your Company | HireSkys',
    description: 'Join our verified directory of remote-first organizations. Add your company to HireSkys and hire the top 1% of global remote talent.',
    url: 'https://www.hireskys.com/add-company',
    siteName: 'HireSkys',
    images: [
      {
        url: '/og-main.png', // Make sure this image exists in your public folder
        width: 1200,
        height: 630,
        alt: 'Add Your Company to HireSkys',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Add Your Company | HireSkys',
    description: 'Join our verified directory of remote-first organizations. Add your company to HireSkys and hire the top 1% of global remote talent.',
    images: ['/logo1.png'],
  },
};

export default function AddCompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Yeh simply page.tsx ko render karega, but apne sath SEO tags attach karke!
  return <>{children}</>;
}
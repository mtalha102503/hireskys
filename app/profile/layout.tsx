import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile | HireSkys Elite',
  description: 'Manage your professional profile, skills, and saved jobs on HireSkys.',
  robots: {
    index: false, // 🛑 Profile private area hai, Google isko index na kare
    follow: false,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
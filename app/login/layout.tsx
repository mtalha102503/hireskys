import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login or Sign Up | HireSkys',
  description: 'Access your account to post jobs or find remote work.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
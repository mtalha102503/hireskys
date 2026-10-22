import AtsAuthForm from '@/components/AtsAuthForm';

export const metadata = {
  title: 'Employer Login | HireSkys ATS',
  description: 'Sign in to your HireSkys ATS employer account — manage jobs, pipeline stages and candidates.',
};

export default function AtsLoginPage() {
  return <AtsAuthForm mode="login" />;
}

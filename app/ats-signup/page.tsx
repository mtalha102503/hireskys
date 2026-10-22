import AtsAuthForm from '@/components/AtsAuthForm';

export const metadata = {
  title: 'Create Employer Account | HireSkys ATS',
  description: 'Create your HireSkys ATS employer account — post jobs, track candidates in a custom pipeline, pay per post with no monthly fees.',
};

export default function AtsSignupPage() {
  return <AtsAuthForm mode="signup" />;
}

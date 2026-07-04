import { supabase } from '@/lib/supabaseClient';
import JobClient from './JobClient'; 
import { notFound, redirect } from 'next/navigation';
import { createSlug } from '@/lib/utils';

// Ye cache wali line naye jobs (jo build ke baad add honge) ko handle karegi
export const revalidate = 86400; 

// 👇 YE NAYA FUNCTION ADD KIYA HAI 👇
export async function generateStaticParams() {
  // Build time par latest 500 active jobs fetch kar lo 
  // (Limit 500 isliye rakhi hai taake build fast ho aur memory limit hit na ho)
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title')
    .eq('approved', true)
    .eq('active', true)
    .order('date_posted', { ascending: false })
    .limit(500); 

  if (!jobs) return [];

  // Next.js ko slugs return karo taake wo in pages ko statically generate kar le
  return jobs.map((job) => ({
    slug: createSlug(job.title, job.id),
  }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // Params await karo
  const { slug } = await params;
  const slugParts = slug.split('-');
  const id = slugParts[slugParts.length - 1];

  if (!id || isNaN(Number(id))) {
    return { title: 'Job Not Found | HireSkys' };
  }

  // Sirf title aur company uthao metadata ke liye (Fast fetch)
  const { data: job } = await supabase
    .from('jobs')
    .select('title, company, source')
    .eq('id', id)
    .single();

  if (!job) {
    return { title: 'Job Not Found | HireSkys' };
  }

  const jobTitle = job.title;
  const companyName = job.company || job.source || 'HireSkys';

  // API Route ko details bhejna image bananay ke liye
  const ogUrl = new URL('https://www.hireskys.com/api/og');
  ogUrl.searchParams.set('title', jobTitle);
  ogUrl.searchParams.set('company', companyName);

  return {
    title: `${jobTitle} at ${companyName} | HireSkys`,
    description: `Apply for ${jobTitle} at ${companyName} on HireSkys. Verified global remote jobs.`,
    openGraph: {
      title: `${jobTitle} at ${companyName} | HireSkys`,
      siteName: 'HireSkys',
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}
// Baki tumhara page component waise ka waisa hi hai
export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const slugParts = slug.split('-');
  const id = slugParts[slugParts.length - 1]; 

  if (!id || isNaN(Number(id))) {
    return notFound();
  }

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !job) {
    return notFound();
  }

  const expectedSlug = createSlug(job.title, job.id);

  if (slug !== expectedSlug) {
    redirect(`/jobs/${expectedSlug}`);
  }

  return <JobClient initialJob={job} />;
}

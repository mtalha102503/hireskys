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

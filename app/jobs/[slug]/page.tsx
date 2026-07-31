import { supabase } from '@/lib/supabaseClient';
import JobClient from './JobClient'; 
import { notFound, redirect } from 'next/navigation';
import { createSlug } from '@/lib/utils'; 
import { getJobPageData } from '@/lib/getJobPageData'; // 👈 NAYA IMPORT

export const revalidate = 86400;

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

  // 👇 NAYA: secondary data yahan fetch karo (cached)
  const companyNameForSearch = job.company || 
    (!['reddit', 'hacker news', 'upwork'].some(s => job.source?.toLowerCase().includes(s)) ? job.source : null);

  const { companyDetails, industryCompanies, companyJobs, relatedJobs } = 
    await getJobPageData(String(job.id), companyNameForSearch, job.category, job.location);

  return (
    <JobClient 
      initialJob={job}
      initialCompanyDetails={companyDetails}
      initialIndustryCompanies={industryCompanies}
      initialCompanyJobs={companyJobs}
      initialRelatedJobs={relatedJobs}
    />
  );
}
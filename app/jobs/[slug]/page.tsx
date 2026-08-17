import { typesenseAdminClient } from '@/lib/typesenseClient';
import JobClient from './JobClient'; 
import { notFound, redirect } from 'next/navigation';
import { createSlug } from '@/lib/utils'; 
import { getJobPageData } from '@/lib/getJobPageData';

export const revalidate = 86400;

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slugParts = slug.split('-');
  const id = slugParts[slugParts.length - 1];
  
  if (!id || isNaN(Number(id))) {
    return notFound();
  }

  let job: any = null;
  try {
    // Direct document retrieve — Typesense me id se exact fetch, search se zyada tez
    job = await typesenseAdminClient.collections('jobs').documents(String(id)).retrieve();
  } catch (err) {
    job = null;
  }
console.log("🔍 FETCHED FROM:", "TYPESENSE", JSON.stringify(job).slice(0, 200)); // 👈 YAHAN
  if (!job) {
    return notFound();
  }

  // Typesense document me id string hoti hai — Supabase jaisa number chahiye ho to convert kar lo
  job.id = Number(job.id);

  const expectedSlug = createSlug(job.title, job.id);
  if (slug !== expectedSlug) {
    redirect(`/jobs/${expectedSlug}`);
  }

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
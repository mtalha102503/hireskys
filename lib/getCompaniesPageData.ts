// lib/getCompaniesPageData.ts
import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabaseClient';

const LIMIT = 30;

async function fetchCompaniesPageData() {
  // 1. Total count (was a separate client-side query before)
  const { count } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true });

  // 2. First page of companies, default sort (a-z), no filter
  const { data: companiesData } = await supabase
    .from('companies')
    .select('name, slug, logo_url, industry, location, description')
    .order('name', { ascending: true })
    .range(0, LIMIT - 1);

  let companies = companiesData || [];

  // 3. Active jobs count + avg salary per company (same logic as before)
  if (companies.length > 0) {
    const companyNames = companies.map((c) => c.name);
    const { data: jobsData } = await supabase
      .from('jobs')
      .select('source, salary_range')
      .in('source', companyNames)
      .eq('active', true)
      .eq('approved', true);

    companies = companies.map((company) => {
      const companyJobs = (jobsData || []).filter((j) => j.source === company.name);
      const activeJobsCount = companyJobs.length;

      let totalSalary = 0;
      let validSalaries = 0;
      companyJobs.forEach((job) => {
        if (job.salary_range && !job.salary_range.toLowerCase().includes('not disclosed')) {
          const nums = job.salary_range.match(/\d+(?:,\d+)*/g);
          if (nums) {
            const parsedNums = nums
              .map((n: string) => parseInt(n.replace(/,/g, ''), 10))
              .filter((n: number) => n > 1000);
            if (parsedNums.length > 0) {
              const avg = parsedNums.reduce((a: number, b: number) => a + b, 0) / parsedNums.length;
              totalSalary += avg;
              validSalaries++;
            }
          }
        }
      });

      let avgSalaryStr = 'Not Disclosed';
      if (validSalaries > 0) {
        const finalAvg = Math.round(totalSalary / validSalaries);
        avgSalaryStr = `$${(finalAvg / 1000).toFixed(0)}k/yr`;
      }

      return { ...company, activeJobsCount, avgSalaryStr };
    });
  }

  const hasMore = companies.length === LIMIT;

  return {
    companies,
    totalCompanies: count || 0,
    hasMore,
  };
}

// 👇 Cache wrapper — 5 min ke liye cache karega (default view ke liye)
export const getCompaniesPageData = unstable_cache(
  fetchCompaniesPageData,
  ['companies-page-default'],
  { revalidate: 300 }
);

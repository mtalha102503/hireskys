// lib/getJobPageData.ts
import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabaseClient';
import { countryMap } from '@/lib/country';

// 👇 Same location-parsing logic jo JobClient.tsx mein hai
const parseComplexLocation = (locationString: string) => {
  if (!locationString) return [];
  let cleanStr = locationString.replace(/Remote\s*/i, '').trim();
  if (cleanStr.startsWith('(') && cleanStr.endsWith(')')) {
    cleanStr = cleanStr.slice(1, -1).trim();
  }
  const parsedLocations: any[] = [];
  const regex = /([a-zA-Z\s]+)(?:\(([^)]+)\))?/g;
  let match;
  while ((match = regex.exec(cleanStr)) !== null) {
    const countryName = match[1].trim().replace(/^,|,$/g, '').trim();
    if (!countryName || countryName.toLowerCase() === 'and') continue;
    const cities = match[2] ? match[2].split(',').map(c => c.trim()) : [];
    parsedLocations.push({ country: countryName, cities });
  }
  return parsedLocations;
};

const getCountryNames = (locationString: string) => {
  const parsedData = parseComplexLocation(locationString);
  const names: string[] = [];
  parsedData.forEach(item => {
    const cKey = item.country.toUpperCase();
    const countryData = countryMap[cKey];
    if (countryData?.code) names.push(countryData.name);
  });
  return names;
};

const getCompanySlug = (name: string) => {
  if (!name) return '#';
  return name.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};
async function fetchJobPageData(jobId: string, companyNameForSearch: string | null, category: string, location: string) {
  console.log(`🔥 FRESH DB FETCH — job: ${jobId}`);
  let companyDetails: any = null;
  let industryCompanies: any[] = [];
  let companyJobs: any[] = [];
  let relatedJobs: any[] = [];

  if (companyNameForSearch) {
    const companySlug = getCompanySlug(companyNameForSearch);

    const { data: companyInfo } = await supabase
      .from('companies')
      .select('name, slug, logo_url, banner_url, description, industry, location, company_size')
      .or(`slug.eq.${companySlug},name.ilike.%${companyNameForSearch}%`)
      .maybeSingle();

    if (companyInfo) {
      companyDetails = companyInfo;
      let finalCompanies: any[] = [];
      let excludeSlugs = [companyInfo.slug];

      if (companyInfo.industry) {
        const keywords = companyInfo.industry.split(/[\s,/&]+/).filter((k: string) => k.length > 3);
        if (keywords.length > 0) {
          const orQuery = keywords.map((k: string) => `industry.ilike.%${k}%`).join(',');
          const { data: indData } = await supabase
            .from('companies')
            .select('slug, name, logo_url, industry, location, company_size, verified')
            .or(orQuery)
            .neq('slug', companyInfo.slug)
            .limit(6);
          if (indData?.length) {
            finalCompanies = indData.sort(() => 0.5 - Math.random()).slice(0, 4);
            excludeSlugs = [...excludeSlugs, ...finalCompanies.map(c => c.slug)];
          }
        }
      }

      if (finalCompanies.length < 4) {
        const limitNeeded = 4 - finalCompanies.length;
        const { data: randomData } = await supabase
          .from('companies')
          .select('slug, name, logo_url, industry, location, company_size, verified')
          .not('slug', 'in', `(${excludeSlugs.join(',')})`)
          .limit(8);
        if (randomData?.length) {
          const shuffled = randomData.sort(() => 0.5 - Math.random()).slice(0, limitNeeded);
          finalCompanies = [...finalCompanies, ...shuffled];
        }
      }
      industryCompanies = finalCompanies;
    }

    const { data: cJobs } = await supabase
      .from('jobs')
      .select('id, title, company, source, location, salary_range, date_posted, category, company_logo_url')
      .or(`company.ilike.%${companyNameForSearch}%,source.ilike.%${companyNameForSearch}%`)
      .neq('id', jobId)
      .eq('approved', true)
      .eq('active', true)
      .order('date_posted', { ascending: false })
      .limit(4);
    if (cJobs) companyJobs = cJobs;
  }

  // Related jobs
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const countryNames = getCountryNames(location);

  let primaryQuery = supabase
    .from('jobs')
    .select('id, title, company, source, location, salary_range, date_posted, category, company_logo_url')
    .eq('category', category)
    .gte('date_posted', thirtyDaysAgo.toISOString())
    .neq('id', jobId)
    .eq('approved', true)
    .order('date_posted', { ascending: false })
    .limit(4);

  if (countryNames.length > 0) {
    const orQueryString = countryNames.map((c: string) => `location.ilike.%${c}%`).join(',');
    primaryQuery = primaryQuery.or(orQueryString);
  }

  const { data: strictData } = await primaryQuery;
  let finalRelatedJobs = strictData || [];

  if (finalRelatedJobs.length < 3) {
    const excludeIds = [jobId, ...finalRelatedJobs.map(j => j.id)];
    const remainingLimit = 4 - finalRelatedJobs.length;
    const { data: fallbackData } = await supabase
      .from('jobs')
      .select('id, title, company, source, location, salary_range, date_posted, category, company_logo_url')
      .eq('category', category)
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .eq('approved', true)
      .eq('active', true)
      .order('date_posted', { ascending: false })
      .limit(remainingLimit);
    if (fallbackData) finalRelatedJobs = [...finalRelatedJobs, ...fallbackData];
  }

  if (finalRelatedJobs.length > 0) {
    const slugsToFind = finalRelatedJobs.map(rJob => getCompanySlug(rJob.company || rJob.source || '')).filter(Boolean);
    const { data: companiesData } = await supabase
      .from('companies')
      .select('slug, logo_url')
      .in('slug', slugsToFind);
    const logoMap: Record<string, string> = {};
    companiesData?.forEach(c => { if (c.logo_url) logoMap[c.slug] = c.logo_url; });
    relatedJobs = finalRelatedJobs.map(rJob => ({
      ...rJob,
      final_logo: rJob.company_logo_url || logoMap[getCompanySlug(rJob.company || rJob.source || '')] || null
    }));
  }

  return { companyDetails, industryCompanies, companyJobs, relatedJobs };
}

// 👇 Cache wrapper — 5 min ke liye cache karega
export const getJobPageData = unstable_cache(
  fetchJobPageData,
  ['job-page-secondary-data'],
  { revalidate: 300 }
);

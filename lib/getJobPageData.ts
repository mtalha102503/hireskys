// lib/getJobPageData.ts
import { unstable_cache } from 'next/cache';
import { typesenseSearchClient } from '@/lib/typesenseClient';
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

// =====================================================================
// 🏢 PART 1 — Company lookup + industry companies (🔥 AB TYPESENSE SE)
// Cached by COMPANY NAME only — so 4500 jobs from the same 200 companies
// share the same cache entry instead of creating 4500 separate queries.
// =====================================================================
async function fetchCompanyData(companyNameForSearch: string) {
  let companyDetails: any = null;
  let industryCompanies: any[] = [];
  let companyJobs: any[] = [];

  if (!companyNameForSearch) {
    return { companyDetails, industryCompanies, companyJobs };
  }

  const companySlug = getCompanySlug(companyNameForSearch);

  // --- 1. Company info: pehle direct ID (slug) se retrieve try karo (fastest) ---
  let companyInfo: any = null;
  try {
    companyInfo = await typesenseSearchClient
      .collections('companies')
      .documents(companySlug)
      .retrieve();
  } catch (err) {
    // Slug se nahi mila to naam se text-search fallback karo
    try {
      const nameResults: any = await typesenseSearchClient
        .collections('companies')
        .documents()
        .search({
          q: companyNameForSearch,
          query_by: 'name',
          per_page: 1,
        });
      companyInfo = nameResults.hits?.[0]?.document || null;
    } catch (err2) {
      companyInfo = null;
    }
  }

  if (companyInfo) {
    companyDetails = companyInfo;
    let finalCompanies: any[] = [];
    const excludeSlugs = [companyInfo.id];

    // --- 2. Industry-match companies (text search, kyunki industry ek free-text field hai) ---
    if (companyInfo.industry) {
      try {
        const indResults: any = await typesenseSearchClient
          .collections('companies')
          .documents()
          .search({
            q: companyInfo.industry,
            query_by: 'industry',
            filter_by: `id:!=${companyInfo.id}`,
            per_page: 8,
          });
        const indData = indResults.hits?.map((h: any) => h.document) || [];
        if (indData.length) {
          finalCompanies = indData.sort(() => 0.5 - Math.random()).slice(0, 4);
          excludeSlugs.push(...finalCompanies.map((c: any) => c.id));
        }
      } catch (err) {
        console.error('Typesense industryCompanies fetch error:', err);
      }
    }

    // --- 3. Random fallback companies (agar industry match kam pade) ---
    if (finalCompanies.length < 4) {
      const limitNeeded = 4 - finalCompanies.length;
      try {
        const randomResults: any = await typesenseSearchClient
          .collections('companies')
          .documents()
          .search({
            q: '*',
            query_by: 'name',
            filter_by: `id:!=[${excludeSlugs.join(',')}]`,
            per_page: 8,
          });
        const randomData = randomResults.hits?.map((h: any) => h.document) || [];
        if (randomData.length) {
          const shuffled = randomData.sort(() => 0.5 - Math.random()).slice(0, limitNeeded);
          finalCompanies = [...finalCompanies, ...shuffled];
        }
      } catch (err) {
        console.error('Typesense randomCompanies fetch error:', err);
      }
    }
    industryCompanies = finalCompanies;
  }

  // --- 4. Same company ki active jobs ---
  try {
    const cResults: any = await typesenseSearchClient.collections('jobs').documents().search({
      q: companyNameForSearch,
      query_by: 'company,source',
      filter_by: 'approved:=true && active:=true',
      sort_by: 'date_posted_ts:desc',
      per_page: 5, // 5 lete hain kyunki caller khud ko (current job) exclude karega
    });
    companyJobs = cResults.hits?.map((h: any) => h.document) || [];
  } catch (err) {
    console.error("Typesense companyJobs fetch error:", err);
  }

  return { companyDetails, industryCompanies, companyJobs };
}

// 👇 Cache key sirf companyNameForSearch pe based hai — job ID involved nahi
export const getCompanyData = unstable_cache(
  fetchCompanyData,
  ['job-page-company-data'],
  { revalidate: 300 }
);

// =====================================================================
// 🔗 PART 2 — Related jobs (category + location based)
// Ye bhi job-id se independent hai — sirf category+location combo se cache
// hoga, jo bhi hazaron jobs se bahut kam unique combinations honge.
// =====================================================================
async function fetchRelatedJobsData(category: string, location: string) {
  let relatedJobs: any[] = [];

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const countryNames = getCountryNames(location);

  const countryCodes = countryNames
    .map((name: string) => {
      const entry = Object.entries(countryMap).find(([, v]: any) => v.name === name);
      return entry ? (entry[1] as any).code : null;
    })
    .filter(Boolean);

  let finalRelatedJobs: any[] = [];

  try {
    const strictFilters = [
      `category:=${category}`,
      'approved:=true',
      `date_posted_ts:>=${thirtyDaysAgo.getTime()}`,
    ];
    if (countryCodes.length > 0) {
      strictFilters.push(`country_codes:=[${countryCodes.join(',')}]`);
    }

    const strictResults: any = await typesenseSearchClient.collections('jobs').documents().search({
      q: '*',
      query_by: 'title,category',
      filter_by: strictFilters.join(' && '),
      sort_by: 'date_posted_ts:desc',
      per_page: 8, // 8 lete hain taake current-job exclude hone ke baad bhi 4+ bache
    });
    finalRelatedJobs = strictResults.hits?.map((h: any) => h.document) || [];

    if (finalRelatedJobs.length < 6) {
      const excludeIds = finalRelatedJobs.map((j: any) => j.id);
      const fallbackFilters = [`category:=${category}`, 'approved:=true', 'active:=true'];
      if (excludeIds.length > 0) {
        fallbackFilters.push(`id:!=[${excludeIds.join(',')}]`);
      }

      const fallbackResults: any = await typesenseSearchClient.collections('jobs').documents().search({
        q: '*',
        query_by: 'title,category',
        filter_by: fallbackFilters.join(' && '),
        sort_by: 'date_posted_ts:desc',
        per_page: 8,
      });
      const fallbackData = fallbackResults.hits?.map((h: any) => h.document) || [];
      finalRelatedJobs = [...finalRelatedJobs, ...fallbackData];
    }
  } catch (err) {
    console.error("Typesense relatedJobs fetch error:", err);
  }

  // --- 🔥 Related jobs ke company logos ab Typesense companies collection se ---
  if (finalRelatedJobs.length > 0) {
    const slugsToFind = Array.from(
      new Set(
        finalRelatedJobs
          .map(rJob => getCompanySlug(rJob.company || rJob.source || ''))
          .filter((s): s is string => Boolean(s) && s !== '#')
      )
    );

    const logoMap: Record<string, string> = {};
    if (slugsToFind.length > 0) {
      try {
        const companiesResults: any = await typesenseSearchClient
          .collections('companies')
          .documents()
          .search({
            q: '*',
            query_by: 'name',
            filter_by: `id:=[${slugsToFind.join(',')}]`,
            per_page: slugsToFind.length,
          });
        const companiesData = companiesResults.hits?.map((h: any) => h.document) || [];
        companiesData.forEach((c: any) => {
          if (c.logo_url) logoMap[c.id] = c.logo_url;
        });
      } catch (err) {
        console.error('Typesense relatedJobs logo fetch error:', err);
      }
    }

    relatedJobs = finalRelatedJobs.map(rJob => ({
      ...rJob,
      final_logo: rJob.company_logo_url || logoMap[getCompanySlug(rJob.company || rJob.source || '')] || null
    }));
  }

  return { relatedJobs };
}

// 👇 Cache key sirf category+location combo pe based hai — job ID involved nahi
export const getRelatedJobsData = unstable_cache(
  fetchRelatedJobsData,
  ['job-page-related-jobs'],
  { revalidate: 300 }
);

// =====================================================================
// 🧩 MAIN — page.tsx isi ek function ko call karega
// Ye khud kisi cheez ko job-id se cache nahi karta — sirf cached
// sub-functions ko combine karke, current job ko results se exclude karta hai
// =====================================================================
export async function getJobPageData(
  jobId: string,
  companyNameForSearch: string | null,
  category: string,
  location: string
) {
  const [companyData, relatedData] = await Promise.all([
    getCompanyData(companyNameForSearch || ''),
    getRelatedJobsData(category, location),
  ]);

  return {
    companyDetails: companyData.companyDetails,
    industryCompanies: companyData.industryCompanies,
    // current job ko exclude karo (cache shared hone ki wajah se ho sakta hai isme khud shaamil ho)
    companyJobs: (companyData.companyJobs || []).filter((j: any) => String(j.id) !== String(jobId)).slice(0, 4),
    relatedJobs: (relatedData.relatedJobs || []).filter((j: any) => String(j.id) !== String(jobId)).slice(0, 4),
  };
}

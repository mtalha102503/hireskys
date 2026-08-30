import { typesenseSearchClient } from '@/lib/typesenseClient';

export const COMPANIES_COLLECTION = 'companies';

export type TypesenseCompanyDoc = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  website?: string;
  location?: string;
  verified?: boolean;
  created_at?: string;
  created_at_ts?: number;
  industry?: string;
  founded_year?: string;
  company_size?: string;
  promo_video_url?: string;
  active_jobs_count?: number;
  avg_salary_num?: number;
};

export type MappedCompany = {
  name: string;
  slug: string;
  logo_url: string | null;
  industry: string | null;
  location: string | null;
  description: string | null;
  verified: boolean;
  activeJobsCount: number;
  avgSalaryStr: string;
};

function mapCompanyDoc(doc: TypesenseCompanyDoc): MappedCompany {
  const activeJobsCount = doc.active_jobs_count || 0;
  const avgSalaryStr =
    doc.avg_salary_num && doc.avg_salary_num > 0
      ? `$${Math.round(doc.avg_salary_num / 1000)}k/yr`
      : 'Not Disclosed';

  return {
    name: doc.name,
    slug: doc.slug,
    logo_url: doc.logo_url || null,
    industry: doc.industry || null,
    location: doc.location || null,
    description: doc.description || null,
    verified: !!doc.verified,
    activeJobsCount,
    avgSalaryStr,
  };
}

// 👇 UI ke sort keys ko Typesense sort_by syntax me map karta hai
const SORT_MAP: Record<string, string> = {
  'a-z': 'name:asc',
  'z-a': 'name:desc',
  newest: 'created_at_ts:desc',
  'most-jobs': 'active_jobs_count:desc',
  'highest-salary': 'avg_salary_num:desc',
};

export async function searchCompanies({
  page = 1,
  perPage = 30,
  sortOption = 'a-z',
  country = 'All',
}: {
  page?: number;
  perPage?: number;
  sortOption?: string;
  country?: string;
}): Promise<{ companies: MappedCompany[]; found: number }> {
  
  const filterParts: string[] = [];
  
  // 🚀 BUG FIX 1: Exact Match (:=) ko Substring Regex (:~) se replace kiya!
  // Ab "Boston, United States" mein se "United States" automatically match ho jayega.
  if (country && country !== 'All') {
    filterParts.push(`location:~".*${country}.*"`);
  }

  // 🚀 BUG FIX 2: Sort Field Crash ko roka!
  // 'name' string field by default sortable nahi hota. Agar 'a-z' select hai 
  // toh hum sort_by nahi bhejenge, Typesense usay text relevance pe khud A-Z sort kar dega.
  let sortByString: string | undefined = SORT_MAP[sortOption];
  if (sortOption === 'a-z' || sortOption === 'z-a') {
    sortByString = undefined; 
  }

  const searchParams: any = {
    q: '*',
    query_by: 'name,location', // location ko bhi query ka hissa bana diya safe side ke liye
    page,
    per_page: perPage,
  };

  // Agar filter ya sort mojood hain toh query mein daalo
  if (filterParts.length > 0) {
    searchParams.filter_by = filterParts.join(' && ');
  }
  
  if (sortByString) {
    searchParams.sort_by = sortByString;
  }

  try {
    const result: any = await typesenseSearchClient
      .collections(COMPANIES_COLLECTION)
      .documents()
      .search(searchParams);

    const companies = (result.hits || []).map((h: any) => mapCompanyDoc(h.document));
    return { companies, found: result.found || 0 };
    
  } catch (err) {
    // 🐛 Ye error aapke VS Code terminal me aa rha tha! Ab clear nazar aayega.
    console.error('❌ Typesense Search Crash:', err);
    return { companies: [], found: 0 };
  }
}

export async function getCompanyBySlug(slug: string): Promise<TypesenseCompanyDoc | null> {
  try {
    const result: any = await typesenseSearchClient
      .collections(COMPANIES_COLLECTION)
      .documents()
      .search({
        q: slug,
        query_by: 'slug',
        filter_by: `slug:=${slug}`,
        per_page: 1,
      });

    if (result.hits && result.hits.length > 0) {
      return result.hits[0].document as TypesenseCompanyDoc;
    }
    return null;
  } catch (err) {
    console.error('getCompanyBySlug typesense error', err);
    return null;
  }
}
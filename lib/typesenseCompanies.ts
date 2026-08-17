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
  if (country && country !== 'All') {
    filterParts.push(`location:=${country}`);
  }

  try {
    const result: any = await typesenseSearchClient
      .collections(COMPANIES_COLLECTION)
      .documents()
      .search({
        q: '*',
        query_by: 'name',
        sort_by: SORT_MAP[sortOption] || SORT_MAP['a-z'],
        page,
        per_page: perPage,
        filter_by: filterParts.length ? filterParts.join(' && ') : undefined,
      });

    const companies = (result.hits || []).map((h: any) => mapCompanyDoc(h.document));
    return { companies, found: result.found || 0 };
  } catch (err) {
    console.error('searchCompanies typesense error', err);
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
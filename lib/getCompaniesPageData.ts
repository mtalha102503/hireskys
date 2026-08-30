import { unstable_cache } from 'next/cache';
import { searchCompanies } from '@/lib/typesenseCompanies';

const LIMIT = 30;

async function fetchCompaniesPageData() {
  const { companies, found } = await searchCompanies({
    page: 1,
    perPage: LIMIT,
    sortOption: 'a-z',
    country: 'All',
  });

  const hasMore = companies.length === LIMIT && found > LIMIT;

  return {
    companies,
    totalCompanies: found,
    hasMore,
  };
}

export const getCompaniesPageData = unstable_cache(
  fetchCompaniesPageData,
  ['companies-page-default-v2'], // 👈 V2 lagadiya, ab fauran naya data fetch hoga!
  { revalidate: 300 }
);
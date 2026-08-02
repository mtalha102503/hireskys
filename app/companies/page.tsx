import CompaniesClient from './CompaniesClient';
import { getCompaniesPageData } from '@/lib/getCompaniesPageData';

export const revalidate = 300;

export default async function Page() {
  const { companies, totalCompanies, hasMore } = await getCompaniesPageData();

  return (
    <CompaniesClient
      initialCompanies={companies}
      initialTotalCompanies={totalCompanies}
      initialHasMore={hasMore}
    />
  );
}

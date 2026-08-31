import { Metadata, ResolvingMetadata } from 'next';
import HomePageClient from '@/app/HomePageClient';
import { CATEGORIES } from '@/lib/categories';
import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import { typesenseSearchClient } from '@/lib/typesenseClient';

export const revalidate = 60; // 1 minute
type Props = {
    params: Promise<{ location: string; category: string }>
}

// ---------------------------------------------------------------------
// 🚀 EGRESS FIX: naye/never-cached URLs pe jab multiple bots ek sath
// hit karte hain, ISR miss hone tak har request apni alag query bhejti
// thi (thundering herd). Ab url_path ke hisaab se cache hoga — same
// path pe concurrent/repeat hits ek hi query share karengi.
// ---------------------------------------------------------------------
const getCachedSeoStatus = unstable_cache(
    async (dbUrlPath: string) => {
        try {
            const results: any = await typesenseSearchClient.collections('seo_pages').documents().search({
                q: '*',
                query_by: 'url_path',
                filter_by: `url_path:=${dbUrlPath}`,
                per_page: 1,
            });
            return results.hits?.[0]?.document || null;
        } catch (err) {
            console.error("Typesense seo_pages fetch error:", err);
            return null;
        }
    },
    ['seo-page-status'],
    { revalidate: 3600 }
);

function formatUrlParam(param: string) {
    if (!param || param.toLowerCase() === 'all' || param.toLowerCase() === 'worldwide') return 'All';
    return param.replace(/-/g, ' '); // Simply remove dashes for matching
}

// 🧠 Helper: URL slug se exact category/tag nikalna (metadata aur page dono me use hoga)
function resolveCategoryOrTag(categoryParam: string) {
    const urlSlug = categoryParam.toLowerCase().replace(/[^a-z0-9]/g, '');
    let isTag = false;
    let isMainCategory = false;
    let actualCategoryName = 'All';
    let actualTagName = '';

    for (const [catName, catData] of Object.entries(CATEGORIES)) {
        if (catName.toLowerCase().replace(/[^a-z0-9]/g, '') === urlSlug) {
            isMainCategory = true;
            actualCategoryName = catName;
            break;
        }
        const matchedTag = catData.sub.find(t => t.toLowerCase().replace(/[^a-z0-9]/g, '') === urlSlug);
        if (matchedTag) {
            isTag = true;
            actualCategoryName = catName;
            actualTagName = matchedTag;
            break;
        }
    }
    return { isTag, isMainCategory, actualCategoryName, actualTagName };
}

// 🚀 DYNAMIC SEO GENERATOR
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const resolvedParams = await params;

    const locationRaw = formatUrlParam(resolvedParams.location);
    const isWorldwide = locationRaw === 'All';
    const displayLocation = isWorldwide ? 'Worldwide' : locationRaw;

    // 🧠 REVERSE SEARCH: Find if it's a Tag or Category
    const { isTag, isMainCategory, actualCategoryName, actualTagName } = resolveCategoryOrTag(resolvedParams.category);
    const finalRoleTitle = isTag ? actualTagName : (isMainCategory ? actualCategoryName : 'Remote');

    // 🎨 VIP Title Generator
    const pageTitle = `${finalRoleTitle} Jobs ${isWorldwide ? 'Worldwide' : `in ${displayLocation}`} | HireSkys`;
    const pageDescription = `Find the best high-paying remote and work-from-home ${finalRoleTitle} jobs hiring ${isWorldwide ? 'worldwide' : `in ${displayLocation}`}. Apply today on HireSkys.`;

    // 🔗 URLs
    const canonicalUrl = `https://www.hireskys.com/remote-jobs/${resolvedParams.location.toLowerCase()}/${resolvedParams.category.toLowerCase()}`;
    const dbUrlPath = `/remote-jobs/${resolvedParams.location.toLowerCase()}/${resolvedParams.category.toLowerCase()}`;

    // 🚀 THE SEO BOT SHIELD (Typesense se, Lightning Fast)
    const seoData = await getCachedSeoStatus(dbUrlPath);

    // Agar record nahi mila, YA is_indexed FALSE hai, toh Google ko block kardo!
    const shouldIndex = seoData?.is_indexed === true;

    if (!shouldIndex) {
        return {
            title: pageTitle,
            description: pageDescription,
            robots: { index: false, follow: false } // 🛑 Bot isko ignore karega
        }
    }

    // ✅ Agar bot ne isay pass kar diya hai (is_indexed = true), toh fully Index maro!
    return {
        title: pageTitle,
        description: pageDescription,
        alternates: { canonical: canonicalUrl },
        robots: { index: true, follow: true },
        openGraph: { title: pageTitle, description: pageDescription, type: 'website', url: canonicalUrl }
    }
}

// 🖥️ MAIN PAGE COMPONENT — ab poori tarah Typesense se SSR
export default async function RemoteJobsPage({ params }: Props) {
    const resolvedParams = await params;
    const LIMIT = 20;

    const locationFormatted = formatUrlParam(resolvedParams.location);
    const { isTag, isMainCategory, actualCategoryName, actualTagName } = resolveCategoryOrTag(resolvedParams.category);

    // 🚀 Exact match filters — jaisa homepage ke fetchJobs() me karte hain
    const filters: string[] = ['approved:=true', 'active:=true'];
    if (isTag) {
        filters.push(`tags:=${actualTagName}`);
    } else if (isMainCategory) {
        filters.push(`category:=${actualCategoryName}`);
    }

    let initialJobs: any[] = [];
    let count = 0;

    try {
        const results: any = await typesenseSearchClient.collections('jobs').documents().search({
            q: locationFormatted !== 'All' ? locationFormatted : '*',
            query_by: locationFormatted !== 'All' ? 'location' : 'title',
            filter_by: filters.join(' && '),
            sort_by: 'featured_until:desc,date_posted_ts:desc',
            per_page: LIMIT,
            page: 1,
        });

        initialJobs = (results.hits?.map((h: any) => h.document) || []).map((doc: any) => ({
            ...doc,
            id: Number(doc.id), // Typesense id string hota hai, HomePageClient ko number chahiye
        }));
        count = results.found || 0;
    } catch (err) {
        console.error("Typesense SSR jobs fetch error:", err);
    }

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            <HomePageClient
                seoCategory={resolvedParams.category}
                seoLocation={resolvedParams.location}
                serverJobs={initialJobs}
                serverCount={count}
                serverPage={0}
            />
        </Suspense>
    );
}

import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '@/lib/supabaseClient';
import HomePageClient from '@/app/HomePageClient';
import { CATEGORIES } from '@/lib/categories'; // 👈 Naya Import
import { Suspense } from 'react';

type Props = {
    params: Promise<{ location: string; category: string }>
}

function formatUrlParam(param: string) {
    if (!param || param.toLowerCase() === 'all' || param.toLowerCase() === 'worldwide') return 'All';
    return param.replace(/-/g, ' '); // Simply remove dashes for matching
}

// 🚀 DYNAMIC SEO GENERATOR
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const resolvedParams = await params;
    
    const locationRaw = formatUrlParam(resolvedParams.location);
    const categoryOrTagRaw = formatUrlParam(resolvedParams.category);

    const isWorldwide = locationRaw === 'All';
    const displayLocation = isWorldwide ? 'Worldwide' : locationRaw;

    // 🧠 REVERSE SEARCH: Find if it's a Tag or Category
    let isTag = false;
    let isMainCategory = false;
    let actualCategoryName = 'All';
    let actualTagName = '';
    const urlSlug = resolvedParams.category.toLowerCase().replace(/[\s-\.]/g, '');

    for (const [catName, catData] of Object.entries(CATEGORIES)) {
        if (catName.toLowerCase().replace(/[\s-\.]/g, '') === urlSlug) {
            isMainCategory = true;
            actualCategoryName = catName;
            break;
        }
        const matchedTag = catData.sub.find(t => t.toLowerCase().replace(/[\s-\.]/g, '') === urlSlug);
        if (matchedTag) {
            isTag = true;
            actualCategoryName = catName;
            actualTagName = matchedTag;
            break;
        }
    }

    const finalRoleTitle = isTag ? actualTagName : (isMainCategory ? actualCategoryName : 'Remote');

    // 🎨 VIP Title Generator
    const pageTitle = `${finalRoleTitle} Jobs ${isWorldwide ? 'Worldwide' : `in ${displayLocation}`}`;
    const pageDescription = `Find the best high-paying remote and work-from-home ${finalRoleTitle} jobs hiring ${isWorldwide ? 'worldwide' : `in ${displayLocation}`}. Apply today on HireSkys.`;
    
    // 🔗 URLs
    const canonicalUrl = `https://www.hireskys.com/remote-jobs/${resolvedParams.location.toLowerCase()}/${resolvedParams.category.toLowerCase()}`;
    const dbUrlPath = `/remote-jobs/${resolvedParams.location.toLowerCase()}/${resolvedParams.category.toLowerCase()}`;

    // 🚀 THE NEW SEO BOT SHIELD (Lightning Fast)
    // Ab hum jobs count nahi karenge, direct apna VIP SEO table check karenge!
    const { data: seoData } = await supabase
        .from('seo_pages')
        .select('is_indexed')
        .eq('url_path', dbUrlPath)
        .single();

    // Agar table mein record nahi hai, YA is_indexed FALSE hai, toh Google ko block kardo!
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

// 🖥️ MAIN PAGE COMPONENT
export default async function RemoteJobsPage({ params }: Props) {
    const resolvedParams = await params;
    
    // 🧠 Pehle hum 'finalLocation' ka variable bana rahe thay jo server se filter chep deta tha,
    // Ab hum direct URL se aane wali location pass karenge bina kisi extra logic ke.
    
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            {/* 🚀 FIXED: Humne 'finalLocation' ki jagah direct 'resolvedParams.location' pass kar diya hai */}
            <HomePageClient 
                seoCategory={resolvedParams.category} 
                seoLocation={resolvedParams.location} 
            />
        </Suspense>
    );
}

import { NextResponse } from 'next/server';
import { typesenseAdminClient } from '@/lib/typesenseClient';
import { countryMap } from '@/lib/country';

function extractCountryCodes(location: string): string[] {
    if (!location) return [];
    const loc = location.toLowerCase();
    const codes = new Set<string>();
    if (loc.includes('worldwide') || loc.includes('global') || loc.includes('anywhere')) codes.add('WORLDWIDE');
    Object.values(countryMap).forEach((v: any) => {
        if (v.name && loc.includes(v.name.toLowerCase())) codes.add(v.code || v.name);
        if (v.code && loc.includes(`(${v.code.toLowerCase()})`)) codes.add(v.code);
    });
    return Array.from(codes);
}

export async function POST(req: Request) {
    try {
        // 1. Security Check: Taake koi aur fake requests na bhej sake
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized Hacker Bro!' }, { status: 401 });
        }

        const payload = await req.json();
        const { type, record, old_record } = payload;

        // 2. Kab Typesense se HATANA hai:
        //    a) Row asal me DELETE hui Supabase se
        //    b) Job 'approved' false ho gayi — unapproved jobs kabhi public
        //       site pe kisi bhi page (active ya inactive) pe nahi dikhni
        //       chahiye, isliye Typesense se poori hata do.
        //
        // 🚀 NOTE: 'active' false hone par ab HATA nahi rahe — sirf update
        // kar rahe hain (neeche step 3 me), taake wo job "inactive/expired
        // jobs" page pe dikh sake. Ye humari sync route ke logic se match
        // karta hai (jo approved=true saari jobs rakhta hai, active status
        // se independent).
        if (type === 'DELETE' || (type === 'UPDATE' && !record.approved)) {
            const idToDelete = old_record?.id || record?.id;
            if (idToDelete) {
                try {
                    await typesenseAdminClient.collections('jobs').documents(idToDelete.toString()).delete();
                } catch (e) {
                    // Document pehle se hi Typesense me nahi tha — koi masla nahi
                }
            }
            return NextResponse.json({ message: "Job removed from Typesense" });
        }

        // 3. Agar Nayi Job aayi hai (INSERT) ya Update hui hai, aur approved hai
        // (active true ho ya false — dono jaani chahiye, filtering website ke
        // filter_by se hogi) -> Typesense mein upsert karo.
        if ((type === 'INSERT' || type === 'UPDATE') && record.approved) {
            // 🚀 EXPLICIT field mapping — poori row (...record) blind spread
            // nahi kar rahe. Wajah: Supabase se aane wali row me 'fts' jaisi
            // tsvector field bhi hoti hai jo Typesense ke liye invalid type
            // hai — usse silent reject ho sakta hai. Ye bilkul wahi field-list
            // hai jo sync route (bulk import) me use hoti hai, taake dono
            // hamesha consistent rahein.
            const document = {
                id: record.id.toString(),
                title: record.title || '',
                source: record.source || '',
                company: record.company || record.source || '',
                category: record.category || 'Other',
                location: record.location || '',
                job_type: record.job_type || '',
                experience_level: record.experience_level || '',
                tags: record.tags || [],
                salary_range: record.salary_range || 'Not Disclosed',
                date_posted: record.date_posted ? String(record.date_posted) : '',
                created_at: record.created_at ? String(record.created_at) : '',
                link: record.link || '',
                description: record.description || '',
                company_logo_url: record.company_logo_url || '',
                slug: record.slug || '',
                platform: record.platform || '',
                contact_email: record.contact_email || '',
                contact_info: record.contact_info || '',
                author_id: record.author_id ? String(record.author_id) : '',
                application_count: record.application_count ?? 0,
                approved: record.approved ?? true,
                active: record.active ?? true,
                is_verified: record.is_verified ?? false,
                featured_until: record.featured_until ? String(record.featured_until) : '',
                brand_color: record.brand_color || '',
                country_codes: extractCountryCodes(record.location || ''),
                date_posted_ts: record.date_posted ? new Date(record.date_posted).getTime() : 0,
            };

            // 'upsert' ka matlab hai: Agar nahi hai toh create karo, agar hai toh update karo
            try {
                await typesenseAdminClient.collections('jobs').documents().upsert(document);
                return NextResponse.json({ message: `Job '${document.title}' successfully synced to Typesense ⚡` });
            } catch (err: any) {
                // Upsert fail hua to asal reason wapas bhejo — silent fail nahi
                console.error(`⚠️ Upsert failed for job id ${document.id}:`, err.message);
                return NextResponse.json(
                    { error: `Typesense upsert failed: ${err.message}`, job_id: document.id },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ message: "Ignored (Job is not approved)" });

    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
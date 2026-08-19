import { NextResponse } from 'next/server';
import { typesenseAdminClient } from '@/lib/typesenseClient';

export async function POST(req: Request) {
    try {
        // 1. Security Check — same secret jobs webhook wala use kar rahe hain
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized Hacker Bro!' }, { status: 401 });
        }

        const payload = await req.json();
        const { type, record, old_record } = payload;

        // 2. DELETE — Typesense se bhi hata do
        if (type === 'DELETE') {
            const slugToDelete = old_record?.slug;
            if (slugToDelete) {
                try {
                    await typesenseAdminClient.collections('companies').documents(slugToDelete).delete();
                } catch (e) {
                    // Pehle se hi Typesense me nahi tha — koi masla nahi
                }
            }
            return NextResponse.json({ message: "Company removed from Typesense" });
        }

        // 3. INSERT / UPDATE — upsert karo
        if (type === 'INSERT' || type === 'UPDATE') {
            if (!record.slug) {
                return NextResponse.json({ message: "Skipped — no slug" });
            }

            // 🚀 Explicit field mapping — jobs pattern jaisa hi, blind spread nahi
            const document = {
                id: record.slug,
                slug: record.slug,
                name: record.name || '',
                description: record.description || '',
                logo_url: record.logo_url || '',
                banner_url: record.banner_url || '',
                website: record.website || '',
                location: record.location || '',
                verified: record.verified ?? false,
                created_at: record.created_at ? String(record.created_at) : '',
                created_at_ts: record.created_at ? new Date(record.created_at).getTime() : 0,
                industry: record.industry || record.category || 'Other',
                employer_id: record.employer_id ? String(record.employer_id) : '',
                job_credits: record.job_credits ?? 0,
                founded_year: record.founded_year || '',
                company_size: record.company_size || '',
                promo_video_url: record.promo_video_url || '',
                // ⚠️ active_jobs_count aur avg_salary_num yahan set NAHI ho rahe —
                // wo jobs-webhook ke through update hote hain (neeche note dekho),
                // taake company create/update hone par purani values overwrite na ho jayen.
            };

            try {
                // 🔥 MERGE-UPDATE pattern: .update() sirf bheje gaye fields ko
                // patch karta hai, baaki (active_jobs_count, avg_salary_num)
                // untouched rehte hain. Agar document exist hi nahi karta
                // (naya company), .update() fail hoga -> tab .upsert() se
                // fresh create karo with job-count fields defaulted to 0.
                try {
                    await typesenseAdminClient.collections('companies').documents(document.id).update(document);
                } catch (updateErr: any) {
                    await typesenseAdminClient.collections('companies').documents().upsert({
                        ...document,
                        active_jobs_count: 0,
                        avg_salary_num: 0,
                    });
                }
                return NextResponse.json({ message: `Company '${document.name}' synced to Typesense ⚡` });
            } catch (err: any) {
                console.error(`⚠️ Sync failed for company ${document.slug}:`, err.message);
                return NextResponse.json(
                    { error: `Typesense sync failed: ${err.message}`, slug: document.slug },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ message: "Ignored" });

    } catch (error: any) {
        console.error("Company Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
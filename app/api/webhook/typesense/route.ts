import { NextResponse } from 'next/server';
import { typesenseAdminClient } from '@/lib/typesenseClient';

export async function POST(req: Request) {
    try {
        // 1. Security Check: Taake koi aur fake requests na bhej sake
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized Hacker Bro!' }, { status: 401 });
        }

        const payload = await req.json();
        const { type, record, old_record } = payload;

        // 2. Agar Job DELETE hui hai, ya Inactive/Unapproved ho gayi hai -> Typesense se hatao
        if (type === 'DELETE' || (type === 'UPDATE' && (!record.active || !record.approved))) {
            const idToDelete = old_record?.id || record?.id;
            if (idToDelete) {
                try {
                    await typesenseAdminClient.collections('jobs').documents(idToDelete.toString()).delete();
                } catch (e) {
                    // Agar Typesense mein pehle se nahi thi, toh ignore karo
                }
            }
            return NextResponse.json({ message: "Job removed from Typesense" });
        }

        // 3. Agar Nayi Job aayi hai (INSERT) ya Update hui hai -> Typesense mein daalo
        if ((type === 'INSERT' || type === 'UPDATE') && record.active && record.approved) {
            const document = {
                ...record,
                id: record.id.toString(), // ID string honi chahiye
                tags: record.tags || [],
                location: record.location || ""
            };

            // 'upsert' ka matlab hai: Agar nahi hai toh create karo, agar hai toh update karo
            await typesenseAdminClient.collections('jobs').documents().upsert(document);
            return NextResponse.json({ message: "Job successfully synced to Typesense ⚡" });
        }

        return NextResponse.json({ message: "Ignored (Job is not active/approved)" });

    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { typesenseAdminClient } from '@/lib/typesenseClient';

export async function GET() {
    try {
        // 1. Fetch Active Jobs from Supabase
        const { data: jobs, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('approved', true)
            .eq('active', true);

        if (error) throw error;
        if (!jobs || jobs.length === 0) return NextResponse.json({ message: "No jobs found to sync." });

        // 2. Define Typesense Schema (Kon konsi cheezon par search karni hai)
        const schema = {
            name: 'jobs',
            fields: [
                { name: 'id', type: 'string' }, // Typesense needs string IDs
                { name: 'title', type: 'string' },
                { name: 'source', type: 'string' },
                { name: 'category', type: 'string' },
                { name: 'location', type: 'string', optional: true },
                { name: 'job_type', type: 'string', optional: true },
                { name: 'tags', type: 'string[]', optional: true },
                { name: 'date_posted', type: 'string' }
            ]
        };

        // 3. Purani collection delete karo (agar pehle se bani hui hai taake duplicate na ho)
        try {
            await typesenseAdminClient.collections('jobs').delete();
        } catch (e) {
            console.log("Collection doesn't exist yet. Creating a fresh one.");
        }

        // 4. Create New Collection
        await typesenseAdminClient.collections().create(schema as any);

        // 5. Format Jobs (ID ko string mein convert karna zaroori hai Typesense ke liye)
        const formattedJobs = jobs.map((job) => ({
            ...job,
            id: job.id.toString(), 
            tags: job.tags || [],
            location: job.location || job.country || 'Remote'
        }));

        // 6. Push Data to Typesense
        await typesenseAdminClient.collections('jobs').documents().import(formattedJobs, { action: 'create' });

        return NextResponse.json({ 
            success: true, 
            message: `🔥 Boom! Successfully synced ${formattedJobs.length} jobs from Supabase to Typesense!` 
        });

    } catch (error: any) {
        console.error("Sync Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
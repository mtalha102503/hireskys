import { supabase } from '@/lib/supabaseClient';
import JobClient from './JobClient'; // Tumhara purana component
import { notFound } from 'next/navigation';

// Ye Server Component hai (Super Fast)
export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  
  // Params ko await karo (Next.js 15+ requirement)
  const { id } = await params;

  // 1. Direct Server se Data nikalo (Instant Fetch)
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  // 2. Agar job nahi mili to 404 page dikhao
  if (error || !job) {
    return notFound();
  }

  // 3. Data ko tumhare purane code (JobClient) mein pass kar do
  return <JobClient initialJob={job} />;
}

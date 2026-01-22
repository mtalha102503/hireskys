import { supabase } from '@/lib/supabaseClient';
import JobClient from './JobClient'; 
import { notFound, redirect } from 'next/navigation'; // 👈 Redirect import kiya
import { createSlug } from '@/lib/utils'; // 👈 Helper function zaroori hai

// Folder ka naam [slug] hai, isliye params mein slug aayega
export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  
  // 1. Params await karo
  const { slug } = await params;

  // 2. Slug se ID nikalo (Last part: "react-dev-692" -> "692")
  const slugParts = slug.split('-');
  const id = slugParts[slugParts.length - 1]; // Sabse last wala hissa ID hai

  // Agar ID valid number nahi hai, to 404
  if (!id || isNaN(Number(id))) {
    return notFound();
  }

  // 3. Database se Job fetch karo (ID use karke)
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !job) {
    return notFound();
  }

  // 4. 🔥 SEO REDIRECT MAGIC
  // Check karo: Kya URL perfect hai?
  const expectedSlug = createSlug(job.title, job.id);

  // Agar URL mein "react-dev" nahi likha (sirf ID hai), ya spelling galat hai
  if (slug !== expectedSlug) {
    // To user ko sahi URL par bhej do (301 Permanent Redirect)
    redirect(`/jobs/${expectedSlug}`);
  }

  // 5. Agar sab theek hai, to Page dikhao
  return <JobClient initialJob={job} />;
}
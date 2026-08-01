// app/talent/page.tsx (Server Component)
import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabaseClient';
import TalentClient from './TalentClient';

export const revalidate = 3600; // 1 ghanta

const getRankedTalent = unstable_cache(
  async () => {
    console.log('🔥 CACHE MISS — fresh fetch for ranked talent list');
    const { data, error } = await supabase.rpc('get_ranked_talent');
    if (error) {
      console.error('Ranked talent fetch error:', error);
      return [];
    }
    return data || [];
  },
  ['ranked-talent-list'],
  { revalidate: 3600 }
);

export default async function Page() {
  const initialTalents = await getRankedTalent();
  return <TalentClient initialTalents={initialTalents} />;
}
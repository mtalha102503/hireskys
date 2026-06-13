import { supabase } from '@/lib/supabaseClient';

export async function getActiveWorkspaceId(userId: string) {
  try {
    // 1. Check karo kya yeh user kisi aur ki team mein 'active' member hai?
    const { data: teamData, error } = await supabase
      .from('team_members')
      .select('employer_id, role')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (teamData) {
      // 🟢 Agar yeh team member hai, toh iske Boss (Owner) ka ID return karo
      return { workspaceId: teamData.employer_id, role: teamData.role };
    }

    // 🔵 Agar yeh kisi team mein nahi hai, toh yeh khud Owner hai! Iska apna ID return karo
    return { workspaceId: userId, role: 'owner' };
    
  } catch (error) {
    // Agar koi masla ho jaye fallback ke tor par user ka apna ID bhej do
    return { workspaceId: userId, role: 'owner' };
  }
}
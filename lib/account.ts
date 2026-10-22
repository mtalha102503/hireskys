// ============================================================
// lib/account.ts — account role helpers (ATS separation)
// Roles live in Supabase Auth user_metadata.role ('employer' |
// 'seeker'), set at login callback / role-selection. A user also
// counts as an employer when real employer data exists (company,
// active team membership, or posted jobs) — that derivation keeps
// every pre-existing employer working without a backfill.
// ============================================================

import { supabase } from '@/lib/supabaseClient';

export interface EmployerAccess {
  isEmployer: boolean;
  role: string | null;
  derived: boolean; // access came from employer data, not the role flag
}

export async function resolveEmployerAccess(user: any): Promise<EmployerAccess> {
  const role: string | null = user?.user_metadata?.role || null;
  if (role === 'employer') {
    return { isEmployer: true, role, derived: false };
  }
  try {
    const [comp, team, job] = await Promise.all([
      supabase.from('companies').select('id').eq('employer_id', user.id).limit(1),
      supabase.from('team_members').select('id').eq('user_id', user.id).eq('status', 'active').limit(1),
      supabase.from('jobs').select('id').eq('employer_id', user.id).limit(1),
    ]);
    const derived = Boolean(
      (comp.data && comp.data.length > 0) ||
      (team.data && team.data.length > 0) ||
      (job.data && job.data.length > 0)
    );
    return { isEmployer: derived, role, derived };
  } catch {
    return { isEmployer: false, role, derived: false };
  }
}

// Explicitly convert the signed-in account into an employer account.
export async function markAsEmployer() {
  const { error } = await supabase.auth.updateUser({ data: { role: 'employer' } });
  if (error) throw error;
  await supabase.auth.refreshSession();
}

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

// Employer ki companies row us ke account ki bunyaad hai — credits,
// billing aur job posting sab usi par chalta hai. Pehle wo row sirf
// Settings save karne par banti thi; naya employer pehle Billing ya
// Post-a-Job par chala jaye to har jagah ".single()" wala error
// ('Cannot coerce the result to a single JSON object') milta tha.
// Ye helper employer banne par row ki maujoodgi pakki karta hai.
// Best-effort hai: kabhi throw nahi karta, taake login flow na ruke.
// SIRF un users ke liye chalana jin ka employer hona tay ho chuka ho —
// seeker par chala to wo hamesha ke liye employer derive hone lagega.
export async function ensureEmployerCompany(user: any): Promise<void> {
  if (!user?.id) return;
  try {
    const { data: existing } = await supabase
      .from('companies')
      .select('id')
      .eq('employer_id', user.id)
      .limit(1);
    if (existing && existing.length > 0) return;

    const rawName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      (user.email ? String(user.email).split('@')[0] : '') ||
      'My Company';
    const baseSlug =
      String(rawName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'company';

    for (let attempt = 0; attempt < 2; attempt++) {
      const suffix = Math.random().toString(36).slice(2, 8);
      const { error } = await supabase.from('companies').insert({
        employer_id: user.id,
        name: rawName,
        slug: `${baseSlug}-${suffix}`,
      });
      if (!error) return;
      // slug takra gaya ho to naye suffix ke saath aik aur koshish
      if (!String(error.message || '').toLowerCase().includes('slug')) return;
    }
  } catch {
    // best-effort — login kabhi is ki wajah se nahi rukega
  }
}

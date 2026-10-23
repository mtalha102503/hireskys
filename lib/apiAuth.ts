import { createClient, type User } from '@supabase/supabase-js';

// ============================================================
// lib/apiAuth.ts — server-side session verification for API routes.
// Browser pages hold their Supabase session in localStorage and
// send the access token as 'Authorization: Bearer <token>'.
// Routes using the SERVICE ROLE key bypass RLS entirely, so they
// must verify the caller here instead of trusting IDs that arrive
// in the request body.
// ============================================================

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify the Bearer token against Supabase Auth.
// Returns the authenticated user, or null when there is no valid session.
export async function getAuthedUser(req: Request): Promise<User | null> {
  const header = req.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

// True when the user owns the workspace (userId === claimedEmployerId)
// or is an ACTIVE team member of it.
export async function resolveWorkspace(userId: string, claimedEmployerId: string): Promise<boolean> {
  if (!userId || !claimedEmployerId) return false;
  if (userId === claimedEmployerId) return true;
  const { data } = await supabaseAdmin
    .from('team_members')
    .select('id')
    .eq('user_id', userId)
    .eq('employer_id', claimedEmployerId)
    .eq('status', 'active')
    .limit(1);
  return !!(data && data.length > 0);
}

// Stricter variant for workspace-admin actions (e.g. team invites):
// owner, or an ACTIVE team member whose role is 'owner' or 'admin'.
export async function resolveWorkspaceAdmin(userId: string, claimedEmployerId: string): Promise<boolean> {
  if (!userId || !claimedEmployerId) return false;
  if (userId === claimedEmployerId) return true;
  const { data } = await supabaseAdmin
    .from('team_members')
    .select('id')
    .eq('user_id', userId)
    .eq('employer_id', claimedEmployerId)
    .eq('status', 'active')
    .in('role', ['owner', 'admin'])
    .limit(1);
  return !!(data && data.length > 0);
}

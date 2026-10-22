// ============================================================
// lib/pipeline.ts — HireSkys ATS pipeline stages (Phase 1)
// Shared types + helpers for per-job custom stages.
// applications.status stores the stage NAME; job_stages is the
// source of truth for each job's pipeline (name, kind, order).
// Every helper falls back to the default pipeline so the board
// never breaks for a job that has no stage rows yet.
// ============================================================

export type StageKind =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected'
  | 'custom';

export interface PipelineStage {
  id?: string;
  job_id?: number;
  name: string;
  kind: StageKind;
  position: number;
  color: string;
}

// Default pipeline. Names match the historical status strings so
// existing applications need no migration; Offer + Hired are new.
export const DEFAULT_STAGES: PipelineStage[] = [
  { name: 'New', kind: 'applied', position: 0, color: 'blue' },
  { name: 'Shortlisted', kind: 'screening', position: 1, color: 'emerald' },
  { name: 'Interview', kind: 'interview', position: 2, color: 'purple' },
  { name: 'Offer', kind: 'offer', position: 3, color: 'amber' },
  { name: 'Hired', kind: 'hired', position: 4, color: 'green' },
  { name: 'Rejected', kind: 'rejected', position: 5, color: 'slate' },
];

// Color token -> Tailwind classes (same style as the old COLUMNS).
export const STAGE_COLORS: Record<string, { border: string; bg: string }> = {
  blue: { border: 'border-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  emerald: { border: 'border-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  purple: { border: 'border-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  amber: { border: 'border-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  green: { border: 'border-green-600', bg: 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400' },
  slate: { border: 'border-slate-400', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' },
  rose: { border: 'border-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  indigo: { border: 'border-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
};

export const COLOR_TOKENS = Object.keys(STAGE_COLORS);

export const KIND_LABELS: Record<StageKind, string> = {
  applied: 'Applied (entry)',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired (final)',
  rejected: 'Rejected (final)',
  custom: 'Custom (no automation)',
};

// Kind buckets used by the "All jobs" board view and bulk actions.
export const KIND_COLUMNS: { kind: StageKind; title: string; color: string }[] = [
  { kind: 'applied', title: 'New / Applied', color: 'blue' },
  { kind: 'screening', title: 'Screening', color: 'emerald' },
  { kind: 'interview', title: 'Interview', color: 'purple' },
  { kind: 'offer', title: 'Offer', color: 'amber' },
  { kind: 'hired', title: 'Hired', color: 'green' },
  { kind: 'rejected', title: 'Rejected', color: 'slate' },
];

// Legacy name -> kind, for jobs/statuses without stage rows.
export function legacyKindOf(status: string | null | undefined): StageKind {
  switch ((status || '').toLowerCase()) {
    case 'new':
      return 'applied';
    case 'shortlisted':
      return 'screening';
    case 'interview':
    case 'interviewing':
      return 'interview';
    case 'offer':
      return 'offer';
    case 'hired':
      return 'hired';
    case 'rejected':
      return 'rejected';
    default:
      return 'applied';
  }
}

export function sortedStages(stages: PipelineStage[] | undefined | null): PipelineStage[] {
  if (!stages || stages.length === 0) return DEFAULT_STAGES;
  return [...stages].sort((a, b) => a.position - b.position);
}

// Kind of a status name within one job's pipeline.
export function kindOfStatus(
  stages: PipelineStage[] | undefined | null,
  status: string | null | undefined
): StageKind {
  if (stages && stages.length > 0) {
    const hit = stages.find((s) => s.name === status);
    if (hit) return hit.kind;
    return 'applied'; // status not in this job's pipeline (e.g. renamed away)
  }
  return legacyKindOf(status);
}

// The stage of a given kind in a job's pipeline (first match by position).
export function stageByKind(
  stages: PipelineStage[] | undefined | null,
  kind: StageKind
): PipelineStage | undefined {
  return sortedStages(stages).find((s) => s.kind === kind);
}

// Fetch stages for many jobs at once. Returns a map job_id -> stages.
// Any error (e.g. table missing) yields an empty map — callers fall
// back to DEFAULT_STAGES via sortedStages().
export async function fetchStagesByJob(
  supabase: any,
  jobIds: number[]
): Promise<Record<number, PipelineStage[]>> {
  const map: Record<number, PipelineStage[]> = {};
  if (!jobIds || jobIds.length === 0) return map;
  try {
    const { data, error } = await supabase
      .from('job_stages')
      .select('id, job_id, name, kind, position, color')
      .in('job_id', jobIds)
      .order('position', { ascending: true });
    if (error || !data) return map;
    for (const row of data as PipelineStage[]) {
      if (row.job_id == null) continue;
      if (!map[row.job_id]) map[row.job_id] = [];
      map[row.job_id].push(row);
    }
  } catch {
    // Table missing or unreachable — defaults take over.
  }
  return map;
}

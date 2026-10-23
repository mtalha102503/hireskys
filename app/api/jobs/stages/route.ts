import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthedUser, resolveWorkspace } from '@/lib/apiAuth';

// ============================================================
// /api/jobs/stages — CRUD for per-job pipeline stages (Phase 1)
// All writes go through the service role. Every action first verifies
// the caller's session (lib/apiAuth) and workspace access, then that
// the job belongs to the given employerId. applications.status stores
// the stage NAME, so renames/deletes cascade to applications.
// ============================================================

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VALID_KINDS = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected', 'custom'];
const LOCKED_KINDS = ['applied', 'hired', 'rejected']; // exactly one each; cannot be deleted
const KIND_DEFAULT_COLOR: Record<string, string> = {
  applied: 'blue',
  screening: 'emerald',
  interview: 'purple',
  offer: 'amber',
  hired: 'green',
  rejected: 'slate',
  custom: 'indigo',
};

async function getJob(jobId: number, employerId: string) {
  const { data: job } = await supabaseAdmin
    .from('jobs')
    .select('id, employer_id, title')
    .eq('id', jobId)
    .single();
  if (!job || String(job.employer_id) !== String(employerId)) return null;
  return job;
}

async function getStages(jobId: number) {
  const { data } = await supabaseAdmin
    .from('job_stages')
    .select('*')
    .eq('job_id', jobId)
    .order('position', { ascending: true });
  return data || [];
}

async function renormalize(jobId: number) {
  const stages = await getStages(jobId);
  for (let i = 0; i < stages.length; i++) {
    if (stages[i].position !== i) {
      await supabaseAdmin.from('job_stages').update({ position: i }).eq('id', stages[i].id);
    }
  }
}

// GET /api/jobs/stages?jobId=..&employerId=..
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = Number(searchParams.get('jobId'));
    const employerId = searchParams.get('employerId') || '';
    if (!jobId || !employerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const authedUser = await getAuthedUser(request);
    if (!authedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!(await resolveWorkspace(authedUser.id, employerId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const job = await getJob(jobId, employerId);
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    const stages = await getStages(jobId);
    return NextResponse.json({ stages });
  } catch (error: any) {
    console.error('Stages GET Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// POST — add a stage { employerId, jobId, name, kind, color? }
export async function POST(request: Request) {
  try {
    const { employerId, jobId, name, kind, color } = await request.json();
    if (!employerId || !jobId || !name?.trim() || !kind) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!VALID_KINDS.includes(kind)) {
      return NextResponse.json({ error: 'Invalid stage type' }, { status: 400 });
    }
    const authedUser = await getAuthedUser(request);
    if (!authedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!(await resolveWorkspace(authedUser.id, employerId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const job = await getJob(Number(jobId), employerId);
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    const stages = await getStages(job.id);
    if (stages.some((s: any) => s.name.toLowerCase() === name.trim().toLowerCase())) {
      return NextResponse.json({ error: 'A stage with this name already exists for this job' }, { status: 400 });
    }
    if (LOCKED_KINDS.includes(kind) && stages.some((s: any) => s.kind === kind)) {
      return NextResponse.json({ error: `This job already has a ${kind} stage` }, { status: 400 });
    }

    // New stages go just before the Rejected stage when there is one,
    // so Rejected stays last; otherwise they append at the end.
    const rejected = stages.find((s: any) => s.kind === 'rejected');
    let position = stages.length;
    if (rejected && kind !== 'rejected') {
      position = rejected.position;
      for (const s of stages) {
        if (s.position >= position) {
          await supabaseAdmin.from('job_stages').update({ position: s.position + 1 }).eq('id', s.id);
        }
      }
    }

    const { error } = await supabaseAdmin.from('job_stages').insert({
      job_id: job.id,
      name: name.trim(),
      kind,
      position,
      color: color || KIND_DEFAULT_COLOR[kind] || 'indigo',
    });
    if (error) throw error;

    return NextResponse.json({ success: true, stages: await getStages(job.id) });
  } catch (error: any) {
    console.error('Stages POST Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// PATCH — rename / recolor / change kind / reorder
// { employerId, jobId, stageId, name?, kind?, color? } or { employerId, jobId, order: [stageId,...] }
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { employerId, jobId } = body;
    if (!employerId || !jobId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // 🔐 SECURITY: session + workspace verify (service role RLS bypass karta hai)
    const authedUser = await getAuthedUser(request);
    if (!authedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!(await resolveWorkspace(authedUser.id, employerId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const job = await getJob(Number(jobId), employerId);
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    const stages = await getStages(job.id);

    // Reorder
    if (Array.isArray(body.order)) {
      for (let i = 0; i < body.order.length; i++) {
        await supabaseAdmin.from('job_stages').update({ position: i }).eq('id', body.order[i]).eq('job_id', job.id);
      }
      return NextResponse.json({ success: true, stages: await getStages(job.id) });
    }

    const stage = stages.find((s: any) => s.id === body.stageId);
    if (!stage) return NextResponse.json({ error: 'Stage not found' }, { status: 404 });

    const updates: Record<string, any> = {};

    if (body.kind && body.kind !== stage.kind) {
      if (!VALID_KINDS.includes(body.kind)) {
        return NextResponse.json({ error: 'Invalid stage type' }, { status: 400 });
      }
      if (LOCKED_KINDS.includes(body.kind) && stages.some((s: any) => s.kind === body.kind)) {
        return NextResponse.json({ error: `This job already has a ${body.kind} stage` }, { status: 400 });
      }
      if (LOCKED_KINDS.includes(stage.kind)) {
        return NextResponse.json({ error: 'The first, Hired and Rejected stages keep their type' }, { status: 400 });
      }
      updates.kind = body.kind;
    }

    if (body.color) updates.color = body.color;

    if (body.name && body.name.trim() && body.name.trim() !== stage.name) {
      const newName = body.name.trim();
      if (stages.some((s: any) => s.id !== stage.id && s.name.toLowerCase() === newName.toLowerCase())) {
        return NextResponse.json({ error: 'A stage with this name already exists for this job' }, { status: 400 });
      }
      updates.name = newName;
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabaseAdmin.from('job_stages').update(updates).eq('id', stage.id);
      if (error) throw error;
      // Rename cascade: applications.status stores the stage name.
      if (updates.name) {
        await supabaseAdmin
          .from('applications')
          .update({ status: updates.name })
          .eq('job_id', job.id)
          .eq('status', stage.name);
      }
    }

    return NextResponse.json({ success: true, stages: await getStages(job.id) });
  } catch (error: any) {
    console.error('Stages PATCH Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// DELETE — remove a stage { employerId, jobId, stageId, moveToStageId? }
export async function DELETE(request: Request) {
  try {
    const { employerId, jobId, stageId, moveToStageId } = await request.json();
    if (!employerId || !jobId || !stageId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const authedUser = await getAuthedUser(request);
    if (!authedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!(await resolveWorkspace(authedUser.id, employerId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const job = await getJob(Number(jobId), employerId);
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    const stages = await getStages(job.id);
    const stage = stages.find((s: any) => s.id === stageId);
    if (!stage) return NextResponse.json({ error: 'Stage not found' }, { status: 404 });

    if (LOCKED_KINDS.includes(stage.kind)) {
      return NextResponse.json({ error: 'The first, Hired and Rejected stages cannot be deleted (rename them instead)' }, { status: 400 });
    }

    const { count } = await supabaseAdmin
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .eq('job_id', job.id)
      .eq('status', stage.name);

    if ((count || 0) > 0) {
      if (!moveToStageId) {
        return NextResponse.json(
          { error: `This stage has ${count} candidate(s). Choose a stage to move them to first.`, needsMove: true, count },
          { status: 400 }
        );
      }
      const target = stages.find((s: any) => s.id === moveToStageId);
      if (!target) return NextResponse.json({ error: 'Target stage not found' }, { status: 400 });
      await supabaseAdmin
        .from('applications')
        .update({ status: target.name })
        .eq('job_id', job.id)
        .eq('status', stage.name);
    }

    const { error } = await supabaseAdmin.from('job_stages').delete().eq('id', stage.id);
    if (error) throw error;
    await renormalize(job.id);

    return NextResponse.json({ success: true, stages: await getStages(job.id) });
  } catch (error: any) {
    console.error('Stages DELETE Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

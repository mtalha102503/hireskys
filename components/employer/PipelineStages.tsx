"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  PipelineStage,
  StageKind,
  DEFAULT_STAGES,
  KIND_LABELS,
  COLOR_TOKENS,
  STAGE_COLORS,
} from '@/lib/pipeline';
import { Loader2, Plus, ArrowUp, ArrowDown, Pencil, Trash2, Lock, Check, X } from 'lucide-react';

// ============================================================
// PipelineStages — per-job pipeline manager (ATS Phase 1)
// Used on the job edit page. Reads stages directly (public read),
// writes go through /api/jobs/stages (service role, ownership
// checked server-side). applications.status stores stage names;
// the API cascades renames and guarded deletes.
// ============================================================

interface Props {
  jobId: number;
  employerId: string;
}

const LOCKED: StageKind[] = ['applied', 'hired', 'rejected'];

export default function PipelineStages({ jobId, employerId }: Props) {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [newName, setNewName] = useState('');
  const [newKind, setNewKind] = useState<StageKind>('custom');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editKind, setEditKind] = useState<StageKind>('custom');
  const [editColor, setEditColor] = useState('indigo');

  const [pendingDelete, setPendingDelete] = useState<{ stage: PipelineStage; count: number } | null>(null);
  const [moveToId, setMoveToId] = useState<string>('');

  async function loadStages() {
    setLoading(true);
    const { data } = await supabase
      .from('job_stages')
      .select('*')
      .eq('job_id', jobId)
      .order('position', { ascending: true });
    setStages((data as PipelineStage[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    loadStages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  function notify(text: string, type: 'success' | 'error' = 'success') {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  }

  async function api(method: string, payload: Record<string, any>) {
    // 🔐 API ab session token mangti hai — baghair is ke 401 milega
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/jobs/stages', {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ employerId, jobId, ...payload }),
    });
    const data = await res.json();
    if (!res.ok) {
      const err: any = new Error(data.error || 'Request failed');
      err.data = data;
      throw err;
    }
    return data;
  }

  async function seedDefaults() {
    setBusy(true);
    try {
      for (const s of DEFAULT_STAGES) {
        await api('POST', { name: s.name, kind: s.kind, color: s.color });
      }
      await loadStages();
      notify('Default pipeline created');
    } catch (e: any) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function addStage() {
    if (!newName.trim()) return;
    setBusy(true);
    try {
      const data = await api('POST', { name: newName.trim(), kind: newKind });
      setStages(data.stages);
      setNewName('');
      setNewKind('custom');
      notify('Stage added');
    } catch (e: any) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit(stage: PipelineStage) {
    setBusy(true);
    try {
      const data = await api('PATCH', {
        stageId: stage.id,
        name: editName.trim(),
        kind: editKind,
        color: editColor,
      });
      setStages(data.stages);
      setEditingId(null);
      notify('Stage updated — candidates moved with it');
    } catch (e: any) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function move(stage: PipelineStage, dir: -1 | 1) {
    const idx = stages.findIndex((s) => s.id === stage.id);
    const swapWith = idx + dir;
    if (swapWith < 0 || swapWith >= stages.length) return;
    const order = [...stages];
    [order[idx], order[swapWith]] = [order[swapWith], order[idx]];
    setStages(order);
    setBusy(true);
    try {
      const data = await api('PATCH', { order: order.map((s) => s.id) });
      setStages(data.stages);
    } catch (e: any) {
      notify(e.message, 'error');
      loadStages();
    } finally {
      setBusy(false);
    }
  }

  async function deleteStage(stage: PipelineStage, moveToStageId?: string) {
    setBusy(true);
    try {
      const data = await api('DELETE', { stageId: stage.id, moveToStageId });
      setStages(data.stages);
      setPendingDelete(null);
      notify('Stage deleted');
    } catch (e: any) {
      if (e.data?.needsMove) {
        setPendingDelete({ stage, count: e.data.count });
        const firstOther = stages.find((s) => s.id !== stage.id);
        setMoveToId(firstOther?.id || '');
      } else {
        notify(e.message, 'error');
      }
    } finally {
      setBusy(false);
    }
  }

  const usedLockedKinds = new Set(stages.filter((s) => LOCKED.includes(s.kind)).map((s) => s.kind));
  const kindOptions = (Object.keys(KIND_LABELS) as StageKind[]).filter(
    (k) => !LOCKED.includes(k) || !usedLockedKinds.has(k)
  );

  return (
    <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">Hiring Pipeline</h2>
        <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40">
          Per-job stages
        </span>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        Rename stages, reorder them, or add your own — this job&apos;s candidate board follows this pipeline.
        Moving a candidate into an <strong>Interview</strong>-type stage sends the interview email; the{' '}
        <strong>Rejected</strong>-type stage sends your rejection template.
      </p>

      {message && (
        <div
          className={`mb-4 px-4 py-2.5 rounded-xl text-sm font-bold ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-indigo-600" size={24} />
        </div>
      ) : stages.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3">
            This job has no pipeline yet.
          </p>
          <button
            onClick={seedDefaults}
            disabled={busy}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {busy ? 'Creating…' : 'Create default pipeline'}
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {stages.map((stage, idx) => {
              const colors = STAGE_COLORS[stage.color] || STAGE_COLORS.blue;
              const locked = LOCKED.includes(stage.kind);
              const isEditing = editingId === stage.id;
              return (
                <div
                  key={stage.id || stage.name}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40"
                >
                  <span className={`w-3 h-3 rounded-full border-t-4 ${colors.border} bg-white dark:bg-slate-800 shrink-0`} />
                  {isEditing ? (
                    <>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 min-w-0 px-3 py-1.5 text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B0F19] text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <select
                        value={editKind}
                        disabled={locked}
                        onChange={(e) => setEditKind(e.target.value as StageKind)}
                        className="px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B0F19] text-slate-600 dark:text-slate-300 disabled:opacity-50"
                      >
                        {(Object.keys(KIND_LABELS) as StageKind[]).map((k) => (
                          <option key={k} value={k}>
                            {KIND_LABELS[k]}
                          </option>
                        ))}
                      </select>
                      <select
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        className="px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B0F19] text-slate-600 dark:text-slate-300"
                      >
                        {COLOR_TOKENS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => saveEdit(stage)}
                        disabled={busy}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg disabled:opacity-50"
                        title="Save"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 min-w-0 font-bold text-sm text-slate-800 dark:text-white truncate">
                        {stage.name}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        {locked && <Lock size={10} />}
                        {KIND_LABELS[stage.kind]}
                      </span>
                      <button
                        onClick={() => move(stage, -1)}
                        disabled={busy || idx === 0}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                        title="Move up"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        onClick={() => move(stage, 1)}
                        disabled={busy || idx === stages.length - 1}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                        title="Move down"
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(stage.id || null);
                          setEditName(stage.name);
                          setEditKind(stage.kind);
                          setEditColor(stage.color);
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600"
                        title="Edit stage"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => deleteStage(stage)}
                        disabled={busy || locked}
                        className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                        title={locked ? 'This stage cannot be deleted' : 'Delete stage'}
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {pendingDelete && (
            <div className="mt-4 p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-500/10">
              <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-2">
                “{pendingDelete.stage.name}” has {pendingDelete.count} candidate(s). Move them to:
              </p>
              <div className="flex items-center gap-2">
                <select
                  value={moveToId}
                  onChange={(e) => setMoveToId(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm font-bold rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-[#0B0F19] text-slate-700 dark:text-slate-200"
                >
                  {stages
                    .filter((s) => s.id !== pendingDelete.stage.id)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
                <button
                  onClick={() => deleteStage(pendingDelete.stage, moveToId)}
                  disabled={busy || !moveToId}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-lg disabled:opacity-50"
                >
                  Move &amp; delete
                </button>
                <button
                  onClick={() => setPendingDelete(null)}
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 mt-5">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New stage name — e.g. Phone Screen"
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B0F19] text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={newKind}
              onChange={(e) => setNewKind(e.target.value as StageKind)}
              className="px-3 py-2.5 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B0F19] text-slate-600 dark:text-slate-300"
            >
              {kindOptions.map((k) => (
                <option key={k} value={k}>
                  {KIND_LABELS[k]}
                </option>
              ))}
            </select>
            <button
              onClick={addStage}
              disabled={busy || !newName.trim()}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
            >
              <Plus size={16} /> Add stage
            </button>
          </div>
        </>
      )}
    </div>
  );
}

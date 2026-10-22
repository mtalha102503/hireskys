-- ============================================================
-- HireSkys ATS Phase 1: per-job pipeline stages
-- Creates public.job_stages, seeds the default pipeline for every
-- employer job (and every job that already has applications).
-- applications.status stays the stage NAME — no data migration.
-- Rollback: drop table public.job_stages;
-- ============================================================

create table if not exists public.job_stages (
  id uuid primary key default gen_random_uuid(),
  job_id bigint not null references public.jobs(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('applied','screening','interview','offer','hired','rejected','custom')),
  position int not null,
  color text not null default 'blue',
  created_at timestamptz not null default now()
);

create unique index if not exists job_stages_job_name_unique
  on public.job_stages (job_id, lower(name));

create index if not exists job_stages_job_position
  on public.job_stages (job_id, position);

alter table public.job_stages enable row level security;

-- Stage names are not sensitive: public read lets the employer board,
-- the job-edit page and the candidate apply page resolve pipelines.
-- All writes go through service-role API routes (RLS is bypassed by
-- the service role); no write policies are granted here.
drop policy if exists "job_stages public read" on public.job_stages;
create policy "job_stages public read"
  on public.job_stages for select
  using (true);

-- Seed the default pipeline. Names match the existing status strings
-- ('New', 'Shortlisted', 'Interview', 'Rejected') so live applications
-- need zero changes; 'Offer' and 'Hired' are the new stages.
insert into public.job_stages (job_id, name, kind, position, color)
select j.id, s.name, s.kind, s.position, s.color
from public.jobs j
cross join (values
  ('New',         'applied',   0, 'blue'),
  ('Shortlisted', 'screening', 1, 'emerald'),
  ('Interview',   'interview', 2, 'purple'),
  ('Offer',       'offer',     3, 'amber'),
  ('Hired',       'hired',     4, 'green'),
  ('Rejected',    'rejected',  5, 'slate')
) as s(name, kind, position, color)
where (j.employer_id is not null
       or j.id in (select distinct job_id from public.applications where job_id is not null))
  and not exists (select 1 from public.job_stages js where js.job_id = j.id);

-- ============================================================
-- Verification (run after the migration, expect: every seeded job
-- has 6 stages; orphan applications = 0)
--   select job_id, count(*) from public.job_stages group by job_id;
--   select a.id, a.status, a.job_id from public.applications a
--   where not exists (select 1 from public.job_stages js
--                     where js.job_id = a.job_id and js.name = a.status);
-- ============================================================

-- Frontend Process — Supabase schema (project: frontend-process / yusggtnusduelymxrcmt).
-- Applied via the Supabase MCP as migration `ideas_table`. Kept here for reference.
--
-- Access model: RLS is ON with NO policies, so anon / publishable keys get no
-- access at all. Every read and write goes through the idea-intake Worker using
-- the service-role key (which bypasses RLS). This keeps assessment content —
-- which can be commercially sensitive — off the public Pages site; the board
-- only ever sees the safe fields the Worker chooses to return.

create extension if not exists pgcrypto;

create table if not exists public.ideas (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  title          text not null default 'Untitled idea',
  one_liner      text,
  submitter_name text,
  submitter_email text,
  stage          text not null default 'inbox'
                   check (stage in ('inbox','assessment','review','build','harden','business','launch','live','parked','declined')),
  status         text not null default 'draft'
                   check (status in ('draft','in_review','validated','declined')),
  intent         text check (intent in ('personal','internal','client','speculative','standalone')),
  confidence     text check (confidence in ('punt','validate','business_case')),
  decision       text check (decision in ('proceed','validate_first','experiment','client_only','product','do_not_proceed')),
  assessment     jsonb not null default '{}'::jsonb,   -- the 8-section prose answers
  gates          jsonb not null default '[]'::jsonb,    -- gate sign-off log
  transcript     jsonb,                                 -- optional conversation record
  decision_note  text,
  reviewed_by    text,
  reviewed_at    timestamptz,
  deleted_at     timestamptz           -- soft delete; the board filters deleted_at is null
);

create index if not exists ideas_stage_idx       on public.ideas (stage);
create index if not exists ideas_updated_at_idx   on public.ideas (updated_at desc);
create index if not exists ideas_deleted_at_idx   on public.ideas (deleted_at);

alter table public.ideas enable row level security;
-- Intentionally no policies. Service role (the Worker) bypasses RLS; everyone
-- else is denied. Do not add an anon SELECT policy without stripping the
-- assessment/transcript columns behind a view first.

-- ChatBreaker Supabase PostgreSQL Schema
-- Privacy Notice: NO RAW CHAT MESSAGES ARE PERMANENTLY STORED.
-- Only aggregated analytics, metrics, and user preferences are persisted.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users / Profiles table (links to auth.users if Supabase Auth is enabled)
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  email text,
  display_name text,
  preferences jsonb default '{"theme": "warm", "default_threshold_hours": 3, "auto_delete_hours": 24}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Reports table (metadata for saved reports)
create table if not exists public.reports (
  id text primary key, -- e.g. report_abcd1234efgh
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  file_name text,
  start_date date not null,
  end_date date not null,
  total_messages integer not null,
  total_participants integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Report Analytics (Aggregated JSON statistics, NOT raw messages!)
create table if not exists public.report_analytics (
  id uuid primary key default uuid_generate_v4(),
  report_id text references public.reports(id) on delete cascade not null unique,
  overview jsonb not null,
  participants jsonb not null,
  activity jsonb not null,
  reply_times jsonb not null,
  conversation_starters jsonb not null,
  streaks jsonb not null,
  words jsonb not null,
  phrases jsonb not null,
  emojis jsonb not null,
  longest_messages jsonb not null,
  links jsonb not null,
  media jsonb not null,
  timeline jsonb not null,
  ai_insights jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Shared Reports (Public read-only shareable links)
create table if not exists public.shared_reports (
  id uuid primary key default uuid_generate_v4(),
  share_slug text unique not null,
  report_id text references public.reports(id) on delete cascade not null,
  is_public boolean default true not null,
  view_count integer default 0 not null,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indices for performance
create index if not exists idx_reports_owner on public.reports(owner_id);
create index if not exists idx_reports_dates on public.reports(start_date, end_date);
create index if not exists idx_shared_reports_slug on public.shared_reports(share_slug);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.report_analytics enable row level security;
alter table public.shared_reports enable row level security;

-- Public can view active shared reports
create policy "Allow public read access to active shared reports"
  on public.shared_reports for select
  using (is_public = true and (expires_at is null or expires_at > now()));

-- Public can read analytics of shared reports
create policy "Allow public read to shared report analytics"
  on public.report_analytics for select
  using (
    exists (
      select 1 from public.shared_reports
      where shared_reports.report_id = report_analytics.report_id
      and shared_reports.is_public = true
    )
  );

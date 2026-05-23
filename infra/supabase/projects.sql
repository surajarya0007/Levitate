create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id text not null unique,
  prompt text not null,
  status text not null,
  deploy_url text,
  logs text,
  result jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_projects_user_created_at
  on public.projects (user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

alter table public.projects enable row level security;

drop policy if exists "users_can_read_own_projects" on public.projects;
create policy "users_can_read_own_projects"
on public.projects
for select
using (auth.uid() = user_id);

drop policy if exists "users_can_insert_own_projects" on public.projects;
create policy "users_can_insert_own_projects"
on public.projects
for insert
with check (auth.uid() = user_id);

drop policy if exists "users_can_update_own_projects" on public.projects;
create policy "users_can_update_own_projects"
on public.projects
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

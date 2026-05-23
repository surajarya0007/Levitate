-- Create the projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  job_id text not null,
  prompt text not null,
  status text not null,
  deploy_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  result jsonb,
  logs text
);

-- Enable Row Level Security (RLS)
alter table public.projects enable row level security;

-- Create policies for access control
create policy "Users can view their own projects"
  on public.projects for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own projects"
  on public.projects for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own projects"
  on public.projects for update
  using ( auth.uid() = user_id );

-- Create an index on specific columns for performance
create index projects_user_id_idx on public.projects (user_id);
create index projects_job_id_idx on public.projects (job_id);

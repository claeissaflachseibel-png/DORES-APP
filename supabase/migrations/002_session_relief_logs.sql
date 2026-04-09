-- Alívio percebido depois da sessão do dia (um registo por utilizador e dia UTC)
create table public.session_relief_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  logged_on date not null default (current_date at time zone 'utc'),
  relief_score int not null check (relief_score between 1 and 10),
  created_at timestamptz not null default now(),
  unique (user_id, logged_on)
);

create index idx_session_relief_user on public.session_relief_logs (user_id, logged_on desc);

alter table public.session_relief_logs enable row level security;

create policy "Own session relief logs"
  on public.session_relief_logs for all using (auth.uid() = user_id);

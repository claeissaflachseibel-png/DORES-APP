-- Extensões
create extension if not exists "uuid-ossp";

-- Perfis (1:1 com auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  plan text not null default 'free' check (plan in ('free', 'single_region', 'full')),
  primary_region_slug text,
  purchased_region_slug text,
  current_pain_level int check (current_pain_level between 1 and 10),
  pain_frequency text,
  last_mood text,
  routine_note text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Regiões de dor (referência; conteúdo pode espelhar o app)
create table public.pain_regions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  sort_order int not null default 0
);

-- Programas por região (para evolução / CMS)
create table public.exercise_programs (
  id uuid primary key default gen_random_uuid(),
  pain_region_id uuid references public.pain_regions (id) on delete cascade,
  name text not null,
  version int not null default 1,
  created_at timestamptz not null default now()
);

-- Exercícios (opcional: seed ou sincronização com o app)
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  pain_region_id uuid references public.pain_regions (id) on delete cascade,
  program_id uuid references public.exercise_programs (id) on delete set null,
  slug text not null unique,
  title text not null,
  description text,
  objective text,
  duration_minutes int,
  reps_or_time_label text,
  step_instructions jsonb default '[]'::jsonb,
  safety_notes text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Logs de dor
create table public.user_pain_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  level int not null check (level between 1 and 10),
  frequency text,
  logged_at timestamptz not null default now()
);

-- Logs de humor
create table public.user_mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  mood_label text not null,
  logged_at timestamptz not null default now()
);

-- Progresso (sessões concluídas)
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  exercise_slug text not null,
  region_slug text not null,
  completed_on date not null default (current_date at time zone 'utc'),
  created_at timestamptz not null default now(),
  unique (user_id, exercise_slug, completed_on)
);

-- Subscrições (Stripe / checkout futuro)
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan text not null check (plan in ('single_region', 'full')),
  region_slug text,
  status text not null default 'mock_active' check (status in ('mock_active', 'active', 'canceled', 'past_due', 'trialing')),
  provider text default 'mock',
  external_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_user_pain_logs_user on public.user_pain_logs (user_id, logged_at desc);
create index idx_user_mood_logs_user on public.user_mood_logs (user_id, logged_at desc);
create index idx_user_progress_user on public.user_progress (user_id, completed_on desc);
create index idx_subscriptions_user on public.subscriptions (user_id);

-- Trigger: novo utilizador → perfil free
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, plan, onboarding_completed)
  values (new.id, 'free', false);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.pain_regions enable row level security;
alter table public.exercise_programs enable row level security;
alter table public.exercises enable row level security;
alter table public.user_pain_logs enable row level security;
alter table public.user_mood_logs enable row level security;
alter table public.user_progress enable row level security;
alter table public.subscriptions enable row level security;

-- Políticas profiles
create policy "Users read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users insert own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Regiões e exercícios: leitura pública autenticada
create policy "Authenticated read pain_regions"
  on public.pain_regions for select to authenticated using (true);
create policy "Authenticated read exercise_programs"
  on public.exercise_programs for select to authenticated using (true);
create policy "Authenticated read exercises"
  on public.exercises for select to authenticated using (true);

-- Logs e progresso: próprio utilizador
create policy "Own pain logs"
  on public.user_pain_logs for all using (auth.uid() = user_id);
create policy "Own mood logs"
  on public.user_mood_logs for all using (auth.uid() = user_id);
create policy "Own progress"
  on public.user_progress for all using (auth.uid() = user_id);

create policy "Own subscriptions read"
  on public.subscriptions for select using (auth.uid() = user_id);

-- Inserção de subscrições pode ser restrita a service role em produção
create policy "Own subscriptions insert mock"
  on public.subscriptions for insert with check (auth.uid() = user_id);
create policy "Own subscriptions update mock"
  on public.subscriptions for update using (auth.uid() = user_id);

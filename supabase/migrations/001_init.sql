-- =====================================================================
-- НАВИГАТОР AI — MVP. Миграция 001: схема, RLS, триггеры
-- Выполнить в Supabase: SQL Editor -> New query -> Run
-- =====================================================================

-- 1. ПРОФИЛИ (зеркало auth.users) -------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  created_at  timestamptz not null default now()
);

-- автосоздание профиля при регистрации
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. ПРОЕКТЫ (одна бизнес-идея = один проект) -------------------------
create table public.projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null default 'Новый проект',
  idea        text not null,
  status      text not null default 'questioning'
              check (status in ('questioning','answering','generating','ready','failed')),
  questions   jsonb,            -- [{id, text, hint, type, options[]}]
  answers     jsonb,            -- {questionId: answer}
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index projects_user_idx on public.projects (user_id, created_at desc);

-- 3. ДОКУМЕНТЫ (результат генерации) ----------------------------------
create table public.documents (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  content     jsonb not null,   -- {title, analysis, risks[], finance_assumptions, launch_plan[], recommendations[]}
  model       text not null,
  created_at  timestamptz not null default now()
);
create index documents_project_idx on public.documents (project_id, created_at desc);

-- 4. ГЕНЕРАЦИИ (телеметрия и лимиты) ----------------------------------
create table public.generations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  project_id  uuid references public.projects(id) on delete set null,
  kind        text not null check (kind in ('questions','document')),
  model       text not null,
  tokens_in   integer not null default 0,
  tokens_out  integer not null default 0,
  latency_ms  integer not null default 0,
  status      text not null check (status in ('success','error')),
  error       text,
  created_at  timestamptz not null default now()
);
create index generations_user_month_idx on public.generations (user_id, created_at desc);

-- 5. ОЦЕНКИ КАЧЕСТВА ---------------------------------------------------
create table public.feedback (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  rating      smallint not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now()
);

-- 6. updated_at триггер ------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

-- 7. ROW LEVEL SECURITY ------------------------------------------------
alter table public.profiles    enable row level security;
alter table public.projects    enable row level security;
alter table public.documents   enable row level security;
alter table public.generations enable row level security;
alter table public.feedback    enable row level security;

create policy "own profile read"    on public.profiles    for select using (auth.uid() = id);
create policy "own projects all"    on public.projects    for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own documents all"   on public.documents   for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own generations sel" on public.generations for select using (auth.uid() = user_id);
create policy "own generations ins" on public.generations for insert with check (auth.uid() = user_id);
create policy "own feedback all"    on public.feedback    for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);

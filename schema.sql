-- ================================================
-- FitCouple — Schéma Supabase
-- Colle tout ça dans l'éditeur SQL de Supabase → Run
-- ================================================

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  couple_id text not null,
  color text default 'green',
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Lire profils couple" on profiles for select using (
  auth.uid() = id or couple_id = (select couple_id from profiles where id = auth.uid())
);
create policy "Créer profil" on profiles for insert with check (auth.uid() = id);
create policy "Modifier profil" on profiles for update using (auth.uid() = id);

create table meals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  couple_id text not null,
  date date not null,
  meal_type text check (meal_type in ('petit_dej','dejeuner','diner','snack')) not null,
  name text not null,
  notes text,
  created_at timestamptz default now()
);
alter table meals enable row level security;
create policy "Repas couple" on meals for all using (
  couple_id = (select couple_id from profiles where id = auth.uid())
);

create table challenges (
  id uuid default gen_random_uuid() primary key,
  couple_id text not null,
  title text not null,
  description text,
  type text default 'custom',
  target numeric not null default 1,
  unit text not null default 'fois',
  challenge_date date not null,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);
alter table challenges enable row level security;
create policy "Défis couple" on challenges for all using (
  couple_id = (select couple_id from profiles where id = auth.uid())
);

create table challenge_progress (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references challenges(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  value numeric default 0,
  completed boolean default false,
  updated_at timestamptz default now(),
  unique(challenge_id, user_id)
);
alter table challenge_progress enable row level security;
create policy "Progrès couple" on challenge_progress for all using (
  user_id = auth.uid() or
  challenge_id in (
    select id from challenges
    where couple_id = (select couple_id from profiles where id = auth.uid())
  )
);

create table poop_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  couple_id text not null,
  bristol_type int check (bristol_type between 1 and 7) not null,
  notes text,
  score text check (score in ('A+','A','B','C','D')) not null,
  logged_at timestamptz default now()
);
alter table poop_logs enable row level security;
create policy "Caca couple" on poop_logs for all using (
  couple_id = (select couple_id from profiles where id = auth.uid())
);

create table objectives (
  id uuid default gen_random_uuid() primary key,
  couple_id text not null,
  user_id uuid references profiles(id),
  title text not null,
  target numeric not null,
  unit text not null,
  current_value numeric default 0,
  deadline date,
  is_shared boolean default false,
  completed boolean default false,
  created_at timestamptz default now()
);
alter table objectives enable row level security;
create policy "Objectifs couple" on objectives for all using (
  couple_id = (select couple_id from profiles where id = auth.uid())
);

create table streaks (
  couple_id text primary key,
  current_streak int default 0,
  best_streak int default 0,
  last_active_date date default current_date,
  updated_at timestamptz default now()
);
alter table streaks enable row level security;
create policy "Streak couple" on streaks for all using (
  couple_id = (select couple_id from profiles where id = auth.uid())
);

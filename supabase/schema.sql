-- Run this once in Supabase: SQL Editor > New query > paste > Run.

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  email text,
  role text not null default 'member' check (role in ('member','admin')),
  created_at timestamptz not null default now()
);
create table public.member_state (            -- each member's private progress
  user_id uuid primary key references auth.users on delete cascade,
  state jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create table public.shared_state (            -- community data: posts, help requests, resources...
  key text primary key,
  value jsonb not null,
  updated_by uuid references auth.users,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.member_state enable row level security;
alter table public.shared_state enable row level security;

create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

-- create a profile automatically when someone signs up
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- profiles: everyone signed in can see names; people can edit only their own name, never their role
create policy "profiles readable" on public.profiles for select to authenticated using (true);
create policy "profiles update own" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;

-- member_state: private to the owner, readable by admins
create policy "own state read" on public.member_state for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy "own state insert" on public.member_state for insert to authenticated
  with check (user_id = auth.uid());
create policy "own state update" on public.member_state for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- shared_state: everyone reads; members write community keys; only admins write the curated ones
create policy "shared read" on public.shared_state for select to authenticated using (true);
create policy "shared insert" on public.shared_state for insert to authenticated
  with check (public.is_admin() or key not in ('quizzes','weeklyActivities','presentations','resources','teamRoster'));
create policy "shared update" on public.shared_state for update to authenticated
  using (public.is_admin() or key not in ('quizzes','weeklyActivities','presentations','resources','teamRoster'))
  with check (public.is_admin() or key not in ('quizzes','weeklyActivities','presentations','resources','teamRoster'));

alter publication supabase_realtime add table public.shared_state;   -- live updates between members

-- After you sign up yourself, make yourself the admin (use your email):
-- update public.profiles set role = 'admin' where email = 'you@example.com';

-- Run once in your Supabase project's SQL Editor. No service-role key belongs in the website.
create table if not exists public.player_saves (
  player_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null check (jsonb_typeof(progress) = 'object'),
  revision bigint not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.player_saves enable row level security;
revoke all on public.player_saves from anon, authenticated;
grant select on public.player_saves to authenticated;
drop policy if exists "Read own save" on public.player_saves;
create policy "Read own save" on public.player_saves for select to authenticated using ((select auth.uid()) = player_id);

-- Optimistic concurrency: a second device cannot silently overwrite a newer save.
create or replace function public.save_player_progress(expected_revision bigint, payload jsonb)
returns bigint
language plpgsql security definer set search_path = '' as $$
declare current_user_id uuid := auth.uid(); saved_revision bigint;
begin
  if current_user_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if payload is null or jsonb_typeof(payload) <> 'object' or (payload->>'schema') is distinct from '1' or octet_length(payload::text) > 262144 then
    raise exception 'Invalid player save' using errcode = '22023';
  end if;
  insert into public.player_saves as saves (player_id, progress, revision)
    values (current_user_id, payload, 1)
    on conflict (player_id) do update
      set progress = excluded.progress, revision = saves.revision + 1, updated_at = now()
      where saves.revision = expected_revision
    returning revision into saved_revision;
  if saved_revision is null then raise exception 'SAVE_CONFLICT' using errcode = '40001'; end if;
  return saved_revision;
end;
$$;
revoke all on function public.save_player_progress(bigint, jsonb) from public, anon;
grant execute on function public.save_player_progress(bigint, jsonb) to authenticated;

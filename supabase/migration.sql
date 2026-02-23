-- ============================================================
-- Kanban Board - Supabase Migration
-- Run this in the Supabase SQL editor to set up your schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Tables ───────────────────────────────────────────────────

create table if not exists boards (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  name        text        not null default 'My Board',
  created_at  timestamptz not null default now()
);

create table if not exists columns (
  id          uuid        primary key default uuid_generate_v4(),
  board_id    uuid        not null references boards(id) on delete cascade,
  title       text        not null,
  color       text        not null default '#5b6aff',
  position    integer     not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists cards (
  id          uuid        primary key default uuid_generate_v4(),
  column_id   uuid        not null references columns(id) on delete cascade,
  title       text        not null,
  description text        not null default '',
  position    integer     not null default 0,
  created_at  timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────

create index if not exists boards_user_id_idx   on boards(user_id);
create index if not exists columns_board_id_idx on columns(board_id);
create index if not exists cards_column_id_idx  on cards(column_id);

-- ── Row Level Security ───────────────────────────────────────

alter table boards  enable row level security;
alter table columns enable row level security;
alter table cards   enable row level security;

-- boards
create policy "boards: select own"
  on boards for select using (auth.uid() = user_id);

create policy "boards: insert own"
  on boards for insert with check (auth.uid() = user_id);

create policy "boards: update own"
  on boards for update using (auth.uid() = user_id);

create policy "boards: delete own"
  on boards for delete using (auth.uid() = user_id);

-- columns (access through boards)
create policy "columns: select own"
  on columns for select using (
    board_id in (select id from boards where user_id = auth.uid())
  );

create policy "columns: insert own"
  on columns for insert with check (
    board_id in (select id from boards where user_id = auth.uid())
  );

create policy "columns: update own"
  on columns for update using (
    board_id in (select id from boards where user_id = auth.uid())
  );

create policy "columns: delete own"
  on columns for delete using (
    board_id in (select id from boards where user_id = auth.uid())
  );

-- cards (access through columns → boards)
create policy "cards: select own"
  on cards for select using (
    column_id in (
      select c.id from columns c
      join boards b on b.id = c.board_id
      where b.user_id = auth.uid()
    )
  );

create policy "cards: insert own"
  on cards for insert with check (
    column_id in (
      select c.id from columns c
      join boards b on b.id = c.board_id
      where b.user_id = auth.uid()
    )
  );

create policy "cards: update own"
  on cards for update using (
    column_id in (
      select c.id from columns c
      join boards b on b.id = c.board_id
      where b.user_id = auth.uid()
    )
  );

create policy "cards: delete own"
  on cards for delete using (
    column_id in (
      select c.id from columns c
      join boards b on b.id = c.board_id
      where b.user_id = auth.uid()
    )
  );

-- ── Realtime ─────────────────────────────────────────────────
-- Add tables to the realtime publication for live sync

alter publication supabase_realtime add table columns;
alter publication supabase_realtime add table cards;

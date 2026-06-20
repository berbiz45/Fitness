-- ============================================================
-- PERFLOG - Esquema de base de datos para Supabase
-- Ejecuta esto en: Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- Tabla de entrenamientos
create table public.trainings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  sport text not null,
  date_key text not null,        -- formato YYYY-MM-DD
  time text not null,            -- formato HH:MM
  session jsonb default '{}'::jsonb,
  exercises jsonb default '[]'::jsonb,
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índices para consultas rápidas por usuario y fecha
create index trainings_user_id_idx on public.trainings(user_id);
create index trainings_date_idx on public.trainings(date_key);
create index trainings_sport_idx on public.trainings(sport);

-- Activar seguridad a nivel de fila (cada usuario solo ve lo suyo)
alter table public.trainings enable row level security;

-- Política: el usuario solo puede ver sus propios entrenos
create policy "Usuarios ven solo sus entrenos"
  on public.trainings for select
  using (auth.uid() = user_id);

-- Política: el usuario solo puede crear entrenos propios
create policy "Usuarios crean sus propios entrenos"
  on public.trainings for insert
  with check (auth.uid() = user_id);

-- Política: el usuario solo puede editar sus propios entrenos
create policy "Usuarios editan sus propios entrenos"
  on public.trainings for update
  using (auth.uid() = user_id);

-- Política: el usuario solo puede borrar sus propios entrenos
create policy "Usuarios borran sus propios entrenos"
  on public.trainings for delete
  using (auth.uid() = user_id);

-- Trigger para actualizar updated_at automáticamente
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trainings_updated_at
  before update on public.trainings
  for each row
  execute function public.handle_updated_at();

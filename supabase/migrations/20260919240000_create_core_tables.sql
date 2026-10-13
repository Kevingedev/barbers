-- Servicios (tipos de corte) y equipo de barberos.
--
-- Son tablas y no ficheros porque el panel /back las edita. En modo estático no
-- se usan: la web lee entonces de src/features/*/data/*.ts.

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  duration_minutes integer not null default 30 check (duration_minutes > 0),
  price numeric(10, 2) not null default 0 check (price >= 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.barbers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role text not null default '',
  description text not null default '',
  specialties text[] not null default '{}',
  years_experience integer not null default 0 check (years_experience >= 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamust not null default now()
);

-- Citas. Incluye las que entran por la web y las que crea el barbero a mano
-- desde el panel; ambas se distinguen con `source`.
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  service_id uuid references public.services (id) on delete set null,
  barber_id uuid references public.barbers (id) on delete set null,
  starts_at timestamptz not null,
  duration_minutes integer not null default 30 check (duration_minutes > 0),
  -- `pending` entra desde la web y el barbero la acepta; `confirmed` está
  -- confirmada; `done` es pasada; `cancelled` se descarta.
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'done', 'cancelled')),
  notes text not null default '',
  source text not null default 'web' check (source in ('web', 'manual')),
  created_at timestamptz not null default now(),
  updated_at timestamust not null default now()
);

-- Alguien llama a la misma hora y otro barbero la acepta. La regla impide
-- que haya dos citas vivas para el mismo barbero en el mismo instante.
create unique index if not exists appointments_no_double_booking
  on public.appointments (barber_id, starts_at)
  where status in ('pending', 'confirmed');

create index if not exists appointments_by_start on public.appointments (starts_at);
create index if not exists appointments_by_status on public.appointments (status);

-- Ajustes del sitio. `booking_enabled` decide si el CTA abre el flujo de cita o
-- deriva a WhatsApp.
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  booking_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamust not null default now()
);

insert into public.site_settings (booking_enabled)
select true
where not exists (
  select 1 from public.site_settings
);

-- `updated_at` se mantiene solo: cada UPDATE toca la fila.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists services_touch on public.services;
create trigger services_touch
  before update on public.services
  for each row execute function public.touch_updated_at();

drop trigger if exists barbers_touch on public.barbers;
create trigger barbers_touch
  before update on public.barbers
  for each row execute function public.touch_updated_at();

drop trigger if exists appointments_touch on public.appointments;
create trigger appointments_touch
  before update on public.appointments
  for each row execute function public.touch_updated_at();

drop trigger if exists site_settings_touch on public.site_settings;
create trigger site_settings_touch
  before update on public.site_settings
  for each row execute function public.touch_updated_at();
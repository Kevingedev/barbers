create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  booking_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.site_settings (booking_enabled)
select true
where not exists (
  select 1 from public.site_settings
);

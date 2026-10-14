-- Seguridad del panel /back.
--
-- Idea: las tablas son legibles por cualquiera (la anon key lo es, y la web
-- pública necesita leer servicios, barberos y disponibilidad), pero ESCRIBIR
-- solo puede hacerlo alguien con sesión iniciada en Supabase Auth. El panel se
-- autentica con email y contraseña; sin sesión, las políticas no dejan cambiar
-- nada.

-- ---------------------------------------------------------------- servicios
alter table public.services enable row level security;
alter table public.barbers enable row level security;
alter table public.appointments enable row level security;
alter table public.site_settings enable row level security;

-- La web pública lee servicios, barberos y ajustes. Eso es intencionado: no
-- hay nada secreto ahí y evita montar un endpoint aparte.
drop policy if exists "lectura publica de servicios" on public.services;
create policy "lectura publica de servicios"
  on public.services for select
  using (true);

drop policy if exists "lectura publica de barbers" on public.barbers;
create policy "lectura publica de barbers"
  on public.barbers for select
  using (true);

drop policy if exists "lectura publica de ajustes" on public.site_settings;
create policy "lectura publica de ajustes"
  on public.site_settings for select
  using (true);

-- Las citas NO son públicas: llevan nombre y teléfono de clientes.
drop policy if exists "lectura publica de citas" on public.appointments;

-- ------------------------------------------------------------------ escritura
-- `authenticated` es cualquier usuario con sesión activa. El panel comprueba
-- además que el usuario esté en la lista de `staff_emails` de abajo, pero la
-- base de datos no se fía solo del cliente: sin sesión no se escribe.

drop policy if exists "staff escribe servicios" on public.services;
create policy "staff escribe servicios"
  on public.services for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "staff escribe barbers" on public.barbers;
create policy "staff escribe barbers"
  on public.barbers for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "staff escribe ajustes" on public.site_settings;
create policy "staff escribe ajustes"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

-- Crear citas desde la web lo hace el servidor con la anon key, que cuenta como
-- `anon` y no como `authenticated`. Se permite insertar solo citas pendientes y
-- solo con `source = 'web'`: nadie puede colarse a confirmar ni a dar de alta
-- una cita como si fuera del barbero.
drop policy if exists "la web crea citas pendientes" on public.appointments;
create policy "la web crea citas pendientes"
  on public.appointments for insert
  to anon, authenticated
  with check (status = 'pending' and source = 'web');

-- Verlas y tocarlas es solo del personal.
drop policy if exists "staff gestiona citas" on public.appointments;
create policy "staff gestiona citas"
  on public.appointments for all
  to authenticated
  using (true)
  with check (true);

-- ------------------------------------------------------------------- staff
-- Lista blanca de correos que pueden entrar al panel. La segunda capa: la
-- primera es tener sesión.
create table if not exists public.staff_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.staff_emails enable row level security;

drop policy if exists "staff lee la lista" on public.staff_emails;
create policy "staff lee la lista"
  on public.staff_emails for select
  to authenticated
  using (true);

-- Añadir o quitar gente de la lista se hace desde el panel de Supabase, no
-- desde la web: a propósito no hay ninguna política de escritura.

-- ---------------------------------------------------------------- LISTA BLANCA
-- CAMBIA ESTE CORREO POR EL TUYO ANTES DE EJECUTAR LA MIGRACIÓN.
-- Con esta fila nada más, no se puede entrar al panel: un usuario de Supabase
-- Auth que no esté en esta tabla se queda en la puerta.
insert into public.staff_emails (email)
select 'kevinswag853@gmail.com'
where not exists (select 1 from public.staff_emails);
# Panel de control (`/back`) y base de datos

## Qué es

Un panel pequeño donde el barbero lleva el día a día:

| Sección | Qué hace |
| :-- | :-- |
| `/back` | Citas de hoy y mañana, y alta manual de una cita |
| `/back/servicios` | Tipos de corte y sus precios: crear, editar, ocultar, borrar |
| `/back/ajustes` | Interruptor de reservas y copia inicial de servicios |

## Los dos modos del proyecto

Es lo que pediste: **el cliente elige una vez** si quiere solo la web o la web
con control de citas.

```text
NEXT_PUBLIC_SITE_MODE=static   # web sola, sin panel
NEXT_PUBLIC_SITE_MODE=full     # web con panel y citas guardadas
```

Si la variable no está, el sitio lo deduce: si hay credenciales de Supabase,
`full`; si no, `static`. Un despliegue nuevo no rompe por no tenerla puesta.

En `static`:

- Servicios y barberos salen de los ficheros de `src/features/*/data/`.
- `/back` responde **404**, para que no se sepa que existe.
- La web pública funciona igual, y `pnpm build` sale estático.

En `full`:

- Servicios, barberos y ajustes salen de la base de datos.
- `/back` existe y pide correo y contraseña.
- Las citas se guardan y aparecen en el panel.

## Poner en marcha el modo `full`

### 1. Crear el proyecto en Supabase

https://supabase.com/dashboard → New project. Anota:

```text
Project URL       → SUPABASE_URL
anon public key   → SUPABASE_ANON_KEY
service_role key  → SUPABASE_SERVICE_ROLE_KEY  (solo para migrar, nunca en el navegador)
```

### 2. Poner las variables en Vercel

```text
SUPABASE_URL                 https://xxxx.supabase.co
SUPABASE_ANON_KEY            eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY    eyJhbGciOi...
NEXT_PUBLIC_SITE_MODE        full
```

En local, en `.env.local`.

### 3. Ejecutar las migraciones

Hay dos, en `supabase/migrations/`, y van en este orden:

```text
20260919230000_create_site_settings.sql   (la que ya existía)
20260919240000_create_core_tables.sql
20260919250000_back_policies.sql
```

Con la CLI de Supabase:

```sh
npm i -g supabase
supabase login
supabase link --project-ref <tu-ref>
supabase db push
```

O a mano: SQL Editor → New query → pegar el contenido de cada fichero en orden.

### 4. Cambiar el correo de la lista blanca

En `20260919250000_back_policies.sql` hay:

```sql
insert into public.staff_emails (email)
select 'TU-CORREO@GMAIL.COM'
where not exists (select 1 from public.staff_emails);
```

Pon ahí tu correo antes de ejecutar la migración, o después con un `update`:

```sql
update public.staff_emails set email = 'tu@correo.com';
```

### 5. Crear el usuario del panel

Authentication → Users → Add user → email y contraseña.

Un usuario en Supabase Auth **no** basta para entrar al panel: además tiene que
estar en `staff_emails`. Son dos capas, a propósito, porque cualquiera puede
crearse una cuenta en el proyecto.

### 6. Copiar los servicios

Entra en `/back/ajustes` y pulsa **Copiar servicios del código**. Pasa los seis
servicios de los ficheros a la base de datos, para no teclearlos.

## Cómo se protege

Tres capas, porque un panel de un negocio real guarda nombre y teléfono de
gente:

1. **`/back` devuelve 404** en modo estático. No se confirma que exista.
2. **Sesión de Supabase** obligatoria, comprobada en el layout antes de renderizar.
3. **Lista blanca** `staff_emails`: tener sesión no basta, el correo tiene que
   estar en la tabla.

Además, todas las Server Actions comprueban la sesión por su cuenta: son
endpoints HTTP públicos y no basta con que la interfaz no las muestre.

Y en base de datos, con RLS:

| Tabla | Leer | Escribir |
| :-- | :-- | :-- |
| `services`, `barbers`, `site_settings` | Público | Solo con sesión |
| `appointments` | **Nadie sin sesión** | La web solo puede insertar citas `pending` y `source = 'web'` |

Lo último es lo que impide que alguien llame a la API para confirmarse una cita
o darse de alta como si fuera del barbero.

Y para buscadores: `/back` está en `robots.txt` como `Disallow`, fuera del
sitemap, y con `noindex` en su cabecera.

## Doble reserva

Hay un índice único en la base de datos:

```sql
create unique index appointments_no_double_booking
  on public.appointments (barber_id, starts_at)
  where status in ('pending', 'confirmed');
```

Dos personas no pueden pedir la misma hora del mismo barbero. Si lo intentan,
la API devuelve **409** con un mensaje que el flujo enseña, y puede elegir otra.

## Qué NO hace (todavía)

- **Histórico completo de citas.** El panel solo mira hoy y mañana. Si quieres
  consultar el mes pasado, o filtrar por cliente, hay que hacerlo.
- **Gestión de barberos desde el panel.** La tabla existe y la web la lee, pero
  no hay pantalla para editarlos. Ahora se cambia en el código.
- **Editar el horario** desde el panel. El horario sigue en `src/config/site.ts`.
- **Notificar al cliente** cuando se confirma una cita. Ahora el aviso depende de
  que el barbero abra WhatsApp.
- **Facturas o pagos.** No hay nada de cobro.

Dime cuáles quieres y los hago.

## Decisiones que tomé y conviene que revises

- **Las citas de la web empiezan `pending`.** El barbero las acepta desde el
  panel. Podría ser automático, pero entonces no hay filtro contra bots ni
  control de hueco real.
- **La cita manual nace `confirmed`.** La crea alguien que ya sabe que viene.
- **Al confirmar desde la web se avisa por WhatsApp.** Es lo que hace ahora.
- **Si guardar la cita falla, cae a WhatsApp.** Es preferible que alguien pierda
  la cita en el panel antes que quedarse sin pedir nada.
- **Borrar un servicio con citas sale mal a propósito.** Se usa la casilla de
  visible: en una peluquería el historial de precios importa.
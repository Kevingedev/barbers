# Poner en marcha el panel (modo `full`)

Estado actual: las dos variables de Supabase están en `.env.local`. Falta esto.

## 1. Añadir el modo al `.env.local`

Dentro de `.env.local`, una línea más:

```text
NEXT_PUBLIC_SITE_MODE=full
```

Sin esto el sitio deduce el modo por las credenciales, pero ponerlo a mano
evita sorpresas.

## 2. Poner tu correo en la lista de acceso

Abre `supabase/migrations/20260919250000_back_policies.sql` y cambia esta línea:

```sql
select 'TU-CORREO@GMAIL.COM'
```

por tu correo. Sin esto, **nadie puede entrar al panel**, ni aunque crees el
usuario en Supabase.

## 3. Ejecutar las migraciones

En Supabase → **SQL Editor** → **New query**. Pega el contenido de estos tres
ficheros, **uno por uno y en este orden**:

```text
supabase/migrations/20260919230000_create_site_settings.sql
supabase/migrations/20260919240000_create_core_tables.sql
supabase/migrations/20260919250000_back_policies.sql
```

El primero solo crea la tabla de ajustes. Los otros dos crean el resto y activan
la seguridad. Cada uno debe salir sin error.

## 4. Crear el usuario del panel

Supabase → **Authentication** → **Users** → **Add user**:

- Email: el mismo que pusiste en el paso 2.
- Password: la que quieras, con al menos 8 caracteres.

## 5. Arrancar y comprobar

```sh
pnpm dev
```

- `http://localhost:3000/back` → te lleva a `/back/login`.
- Entra con ese correo y contraseña.
- En **Ajustes**, pulsa **"Copiar servicios del código"** para pasar los seis
  servicios a la base de datos.
- Ya puedes cambiar precios y verlos en la web.

## 6. En Vercel

```text
SUPABASE_URL              https://yfyhsubndkfzgywxljun.supabase.co
SUPABASE_ANON_KEY         (la publishable)
NEXT_PUBLIC_SITE_MODE     full
```

Sin `service_role`. No hace falta.

## Si algo falla

| Síntoma | Causa |
| :-- | :-- |
| `/back` da 404 | Falta `NEXT_PUBLIC_SITE_MODE=full`, o reinicia el servidor |
| `/back/login` da 404 | Lo mismo, o las migraciones no están aplicadas |
| "Correo o contraseña incorrectos" | El usuario no existe en Authentication, o no está en `staff_emails` |
| Entra y no se ven servicios | Aún no has copiado los servicios desde Ajustes |
| "No se pudo conectar para guardar la cita" | La tabla `appointments` no existe: faltan migraciones |
---

## `/back` da 404 en Vercel (pero funciona en local)

**Es lo que pasa si no copiaste las variables a Vercel.** No es un fallo del
código.

El motivo: `.env.local` está en el `.gitignore`, así que **no se sube a GitHub**,
y Vercel despliega desde GitHub. En local lees `.env.local`; en producción solo
existen las variables que hayas puesto en el panel de Vercel.

Pégalas en **Vercel → el proyecto → Settings → Environment Variables**:

| Nombre | Valor |
| :-- | :-- |
| `SUPABASE_URL` | `https://yfyhsubndkfzgywxljun.supabase.co` |
| `SUPABASE_ANON_KEY` | la clave `sb_publishable_...` |
| `NEXT_PUBLIC_SITE_MODE` | `full` |

Las tres van en los tres entornos (Production, Preview y Development). Pulsa
**Deployments → redeploy** después de añadirlas, porque Vercel no las lee en
tiempo real: hacen falta las variables **antes** de la compilación.

Ojo con esto, que es la trampa más fácil: `NEXT_PUBLIC_*` se sustituye por su
valor al compilar. Si añades la variable **después** del deploy, hay que
recompilar; con solo recargar la página no vale.

### Cómo comprobarlo rápido

```sh
# Debe imprimir la URL de tu proyecto. Si dice localhost, falta SUPABASE_URL.
curl -s https://barbers-sable.vercel.app/robots.txt
```

Si responde `Disallow: /`, significa que Vercel no detectó dominio y tampoco
tiene las variables de Supabase.

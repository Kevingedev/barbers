# Despliegue en Vercel

## Antes del primer despliegue

Este proyecto **no es un repositorio git todavía**. Vercel despliega desde git,
así que hay que inicializarlo y subirlo:

```sh
cd /home/morningstar/Documentos/barber-web
git init
git add .
git commit -m "Barbería Ejemplo: web con paseo en scroll y reservas"
```

`git add .` respeta el `.gitignore`, que deja fuera solo `ai_img/` (los PNG de
trabajo) y `.env.local`. **El vídeo y los pósters sí se suben**, y tienen que
subir: el paseo los lee de `public/`.

## Variables de entorno en Vercel

Settings → Environment Variables. Con estos valores:

```text
NEXT_PUBLIC_SITE_URL              https://tu-dominio.com
NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER 34600000000
NEXT_PUBLIC_MAPBOX_TOKEN          pk.eyJ1...
SUPABASE_URL                      (vacío por ahora)
SUPABASE_ANON_KEY                 (vacío por ahora)
```

- `NEXT_PUBLIC_SITE_URL`: **obligatoria**. Sin ella los metadatos de Open Graph
  y el sitemap apuntan a `localhost`. Si no la pones, el sitio detecta que está
  en Vercel y usa el dominio del proyecto, pero mejor ponerla explícitamente.
- `NEXT_PUBLIC_MAPBOX_TOKEN`: pública por diseño (`pk.`). Aun así, restríngela
  por dominio en Mapbox: Settings → Tokens → Public tokens → Restrict → Allowed
  URLs con `https://api.mapbox.com` y `https://events.mapbox.com`.
- Las de Supabase no hacen falta todavía: `getSiteSettings()` es un mock.

## Configuración de build

Vercel la detecta sola. Si tienes que declararla a mano:

```text
Build command:     pnpm build
Output directory:  .next
Install command:  pnpm install
Node.js version:   22.x
```

El `packageManager` del `package.json` fija pnpm 11.1.1, así que no hace falta
activar nada.

## Qué se publica

Todo está prerenderizado: home, `/reservar`, `robots.txt` y `sitemap.xml` son
estáticos. No hay servidor que mantener ni base de datos conectada.

## Pendiente antes de abrir al público

Estos tres son de contenido, no de despliegue, pero el sitio se ve mal sin ellos:

1. **Nombre real.** `SITE_NAME` en `src/config/site.ts` está como `"Ejemplo"`, y
   `brand.name` en los mensajes.
2. **Teléfono real.** Ahora es `34600000000`, un número de ejemplo. Aparece en
   los botones de WhatsApp.
3. **Reseñas reales.** Las de `src/features/reviews/data/reviews.ts` las inventé
   yo para maquetar. Publicar reseñas falsas es engañoso y ilegal en varios
   países: pide permiso a clientes y sustitúyelas.

## Rendimiento

Medido en el build de producción:

| | Valor |
|---|---|
| Primera vista | 5,17 MB (4,26 MB son el vídeo del paseo) |
| FCP | 528 ms |
| JavaScript de la home | 15 kB, 134 kB con lo compartido |
| Vídeo | 4,3 MB, 1280×720, 60 fps, keyframe cada 2 fotogramas |

El mapa no se descarga hasta que se acerca a la vista. Ese cambio bajó la carga
inicial de 11,66 MB a 5,17 MB: antes el mapa pedía 4,7 MB de teselas nada más
montarse.

El vídeo está codificado con keyframe cada 2 fotogramas a propósito. Con un GOP
más largo el scrub del paseo se arrastra, porque cada salto de `currentTime`
obliga a decodificar desde el último keyframe. El comando está en
`src/config/paseo.ts`.
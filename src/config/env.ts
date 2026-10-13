import { z } from "zod";

/**
 * Variables de entorno públicas (las que viajan al navegador con
 * `NEXT_PUBLIC_`).
 *
 * `emptyToUndefined` es importante: en Vercel, una variable sin valor suele
 * llegar como cadena vacía, y un `z.string().url()` a secas revienta el build
 * con "Invalid url". Un despliegue normal empieza con `NEXT_PUBLIC_SITE_URL`
 * vacía porque el dominio todavía no existe.
 */
const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER: z.preprocess(emptyToUndefined, z.string().optional()),
  NEXT_PUBLIC_MAPBOX_TOKEN: z.preprocess(emptyToUndefined, z.string().optional()),
  /**
   * Modo del proyecto:
   * - `static`: web sin backend. Los servicios y el equipo salen de ficheros
   *   locales, no hay citas guardadas y `/back` no existe.
   * - `full`: con Supabase. Los datos salen de la base de datos, `/back` existe
   *   y las citas se registran.
   *
   * Es lo que pediste: que el cliente elija de una vez si quiere solo la web o
   * la web con control de citas. Sin esto, cada despliegue adivina.
   *
   * Si no se define, se deduce: si hay credenciales de Supabase, `full`; si no,
   * `static`. Así un despliegue nuevo no rompe por no tener la variable puesta.
   */
  NEXT_PUBLIC_SITE_MODE: z.preprocess(emptyToUndefined, z.enum(["static", "full"]).optional())
});

export const env = publicEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER,
  NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  NEXT_PUBLIC_SITE_MODE: process.env.NEXT_PUBLIC_SITE_MODE
});

/**
 * Variables de servidor. No llevan `NEXT_PUBLIC_`, así que nunca viajan al
 * navegador. Se validan aparte y a puerta cerrada: si faltan, `getServerEnv()`
 * devuelve `null` y el sitio cae en modo estático en vez de romperse.
 *
 * Solo hacen falta dos. NO se pide la clave `service_role`: esa se salta la
 * seguridad de las filas y no se usa en ninguna parte de este proyecto. Todas
 * las escrituras del panel pasan por la sesión del usuario y las políticas de
 * la base de datos.
 */
const serverEnvSchema = z.object({
  SUPABASE_URL: z.preprocess(emptyToUndefined, z.string().url()),
  SUPABASE_ANON_KEY: z.preprocess(emptyToUndefined, z.string().min(1))
});

/** Instancia válida, o `null` si faltan las variables. Nunca lanza. */
export function getServerEnv() {
  const parsed = serverEnvSchema.safeParse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
  });

  return parsed.success ? parsed.data : null;
}
import { env } from "@/config/env";
import { getServerEnv } from "@/config/env";

/**
 * Modo efectivo del sitio.
 *
 * Se lee de la variable si está; si no, se deduce de si hay credenciales de
 * Supabase. Un despliegue sin nada de eso cae en `static` y sigue funcionando,
 * que es justo lo que se pidió: el cliente elige de una vez qué quiere.
 *
 * Ojo: `getServerEnv()` se lee aquí en un módulo que también usan componentes
 * de cliente. Solo se comprueba si la variable existe (no su valor), así que no
 * filtra el secreto: el nombre de la variable es lo único que pasa.
 */
export type SiteMode = "static" | "full";

export function getSiteMode(): SiteMode {
  if (env.NEXT_PUBLIC_SITE_MODE) return env.NEXT_PUBLIC_SITE_MODE;

  const serverEnv = getServerEnv();
  if (serverEnv?.SUPABASE_URL && serverEnv?.SUPABASE_ANON_KEY) return "full";

  return "static";
}

/** `true` si el sitio tiene backend y por tanto panel `/back`. */
export function isFullMode(): boolean {
  return getSiteMode() === "full";
}

/**
 * `true` si `/back` debe existir. En modo estático no hay nada que enseñar y
 * la ruta responde 404, para que no se vea que existe un panel.
 */
export function isBackEnabled(): boolean {
  return isFullMode();
}

/**
 * Por qué el panel no está disponible, o `null` si lo está.
 *
 * Existe porque el 404 sin explicación es el fallo más difícil de diagnosticar
 * de todo el panel. En Vercel casi siempre es por variables que faltan, y sin
 * este aviso no hay forma de saberlo desde fuera.
 */
export function getBackMisconfiguration(): string | null {
  if (isFullMode()) return null;

  const serverEnv = getServerEnv();
  const faltan: string[] = [];

  if (!serverEnv?.SUPABASE_URL) faltan.push("SUPABASE_URL");
  if (!serverEnv?.SUPABASE_ANON_KEY) faltan.push("SUPABASE_ANON_KEY");

  if (faltan.length) {
    return `faltan ${faltan.join(" y ")} en las variables de entorno. El panel necesita Supabase.`;
  }

  return "NEXT_PUBLIC_SITE_MODE está en 'static'. Ponlo en 'full' para activar el panel.";
}
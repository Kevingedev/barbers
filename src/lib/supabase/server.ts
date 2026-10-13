import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getServerEnv } from "@/config/env";

/**
 * Cliente de Supabase para el servidor.
 *
 * Se crea una sola vez y se reutiliza: abrir una conexión por petición agota
 * el límite de conexiones de Postgres si hay algo de tráfico.
 *
 * Devuelve `null` si faltan las credenciales, para que la web siga funcionando
 * en modo estático sin ellas.
 */
let cached: SupabaseClient | null = null;
let cachedMissing = false;

export function getSupabase(): SupabaseClient | null {
  if (cached) return cached;
  if (cachedMissing) return null;

  const serverEnv = getServerEnv();
  if (!serverEnv) {
    cachedMissing = true;
    return null;
  }

  cached = createClient(serverEnv.SUPABASE_URL, serverEnv.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      // En el servidor la sesión va en cookies, no en el navegador.
      detectSessionInUrl: false
    }
  });

  return cached;
}
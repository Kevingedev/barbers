import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { getServerEnv } from "@/config/env";

/**
 * Sesión del panel.
 *
 * El panel se autentica con Supabase Auth (correo y contraseña) y la sesión
 * viaja en una cookie. Se comprueba en dos niveles:
 *
 * 1. Que haya cookie de sesión.
 * 2. Que el correo esté en la lista blanca `staff_emails`.
 *
 * El segundo importa porque tener sesión no significa ser del barbero: si
 * alguien creara una cuenta en el proyecto, sin el segundo control entraría al
 * panel. Las políticas de la base de datos no cubren esto porque dan escritura a
 * cualquier `authenticated`.
 */

const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 horas

/**
 * Cliente de Supabase que escribe la cookie de sesión. `setAll` deja el cookie
 * porque en un Route Handler hay que hacerlo a mano.
 */
export async function createSessionClient() {
  const serverEnv = getServerEnv();
  if (!serverEnv) return null;

  const cookieStore = await cookies();

  return createServerClient(serverEnv.SUPABASE_URL, serverEnv.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, { ...options, maxAge: options?.maxAge ?? COOKIE_MAX_AGE });
        }
      }
    }
  });
}

export type StaffSession = { email: string } | null;

/**
 * Devuelve el correo del barbero si la sesión es válida y el correo está en la
 * lista blanca. `null` en cualquier otro caso.
 */
export async function getStaffSession(): Promise<StaffSession> {
  const supabase = await createSessionClient();
  if (!supabase) return null;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const { data: staff } = await supabase
    .from("staff_emails")
    .select("email")
    .eq("email", user.email.toLowerCase())
    .maybeSingle();

  if (!staff) return null;

  return { email: user.email };
}
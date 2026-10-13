"use server";

import { redirect } from "next/navigation";

import { createSessionClient } from "@/lib/supabase/session";

export type LoginState = { error?: string };

/**
 * Entrar al panel.
 *
 * El mensaje de error es el mismo tanto si el correo no existe como si la
 * contraseña falla: con mensajes distintos se puede averiguar qué correos hay
 * dados de alta.
 */
export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Escribe el correo y la contraseña." };

  const supabase = await createSessionClient();
  if (!supabase) {
    return { error: "El sitio está en modo estático: no hay panel." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "No se pudo entrar. Revisa el correo y la contraseña." };
  }

  // Fuera del `try` a propósito: `redirect` lanza una excepción que no debe
  // confundirse con un fallo de autenticación.
  redirect("/back");
}

export async function logout(): Promise<void> {
  const supabase = await createSessionClient();
  await supabase?.auth.signOut();
  redirect("/back/login");
}
import "server-only";

import { getSupabase } from "@/lib/supabase/server";
import { SERVICES } from "@/features/services/data/services";

import type { ServiceRow } from "@/lib/domain/types";

/**
 * Escrituras del panel. Todas exigen sesión: si no la hay, Supabase las rechaza
 * con las políticas, y aquí además se devuelve un error claro en lugar de un
 * 500. `getSupabase()` devuelve `null` en modo estático, que es la otra forma
 * de que no haya panel.
 */

export type ServiceInput = {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  sortOrder: number;
};

/** Convierte el nombre en un slug: "Corte + Barba" -> "corte-barba". */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function requireSupabase() {
  const supabase = getSupabase();
  if (!supabase) {
    return { supabase: null, error: "El sitio está en modo estático: no hay panel." } as const;
  }
  return { supabase, error: null } as const;
}

export async function saveService(
  input: ServiceInput,
  id?: string
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const { supabase, error: envError } = requireSupabase();
  if (!supabase) return { ok: false, error: envError ?? "Sin base de datos." };

  const row = {
    slug: slugify(input.name),
    name: input.name,
    description: input.description,
    duration_minutes: input.durationMinutes,
    price: input.price,
    active: input.active,
    sort_order: input.sortOrder
  };

  if (id) {
    const { error } = await supabase.from("services").update(row).eq("id", id);
    if (error) {
      const duplicate = error.code === "23505";
      return {
        ok: false,
        error: duplicate ? "Ya existe un servicio con ese nombre." : "No se pudo guardar el servicio."
      };
    }
    return { ok: true, id };
  }

  const { data, error } = await supabase.from("services").insert(row).select("id").single();
  if (error) {
    const duplicate = error.code === "23505";
    return {
      ok: false,
      error: duplicate ? "Ya existe un servicio con ese nombre." : "No se pudo guardar el servicio."
    };
  }

  return { ok: true, id: String((data as Record<string, unknown>).id) };
}

/**
 * Borrar un servicio. Si tiene citas asociado no se puede: la cita se quedaría
 * colgada. Se prefiere desactivar (`active = false`).
 */
export async function deleteService(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase, error: envError } = requireSupabase();
  if (!supabase) return { ok: false, error: envError ?? "Sin base de datos." };

  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) {
    return {
      ok: false,
      error: "No se pudo borrar. Si tiene citas asociadas, desactívalo en lugar de borrarlo."
    };
  }

  return { ok: true };
}

export async function setBookingEnabled(
  enabled: boolean
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase, error: envError } = requireSupabase();
  if (!supabase) return { ok: false, error: envError ?? "Sin base de datos." };

  const { data } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();
  if (!data) return { ok: false, error: "No hay fila de ajustes. Ejecuta las migraciones." };

  const { error } = await supabase
    .from("site_settings")
    .update({ booking_enabled: enabled })
    .eq("id", (data as Record<string, unknown>).id);

  if (error) return { ok: false, error: "No se pudo guardar el ajuste." };
  return { ok: true };
}

/** Datos de arranque: copia los servicios de los ficheros a la tabla. */
export async function seedServicesFromFiles(): Promise<{ ok: boolean; message: string }> {
  const { supabase, error: envError } = requireSupabase();
  if (!supabase) return { ok: false, message: envError ?? "Sin base de datos." };

  const rows = SERVICES.map((service, index) => ({
    slug: service.id,
    name: service.name,
    description: service.description,
    duration_minutes: service.durationMinutes,
    price: service.price,
    active: true,
    sort_order: index
  }));

  const { error } = await supabase.from("services").upsert(rows, { onConflict: "slug" });
  if (error) return { ok: false, message: "No se pudieron copiar los servicios." };

  return { ok: true, message: `Se han copiado ${rows.length} servicios a la base de datos.` };
}

/** Para el panel: el id de los servicios de fichero, por si hay que comparar. */
export const LOCAL_SERVICE_IDS = SERVICES.map((s) => s.id);

export type { ServiceRow };
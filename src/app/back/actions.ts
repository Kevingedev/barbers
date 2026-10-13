"use server";

import { revalidatePath } from "next/cache";

import {
  createAppointment,
  deleteAppointment,
  listServices,
  updateAppointmentStatus
} from "@/lib/data";
import { getStaffSession } from "@/lib/supabase/session";
import { validateNewAppointment } from "@/features/back/lib/validateAppointment";

import type { AppointmentStatus } from "@/lib/domain/types";

/**
 * Acciones del panel.
 *
 * Todas comprueban la sesión antes de tocar nada. No es solo por seguridad: las
 * Server Actions son endpoints HTTP públicos, así que cualquiera que encuentre
 * la URL podría llamarlas sin pasar por la interfaz.
 */

function denied() {
  return { ok: false, error: "Sesión no válida. Vuelve a entrar." };
}

export async function setStatusAction(
  id: string,
  status: AppointmentStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await getStaffSession())) return denied();

  const result = await updateAppointmentStatus(id, status);
  revalidatePath("/back");
  return result;
}

export async function deleteAction(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await getStaffSession())) return denied();

  const result = await deleteAppointment(id);
  revalidatePath("/back");
  return result;
}

export type ManualAppointmentState = { error?: string; ok?: boolean };

export async function createManualAppointment(
  _prev: ManualAppointmentState,
  formData: FormData
): Promise<ManualAppointmentState> {
  if (!(await getStaffSession())) return { error: "Sesión no válida. Vuelve a entrar." };

  const parsed = validateNewAppointment({
    customerName: String(formData.get("customerName") ?? ""),
    customerPhone: String(formData.get("customerPhone") ?? ""),
    barberId: String(formData.get("barberId") ?? ""),
    serviceId: String(formData.get("serviceId") ?? ""),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    notes: String(formData.get("notes") ?? "")
  });

  if (!parsed.ok) return { error: parsed.error };

  // La duración la pone el servicio elegido, no un número fijo: si el corte
  // dura 45 minutos, la cita ocupa 45.
  const services = await listServices();
  const service = services.find((s) => s.id === parsed.data.serviceId);

  const result = await createAppointment({
    customerName: parsed.data.customerName,
    customerPhone: parsed.data.customerPhone,
    barberId: parsed.data.barberId,
    serviceId: parsed.data.serviceId,
    startsAt: parsed.data.startsAt,
    durationMinutes: service?.durationMinutes ?? 30,
    notes: parsed.data.notes,
    // `manual`: la crea el barbero en la barbería, no alguien desde la web.
    source: "manual"
  });

  if (!result.ok) return { error: result.error };

  revalidatePath("/back");
  return { ok: true };
}

export type ServiceFormState = { error?: string; ok?: boolean };

export async function saveServiceAction(
  _prev: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  if (!(await getStaffSession())) return { error: "Sesión no válida." };

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").replace(",", ".");

  if (!name) return { error: "El nombre no puede estar vacío." };

  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price < 0) return { error: "El precio no es válido." };

  const duration = Number(formData.get("durationMinutes") ?? 30);
  if (!Number.isInteger(duration) || duration <= 0) {
    return { error: "La duración debe ser un número de minutos mayor que cero." };
  }

  const { saveService } = await import("@/lib/data/admin");
  const result = await saveService(
    {
      name,
      description: String(formData.get("description") ?? "").trim(),
      durationMinutes: duration,
      price,
      active: formData.get("active") === "on",
      sortOrder: Number(formData.get("sortOrder") ?? 0)
    },
    id || undefined
  );

  if (!result.ok) return { error: result.error };

  revalidatePath("/back/servicios");
  revalidatePath("/back");
  return { ok: true };
}

export async function deleteServiceAction(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await getStaffSession())) return denied();

  const { deleteService } = await import("@/lib/data/admin");
  const result = await deleteService(id);

  revalidatePath("/back/servicios");
  return result;
}

export async function toggleBookingAction(
  formData: FormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await getStaffSession())) return denied();

  const enabled = String(formData.get("bookingEnabled")) === "true";
  const { setBookingEnabled } = await import("@/lib/data/admin");
  const result = await setBookingEnabled(enabled);

  revalidatePath("/back/ajustes");
  revalidatePath("/back");
  return result;
}

export async function seedServicesAction(): Promise<{ ok: boolean; message: string }> {
  if (!(await getStaffSession())) return { ok: false, message: "Sesión no válida." };

  const { seedServicesFromFiles } = await import("@/lib/data/admin");
  const result = await seedServicesFromFiles();

  revalidatePath("/back/servicios");
  return result;
}
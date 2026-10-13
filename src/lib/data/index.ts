import "server-only";

import { getSupabase } from "@/lib/supabase/server";
import { BARBERS } from "@/features/barbers/data/barbers";
import { SERVICES } from "@/features/services/data/services";

import type { Barber, Service } from "@/types";
import type {
  AppointmentDetail,
  AppointmentRow,
  AppointmentSource,
  AppointmentStatus,
  BarberRow,
  ServiceRow,
  SiteSettingsRow
} from "@/lib/domain/types";

/**
 * Acceso a datos con dos orígenes.
 *
 * En modo `static` todo sale de los ficheros de `data/`, que es lo que hace la
 * web sin base de datos. En modo `full` sale de Supabase, y si algo falla se
 * vuelve a los ficheros locales en vez de romper la página: es preferible
 * mostrar precios desactualizados que no mostrar nada.
 *
 * Todas las funciones son `async` porque en modo `full` hay red de por medio, y
 * así quien las llama no cambia según el modo.
 */

const fromService = (service: Service): ServiceRow => ({
  id: `local:${service.id}`,
  slug: service.id,
  name: service.name,
  description: service.description,
  durationMinutes: service.durationMinutes,
  price: service.price,
  active: true,
  sortOrder: 0
});

const fromBarber = (barber: Barber): BarberRow => ({
  id: `local:${barber.id}`,
  slug: barber.id,
  name: barber.name,
  role: barber.role,
  description: barber.description,
  specialties: barber.specialties,
  yearsExperience: barber.yearsExperience,
  active: true,
  sortOrder: 0
});

/* ------------------------------------------------------------------ servicios */

export async function listServices(onlyActive = true): Promise<ServiceRow[]> {
  const supabase = getSupabase();
  // En modo estatico todos los servicios de fichero estan activos: no hay forma
  // de ocultar uno sin tocar el codigo.
  if (!supabase) return SERVICES.map(fromService);

  let query = supabase
    .from("services")
    .select("id, slug, name, description, duration_minutes, price, active, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (onlyActive) query = query.eq("active", true);

  const { data, error } = await query;
  if (error || !data?.length) return SERVICES.map(fromService);

  return (data as Record<string, unknown>[]).map((row) => ({
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    description: String(row.description ?? ""),
    durationMinutes: Number(row.duration_minutes ?? 30),
    price: Number(row.price ?? 0),
    active: Boolean(row.active),
    sortOrder: Number(row.sort_order ?? 0)
  }));
}

/* ------------------------------------------------------------------- barberos */

export async function listBarbers(onlyActive = true): Promise<BarberRow[]> {
  const supabase = getSupabase();
  if (!supabase) return BARBERS.map(fromBarber);

  let query = supabase
    .from("barbers")
    .select("id, slug, name, role, description, specialties, years_experience, active, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (onlyActive) query = query.eq("active", true);

  const { data, error } = await query;
  if (error || !data?.length) return BARBERS.map(fromBarber);

  return (data as Record<string, unknown>[]).map((row) => ({
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    role: String(row.role ?? ""),
    description: String(row.description ?? ""),
    specialties: Array.isArray(row.specialties) ? (row.specialties as string[]) : [],
    yearsExperience: Number(row.years_experience ?? 0),
    active: Boolean(row.active),
    sortOrder: Number(row.sort_order ?? 0)
  }));
}

/* --------------------------------------------------------------------- ajustes */

export async function getSiteSettings(): Promise<SiteSettingsRow> {
  const supabase = getSupabase();
  if (!supabase) return { bookingEnabled: true };

  const { data, error } = await supabase
    .from("site_settings")
    .select("booking_enabled")
    .limit(1)
    .maybeSingle();

if (error || !data) return { bookingEnabled: true };

  // `maybeSingle` devuelve una fila suelta, no un array.
  const row = data as Record<string, unknown>;
  return { bookingEnabled: Boolean(row.booking_enabled ?? true) };
}

/* ----------------------------------------------------------------------- citas */

const APPOINTMENT_FIELDS =
  "id, customer_name, customer_phone, service_id, barber_id, starts_at, duration_minutes, status, notes, source";

function toAppointment(row: Record<string, unknown>): AppointmentRow {
  return {
    id: String(row.id),
    customerName: String(row.customer_name ?? ""),
    customerPhone: String(row.customer_phone ?? ""),
    serviceId: row.service_id ? String(row.service_id) : null,
    barberId: row.barber_id ? String(row.barber_id) : null,
    startsAt: String(row.starts_at),
    durationMinutes: Number(row.duration_minutes ?? 30),
    status: (row.status as AppointmentStatus) ?? "pending",
    notes: String(row.notes ?? ""),
    source: (row.source as AppointmentSource) ?? "web"
  };
}

/** Citas entre dos fechas, con el nombre del servicio y del barbero puestos. */
export async function listAppointments(from: Date, to: Date): Promise<AppointmentDetail[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_FIELDS)
    .gte("starts_at", from.toISOString())
    .lt("starts_at", to.toISOString())
    .order("starts_at", { ascending: true });

  if (error || !data?.length) return [];

  const rows = (data as Record<string, unknown>[]).map(toAppointment);

  // Nombres resueltos en una sola consulta extra, en vez de una por cita.
  const serviceIds = [...new Set(rows.map((r) => r.serviceId).filter(Boolean))] as string[];
  const barberIds = [...new Set(rows.map((r) => r.barberId).filter(Boolean))] as string[];

  const [servicesRes, barbersRes] = await Promise.all([
    serviceIds.length
      ? supabase.from("services").select("id, name").in("id", serviceIds)
      : Promise.resolve({ data: [] }),
    barberIds.length
      ? supabase.from("barbers").select("id, name").in("id", barberIds)
      : Promise.resolve({ data: [] })
  ]);

  const serviceNames = new Map(
    ((servicesRes.data ?? []) as Record<string, unknown>[]).map((r) => [String(r.id), String(r.name)])
  );
  const barberNames = new Map(
    ((barbersRes.data ?? []) as Record<string, unknown>[]).map((r) => [String(r.id), String(r.name)])
  );

  return rows.map((row) => ({
    ...row,
    serviceName: row.serviceId ? (serviceNames.get(row.serviceId) ?? null) : null,
    barberName: row.barberId ? (barberNames.get(row.barberId) ?? null) : null
  }));
}

/**
 * Instantes ya ocupados de un barbero, para que el flujo de cita no ofrezca
 * horas que ya están tomadas.
 */
export async function listBusySlots(barberId: string, from: Date, to: Date): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("appointments")
    .select("starts_at, duration_minutes")
    .eq("barber_id", barberId)
    .in("status", ["pending", "confirmed"])
    .gte("starts_at", from.toISOString())
    .lt("starts_at", to.toISOString());

  if (error || !data) return [];

  return (data as Record<string, unknown>[]).map((row) => {
    const start = new Date(String(row.starts_at)).getTime();
    const minutes = Number(row.duration_minutes ?? 30);
    return new Date(start + minutes * 60_000).toISOString();
  });
}

export type NewAppointment = {
  customerName: string;
  customerPhone: string;
  serviceId: string | null;
  barberId: string | null;
  startsAt: string;
  durationMinutes: number;
  notes?: string;
  source: AppointmentSource;
};

export async function createAppointment(
  input: NewAppointment
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: "El sitio está en modo estático: no hay donde guardar citas." };

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      service_id: input.serviceId,
      barber_id: input.barberId,
      starts_at: input.startsAt,
      duration_minutes: input.durationMinutes,
      notes: input.notes ?? "",
      source: input.source,
      // Las que entran por la web empiezan pendientes; el barbero las acepta
      // desde el panel. Las manuales se confirman directamente.
      status: input.source === "manual" ? "confirmed" : "pending"
    })
    .select("id")
    .single();

  if (error) {
    // El índice único de doble reserva es la comprobación real; el mensaje de
    // Postgres se traduce para que el panel muestre algo entendible.
    const duplicate =
      error.code === "23505" || /appointments_no_double_booking/.test(error.message ?? "");
    return {
      ok: false,
      error: duplicate
        ? "Ese barbero ya tiene una cita a esa hora."
        : "No se pudo guardar la cita. Revisa los datos e inténtalo de nuevo."
    };
  }

  return { ok: true, id: String((data as Record<string, unknown>).id) };
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: "Sin base de datos." };

  const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
  if (error) return { ok: false, error: "No se pudo cambiar el estado de la cita." };

  return { ok: true };
}

export async function deleteAppointment(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: "Sin base de datos." };

  const { error } = await supabase.from("appointments").delete().eq("id", id);
  if (error) return { ok: false, error: "No se pudo borrar la cita." };

  return { ok: true };
}
/**
 * Tipos del dominio, compartidos entre la web pública y el panel.
 *
 * Son los mismos que usan la web (`src/types/service.ts`, `barber.ts`), pero con
 * los campos que solo existen en base de datos: `id` real, `active` para
 * ocultar sin borrar y `sort_order` para el orden manual.
 */

export type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  sortOrder: number;
};

export type BarberRow = {
  id: string;
  slug: string;
  name: string;
  role: string;
  description: string;
  specialties: string[];
  yearsExperience: number;
  active: boolean;
  sortOrder: number;
};

export type AppointmentStatus = "pending" | "confirmed" | "done" | "cancelled";
export type AppointmentSource = "web" | "manual";

export type AppointmentRow = {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string | null;
  barberId: string | null;
  startsAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  notes: string;
  source: AppointmentSource;
};

/** Cita con los nombres resueltos, que es como la pinta el panel. */
export type AppointmentDetail = AppointmentRow & {
  serviceName: string | null;
  barberName: string | null;
};

export type SiteSettingsRow = {
  bookingEnabled: boolean;
};
import { z } from "zod";

/**
 * Validación de la cita manual que se crea desde el panel.
 *
 * Va en un fichero aparte porque la comparten el formulario y la acción del
 * servidor, y porque así el mensaje de error sale en el servidor, que es donde
 * está el dato, y no en el navegador.
 */
const schema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Escribe el nombre del cliente.")
    .max(80, "El nombre es demasiado largo."),
  customerPhone: z
    .string()
    .trim()
    .min(6, "Escribe un teléfono.")
    .max(30, "El teléfono es demasiado largo."),
  barberId: z.string().trim().min(1, "Elige un barbero."),
  serviceId: z.string().trim().min(1, "Elige un servicio."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elige una fecha."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Elige una hora."),
  notes: z.string().trim().max(500, "La nota es demasiado larga.").default("")
});

export type ManualAppointmentInput = z.input<typeof schema>;
export type ManualAppointmentData = z.output<typeof schema> & { startsAt: string };
export type ManualAppointmentResult =
  | { ok: true; data: ManualAppointmentData }
  | { ok: false; error: string };

export function validateNewAppointment(input: ManualAppointmentInput): ManualAppointmentResult {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Revisa los datos." };
  }

  const date = new Date(`${parsed.data.date}T${parsed.data.time}:00`);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: "Esa fecha no es válida." };
  }

  return {
    ok: true,
    data: { ...parsed.data, startsAt: date.toISOString() }
  };
}
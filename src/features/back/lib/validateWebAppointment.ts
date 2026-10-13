import { z } from "zod";

/**
 * Validación de la cita que entra desde la web pública.
 *
 * Aparte de la del panel porque aquí los identificadores son `slug` (lo que va
 * en la URL y en el HTML), no UUID de base de datos: quien llama desde el
 * navegador ve "corte-clasico", no un uuid.
 */
const schema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Escribe tu nombre.")
    .max(80, "El nombre es demasiado largo."),
  customerPhone: z
    .string()
    .trim()
    .min(6, "Escribe un teléfono válido.")
    .max(30, "El teléfono es demasiado largo."),
  barberId: z.string().trim().min(1, "Elige un barbero."),
  serviceId: z.string().trim().min(1, "Elige un servicio."),
  startsAt: z
    .string()
    .trim()
    .min(1, "Elige fecha y hora.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), "Esa fecha no es válida.")
});

export type WebAppointmentResult =
  | {
      ok: true;
      data: { customerName: string; customerPhone: string; barberId: string; serviceId: string; startsAt: string };
    }
  | { ok: false; error: string };

export function validateWebAppointment(input: unknown): WebAppointmentResult {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Revisa los datos." };
  }
  return { ok: true, data: parsed.data };
}
import { z } from "zod";

export const appointmentSchema = z.object({
  barberId: z.string().min(1, "Selecciona un barbero."),
  serviceId: z.string().min(1, "Selecciona un servicio."),
  startsAt: z.string().datetime("Selecciona una fecha y hora válida."),
  customerName: z.string().trim().min(2, "Introduce tu nombre.").max(60),
  customerPhone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{6,19}$/, "Introduce un teléfono válido.")
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
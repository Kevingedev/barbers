import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre.").max(60),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{6,19}$/, "Introduce un teléfono válido.")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(5, "Cuéntanos un poco más.").max(500)
});

export type ContactInput = z.infer<typeof contactSchema>;
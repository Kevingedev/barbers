import { z } from "zod";

/**
 * Variables de entorno públicas (las que viajan al navegador con
 * `NEXT_PUBLIC_`).
 *
 * `emptyToUndefined` es importante: en Vercel, una variable sin valor suele
 * llegar como cadena vacía, y un `z.string().url()` a secas revienta el build
 * con "Invalid url". Un despliegue normal empieza con `NEXT_PUBLIC_SITE_URL`
 * vacía porque el dominio todavía no existe.
 */
const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER: z.preprocess(emptyToUndefined, z.string().optional()),
  NEXT_PUBLIC_MAPBOX_TOKEN: z.preprocess(emptyToUndefined, z.string().optional())
});

export const env = publicEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER,
  NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN
});
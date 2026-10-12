import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER: z.string().optional(),
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().optional()
});

export const env = publicEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER,
  NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN
});

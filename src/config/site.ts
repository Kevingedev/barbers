import { env } from "@/config/env";

import type { DaySchedule } from "@/types";

export const SITE_NAME = "Ejemplo";
export const DEFAULT_LANGUAGE = "es";

export const WHATSAPP_PHONE = env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ?? "";
/**
 * URL pública del sitio.
 *
 * En Vercel, `VERCEL_PROJECT_PRODUCTION_URL` y `VERCEL_URL` los inyecta la
 * plataforma, así que si defines la variable a mano no hace falta tocarlas.
 * El orden importa: primero la variable propia, que manda.
 *
 * Sin ninguna de las tres se cae a localhost, que es lo que evita que el build
 * reviente, pero deja los metadatos de Open Graph apuntando a localhost. Por eso
 * en Vercel hay que comprobar que al menos una de ellas está definida.
 */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export const SITE_URL = (
  env.NEXT_PUBLIC_SITE_URL ?? (vercelHost ? `https://${vercelHost}` : "http://localhost:3000")
).replace(/\/$/, "");

export const MAPBOX_TOKEN = env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export const MAX_BOOKING_DAYS = 7;
export const BOOKING_DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hola, me gustaría reservar una cita.";

export const VENUE = {
  addressLine: "Zurbaranbarri Auzoa, 1",
  postalCode: "48007",
  cityLine: "Bilbao, Bizkaia",
  country: "ES",
  countryName: "España",
  coordinates: {
    latitude: 43.2647784,
    longitude: -2.9132798
  },
  mapsUrl: "https://maps.app.goo.gl/R8rBZGaTXgp3Suoc7"
} as const;

/** Enlace para cómo llegar, con el destino ya puesto. */
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${VENUE.coordinates.latitude},${VENUE.coordinates.longitude}`;

/**
 * Horario semanal.
 *
 * PENDIENTE: estos horarios son de relleno, no vienen de la ficha real. El
 * lunes a las 14:00 y el cierre de los martes a viernes a las 20:00 hay que
 * confirmarlos antes de publicar, porque un horario equivocado en la web hace
 * que alguien se desplace en balde.
 */
export const WEEKLY_SCHEDULE: DaySchedule[] = [
  { dayName: "Lunes", opensAt: "09:30", closesAt: "20:00", closed: false },
  { dayName: "Martes", opensAt: "09:30", closesAt: "20:00", closed: false },
  { dayName: "Miércoles", opensAt: "09:30", closesAt: "20:00", closed: false },
  { dayName: "Jueves", opensAt: "09:30", closesAt: "20:00", closed: false },
  { dayName: "Viernes", opensAt: "09:30", closesAt: "20:00", closed: false },
  { dayName: "Sábado", opensAt: "09:00", closesAt: "18:00", closed: false },
  { dayName: "Domingo", opensAt: "00:00", closesAt: "00:00", closed: true }
] as const;

export const BRAND_COLORS = {
  background: "#0F0F11",
  accent: "#C5A880",
  foreground: "#EDEDED"
} as const;
import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config/site";

/**
 * Mapa del sitio para buscadores.
 *
 * En local se sirve `localhost`, que no sirve para nada: se devuelve un mapa
 * vacío para no indexar un sitio que no existe en internet.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (SITE_URL.includes("localhost")) return [];

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/reservar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 }
  ];
}
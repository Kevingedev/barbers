import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (SITE_URL.includes("localhost")) {
    // En local no se indexa nada: si alguien despliega sin definir la URL, el
    // sitio queda en pausa en lugar de aparecer en buscadores como localhost.
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
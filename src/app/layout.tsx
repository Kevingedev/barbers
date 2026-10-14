import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";

import "@/styles/globals.css";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { getMessages } from "@/messages";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`
  },
  description: getMessages().brand.tagline,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: SITE_NAME,
    description: getMessages().brand.tagline,
    locale: "es_ES",
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    // Sin imagen, al compartir el enlace en WhatsApp, X o Facebook sale un
    // rectángulo vacío.
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: SITE_NAME }]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: getMessages().brand.tagline,
    images: ["/og-image.jpg"]
  },
  robots: { index: true, follow: true }
};

/**
 * Layout raíz: solo el documento.
 *
 * La navbar y el pie NO están aquí, sino en el layout de `(web)`. Si estuvieran
 * en la raíz, el panel los heredaría: la navbar `fixed` taparía la cabecera del
 * panel y sus enlaces a `#contacto` llevarían al visitante a una sección de la
 * web pública desde dentro del panel.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
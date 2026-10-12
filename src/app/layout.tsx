import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";

import "@/styles/globals.css";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
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

// Sin datos estructurados (JSON-LD) a propósito: el negocio se llama "Ejemplo"
// y son datos de muestra. Publicar un schema.org/HairSalon con nombre, dirección
// y horario inventados hace que Google indexe información falsa. Cuando haya
// nombre, dirección y horario reales, se recupera en
// `src/features/visit/lib/hairSalonSchema.ts`.
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <SmoothScroll />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

/**
 * Layout de la web pública: portada, `/reservar` y la 404.
 *
 * El nombre del grupo `(web)` no aparece en las URLs.
 */
export default function WebLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
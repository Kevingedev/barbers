import type { Metadata } from "next";

import { listServices } from "@/lib/data";
import { ServicesEditor } from "@/features/back/components/ServicesEditor";

export const metadata: Metadata = {
  title: "Servicios",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

/**
 * Servicios: los tipos de corte y sus precios.
 *
 * Todos, activos y ocultos: los ocultos no salen en la web pero interesa verlos
 * para saber qué se dejó de ofrecer.
 */
export default async function ServicesPage() {
  const services = await listServices(false);

  return (
    <div className="back-stack">
      <header>
        <h1 className="back-title">Servicios y precios</h1>
        <p className="back-copy">
          Lo que aparece aquí es lo que sale en la web. Para dejar de ofrecer un servicio sin borrar su
          historial, desmarca la casilla de visible en vez de borrarlo.
        </p>
      </header>

      <ServicesEditor services={services} />
    </div>
  );
}
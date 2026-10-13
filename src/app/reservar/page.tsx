import { BookingFlow } from "@/features/booking/components/BookingFlow";
import { listBarbers, listServices } from "@/lib/data";
import { isFullMode } from "@/config/siteMode";

/**
 * La reserva lee servicios y barberos de la capa de datos, no de los ficheros:
 * en modo `full` los gestiona el panel y la web tiene que ver lo mismo.
 *
 * La página es dinámica a propósito: leer la base de datos en el build congelaría
 * los precios en el despliegue. En modo `static` no hay base de datos y no pasa
 * nada, pero se marca igual para que no se intente cachear.
 */
export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const [barbers, services] = await Promise.all([listBarbers(true), listServices(true)]);

  return (
    <main className="booking-page">
      <BookingFlow
        barbers={barbers}
        services={services}
        /** Si no hay backend, no hay dónde guardar: el flujo sale por WhatsApp. */
        canPersist={isFullMode()}
      />
    </main>
  );
}
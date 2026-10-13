import type { Metadata } from "next";

import { listAppointments, listBarbers, listServices } from "@/lib/data";
import { AppointmentsClient } from "@/features/back/components/AppointmentsClient";
import { NewAppointmentForm } from "@/features/back/components/NewAppointmentForm";

// El panel nunca se indexa, aunque el buscador llegue a la URL.
export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false }
};

// Las citas cambian en cualquier momento: no se cachea esta página.
export const dynamic = "force-dynamic";

/**
 * Inicio del panel: las citas de hoy y de mañana, y el formulario para apuntar
 * a alguien a mano.
 *
 * Se limita a dos días a propósito: es lo que el barbero necesita ver al
 * empezar la jornada. El histórico largo lo añade el listado de servicios, que
 * no, y eso se deja para más adelante si hace falta.
 */
export default async function BackPage() {
  const from = new Date();
  from.setHours(0, 0, 0, 0);

  const to = new Date(from);
  to.setDate(to.getDate() + 2);

  const [appointments, barbers, services] = await Promise.all([
    listAppointments(from, to),
    listBarbers(false),
    listServices(false)
  ]);

  const pendingCount = appointments.filter((a) => a.status === "pending").length;

  return (
    <div className="back-stack">
      <section>
        <h1 className="back-title">
          Citas de hoy y mañana
          {pendingCount > 0 ? (
            <span className="back-badge">{pendingCount} por confirmar</span>
          ) : null}
        </h1>

        <AppointmentsClient appointments={appointments} />
      </section>

      <section>
        <h2 className="back-title">Apuntar a alguien a mano</h2>
        <p className="back-copy">
          Para quien llame o entre por la puerta. Esta cita cuenta como confirmada desde el principio.
        </p>
        <NewAppointmentForm barbers={barbers} services={services} />
      </section>
    </div>
  );
}
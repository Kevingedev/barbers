import type { AppointmentDetail, AppointmentStatus } from "@/lib/domain/types";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: "Por confirmar",
  confirmed: "Confirmada",
  done: "Hecha",
  cancelled: "Descartada"
};

/** Grupo por día, que es como el barbero piensa el día de trabajo. */
function groupByDay(appointments: AppointmentDetail[]) {
  const groups = new Map<string, AppointmentDetail[]>();

  for (const appointment of appointments) {
    const day = new Date(appointment.startsAt).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
    const list = groups.get(day);
    if (list) list.push(appointment);
    else groups.set(day, [appointment]);
  }

  return [...groups.entries()];
}

export function AppointmentsList({
  appointments,
  onStatus,
  onDelete
}: {
  appointments: AppointmentDetail[];
  onStatus: (id: string, status: AppointmentStatus) => void;
  onDelete: (id: string) => void;
}) {
  if (!appointments.length) {
    return (
      <p className="back-empty">
        No hay citas en este periodo. Aparece aquí en cuanto alguien reserve por la web o las añadas
        a mano.
      </p>
    );
  }

  return (
    <div className="back-appointments">
      {groupByDay(appointments).map(([day, items]) => (
        <section key={day} className="back-day">
          <h2 className="back-day__title">{day}</h2>

          <ul className="back-appointments__list">
            {items.map((appointment) => (
              <li
                key={appointment.id}
                className={`back-appointment back-appointment--${appointment.status}`}
              >
                <div className="back-appointment__main">
                  <p className="back-appointment__time">
                    {new Date(appointment.startsAt).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                    <span className="back-appointment__duration">
                      {appointment.durationMinutes} min
                    </span>
                  </p>
                  <p className="back-appointment__customer">
                    {appointment.customerName}
                    <a className="back-appointment__phone" href={`tel:${appointment.customerPhone}`}>
                      {appointment.customerPhone}
                    </a>
                  </p>
                  <p className="back-appointment__service">
                    {appointment.serviceName ?? "Sin servicio"}
                    {appointment.barberName ? ` · ${appointment.barberName}` : ""}
                    {appointment.source === "manual" ? " · Añadida a mano" : ""}
                  </p>
                  {appointment.notes ? (
                    <p className="back-appointment__notes">{appointment.notes}</p>
                  ) : null}
                </div>

                <div className="back-appointment__actions">
                  <span className={`back-status back-status--${appointment.status}`}>
                    {STATUS_LABEL[appointment.status]}
                  </span>

                  {appointment.status === "pending" ? (
                    <button
                      className="back-button"
                      type="button"
                      onClick={() => onStatus(appointment.id, "confirmed")}
                    >
                      Confirmar
                    </button>
                  ) : null}

                  {appointment.status === "confirmed" ? (
                    <button
                      className="back-button"
                      type="button"
                      onClick={() => onStatus(appointment.id, "done")}
                    >
                      Marcar hecha
                    </button>
                  ) : null}

                  {appointment.status !== "cancelled" && appointment.status !== "done" ? (
                    <button
                      className="back-button back-button--quiet"
                      type="button"
                      onClick={() => onStatus(appointment.id, "cancelled")}
                    >
                      Descartar
                    </button>
                  ) : null}

                  <button
                    className="back-button back-button--danger"
                    type="button"
                    onClick={() => onDelete(appointment.id)}
                  >
                    Borrar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
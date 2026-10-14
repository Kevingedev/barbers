"use client";

import { useActionState, useEffect } from "react";

import { createManualAppointment } from "@/app/(back)/back/actions";

import type { ManualAppointmentState } from "@/app/(back)/back/actions";
import type { BarberRow, ServiceRow } from "@/lib/domain/types";

const initialState: ManualAppointmentState = {};

/** Fecha de hoy en formato `YYYY-MM-DD`, para el valor por defecto del input. */
function today() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

/**
 * Alta manual de cita: cuando alguien entra por el teléfono o por la puerta y
 * hay que apuntarlo sin pasar por la web.
 */
export function NewAppointmentForm({
  barbers,
  services
}: {
  barbers: BarberRow[];
  services: ServiceRow[];
}) {
  const [state, formAction, pending] = useActionState(createManualAppointment, initialState);

  // Al guardar bien, el formulario se queda listo para la siguiente.
  useEffect(() => {
    if (state.ok) {
      const form = document.querySelector<HTMLFormElement>(".back-form--new-appointment");
      form?.reset();
    }
  }, [state.ok]);

  return (
    <form action={formAction} className="back-form back-form--new-appointment">
      <div className="back-form__grid">
        <div className="field">
          <label className="field__label" htmlFor="customerName">
            Nombre
          </label>
          <input
            className="field__input"
            id="customerName"
            name="customerName"
            required
            placeholder="Nombre del cliente"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="customerPhone">
            Teléfono
          </label>
          <input
            className="field__input"
            id="customerPhone"
            name="customerPhone"
            type="tel"
            required
            placeholder="600 000 000"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="barberId">
            Barbero
          </label>
          <select className="field__input" id="barberId" name="barberId" required defaultValue="">
            <option value="" disabled>
              Elige
            </option>
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="serviceId">
            Servicio
          </label>
          <select className="field__input" id="serviceId" name="serviceId" required defaultValue="">
            <option value="" disabled>
              Elige
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} · {service.price} €
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="date">
            Día
          </label>
          <input
            className="field__input"
            id="date"
            name="date"
            type="date"
            required
            defaultValue={today()}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="time">
            Hora
          </label>
          <input className="field__input" id="time" name="time" type="time" required step={900} />
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="notes">
          Nota
        </label>
        <input
          className="field__input"
          id="notes"
          name="notes"
          placeholder="Por ejemplo: viene con el hijo"
        />
      </div>

      {state.error ? (
        <p className="back-alert" role="alert">
          {state.error}
        </p>
      ) : null}

      {state.ok && !state.error ? <p className="back-ok">Cita guardada.</p> : null}

      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Guardar cita"}
      </button>
    </form>
  );
}
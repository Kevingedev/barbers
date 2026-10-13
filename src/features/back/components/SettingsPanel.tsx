"use client";

import { useState, useTransition } from "react";

import { seedServicesAction, toggleBookingAction } from "@/app/back/actions";

/**
 * Interruptor de reservas.
 *
 * Apagado, los botones de la web dejan de llevar a `/reservar` y pasan a abrir
 * WhatsApp. Es el interruptor de emergencia: si el barbero está lleno o se
 * rompe algo, se corta la entrada de citas desde la propia web.
 */
export function SettingsPanel({ bookingEnabled }: { bookingEnabled: boolean }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="back-stack">
      <section className="back-card">
        <h2 className="back-title">Reservas</h2>
        <p className="back-copy">
          {bookingEnabled
            ? "Ahora mismo los botones llevan al formulario de cita. Los que entren crean una cita por confirmar."
            : "Ahora mismo los botones abren WhatsApp. Nadie puede reservar desde la web."}
        </p>

        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await toggleBookingAction(formData);
              setMessage(result.ok ? "Guardado." : result.error);
            });
          }}
        >
          <input type="hidden" name="bookingEnabled" value={bookingEnabled ? "false" : "true"} />
          <button className="primary-button" type="submit" disabled={pending}>
            {pending
              ? "Guardando…"
              : bookingEnabled
                ? "Desactivar las reservas"
                : "Activar las reservas"}
          </button>
        </form>

        {message ? <p className="back-hint">{message}</p> : null}
      </section>

      <section className="back-card">
        <h2 className="back-title">Empezar de cero</h2>
        <p className="back-copy">
          Copia los servicios que están en el código a la base de datos, para no tener que teclearlos uno
          a uno la primera vez.
        </p>
        <button
          className="back-button"
          type="button"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await seedServicesAction();
              setMessage(result.message);
            });
          }}
        >
          Copiar servicios del código
        </button>
      </section>
    </div>
  );
}
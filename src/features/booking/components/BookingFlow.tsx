"use client";

import { useState } from "react";

import { useBooking } from "@/hooks/useBooking";
import { useLocale } from "@/hooks/useLocale";
import { BOOKING_STEPS } from "@/features/booking/lib/bookingSteps";
import { BookingStepBarber } from "@/features/booking/components/BookingStepBarber";
import { BookingStepService } from "@/features/booking/components/BookingStepService";
import { BookingStepDatetime } from "@/features/booking/components/BookingStepDatetime";
import { BookingStepConfirmation } from "@/features/booking/components/BookingStepConfirmation";
import { WHATSAPP_PHONE } from "@/config/site";
import { formatDateTime } from "@/lib/utils/formatDateTime";
import { formatPrice } from "@/lib/utils/formatPrice";
import { generateWhatsAppUrl } from "@/lib/utils/generateWhatsAppUrl";

import type { BarberRow, ServiceRow } from "@/lib/domain/types";

type BookingFlowProps = {
  barbers: BarberRow[];
  services: ServiceRow[];
  /**
   * `false` en modo estático: no hay base de datos donde guardar la cita, así que
   * el flujo termina abriendo WhatsApp, que es como funcionaba antes.
   */
  canPersist: boolean;
};

export function BookingFlow({ barbers, services, canPersist }: BookingFlowProps) {
  const t = useLocale();
  const booking = useBooking();

  const { currentStep, draft, canProceed } = booking;

  const barber = barbers.find((item) => item.id === draft.barberId) ?? null;
  const service = services.find((item) => item.id === draft.serviceId) ?? null;

  const confirmationErrors =
    currentStep === "confirmation" ? booking.getStepErrors("confirmation") : {};

  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  /** Monta el mensaje de WhatsApp con los datos de la cita. */
  function buildWhatsAppMessage(): string {
    // El botón de confirmar ya comprueba que estén los tres, pero aquí el
    // tipo no lo sabe y no daría error al ejecutarse si faltara alguno.
    if (!barber || !service || !draft.startsAt) return t.booking.whatsappMessage;

    return [
      t.booking.whatsappMessage,
      "",
      `${t.booking.summary.barber}: ${barber.name}`,
      `${t.booking.summary.service}: ${service.name} (${service.durationMinutes} min)`,
      `${t.booking.summary.datetime}: ${formatDateTime(draft.startsAt)}`,
      `${t.booking.summary.price}: ${formatPrice(service.price)}`,
      `${t.booking.yourName}: ${draft.customerName}`,
      `${t.booking.yourPhone}: ${draft.customerPhone}`
    ].join("\n");
  }

  function openWhatsApp() {
    window.open(
      generateWhatsAppUrl({ phone: WHATSAPP_PHONE, message: buildWhatsAppMessage() }),
      "_blank",
      "noopener,noreferrer"
    );
    booking.resetBooking();
  }

  /**
   * Al confirmar se intenta guardar la cita. Si el sitio no tiene backend, o si
   * el servidor falla, se cae a WhatsApp: es preferible que la persona pierda la
   * cita en el panel antes que quedarse sin pedir nada.
   */
  async function handleConfirm() {
    if (!barber || !service || !draft.startsAt) return;

    if (!canPersist) {
      openWhatsApp();
      return;
    }

    setStatus("saving");
    setServerError(null);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: draft.customerName,
          customerPhone: draft.customerPhone,
          barberId: barber.id,
          serviceId: service.id,
          startsAt: draft.startsAt
        })
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus("error");
        setServerError(data?.error ?? "No se pudo guardar la cita.");
        return;
      }

      setStatus("done");
    } catch {
      setStatus("error");
      setServerError("No se pudo conectar para guardar la cita.");
    }
  }

  return (
    <section className="booking-flow" aria-labelledby="booking-title">
      <p className="eyebrow">Reserva guiada</p>
      <h1 className="booking-flow__title" id="booking-title">
        {t.booking.steps[currentStep]}
      </h1>

      <ol className="booking-progress" aria-label="Progreso de la reserva">
        {BOOKING_STEPS.map((step, index) => (
          <li
            key={step}
            className={
              step === currentStep
                ? "booking-progress__step booking-progress__step--active"
                : "booking-progress__step"
            }
          >
            <span className="booking-progress__index">{index + 1}</span>
            <span className="booking-progress__label">{t.booking.steps[step]}</span>
          </li>
        ))}
      </ol>

      <div className="booking-flow__content">
        {currentStep === "barber" && (
          <BookingStepBarber
            barbers={barbers}
            selectedId={draft.barberId}
            onSelect={booking.selectBarber}
          />
        )}

        {currentStep === "service" && (
          <BookingStepService
            services={services}
            selectedId={draft.serviceId}
            onSelect={booking.selectService}
          />
        )}

        {currentStep === "datetime" && (
          <BookingStepDatetime
            durationMinutes={service?.durationMinutes ?? 30}
            selectedSlot={draft.startsAt}
            onSelectSlot={booking.selectDateTime}
          />
        )}

        {currentStep === "confirmation" && (
          <BookingStepConfirmation
            barber={barber}
            service={service}
            draft={draft}
            errors={confirmationErrors}
            onCustomerChange={booking.setCustomer}
          />
        )}
      </div>

      <div className="button-row booking-flow__actions">
        {currentStep !== "barber" && (
          <button
            className="secondary-button"
            type="button"
            onClick={booking.goToPreviousStep}
          >
            {t.booking.back}
          </button>
        )}

        {currentStep !== "confirmation" ? (
          <button
            className="primary-button"
            type="button"
            disabled={!canProceed()}
            onClick={booking.goToNextStep}
          >
            {t.booking.next}
          </button>
        ) : (
          <button
            className="primary-button"
            type="button"
            onClick={handleConfirm}
            disabled={!canProceed("confirmation") || status === "saving"}
          >
            {status === "saving" ? "Guardando…" : t.booking.confirm}
          </button>
        )}
      </div>

      {status === "done" ? (
        <div className="booking-done">
          <p className="booking-done__title">Cita pedida.</p>
          <p className="booking-done__copy">
            Te la confirmamos por WhatsApp en cuanto el barbero la revise.
          </p>
          <button className="primary-button" type="button" onClick={openWhatsApp}>
            Abrir WhatsApp
          </button>
          <button className="secondary-button" type="button" onClick={booking.resetBooking}>
            Pedir otra
          </button>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="back-alert" role="alert">
          <p>{serverError}</p>
          <p className="back-hint">
            También puedes enviarla por WhatsApp y la apunto a mano.
          </p>
          <button className="primary-button" type="button" onClick={openWhatsApp}>
            Abrir WhatsApp
          </button>
        </div>
      ) : null}
    </section>
  );
}
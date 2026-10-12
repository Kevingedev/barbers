"use client";

import { useBooking } from "@/hooks/useBooking";
import { useLocale } from "@/hooks/useLocale";
import { BARBERS } from "@/features/barbers/data/barbers";
import { SERVICES } from "@/features/services/data/services";
import { BOOKING_STEPS } from "@/features/booking/lib/bookingSteps";
import { BookingStepBarber } from "@/features/booking/components/BookingStepBarber";
import { BookingStepService } from "@/features/booking/components/BookingStepService";
import { BookingStepDatetime } from "@/features/booking/components/BookingStepDatetime";
import { BookingStepConfirmation } from "@/features/booking/components/BookingStepConfirmation";
import { WHATSAPP_PHONE } from "@/config/site";
import { formatDateTime } from "@/lib/utils/formatDateTime";
import { formatPrice } from "@/lib/utils/formatPrice";
import { generateWhatsAppUrl } from "@/lib/utils/generateWhatsAppUrl";

export function BookingFlow() {
  const t = useLocale();
  const booking = useBooking();

  const { currentStep, draft, canProceed } = booking;

  const barber = BARBERS.find((item) => item.id === draft.barberId) ?? null;
  const service = SERVICES.find((item) => item.id === draft.serviceId) ?? null;

  const confirmationErrors =
    currentStep === "confirmation" ? booking.getStepErrors("confirmation") : {};

  function handleConfirm() {
    if (!barber || !service || !draft.startsAt) {
      return;
    }

    const message = [
      t.booking.whatsappMessage,
      "",
      `${t.booking.summary.barber}: ${barber.name}`,
      `${t.booking.summary.service}: ${service.name} (${service.durationMinutes} min)`,
      `${t.booking.summary.datetime}: ${formatDateTime(draft.startsAt)}`,
      `${t.booking.summary.price}: ${formatPrice(service.price)}`,
      `${t.booking.yourName}: ${draft.customerName}`,
      `${t.booking.yourPhone}: ${draft.customerPhone}`
    ].join("\n");

    const whatsappUrl = generateWhatsAppUrl({
      phone: WHATSAPP_PHONE,
      message
    });

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    booking.resetBooking();
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
            barbers={BARBERS}
            selectedId={draft.barberId}
            onSelect={booking.selectBarber}
          />
        )}

        {currentStep === "service" && (
          <BookingStepService
            services={SERVICES}
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
            disabled={!canProceed("confirmation")}
            onClick={handleConfirm}
          >
            {t.booking.confirm}
          </button>
        )}
      </div>
    </section>
  );
}
"use client";

import { useLocale } from "@/hooks/useLocale";
import { formatDateTime } from "@/lib/utils/formatDateTime";
import { formatPrice } from "@/lib/utils/formatPrice";

import type { BookingDraft } from "@/hooks/useBooking";
import type { Barber, Service } from "@/types";

type BookingStepConfirmationProps = {
  barber: Barber | null;
  service: Service | null;
  draft: BookingDraft;
  errors: Record<string, string>;
  onCustomerChange: (customer: Pick<BookingDraft, "customerName" | "customerPhone">) => void;
};

export function BookingStepConfirmation({
  barber,
  service,
  draft,
  errors,
  onCustomerChange
}: BookingStepConfirmationProps) {
  const t = useLocale();

  return (
    <div className="confirmation-step">
      <h2 className="confirmation-step__heading">{t.booking.summaryTitle}</h2>

      <dl className="summary-list">
        {barber && (
          <div className="summary-list__row">
            <dt>{t.booking.summary.barber}</dt>
            <dd>{barber.name}</dd>
          </div>
        )}
        {service && (
          <>
            <div className="summary-list__row">
              <dt>{t.booking.summary.service}</dt>
              <dd>{service.name}</dd>
            </div>
            <div className="summary-list__row">
              <dt>{t.booking.summary.duration}</dt>
              <dd>{service.durationMinutes} min</dd>
            </div>
            <div className="summary-list__row">
              <dt>{t.booking.summary.price}</dt>
              <dd>{formatPrice(service.price)}</dd>
            </div>
          </>
        )}
        {draft.startsAt && (
          <div className="summary-list__row">
            <dt>{t.booking.summary.datetime}</dt>
            <dd>{formatDateTime(draft.startsAt)}</dd>
          </div>
        )}
      </dl>

      <div className="form-grid">
        <label className="field">
          <span className="field__label">{t.booking.yourName}</span>
          <input
            className="field__input"
            type="text"
            autoComplete="name"
            value={draft.customerName}
            onChange={(event) =>
              onCustomerChange({
                customerName: event.target.value,
                customerPhone: draft.customerPhone
              })
            }
          />
          {errors.customerName && <small className="field__error">{errors.customerName}</small>}
        </label>

        <label className="field">
          <span className="field__label">{t.booking.yourPhone}</span>
          <input
            className="field__input"
            type="tel"
            autoComplete="tel"
            value={draft.customerPhone}
            onChange={(event) =>
              onCustomerChange({
                customerName: draft.customerName,
                customerPhone: event.target.value
              })
            }
          />
          {errors.customerPhone && <small className="field__error">{errors.customerPhone}</small>}
        </label>
      </div>
    </div>
  );
}
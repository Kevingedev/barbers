"use client";

import { useMemo, useState } from "react";

import { MAX_BOOKING_DAYS } from "@/config/site";
import { useLocale } from "@/hooks/useLocale";
import {
  createTimeSlots,
  getNextBookingDays,
  isSlotTaken
} from "@/features/booking/lib/availability";

type BookingStepDatetimeProps = {
  durationMinutes: number;
  selectedSlot: string | null;
  onSelectSlot: (isoString: string) => void;
};

const dayFormatter = new Intl.DateTimeFormat("es-ES", {
  weekday: "short",
  day: "numeric"
});

const timeFormatter = new Intl.DateTimeFormat("es-ES", {
  hour: "2-digit",
  minute: "2-digit"
});

export function BookingStepDatetime({
  durationMinutes,
  selectedSlot,
  onSelectSlot
}: BookingStepDatetimeProps) {
  const t = useLocale();
  const days = useMemo(() => getNextBookingDays(MAX_BOOKING_DAYS), []);
  const [activeDay, setActiveDay] = useState<string>(days[0] ?? "");

  const slots = useMemo(
    () =>
      activeDay ? createTimeSlots({ dayISO: activeDay, durationMinutes }) : [],
    [activeDay, durationMinutes]
  );

  return (
    <div className="datetime-step">
      <div className="day-picker" role="radiogroup" aria-label={t.booking.chooseDate}>
        {days.map((day) => {
          const isActive = day === activeDay;
          const label = dayFormatter.format(new Date(`${day}T12:00:00`));

          return (
            <button
              key={day}
              className={isActive ? "day-pill day-pill--active" : "day-pill"}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setActiveDay(day)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {slots.length === 0 ? (
        <p className="datetime-step__empty">
          No hay horarios disponibles para este día y servicio.
        </p>
      ) : (
        <div className="slot-grid">
          {slots.map((slot) => {
            const taken = isSlotTaken(slot);
            const isSelected = slot === selectedSlot;

            return (
              <button
                key={slot}
                className={
                  taken
                    ? "slot-pill slot-pill--taken"
                    : isSelected
                      ? "slot-pill slot-pill--selected"
                      : "slot-pill"
                }
                type="button"
                disabled={taken}
                title={taken ? t.booking.slotTaken : undefined}
                aria-pressed={isSelected}
                onClick={() => onSelectSlot(slot)}
              >
                {timeFormatter.format(new Date(slot))}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
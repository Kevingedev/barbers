import type { Barber } from "@/types";

type BookingStepBarberProps = {
  barbers: Barber[];
  selectedId: string | null;
  onSelect: (barberId: string) => void;
};

export function BookingStepBarber({ barbers, selectedId, onSelect }: BookingStepBarberProps) {
  return (
    <div className="booking-options" role="radiogroup" aria-label="Barbero">
      {barbers.map((barber) => {
        const isSelected = barber.id === selectedId;

        return (
          <button
            key={barber.id}
            className={
              isSelected ? "booking-option booking-option--selected" : "booking-option"
            }
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(barber.id)}
          >
            <span className="booking-option__monogram" aria-hidden="true">
              {barber.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <span className="booking-option__body">
              <strong className="booking-option__title">{barber.name}</strong>
              <span className="booking-option__subtitle">{barber.role}</span>
              <span className="booking-option__detail">
                {barber.yearsExperience} años de oficio
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
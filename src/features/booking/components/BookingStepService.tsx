import { formatPrice } from "@/lib/utils/formatPrice";

import type { Service } from "@/types";

type BookingStepServiceProps = {
  services: Service[];
  selectedId: string | null;
  onSelect: (serviceId: string) => void;
};

export function BookingStepService({ services, selectedId, onSelect }: BookingStepServiceProps) {
  return (
    <div className="booking-options" role="radiogroup" aria-label="Servicio">
      {services.map((service) => {
        const isSelected = service.id === selectedId;

        return (
          <button
            key={service.id}
            className={
              isSelected ? "booking-option booking-option--selected" : "booking-option"
            }
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(service.id)}
          >
            <span className="booking-option__body">
              <strong className="booking-option__title">{service.name}</strong>
              <span className="booking-option__subtitle">{service.description}</span>
              <span className="booking-option__detail">
                {service.durationMinutes} min · {formatPrice(service.price)}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
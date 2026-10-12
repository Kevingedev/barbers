import { formatPrice } from "@/lib/utils/formatPrice";

import type { Service } from "@/types";

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="service-card">
      <div className="service-card__meta">
        <span className="service-card__duration">{service.durationMinutes} min</span>
        <span className="service-card__price">{formatPrice(service.price)}</span>
      </div>
      <h3 className="service-card__name">{service.name}</h3>
      <p className="service-card__description">{service.description}</p>
    </article>
  );
}
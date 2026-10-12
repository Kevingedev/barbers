import type { Barber } from "@/types";

type BarberCardProps = {
  barber: Barber;
};

export function BarberCard({ barber }: BarberCardProps) {
  return (
    <article className="barber-card">
      <div className="barber-card__monogram" aria-hidden="true">
        {barber.name
          .split(" ")
          .map((part) => part[0])
          .join("")}
      </div>
      <h3 className="barber-card__name">{barber.name}</h3>
      <p className="barber-card__role">{barber.role}</p>
      <p className="barber-card__description">{barber.description}</p>
      <ul className="barber-card__specialties">
        {barber.specialties.map((specialty) => (
          <li key={specialty}>{specialty}</li>
        ))}
      </ul>
      <p className="barber-card__experience">{barber.yearsExperience} años de oficio</p>
    </article>
  );
}
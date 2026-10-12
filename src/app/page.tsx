import { getSiteSettings } from "@/features/settings/lib/getSiteSettings";
import { getMessages } from "@/messages";
import { SERVICES } from "@/features/services/data/services";
import { ServiceCard } from "@/features/services/components/ServiceCard";
import { BARBERS } from "@/features/barbers/data/barbers";
import { BarberCard } from "@/features/barbers/components/BarberCard";
import { ContactSection } from "@/features/contact/components/ContactSection";
import { Reveal } from "@/components/animations/Reveal";
import { Secuencial } from "@/components/animations/Secuencial";
import { DynamicMapboxMap } from "@/components/ui/DynamicMapboxMap";
import { ScrollWorld } from "@/features/world/components/ScrollWorld";
import { ReviewsSection } from "@/features/reviews/components/ReviewsSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VENUE } from "@/config/site";

export default async function HomePage() {
  const settings = await getSiteSettings();
  const t = getMessages();

  return (
    <main className="home-page">
      <ScrollWorld bookingEnabled={settings.booking_enabled} />

      <section className="section section--services" id="servicios">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow={t.services.eyebrow}
              title={t.services.title}
              copy={t.services.copy}
            />
          </Reveal>

          <Reveal>
            <div className="services-grid">
              {SERVICES.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--experience" id="experiencia">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow={t.experience.eyebrow}
              title={t.experience.title}
              align="left"
            />
          </Reveal>

          <Reveal>
            <div className="experience-grid">
              <div className="experience-copy">
                <p>{t.experience.paragraphOne}</p>
                <p>{t.experience.paragraphTwo}</p>
              </div>

              <dl className="stats">
                <div className="stats__item">
                  <dt className="stats__value">14</dt>
                  <dd className="stats__label">{t.experience.stats.years}</dd>
                </div>
                <div className="stats__item">
                  <dt className="stats__value">4.800</dt>
                  <dd className="stats__label">{t.experience.stats.cuts}</dd>
                </div>
                <div className="stats__item">
                  <dt className="stats__value">03</dt>
                  <dd className="stats__label">{t.experience.stats.barbers}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--barbers" id="barberos">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow={t.barbers.eyebrow}
              title={t.barbers.title}
              copy={t.barbers.copy}
            />
          </Reveal>

          {/* Entrada escalonada: con una sola tarjeta no se aprecia el efecto,
              pero el marcado ya queda listo para cuando haya más de una. */}
          <Secuencial className="barbers-grid">
            {BARBERS.map((barber) => (
              <BarberCard key={barber.id} barber={barber} />
            ))}
          </Secuencial>
        </div>
      </section>

      <ReviewsSection />

      <section className="section section--visit" id="visitanos">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow={t.visit.eyebrow}
              title={t.visit.title}
              copy={t.visit.copy}
            />
          </Reveal>

          <Reveal>
            <div className="visit-grid">
              <div className="visit-info">
                <p className="visit-info__address">
                  {VENUE.addressLine}
                  <br />
                  {VENUE.cityLine}
                </p>
              </div>
              <DynamicMapboxMap />
            </div>
          </Reveal>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
import { getMessages } from "@/messages";
import { DIRECTIONS_URL, VENUE, WHATSAPP_PHONE, WEEKLY_SCHEDULE } from "@/config/site";
import { formatPhoneDisplay } from "@/lib/utils/formatPhoneDisplay";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/features/contact/components/ContactForm";

export function ContactSection() {
  const t = getMessages();

  return (
    <section className="section section--contact" id="contacto">
      <div className="container">
        <SectionHeading
          eyebrow={t.contact.eyebrow}
          title={t.contact.title}
          copy={t.contact.copy}
        />

        <div className="contact-grid">
          <div className="contact-info">
            <dl className="contact-details">
              <div>
                <dt>{t.visit.addressLabel}</dt>
                <dd>
                  {VENUE.addressLine}
                  <br />
                  {VENUE.cityLine}
                </dd>
                <a
                  className="contact-directions"
                  href={DIRECTIONS_URL}
                  rel="noreferrer"
                  target="_blank"
                >
                  {t.visit.directions}
                </a>
              </div>

              <div>
                <dt>WhatsApp</dt>
                <dd>{WHATSAPP_PHONE ? formatPhoneDisplay(WHATSAPP_PHONE) : "Por configurar"}</dd>
              </div>

              <div>
                <dt>{t.visit.hoursLabel}</dt>
                <dd>
                  <ul className="contact-details__hours">
                    {WEEKLY_SCHEDULE.filter((day) => !day.closed).map((day) => (
                      <li key={day.dayName}>
                        {day.dayName}: {day.opensAt} – {day.closesAt}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
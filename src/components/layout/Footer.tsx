import Link from "next/link";

import { getMessages } from "@/messages";
import { SITE_NAME, VENUE, WEEKLY_SCHEDULE } from "@/config/site";

const FOOTER_NAV_ITEMS = [
  { href: "#servicios", key: "services" },
  { href: "#experiencia", key: "experience" },
  { href: "#barberos", key: "barbers" },
  { href: "#visitanos", key: "visit" },
  { href: "#contacto", key: "contact" }
] as const;

export function Footer() {
  const t = getMessages();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand-block">
          <p className="footer__brand">{SITE_NAME}</p>
          <p className="footer__tagline">{t.footer.tagline}</p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <h4 className="footer__heading">{t.footer.navigate}</h4>
          <ul>
            {FOOTER_NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link href={item.href}>{t.nav[item.key]}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__schedule">
          <h4 className="footer__heading">{t.visit.hoursLabel}</h4>
          <ul>
            {WEEKLY_SCHEDULE.map((day) => (
              <li key={day.dayName}>
                <span>{day.dayName}</span>
                <span>{day.closed ? "Cerrado" : `${day.opensAt} – ${day.closesAt}`}</span>
              </li>
            ))}
          </ul>
        </div>

        <address className="footer__address">
          <h4 className="footer__heading">{t.visit.addressLabel}</h4>
          <p>{VENUE.addressLine}</p>
          <p>{VENUE.cityLine}</p>
        </address>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>
            © {year} {SITE_NAME}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
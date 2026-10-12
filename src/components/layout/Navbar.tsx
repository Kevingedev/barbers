import Link from "next/link";

import { getMessages } from "@/messages";
import { SITE_NAME, WHATSAPP_PHONE } from "@/config/site";
import { getSiteSettings } from "@/features/settings/lib/getSiteSettings";
import { generateWhatsAppUrl } from "@/lib/utils/generateWhatsAppUrl";

const NAV_ITEMS = [
  { href: "#servicios", key: "services" },
  { href: "#experiencia", key: "experience" },
  { href: "#barberos", key: "barbers" },
  { href: "#resenas", key: "reviews" },
  { href: "#visitanos", key: "visit" },
  { href: "#contacto", key: "contact" }
] as const;

export async function Navbar() {
  const t = getMessages();
  const { booking_enabled: bookingEnabled } = await getSiteSettings();

  const whatsappUrl = generateWhatsAppUrl({
    phone: WHATSAPP_PHONE,
    message: t.booking.whatsappMessage
  });

  return (
    <header className="navbar">
      <Link className="navbar__brand" href="/">
        {SITE_NAME}
      </Link>

      <nav className="navbar__links" aria-label="Principal">
        {NAV_ITEMS.map((item) => (
          <Link key={item.key} className="navbar__link" href={item.href}>
            {t.nav[item.key]}
          </Link>
        ))}
      </nav>

      {bookingEnabled ? (
        <Link className="navbar__cta" href="/reservar">
          {t.nav.book}
        </Link>
      ) : (
        <a className="navbar__cta" href={whatsappUrl} rel="noreferrer" target="_blank">
          {t.booking.whatsappCta}
        </a>
      )}
    </header>
  );
}
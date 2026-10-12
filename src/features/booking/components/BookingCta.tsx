import Link from "next/link";

import { getMessages } from "@/messages";
import { WHATSAPP_PHONE } from "@/config/site";
import { generateWhatsAppUrl } from "@/lib/utils/generateWhatsAppUrl";

type BookingCtaProps = {
  bookingEnabled: boolean;
};

export function BookingCta({ bookingEnabled }: BookingCtaProps) {
  const t = getMessages();

  if (!bookingEnabled) {
    const whatsappUrl = generateWhatsAppUrl({
      phone: WHATSAPP_PHONE,
      message: t.booking.whatsappMessage
    });

    return (
      <a className="primary-button" href={whatsappUrl} rel="noreferrer" target="_blank">
        {t.booking.whatsappCta}
      </a>
    );
  }

  return (
    <Link className="primary-button" href="/reservar">
      {t.hero.primaryCta}
    </Link>
  );
}
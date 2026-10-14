import Link from "next/link";

import { getMessages } from "@/messages";

export default function NotFound() {
  const t = getMessages();

  return (
    <main className="not-found-page">
      <section className="not-found">
        <p className="not-found__code">404</p>
        <h1 className="not-found__title">{t.notFound.title}</h1>
        <p className="not-found__copy">{t.notFound.copy}</p>
        <Link className="primary-button" href="/">
          {t.notFound.cta}
        </Link>
      </section>
    </main>
  );
}
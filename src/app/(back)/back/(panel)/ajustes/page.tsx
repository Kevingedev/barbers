import type { Metadata } from "next";

import { getSiteSettings } from "@/lib/data";
import { SettingsPanel } from "@/features/back/components/SettingsPanel";

export const metadata: Metadata = {
  title: "Ajustes",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

/** Ajustes del sitio: por ahora el interruptor de reservas. */
export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="back-stack">
      <header>
        <h1 className="back-title">Ajustes</h1>
      </header>

      <SettingsPanel bookingEnabled={settings.bookingEnabled} />
    </div>
  );
}
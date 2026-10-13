import Link from "next/link";

import { notFound } from "next/navigation";

import { isBackEnabled } from "@/config/siteMode";
import { getStaffSession } from "@/lib/supabase/session";
import { logout } from "@/app/back/login/actions";

/**
 * Panel de control: citas, servicios y ajustes.
 *
 * Este layout ES la protección. Comprueba sesión y lista blanca antes de
 * renderizar nada, y además marca la página como no indexable, para que un
 * buscador no llegue a leerla.
 */
export default async function BackLayout({ children }: { children: React.ReactNode }) {
  if (!isBackEnabled()) notFound();

  const session = await getStaffSession();

  if (!session) {
    const { redirect } = await import("next/navigation");
    redirect("/back/login");
  }

  return (
    <div className="back">
      <header className="back__header">
        <Link className="back__brand" href="/back">
          Panel
        </Link>
        <div className="back__header-right">
          <Link className="back__link" href="/" target="_blank">
            Ver la web
          </Link>
          <form action={logout}>
            <button className="back__logout" type="submit">
              Salir
            </button>
          </form>
        </div>
      </header>

      <nav className="back__nav" aria-label="Secciones del panel">
        <Link className="back__nav-link" href="/back">
          Citas
        </Link>
        <Link className="back__nav-link" href="/back/servicios">
          Servicios
        </Link>
        <Link className="back__nav-link" href="/back/ajustes">
          Ajustes
        </Link>
      </nav>

      <main className="back__main">{children}</main>
    </div>
  );
}
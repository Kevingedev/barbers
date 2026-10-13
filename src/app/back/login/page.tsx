import { redirect } from "next/navigation";

import { isBackEnabled } from "@/config/siteMode";
import { getStaffSession } from "@/lib/supabase/session";
import { LoginForm } from "@/features/back/components/LoginForm";

/**
 * Pantalla de entrada al panel.
 *
 * Comprueba la sesión y, si ya la hay, salta al panel. El `layout` de /back
 * protege el resto, pero no puede proteger esta pantalla: se redirigiría a sí
 * misma y no habría forma de entrar.
 */
export default async function LoginPage() {
  if (!isBackEnabled()) {
    const { notFound } = await import("next/navigation");
    notFound();
  }

  const session = await getStaffSession();
  if (session) redirect("/back");

  return (
    <main className="back-login">
      <div className="back-login__card">
        <h1 className="back-login__title">Panel de la peluquería</h1>
        <p className="back-login__copy">Entra con el correo que te dio el barbero.</p>
        <LoginForm />
      </div>
    </main>
  );
}
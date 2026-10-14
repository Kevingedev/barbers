"use client";

import { useEffect, useState } from "react";

type MenuToggleProps = {
  items: { href: string; label: string }[];
};

/**
 * Menú para pantallas estrechas.
 *
 * Sin esto, por debajo de 820 px la navbar esconde los enlaces y no queda forma
 * de ir a los servicios, la experiencia, el equipo o el contacto: el visitante
 * móvil solo podía bajar hasta el final de la página.
 *
 * Va en un componente aparte para no convertir la navbar entera en cliente: la
 * navbar es un Server Component porque lee los ajustes del sitio.
 *
 * Detalles que importan:
 * - Las tres líneas rotan hasta formar una X. No desaparecen de golpe, que es lo
 *   que hace que parezca un fallo.
 * - Escape cierra, y el foco entra en el menú al abrir. Sin eso el teclado se
 *   queda detrás del menú y no se puede navegar.
 * - Al abrir se bloquea el scroll del fondo, que si no sigue moviéndose.
 */
export function MobileMenu({ items }: MenuToggleProps) {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setAbierto(false);
    }

    document.addEventListener("keydown", onKeyDown);

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const primero = document.querySelector<HTMLElement>(".navbar__drawer a");
    primero?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [abierto]);

  return (
    <>
      <button
        className={`navbar__burger${abierto ? " is-open" : ""}`}
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label={abierto ? "Cerrar el menú" : "Abrir el menú"}
      >
        <span aria-hidden="true" className="navbar__burger-line" />
        <span aria-hidden="true" className="navbar__burger-line" />
        <span aria-hidden="true" className="navbar__burger-line" />
      </button>

      {abierto ? (
        <>
          <div
            className="navbar__overlay"
            onClick={() => setAbierto(false)}
            aria-hidden="true"
          />

          <nav className="navbar__drawer" id="menu-movil" aria-label="Menú">
            <ul className="navbar__drawer-list">
              {items.map((item, index) => (
                <li key={item.href} style={{ transitionDelay: `${index * 45}ms` }}>
                  <a href={item.href} onClick={() => setAbierto(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </>
      ) : null}
    </>
  );
}
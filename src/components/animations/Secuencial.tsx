"use client";

import { useEffect, useRef } from "react";

import type { ReactNode } from "react";

type SecuencialProps = {
  children: ReactNode;
  /** Retardo entre cada hijo, en segundos. */
  stagger?: number;
  /** Desplazamiento inicial en píxeles. */
  distance?: number;
  className?: string;
};

/**
 * Entrada escalonada: los hijos directos aparecen uno detrás de otro, en orden,
 * al entrar en pantalla. Usa `gsap.from` con `stagger`, que hace el trabajo en
 * un único tween en lugar de crear uno por hijo.
 *
 * `gsap.set` deja los hijos en su sitio final antes de que GSAP los anime: si
 * no, el navegador pinta el contenido ya visible y luego salta hacia atrás,
 * que es el parpadeo típico de estas animaciones.
 */
export function Secuencial({
  children,
  stagger = 0.08,
  distance = 28,
  className
}: SecuencialProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let context: { revert: () => void } | undefined;

    async function init() {
      // El await corta el estrechamiento de tipo del `if (!root)` de fuera.
      const scope = rootRef.current;
      if (!scope) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger")
      ]);

      gsap.registerPlugin(ScrollTrigger);

      const items = scope.querySelectorAll(":scope > *");
      if (!items.length) return;

      context = gsap.context(() => {
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: distance },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger,
            scrollTrigger: {
              trigger: scope,
              start: "top 82%",
              once: true
            }
          }
        );
      }, scope);
    }

    void init();

    return () => {
      context?.revert();
    };
  }, [stagger, distance]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
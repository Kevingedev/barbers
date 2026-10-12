"use client";

import { useEffect, useRef } from "react";

/**
 * Entradas al hacer scroll para todo lo que no sea el paseo.
 *
 * El paseo va con su propio motor (GSAP sin ScrollTrigger, porque el escenario
 * es `sticky` y no está pineado), así que aquí solo se cubren las secciones de
 * debajo.
 *
 * GSAP se importa de forma diferida dentro del efecto para que no entre en el
 * bundle inicial, y el trigger usa `once` para morir en cuanto ha disparado:
 * menos trabajo por frame en la parte de la página que ya se ha visto.
 */
export function Reveal({ children }: { children: React.ReactNode }) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let context: { revert: () => void } | undefined;

    async function initReveal() {
      // El await corta el estrechamiento de tipo que hizo el `if (!element)`
      // de fuera, así que se comprueba otra vez aquí.
      const target = elementRef.current;
      if (!target) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger")
      ]);

      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        gsap.fromTo(
          target,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: target,
              start: "top 85%",
              once: true
            }
          }
        );
      }, target);
    }

    void initReveal();

    return () => {
      context?.revert();
    };
  }, []);

  return <div ref={elementRef}>{children}</div>;
}
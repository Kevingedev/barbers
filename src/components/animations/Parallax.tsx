"use client";

import { useEffect, useRef } from "react";

import type { ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  /**
   * Cuánto se desplaza respecto al scroll, como fracción del alto del
   * elemento. 0 es fijo, 0,3 es un recorrido suave. Negativo va al revés.
   */
  speed?: number;
  className?: string;
};

/**
 * Desplazamiento en profundidad: el contenido se mueve más despacio que la
 * página, lo que da sensación de profundidad al hacer scroll.
 *
 * Solo anima `transform` y se actualiza con el ticker de GSAP (que ya corre a
 * 60 fps), nunca con un listener de scroll propio: un segundo lector de scroll
 * en el mismo hilo es de donde salen los tirones.
 */
export function Parallax({ children, speed = 0.2, className }: ParallaxProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    // Sin movimiento no se monta nada, y se respeta la preferencia del sistema.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let context: { revert: () => void } | undefined;

    async function init() {
      // El await corta el estrechamiento de tipo del `if (!outer)` de fuera.
      const scope = outerRef.current;
      const target = innerRef.current;
      if (!scope || !target) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger")
      ]);

      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        gsap.fromTo(
          target,
          { yPercent: -speed * 100 },
          {
            yPercent: speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger: scope,
              start: "top bottom",
              end: "bottom top",
              // `scrub` engancha el progreso al scroll: el elemento siempre
              // está donde le corresponde.
              scrub: 0.6,
              invalidateOnRefresh: true
            }
          }
        );
      }, scope);
    }

    void init();

    return () => {
      context?.revert();
    };
  }, [speed]);

  return (
    <div ref={outerRef} className={className ?? "parallax"}>
      <div ref={innerRef} className="parallax__inner">
        {children}
      </div>
    </div>
  );
}
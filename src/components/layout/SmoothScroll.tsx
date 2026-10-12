"use client";

import { useEffect } from "react";

/**
 * Scroll suave para toda la web.
 *
 * Antes vivía dentro del paseo, así que al salir de esa sección el scroll
 * volvía a ser nativo de golpe y se notaba el cambio. Aquí es global: el mismo
 * interpolado de principio a fin.
 *
 * GSAP y Lenis se importan de forma diferida: los necesita el usuario en
 * cuanto empieza a hacer scroll, pero meterlos en el bundle inicial empuja el
 * LCP.
 */
export function SmoothScroll() {
  useEffect(() => {
    // En StrictMode este efecto se monta dos veces. Los imports son asíncronos,
    // así que sin este flag la primera instancia se crearía después del cleanup
    // y se quedaría viva: dos Lenis peleándose por el scroll.
    let cancelled = false;
    let dispose: (() => void) | undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    void Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;

        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
          autoRaf: false,
          anchors: { offset: 0, duration: 1.1 },
          lerp: 0.11,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.5,
          syncTouch: true,
          infinite: false
        });

        const onScroll = () => ScrollTrigger.update();
        const raf = (time: number) => lenis.raf(time * 1000);

        lenis.on("scroll", onScroll);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        document.documentElement.classList.add("has-lenis");

        // El alto del documento cambia al cargar imágenes y fuentes. El refresco
        // global de triggers solo se hace en esas dos ocasiones: un
        // ResizeObserver sobre `documentElement` se dispara también con los
        // cambios internos de la página (el texto de una parada, el alto de un
        // póster) y cada refresco rehace todos los triggers, que es justo lo
        // que Provoca los picos de frame.
        const refresh = () => ScrollTrigger.refresh();
        const onLoad = () => refresh();
        window.addEventListener("load", onLoad);
        document.fonts?.ready.then(refresh);

        dispose = () => {
          window.removeEventListener("load", onLoad);
          gsap.ticker.remove(raf);
          lenis.off("scroll", onScroll);
          lenis.destroy();
          document.documentElement.classList.remove("has-lenis");
        };
      }
    );

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return null;
}
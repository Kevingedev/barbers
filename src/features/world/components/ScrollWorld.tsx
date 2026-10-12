"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { paseo } from "@/config/paseo";
import { SITE_NAME } from "@/config/site";
import { getMessages } from "@/messages";
import { BookingCta } from "@/features/booking/components/BookingCta";
import { Stop } from "@/features/world/components/Stop";
import { initWorld } from "@/features/world/lib/world";

const { paradas } = paseo;
const t = getMessages();

type ScrollWorldProps = {
  /** Viene de `site_settings`. Decide si el CTA abre el flujo guiado o WhatsApp. */
  bookingEnabled: boolean;
};

/**
 * Paseo por la barbería: la portada es un recorrido que avanza y retrocede con
 * el scroll. Cada parada tiene su clip, que va de ella a la siguiente.
 *
 * El escenario es `sticky` a pantalla completa y las paradas van encima, cada una
 * de dos pantallas de alto, así que el scroll natural es el que mueve el paseo.
 * No hay pinning de ScrollTrigger: el motor solo lee la posición.
 */
export function ScrollWorld({ bookingEnabled }: ScrollWorldProps) {
  const worldRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const world = worldRef.current;
    if (!world) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // El motor y el scroll suave se montan asíncronos, así que el efecto puede
    // limpiarse antes de que lleguen. Sin este flag, el motor se crearía
    // después del cleanup y se quedaría escuchando scrolls para siempre.
    let cancelled = false;
    let teardown: (() => void) | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        teardown = initWorld(world, reduceMotion, gsap, ScrollTrigger);
      }
    );

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  const entrada = paradas[0];
  const silla = paradas[1];

  return (
    <section id="recorrido" ref={worldRef} data-world className="world" aria-label={t.world.label}>
      {/* Escenario fijo: los clips del paseo ocupan toda la pantalla. Debajo, el
          primer fotograma de cada clip, con el mismo encuadre, para que el vídeo
          entre sin que se note el cambio. */}
      <div data-stage className="world-stage">
        <div aria-hidden="true" className="world-media">
          {paradas.map((parada, i) => (
            <div
              key={`frame-${parada.id}`}
              data-frame
              className="world-frame"
              style={i === 0 ? undefined : { opacity: 0 }}
            >
              <Image
                src={parada.poster}
                alt=""
                fill
                sizes="100vw"
                priority={i === 0}
                className="world-frame__img"
              />
            </div>
          ))}

          <div className="world-clips">
            {paradas.map((parada, i) =>
              parada.clip ? (
                <video
                  key={`clip-${parada.id}`}
                  data-clip
                  data-src={parada.clip}
                  data-segment={i}
                  className="world-clip"
                  muted
                  playsInline
                  preload="none"
                  disablePictureInPicture
                  tabIndex={-1}
                />
              ) : null
            )}
          </div>
        </div>

        {/* Velos para leer el texto encima del vídeo. */}
        <div aria-hidden="true" className="world-veil world-veil--top" />
        <div aria-hidden="true" className="world-veil world-veil--stage" />
        <div aria-hidden="true" className="world-veil world-veil--bottom" />

        {/* Raíl de paradas. */}
        <nav aria-label={t.world.railLabel} className="world-rail">
          <ol className="world-rail__list">
            <span aria-hidden="true" className="world-rail__line">
              <span data-rail-fill className="world-rail__fill" />
            </span>
            {paradas.map((parada, i) => (
              <li key={`rail-${parada.id}`}>
                <a
                  href={`#${parada.id}`}
                  data-goto
                  aria-current={i === 0 ? "true" : "false"}
                  className="world-rail__link"
                >
                  <span className="world-rail__label">{parada.lugar}</span>
                  <span className="world-rail__dot" />
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <p data-hint aria-hidden="true" className="world-hint">
          {t.world.hint}
          <span className="world-hint__line" />
        </p>
      </div>

      {/* Paradas: cada una deja su texto abajo a la izquierda mientras el paseo avanza. */}
      <div className="world-stops">
        <Stop
          index={0}
          total={paradas.length}
          id={entrada.id}
          lugar={entrada.lugar}
          focus={entrada.focus}
        >
          <h1 className="world-stop__title">
            {/* Los dos `span` son de bloque (el CSS los pone en líneas
                separadas), pero el texto plano se leería pegado: "BilbaoEjemplo".
                El salto explícito lo separa también para lectores de pantalla y
                para los buscadores, que leen el contenido como texto. */}
            <span className="world-stop__kicker">
              {t.hero.eyebrow}
              <br />
            </span>
            <span className="world-stop__brand">{SITE_NAME}</span>
          </h1>
          <p className="world-stop__copy">{t.hero.copy}</p>
          <div className="world-stop__actions">
            <BookingCta bookingEnabled={bookingEnabled} />
          </div>
          <ul className="world-stop__pills" aria-label={t.world.label}>
            {t.world.pills.map((pill) => (
              <li key={pill} className="world-pill">
                {pill}
              </li>
            ))}
          </ul>
        </Stop>

        <Stop
          index={1}
          total={paradas.length}
          id={silla.id}
          lugar={silla.lugar}
          focus={silla.focus}
          compact={!silla.clip}
          eyebrow={t.world.oficio.eyebrow}
        >
          <h2 className="world-stop__heading">{t.world.oficio.title}</h2>
          <p className="world-stop__copy">{t.world.oficio.copy}</p>
        </Stop>
      </div>
    </section>
  );
}
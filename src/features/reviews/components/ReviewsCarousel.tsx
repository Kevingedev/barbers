"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { REVIEWS } from "@/features/reviews/data/reviews";

const AUTO_MS = 6500;

/**
 * Carrusel de reseñas.
 *
 * Avanza solo, se puede parar con el puntero o al tabular dentro (nadie lee una
 * reseña que se le mueve mientras la lee), y tiene botones y teclas de flecha
 * para ir a una concreta. `aria-live` avisa a quien usa lector de pantalla de
 * que el contenido ha cambiado.
 */
export function ReviewsCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLUListElement>(null);

  const total = REVIEWS.length;

  const go = useCallback(
    (next: number) => {
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  // Autoplay. Se reinicia al cambiar de posición para que el tiempo de lectura
  // no dependa de lo rápido que se pulse antes.
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => go(index + 1), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, go]);

  // Al pulsar las flechas el carrusel salta varias tarjetas de golpe: se lleva
  // el foco al artículo visible para que quien navega con teclado no se quede
  // leyendo una tarjeta que ya no está delante.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
      focusCurrent();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
      focusCurrent();
    }
  };

  const focusCurrent = () => {
    window.requestAnimationFrame(() => {
      const track = trackRef.current;
      const active = track?.children[index] as HTMLElement | undefined;
      active?.focus({ preventScroll: true });
    });
  };

  return (
    <div
      className="reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onKeyDown={onKeyDown}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Reseñas de clientes"
      tabIndex={0}
    >
      <ul className="reviews__track" ref={trackRef} aria-live="polite">
        {REVIEWS.map((review, i) => (
          <li
            key={review.id}
            className="reviews__item"
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
          >
            <figure className="review-card">
              <div
                className="review-card__stars"
                role="img"
                aria-label={`${review.rating} de 5 estrellas`}
              >
                <span aria-hidden="true">{"★".repeat(review.rating)}</span>
              </div>
              <blockquote className="review-card__text">{review.text}</blockquote>
              <figcaption className="review-card__footer">
                <span className="review-card__author">{review.author}</span>
                <span className="review-card__meta">{review.service}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="reviews__controls">
        <button
          type="button"
          className="reviews__arrow"
          onClick={() => go(index - 1)}
          aria-label="Reseña anterior"
        >
          <span aria-hidden="true">←</span>
        </button>

        <div className="reviews__dots">
          {REVIEWS.map((review, i) => (
            <button
              key={review.id}
              type="button"
              className="reviews__dot"
              onClick={() => go(i)}
              aria-label={`Ir a la reseña ${i + 1} de ${total}`}
              aria-current={i === index ? "true" : undefined}
            />
          ))}
        </div>

        <button
          type="button"
          className="reviews__arrow"
          onClick={() => go(index + 1)}
          aria-label="Reseña siguiente"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
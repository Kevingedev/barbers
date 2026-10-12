import type { ReactNode } from "react";

type StopProps = {
  index: number;
  /** Total de paradas, para el contador `01 / 02`. */
  total: number;
  id: string;
  lugar: string;
  /** Punto horizontal del vídeo (0 a 100) que queda a la vista en móvil. */
  focus: number;
  /**
   * Última parada sin clip detrás: no hay tramo que recorrer, así que se
   * acorta para no dejar scroll muerto con la imagen parada.
   */
  compact?: boolean;
  /**
   * Sin eyebrow, la parada lo pone dentro de su propio titular. La entrada lo
   * mete dentro del h1 para que el titular principal diga qué es y dónde está.
   */
  eyebrow?: string;
  children: ReactNode;
};

/**
 * Una parada del paseo. El artículo marca la distancia de scroll; el texto se
 * queda abajo a la izquierda mientras la cámara avanza y sale empujado por la
 * parada siguiente.
 */
export function Stop({
  index,
  total,
  id,
  lugar,
  focus,
  compact,
  eyebrow,
  children
}: StopProps) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const className = compact ? "world-stop world-stop--compact" : "world-stop";

  return (
    <article id={id} data-stop data-focus={focus} className={className}>
      <div className="world-stop__body">
        <p className="world-stop__counter">
          <span className="tabular-nums">
            {pad(index + 1)} / {pad(total)}
          </span>
          <span aria-hidden="true" className="world-stop__dot" />
          <span>{lugar}</span>
        </p>
        {eyebrow ? <p className="world-stop__eyebrow">{eyebrow}</p> : null}
        {children}
      </div>
    </article>
  );
}
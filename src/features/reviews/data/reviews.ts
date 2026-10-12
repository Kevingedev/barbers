/**
 * Reseñas de clientes para el carrusel.
 *
 * IMPORTANTE: son TEXTO DE EJEMPLO para maquetar la sección. Publicarlas como
 * si fueran reales es mentirle al visitante y, además, es ilegal en varios
 * países (leyes de prácticas de comparación engañosas). Antes de publicar:
 * pide permiso a cada cliente y sustituye estos textos por los suyos.
 *
 * Los campos que deben conservarse son los del tipo, que son los que usa el
 * carrusel y el schema.org.
 */
export type Review = {
  id: string;
  /** Nombre que se muestra. Si el cliente prefiere anonimato, usa solo la inicial. */
  author: string;
  /** Valoración de 1 a 5. */
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** Mes y año de la reseña, para mostrar "hace 3 meses". */
  date: string;
  service: string;
};

export const REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Marina G.",
    rating: 5,
    text: "El corte perfecto y el trato, impecable. Salí de ahí sintiéndome de diez.",
    date: "2026-09",
    service: "Corte + Barba"
  },
  {
    id: "r2",
    author: "Iker L.",
    rating: 5,
    text: "Adrián es un profesional de verdad. Explica lo que va haciendo y el resultado es luego.",
    date: "2026-08",
    service: "Corte clásico"
  },
  {
    id: "r3",
    author: "Ane M.",
    rating: 4,
    text: "Sitio tranquilo, buena música y muy buen afeitado. Repetiré seguro.",
    date: "2026-07",
    service: "Afeitado con navaja"
  },
  {
    id: "r4",
    author: "Dani P.",
    rating: 5,
    text: "El ritual de barba es lo mejor que me han hecho. Cero prisa y muy buen detalle.",
    date: "2026-06",
    service: "Ritual de barba"
  },
  {
    id: "r5",
    author: "Uxue R.",
    rating: 5,
    text: "Llevé a mi padre y salimos los dos muy conformes con el corte.",
    date: "2026-05",
    service: "Caballero sénior"
  }
];
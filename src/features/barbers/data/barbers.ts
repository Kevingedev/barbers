import type { Barber } from "@/types";

/**
 * El equipo. Ahora mismo hay una sola persona: el layout se adapta al número
 * real de barberos, así que añadir más adelante es solo ampliar el array.
 */
export const BARBERS: Barber[] = [
  {
    id: "adrian-montero",
    name: "Adrián Montero",
    role: "Maestro barbero · Propietario",
    description:
      "Te adjunta a la tradición: veterano de la navaja y del corte clásico, con más de catorce años frente a la silla.",
    specialties: ["Corte clásico", "Navaja", "Educación de estilo"],
    yearsExperience: 14
  }
];
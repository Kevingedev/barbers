import type { Service } from "@/types";

export const SERVICES: Service[] = [
  {
    id: "corte-clasico",
    name: "Corte Clásico",
    description: "Tijera y navaja según tu estructura facial. Acabado preciso, sin estridencias.",
    durationMinutes: 30,
    price: 25
  },
  {
    id: "corte-barba",
    name: "Corte + Barba",
    description: "El servicio estrella: corte completo y alineado de barba con navaja.",
    durationMinutes: 45,
    price: 38
  },
  {
    id: "afeitado-navaja",
    name: "Afeitado con Navaja",
    description: "Toalla caliente, espuma artesanal y navaja de afeitado tradicional.",
    durationMinutes: 25,
    price: 22
  },
  {
    id: "ritual-barba",
    name: "Ritual de Barba",
    description: "Hidratación, masaje facial y perfilado con toalla caliente. Relajante completo.",
    durationMinutes: 40,
    price: 32
  },
  {
    id: "caballero-senior",
    name: "Caballero Sénior",
    description: "Corte, arreglo de patillas y afeitado de contorno para un resultado impecable.",
    durationMinutes: 35,
    price: 28
  },
  {
    id: "arreglo-barba",
    name: "Arreglo de Barba",
    description: "Rápido y preciso: perfilado, alineado y sellado de la barba.",
    durationMinutes: 20,
    price: 15
  }
];
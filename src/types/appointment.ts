export type Appointment = {
  barberId: string;
  serviceId: string;
  startsAt: string;
  customerName: string;
  customerPhone: string;
};

export type BookingStep = "barber" | "service" | "datetime" | "confirmation";
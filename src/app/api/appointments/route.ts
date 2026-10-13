import { NextResponse } from "next/server";

import { createAppointment, listServices } from "@/lib/data";
import { validateWebAppointment } from "@/features/back/lib/validateWebAppointment";

/**
 * Alta de cita desde la web pública.
 *
 * Es la ruta que convierte el formulario de `/reservar` en algo de verdad: en
 * modo `static` devuelve 503 y el flujo sigue saliendo por WhatsApp, que es lo
 * que hace ahora. En modo `full` guarda la cita como `pending` y el barbero la
 * acepta desde el panel.
 *
 * La validación se repite aquí aunque el navegador ya la hiciera: es un endpoint
 * público y no se fía de quien llama.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  }

  const parsed = validateWebAppointment(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const services = await listServices(true);
  const service = services.find((s) => s.id === parsed.data.serviceId);

  const result = await createAppointment({
    customerName: parsed.data.customerName,
    customerPhone: parsed.data.customerPhone,
    serviceId: parsed.data.serviceId,
    barberId: parsed.data.barberId,
    startsAt: parsed.data.startsAt,
    durationMinutes: service?.durationMinutes ?? 30,
    notes: "",
    source: "web"
  });

  if (!result.ok) {
    // 409 cuando el conflicto es de horario, que el cliente puede entender y
    //invitar a elegir otra hora.
    const conflict = /ya tiene una cita/.test(result.error);
    return NextResponse.json({ error: result.error }, { status: conflict ? 409 : 503 });
  }

  return NextResponse.json({ ok: true, id: result.id }, { status: 201 });
}
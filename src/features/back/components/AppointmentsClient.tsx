"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteAction, setStatusAction } from "@/app/back/actions";
import { AppointmentsList } from "@/features/back/components/AppointmentsList";

import type { AppointmentDetail, AppointmentStatus } from "@/lib/domain/types";

/**
 * Listado de citas con los botones de acción.
 *
 * Es un componente de cliente solo porque las acciones necesitan feedback
 * inmediato. Los datos vienen del servidor y llegan ya resueltos.
 */
export function AppointmentsClient({ appointments }: { appointments: AppointmentDetail[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (action: () => Promise<{ ok: true } | { ok: false; error: string }>) => {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) setError(result.error);
      else {
        setError(null);
        router.refresh();
      }
    });
  };

  const onStatus = (id: string, status: AppointmentStatus) =>
    run(() => setStatusAction(id, status));

  const onDelete = (id: string) => {
    // Borrar no tiene vuelta atrás: se pregunta.
    if (!window.confirm("¿Borrar esta cita? No se puede deshacer.")) return;
    run(() => deleteAction(id));
  };

  return (
    <>
      {error ? (
        <p className="back-alert" role="alert">
          {error}
        </p>
      ) : null}

      {pending ? <p className="back-hint">Guardando…</p> : null}

      <AppointmentsList appointments={appointments} onStatus={onStatus} onDelete={onDelete} />
    </>
  );
}
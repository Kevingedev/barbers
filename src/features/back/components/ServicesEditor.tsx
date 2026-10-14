"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";

import { deleteServiceAction, saveServiceAction } from "@/app/(back)/back/actions";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/features/back/components/ConfirmDialog";

import type { ServiceFormState } from "@/app/(back)/back/actions";
import type { ServiceRow } from "@/lib/domain/types";

const initialState: ServiceFormState = {};

/**
 * Servicios: lista con botones, y los formularios en ventanas modales.
 *
 * Los formularios NO están en la página: antes estaban siempre visibles y al
 * pulsar "Editar" no se rellenaban con los datos del servicio, porque el
 * formulario no se volvía a montar. Aquí cada modal nace con sus valores.
 */
export function ServicesEditor({ services }: { services: ServiceRow[] }) {
  const router = useRouter();
  const [editando, setEditando] = useState<ServiceRow | null>(null);
  const [creando, setCreando] = useState(false);
  const [borrando, setBorrando] = useState<ServiceRow | null>(null);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function confirmarBorrado() {
    if (!borrando) return;
    const objetivo = borrando;
    setBorrando(null);

    startTransition(async () => {
      const result = await deleteServiceAction(objetivo.id);
      if (!result.ok) setDeleteError(result.error);
      else {
        setDeleteError(null);
        router.refresh();
      }
    });
  }

  return (
    <div className="back-stack">
      <section>
        <ul className="back-list">
          {services.map((service) => (
            <li key={service.id} className={`back-list__item${service.active ? "" : " is-off"}`}>
              <div>
                <p className="back-list__title">
                  {service.name}
                  {!service.active ? (
                    <span className="back-badge back-badge--muted">Oculto</span>
                  ) : null}
                </p>
                <p className="back-list__meta">
                  {service.price} € · {service.durationMinutes} min
                </p>
              </div>

              <div className="back-list__actions">
                <button
                  className="back-button"
                  type="button"
                  onClick={() => {
                    setDeleteError(null);
                    setEditando(service);
                  }}
                >
                  Editar
                </button>
                <button
                  className="back-button back-button--danger"
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    setDeleteError(null);
                    setBorrando(service);
                  }}
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>

        {deleteError ? (
          <p className="back-alert" role="alert">
            {deleteError}
          </p>
        ) : null}

        <button className="primary-button back-nuevo" type="button" onClick={() => setCreando(true)}>
          Nuevo servicio
        </button>
      </section>

      {/* Cada modal tiene su propia `key`: al cambiar de servicio a otro, React
          lo remonta y el formulario se rellena con los valores nuevos. */}
      <ServiceFormModal
        key={editando?.id ?? "nuevo"}
        open={creando || editando !== null}
        servicio={editando}
        onClose={() => {
          setCreando(false);
          setEditando(null);
        }}
      />

      <ConfirmDialog
        open={borrando !== null}
        titulo={`Borrar "${borrando?.name ?? ""}"`}
        descripcion="Esta acción no se puede deshacer. Si el servicio tiene citas, el borrado fallará: en ese caso desmarca la casilla de visible en lugar de borrarlo."
        dangerLabel="Borrar"
        onConfirm={confirmarBorrado}
        onCancel={() => setBorrando(null)}
      />
    </div>
  );
}

function ServiceFormModal({
  open,
  servicio,
  onClose
}: {
  open: boolean;
  servicio: ServiceRow | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(saveServiceAction, initialState);

  // Al guardar bien, el modal se cierra solo. Antes se quedaba abierto con el
  // mensaje de éxito y había que cerrarlo a mano.
  useEffect(() => {
    if (state.ok) {
      onClose();
      router.refresh();
    }
  }, [state.ok, onClose, router]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={servicio ? `Editar: ${servicio.name}` : "Nuevo servicio"}
      description={
        servicio
          ? undefined
          : "Los cambios salen en la web en cuanto se guarda."
      }
    >
      <form action={formAction} className="back-form">
        {servicio ? <input type="hidden" name="id" value={servicio.id} /> : null}

        <div className="back-form__grid">
          <div className="field">
            <label className="field__label" htmlFor="name">
              Nombre
            </label>
            <input
              className="field__input"
              id="name"
              name="name"
              required
              defaultValue={servicio?.name ?? ""}
              placeholder="Corte clásico"
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="price">
              Precio (€)
            </label>
            <input
              className="field__input"
              id="price"
              name="price"
              type="number"
              step="0.50"
              min="0"
              required
              defaultValue={servicio?.price ?? ""}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="durationMinutes">
              Duración (min)
            </label>
            <input
              className="field__input"
              id="durationMinutes"
              name="durationMinutes"
              type="number"
              min="5"
              step="5"
              required
              defaultValue={servicio?.durationMinutes ?? 30}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="sortOrder">
              Orden
            </label>
            <input
              className="field__input"
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={servicio?.sortOrder ?? 0}
            />
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="description">
            Descripción
          </label>
          <textarea
            className="field__input field__input--textarea"
            id="description"
            name="description"
            rows={2}
            defaultValue={servicio?.description ?? ""}
          />
        </div>

        <label className="back-checkbox">
          <input type="checkbox" name="active" defaultChecked={servicio?.active ?? true} />
          <span>Visible en la web</span>
        </label>

        {state.error ? (
          <p className="back-alert" role="alert">
            {state.error}
          </p>
        ) : null}

        <div className="back-form__actions">
          <button className="back-button" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="primary-button" type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
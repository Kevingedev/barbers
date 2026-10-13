"use client";

import { useActionState, useState, useTransition } from "react";

import { deleteServiceAction, saveServiceAction } from "@/app/back/actions";

import type { ServiceFormState } from "@/app/back/actions";
import type { ServiceRow } from "@/lib/domain/types";

const initialState: ServiceFormState = {};

/**
 * Alta y edición de servicios.
 *
 * Borrar está limitado a los que no tienen citas: los que las tienen se ocultan
 * con la casilla "activo", que es lo que se usa en una peluería de verdad. Si un
 * servicio tiene historia, desaparece del precio pero no de los registros.
 */
export function ServicesEditor({ services }: { services: ServiceRow[] }) {
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [pending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  return (
    <div className="back-stack">
      <section>
        <ul className="back-list">
          {services.map((service) => (
            <li key={service.id} className={`back-list__item${service.active ? "" : " is-off"}`}>
              <div>
                <p className="back-list__title">
                  {service.name}
                  {!service.active ? <span className="back-badge back-badge--muted">Oculto</span> : null}
                </p>
                <p className="back-list__meta">
                  {service.price} € · {service.durationMinutes} min
                </p>
              </div>

              <div className="back-list__actions">
                <button
                  className="back-button"
                  type="button"
                  onClick={() => setEditing(service)}
                >
                  Editar
                </button>
                <button
                  className="back-button back-button--danger"
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    if (!window.confirm(`¿Borrar "${service.name}"?`)) return;
                    startTransition(async () => {
                      const result = await deleteServiceAction(service.id);
                      setDeleteError(result.ok ? null : result.error);
                    });
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
      </section>

      <ServiceForm key={editing?.id ?? "new"} editing={editing} onDone={() => setEditing(null)} />
    </div>
  );
}

function ServiceForm({ editing, onDone }: { editing: ServiceRow | null; onDone: () => void }) {
  const [state, formAction, pending] = useActionState(saveServiceAction, initialState);

  return (
    <section>
      <h2 className="back-title">{editing ? `Editar: ${editing.name}` : "Nuevo servicio"}</h2>

      <form action={formAction} className="back-form">
        {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

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
              defaultValue={editing?.name ?? ""}
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
              defaultValue={editing?.price ?? ""}
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
              defaultValue={editing?.durationMinutes ?? 30}
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
              defaultValue={editing?.sortOrder ?? 0}
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
            defaultValue={editing?.description ?? ""}
          />
        </div>

        <label className="back-checkbox">
          <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} />
          <span>Visible en la web</span>
        </label>

        {state.error ? (
          <p className="back-alert" role="alert">
            {state.error}
          </p>
        ) : null}

        <div className="back-form__actions">
          <button className="primary-button" type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Guardar"}
          </button>
          {editing ? (
            <button className="back-button" type="button" onClick={onDone}>
              Cancelar
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
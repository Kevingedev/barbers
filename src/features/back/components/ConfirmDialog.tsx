"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/Modal";

/**
 * Confirmación antes de borrar.
 *
 * Borrar no tiene vuelta atrás, así que se pregunta. Se sustituye
 * `window.confirm` por dos razones: no se puede estilar, y en algunos
 * navegadores Android no aparece.
 *
 * Para borrados con texto que teclear:
 *
 *   <ConfirmDialog
 *     open={borrar !== null}
 *     titulo="Borrar el servicio"
 *     descripcion="..."
 *     fraseDeConfirmacion="BORRAR"
 *     onConfirm={...}
 *   />
 */
type ConfirmDialogProps = {
  open: boolean;
  titulo: string;
  descripcion: string;
  confirmLabel?: string;
  dangerLabel?: string;
  /**
   * Si se indica, el botón de confirmar no se activa hasta que se escribe este
   * texto. Para lo que no se puede deshacer.
   */
  fraseDeConfirmacion?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  titulo,
  descripcion,
  confirmLabel,
  dangerLabel,
  fraseDeConfirmacion,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const [escrito, setEscrito] = useState("");

  // Al reabrir se limpia lo tecleado: si se cancela y se vuelve a abrir, no
  // puede quedar la palabra puesta y confirmar de un clic.
  useEffect(() => {
    if (open) setEscrito("");
  }, [open]);

  const listo = !fraseDeConfirmacion || escrito.trim().toUpperCase() === fraseDeConfirmacion.toUpperCase();

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={titulo}
      confirmLabel={confirmLabel ?? dangerLabel ?? "Borrar"}
      confirmDisabled={!listo}
      onConfirm={() => {
        if (listo) onConfirm();
      }}
    >
      <p className="modal__text">{descripcion}</p>

      {fraseDeConfirmacion ? (
        <div className="field">
          <label className="field__label" htmlFor="confirmacion">
            Escribe <strong>{fraseDeConfirmacion}</strong> para confirmar
          </label>
          <input
            className="field__input"
            id="confirmacion"
            value={escrito}
            onChange={(event) => setEscrito(event.target.value)}
            autoComplete="off"
          />
        </div>
      ) : null}
    </Modal>
  );
}
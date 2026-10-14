"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Etiqueta del botón de confirmar. */
  confirmLabel?: string;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
};

/**
 * Ventana modal.
 *
 * Se monta en un `portal` al final del `body` para que quede por encima de
 * todo, esté donde esté en el DOM.
 *
 * Lo importante de accesibilidad:
 * - Se cierra con Escape, que es lo que espera cualquiera.
 * - El foco entra en la ventana al abrir y vuelve al botón que la abrió al
 *   cerrar, para que quien navega con teclado no se quede perdido.
 * - Un `role="dialog"` con `aria-modal`, y el fondo no se puede pulsar.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  confirmLabel,
  onConfirm,
  confirmDisabled
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // El elemento que tenía el foco antes de abrir, para devolvérselo.
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // El foco entra en la ventana: si no, quien navega con teclado se queda en
    // la página de detrás y no se entera de que hay un formulario delante.
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    focusables?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    // Se bloquea el scroll del fondo: si no, la página de detrás sigue moviéndose
    // mientras el modal está abierto.
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previousFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={panelRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button
            className="modal__close"
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {description ? <p className="modal__description">{description}</p> : null}

        <div className="modal__body">{children}</div>

        {onConfirm ? (
          <footer className="modal__footer">
            <button className="back-button" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={onConfirm}
              disabled={confirmDisabled}
            >
              {confirmLabel ?? "Guardar"}
            </button>
          </footer>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
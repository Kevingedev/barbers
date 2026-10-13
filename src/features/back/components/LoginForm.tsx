"use client";

import { useActionState } from "react";

import { login } from "@/app/back/login/actions";

import type { LoginState } from "@/app/back/login/actions";

const initialState: LoginState = {};

/**
 * Formulario de entrada. Usa `useActionState` para que el error del servidor
 * aparezca sin recargar, y se autocompleta con el correo del barbero.
 */
export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="back-form">
      <div className="field">
        <label className="field__label" htmlFor="email">
          Correo
        </label>
        <input
          className="field__input"
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="password">
          Contraseña
        </label>
        <input
          className="field__input"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {state.error ? (
        <p className="back-alert" role="alert">
          {state.error}
        </p>
      ) : null}

      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
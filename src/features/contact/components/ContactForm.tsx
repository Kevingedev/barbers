"use client";

import { useState } from "react";

import { useLocale } from "@/hooks/useLocale";
import { WHATSAPP_PHONE } from "@/config/site";
import { generateWhatsAppUrl } from "@/lib/utils/generateWhatsAppUrl";
import { contactSchema } from "@/lib/validations/contact";

import type { ContactInput } from "@/lib/validations/contact";

type FieldErrors = Partial<Record<keyof ContactInput, string>>;

const INITIAL_VALUES = { name: "", phone: "", message: "" };

export function ContactForm() {
  const t = useLocale();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isReady, setIsReady] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = contactSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: FieldErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactInput;
        nextErrors[field] = issue.message;
      }

      setErrors(nextErrors);
      setIsReady(false);
      return;
    }

    const message = [
      `${result.data.name}${result.data.phone ? ` · ${result.data.phone}` : ""}`,
      "",
      result.data.message
    ].join("\n");

    const whatsappUrl = generateWhatsAppUrl({
      phone: WHATSAPP_PHONE,
      message
    });

    setErrors({});
    setIsReady(true);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  function updateField(field: keyof typeof INITIAL_VALUES, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span className="field__label">{t.contact.form.nameLabel}</span>
        <input
          className="field__input"
          type="text"
          autoComplete="name"
          placeholder={t.contact.form.namePlaceholder}
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
        {errors.name && <small className="field__error">{errors.name}</small>}
      </label>

      <label className="field">
        <span className="field__label">{t.contact.form.phoneLabel}</span>
        <input
          className="field__input"
          type="tel"
          autoComplete="tel"
          placeholder={t.contact.form.phonePlaceholder}
          value={values.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />
        {errors.phone && <small className="field__error">{errors.phone}</small>}
      </label>

      <label className="field">
        <span className="field__label">{t.contact.form.messageLabel}</span>
        <textarea
          className="field__input field__input--textarea"
          rows={4}
          placeholder={t.contact.form.messagePlaceholder}
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
        {errors.message && <small className="field__error">{errors.message}</small>}
      </label>

      <button className="primary-button" type="submit" disabled={!WHATSAPP_PHONE}>
        {t.contact.form.submit}
      </button>

      {isReady && <p className="form-success">{t.contact.form.success}</p>}
      {!WHATSAPP_PHONE && (
        <p className="form-success form-success--warning">
          Define NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER en tu entorno para activar el envío.
        </p>
      )}
    </form>
  );
}
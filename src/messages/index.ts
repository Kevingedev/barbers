import { DEFAULT_LANGUAGE } from "@/config/site";
import { messages as esMessages } from "@/messages/es";
import { messages as enMessages } from "@/messages/en";

export type Locale = "es" | "en";

export const LOCALES: Locale[] = ["es", "en"];

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

/**
 * Resolves the message catalog for the active locale.
 * Intended for Server Components: components render synchronously
 * using the global DEFAULT_LANGUAGE.
 */
export function getMessages(locale?: string) {
  const active: Locale = isLocale(locale) ? locale : DEFAULT_LANGUAGE;
  return active === "en" ? enMessages : esMessages;
}

export type Messages = ReturnType<typeof getMessages>;
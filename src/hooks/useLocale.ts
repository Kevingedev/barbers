"use client";

import { getMessages } from "@/messages";

/**
 * Returns the message catalog of the active locale for client components.
 * The site renders in Spanish by default; swapping DEFAULT_LANGUAGE
 * switches the whole catalog without touching component markup.
 */
export function useLocale() {
  return getMessages();
}
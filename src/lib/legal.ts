/**
 * Responsible person for the Impressum and Datenschutz pages.
 *
 * Injected at build time from env vars so the real name never lands in the
 * public GitHub source or its history — only on the live (access-gated)
 * page, where the law requires it. `vite.config.ts` fails a production build
 * when either value is missing, so the legal pages can't ship blank.
 */
export const LEGAL_NAME = import.meta.env.VITE_LEGAL_NAME
export const LEGAL_EMAIL = import.meta.env.VITE_LEGAL_EMAIL

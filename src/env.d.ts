/// <reference types="vite/client" />

// Build-time legal contact details. Values live outside the repo: in the
// Cloudflare Pages dashboard (Settings → Variables and Secrets) for deploys,
// and in a git-ignored `.env.local` for local dev. See `.env.example`.
interface ImportMetaEnv {
  readonly VITE_LEGAL_NAME: string
  readonly VITE_LEGAL_EMAIL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

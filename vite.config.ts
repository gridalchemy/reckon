import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Legal contact details are injected at build time (see src/lib/legal.ts).
// A production build without them would ship an empty Impressum, so fail
// loudly instead. Dev keeps running with blanks.
const REQUIRED_LEGAL_ENV = ['VITE_LEGAL_NAME', 'VITE_LEGAL_EMAIL'] as const

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd(), 'VITE_LEGAL_')
    const missing = REQUIRED_LEGAL_ENV.filter((key) => !env[key]?.trim())
    if (missing.length > 0) {
      throw new Error(
        `Missing ${missing.join(', ')}. Set them in Cloudflare Pages → Settings → Variables and Secrets, or in .env.local for local builds (see .env.example).`,
      )
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})

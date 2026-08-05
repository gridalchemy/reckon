# Reckon

A web-based design decision-logging tool. Solo build, 4-week sprint, portfolio piece.

## Stack

- **React 19 + Vite + TypeScript** (scaffolded with `npm create vite@latest`)
- **Tailwind v4** (CSS-first config in `src/styles/globals.css`, no `tailwind.config.js`)
- **shadcn/ui** — the `base-nova` style (shadcn v4's default; uses **Base UI** primitives, not Radix). Components live in `src/components/ui/` and are owned source, edit freely.
- **Lucide** icons
- **Fuse.js** for fuzzy search
- **idb** (IndexedDB wrapper) for local storage
- **Cloudflare Worker** proxies Anthropic API calls (`worker/` — not yet scaffolded; lands in Session 11 in mock mode, returning canned JSON. Live Anthropic calls flip on only once billing is set up — a deliberate deferral, not schedule-bound. Install the security-guidance plugin before any Worker code is written; the Worker's security requirements live in the compliance notes, the session slot in the build plan — they layer, they don't compete.)
- **Deploy:** Cloudflare Pages for the app, Cloudflare Workers for the proxy
- **Path alias:** `@/` → `src/` (configured in `tsconfig.json` + `vite.config.ts`). Always import as `@/components/ui/button`, never relative `../../../`.

## Core model

Entries have two states:
- **Sketch**: exploratory, mutable, low-commitment.
- **Decision**: locked-in, ceremonial, immutable once sealed.

Promotion from Sketch → Decision uses a wax-seal micro-interaction. This moment is intentional and should never feel automatic.

## The Reckoning

AI-generated synthesis across logged decisions. Observational, not Socratic. Surfaces patterns in prose suitable for retros or case studies. Never asks questions of the user.

**Manual trigger only in v0.1.** No background auto-generation, no schedulers. The only entry point is a button ("Reckon with this week" / "...month" / custom range).

## Design tokens

All colors, type, and radii live as CSS variables under `@theme` in `src/styles/globals.css`. The block is the **single source of truth** for the design system and mirrors Figma variables 1:1.

**Rules:**
- Never hardcode hex values in components. Always use Tailwind utility classes (`bg-bg-surface`, `text-text-secondary`, `border-border-default`).
- Two layers of tokens: **ramps** (`mulberry-50` through `mulberry-950`, same for `sanmarino-*` and `graychateau-*`) and **semantic aliases** (`bg-page`, `text-headline`, `action-primary`, `action-primary-hover`, etc.). Reach for semantic aliases first; only use raw ramp shades when no alias fits.
- Canonical token names and roles live in `docs/Variable_Inventory.md` — the Figma ↔ code naming contract. When in doubt about a name, that file wins.
- For ad-hoc opacity, use Tailwind's `/N` modifier (`text-secondary/80`, `bg-mulberry-600/10`) rather than introducing a new resolved hex.
- shadcn's variables (`--primary`, `--background`, etc.) are wired in `:root` to point at our semantic tokens, then exposed to Tailwind via `@theme inline`. So `bg-primary` resolves to `--color-action-primary`, `bg-background` resolves to `--color-bg-page`, and so on. When customizing a shadcn component, prefer our semantic names (`bg-action-primary-hover`) over the shadcn aliases when the intent is design-system-level.

## Accessibility

**Reckon targets WCAG AA minimum on all interactive states.**

- Hover and focus states must darken (use the next step in the color ramp, e.g. Mulberry 600 → Mulberry 700). **Never** use opacity-based lightening (`hover:bg-primary/80`) for primary affordances — many shadcn defaults ship this way and must be swapped on install. `--color-action-primary-hover` is the locked correct value for the primary CTA hover.
- For non-Mulberry surfaces, step one level deeper in the ramp rather than reducing opacity.
- Disabled states are exempt — for buttons, opacity 75% on the matching Default per Type (verified 3:1); surfaces and inputs use the designated `*-disabled` tokens instead. See `docs/Component_Conventions.md` § Disabled strategy.
- All focus states are accompanied by `--shadow-focus` (mulberry/600 at 30%, 3px spread).
- Verify contrast in Figma's contrast checker before locking new colors. Minimum: 4.5:1 for body text, 3:1 for large text and UI components.

## Type

- **Domine** for display/headlines and the wordmark (weight 700 loaded)
- **Space Grotesk** for body and UI (weights 300, 400, 500, 600, 700 loaded)
- **JetBrains Mono** for labels, timestamps, counts (weights 400, 500 loaded)

**Self-hosted** from `public/fonts/` via `@font-face` in `src/styles/globals.css` (all faces use `font-display: swap`). No requests to `fonts.googleapis.com` or `fonts.gstatic.com` at runtime — GDPR-clean, no visitor IP transfer to Google. Adding a new weight is a manual chore: download the `.woff2` from google-webfonts-helper, drop it in `public/fonts/`, add a matching `@font-face` block in `globals.css`, and update the "Available font weights" table in `docs/Variable_Inventory.md` in the same session.

The full type scale is locked in Figma: 18 text styles (Display, Heading, Body, Caption, Label, Mono families) documented with their Tailwind shorthands in `docs/Variable_Inventory.md` § Typography. Use those shorthands verbatim when implementing screens.

## Voice

Microcopy is flowing and design-anchored, never corporate. No "Submit" or "Are you sure?" energy.

Examples: sidebar CTA is "+ New Sketch", not "Create entry". Promotion label is "Lock in as decision".

EU/Germany context: footer must carry **Datenschutz** and **Impressum** links — these are real legal expectations under GDPR, not stylistic choices.

## Documentation contract

Reckon has three living documents plus this file. Each owns one thing; drift between them is a bug.

| File | Owns | Update when |
|---|---|---|
| `docs/Variable_Inventory.md` | Figma ↔ code token contract (names, values, text styles) | Any Figma variable / text style changes — same session |
| `src/styles/globals.css` | The code mirror of the inventory | Immediately after the inventory changes — same session, never later |
| `docs/Component_Conventions.md` | Naming, variants, states, exceptions log | A new convention or intentional exception is decided |
| `CLAUDE.md` (this file) | Product rules, stack, scope, voice | A locked decision changes or a rule here goes stale |

**Sync rules (enforce these — don't wait to be asked):**
- **Figma moves first, code mirrors.** A Variable_Inventory edit and its `globals.css` mirror land in the *same commit* whenever possible.
- **At the start of every code session**, before building anything: spot-check `globals.css` against `Variable_Inventory.md` (values *and* names). If they've drifted, flag it and run the mirror pass first — the playbook is: read the inventory, update `@theme`, grep `src/` for renamed utility consumers.
- **If any session changes a fact stated in this file** (token names, worker timing, scope, fonts), update this file in the same session and say so out loud.
- The foundation is **frozen** as of 2026-07-03: no new tokens, primitives, or conventions docs unless a screen under construction forces one.

## Scope discipline

**v0.1 =** home/today + sketch CRUD + lock-in + library + at least one working Reckoning + Demo Mode.

Anything else (sketch-to-prompt generation, multi-user, sync, dark mode, mobile, etc.) is v0.2+.

**Never-cut pillars** (these four *are* the product):
1. The capture flow (Sketch → Decision)
2. The Library
3. At least one working Reckoning
4. Demo Mode (15–20 pre-loaded sample entries — load-bearing for the portfolio audience)

If Week 3 is at risk, cut in this order: JSON export → Reckoning history → Recent by Project → Weekly activity strip → Fuzzy search.

## v0.2 candidates (parked, not cut)

Considered and intentionally deferred — these may land in v0.2 if v0.1 ships well. Distinct from "out of scope forever":

- Sketch-to-prompt generation (turn a Sketch into an LLM prompt skeleton)
- Auto / scheduled Reckoning generation (v0.1 is manual-trigger only by locked decision)
- Multi-user / shared workspaces
- Cloud sync across devices
- Dark mode
- Mobile / responsive layouts
- Richer entry media (images, attachments)
- Public sharing of individual Reckonings as read-only URLs
- Export beyond JSON (PDF, Markdown)
- Domain swap from `*.pages.dev` to a custom domain (`reckonapp.com` is taken; candidates are `reckon-design.com` / `reckonwebapp.com`, decision open)

If a request isn't here AND isn't in v0.1 scope, treat it as a fresh idea — surface it before scoping into the build.

## Conventions

- Functional components, hooks, no class components.
- Co-locate component + styles; one component per file.
- Types live in `src/types/` and are imported, not redefined.
- Date formatting via `date-fns`.
- Imports: use the `@/` alias for anything inside `src/`. Never `../../../`.
- shadcn components are owned source — edit `src/components/ui/*.tsx` directly when the default doesn't match Reckon's tokens or accessibility floor. The `npx shadcn add` command will re-fetch defaults; only run it for new components, not to "update" existing ones.

## Local development

```powershell
npm install        # first time only
npm run dev        # dev server on http://localhost:5173 with HMR
npm run build      # tsc -b && vite build → outputs to ./dist
npm run preview    # serve the built bundle locally to sanity-check production
npm run lint       # ESLint over src/
```

Production deploy is automatic: any push to `main` triggers a Cloudflare Pages build. Live preview: https://reckon-a5q.pages.dev (the `*.pages.dev` subdomain stays through v0.1; the custom-domain swap is a post-launch task).

# Reckon

A web-based decision-logging tool for designers. Capture the *thinking* behind your work, not just the outcome.

🌐 **Live:** https://reckon-a5q.pages.dev

## What it is

Designers' decision-making lives in their heads, Slack threads, and Figma comments. By the time it's needed for a case study, a retro, or a stakeholder defence, it's reconstructed from fragments. Notes apps are too flat. Figma plugins focus on artifacts. Notion templates demand a setup tax.

Reckon is a small, single-user, local-only web app that turns design decisions into a deliberate practice — fast to capture, slow to lock in, easy to look back on.

## The model

Entries have two states with a deliberate promotion moment:

- **Sketch** — exploration, captured fast (target: under 60 seconds).
- **Decision** — a Sketch that's been "locked in" with a ceremonial wax-seal micro-interaction.

Once you've logged a stretch of decisions, **The Reckoning** synthesizes them into observational prose — patterns across the week or month, suitable for retros or case studies. Manual trigger only; no AI peering over your shoulder.

## Stack

- React 19 + Vite + TypeScript
- Tailwind v4 (CSS-first)
- shadcn/ui (base-nova style, Base UI primitives)
- IndexedDB via `idb` for storage — no accounts, no sync, no cloud copies of your data
- Cloudflare Pages (app) + Cloudflare Workers (Anthropic API proxy for The Reckoning)

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

Requires Node.js 22+ (`.nvmrc` pins the version).

## Status

Active 4-week solo build. Currently in Session 3 of 20 — scaffold, design tokens, and a deployed smoke screen are live. The capture flow, Library, and Reckoning ship in Sessions 6–15. Demo Mode and polish in Week 4.

## Context

Reckon is a portfolio piece and a deliberate demonstration of human–AI design collaboration: the product, the process of building it with Claude, and the conventions baked into the codebase are all part of the deliverable.

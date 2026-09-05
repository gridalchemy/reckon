# Reckon — Product Spec (v0.1)

*Living document. Last updated: Session 8 prep — persistence rules for New Sketch (create mode) and Entry Detail (edit mode) locked; empty-option-row behavior locked; frictionless-option-deletion stance recorded.*

---

## Product summary

A web-based design decision log. Users capture **Sketches** (exploration) and promote them to **Decisions** (locked-in). An AI feature called **The Reckoning** synthesizes patterns across entries.

---

## Stack

> Note: this doc covers product intent — what Reckon is, how it should feel, what's in/out of scope. The repo's `CLAUDE.md` is the source of truth for implementation: exact stack versions, file structure, token conventions in code, accessibility floor, dev commands. When the two diverge on technical detail, `CLAUDE.md` wins; when they diverge on product intent, this doc wins.

- **Frontend:** React + Vite + TypeScript + Tailwind v4 (CSS-first config)
- **Storage:** IndexedDB (browser-local, persists across refreshes), via `idb`
- **AI:** Anthropic API, proxied via a Cloudflare Worker. **Worker-secret architecture (locked):** the Anthropic API key is set once via `wrangler secret put ANTHROPIC_API_KEY` (or the Cloudflare dashboard), never written into a source file, never committed to Git, and never sent to the browser. The Worker reads it from `env.ANTHROPIC_API_KEY` at runtime, attaches it as a header on the outbound request, and discards it. The browser only sees the Worker URL, never Anthropic's URL or the header. Users do not provide their own key — a portfolio demo cannot ask visitors to bring their own API access, and asking would also read as amateur security hygiene during a portfolio review.
- **Deployment:** Cloudflare Pages. Preview stays on `*.pages.dev` through the entire build; custom domain is a launch-day swap (see Domain note below).
- **Component starter:** shadcn/ui (`base-nova` style, Base UI primitives), heavily restyled
- **Icons:** Lucide
- **Search:** Fuse.js (fuzzy)
- **Fonts (locked):**
  - **Domine** — headlines, logo wordmark, main headers
  - **Space Grotesk** — body text, paragraphs, UI
  - **JetBrains Mono** — labels, timestamps, counts

---

## Cross-cutting concerns (part of v0.1)

Substantive work outside the original screen-by-screen scope that shipped as part of v0.1. Documented here so it doesn't disappear into implementation details.

- **Privacy, compliance, security.** GDPR posture (Datenschutz, Impressum in footer), local-only data model, no accounts, no cloud sync, Worker-secret architecture for API key handling.
- **npm supply-chain hardening.** Post-Shai-Hulud audit of dependencies, `.npmrc` with `ignore-scripts=true`, Cloudflare Pages build command locked to `npm ci && npm run build`, ongoing dependency vigilance.
- **Interim audit.** Retrospective alignment pass on Foundations mismatches between `CLAUDE.md`, Figma variables, and Component Conventions. Sync rules subsequently formalized in `CLAUDE.md`.
- **Live tech architecture map.** A rendered artifact at `reckon-a5q.pages.dev/reckon_live_map` documenting the actual system architecture. Companion to the codebase.

The case study will cover these more expansively. They're logged here as scope reality, not stylistic addenda.

---

## Color system (locked)

Palette built around two families plus alert states. Token-mapped in Figma and in `globals.css` as CSS variables — **see `CLAUDE.md` for the implementation source of truth** (ramps, semantic aliases, accessibility rules around hover states).

- **Mulberry** — primary action color (warm pink/magenta). Also carries semantic weight for **Sketches** (alive, still evolving).
- **San Marino** — base/secondary. Cool blue-grey neutrals for text, borders, secondary surfaces. Also carries semantic weight for **Decisions** (sealed, archival).
- **Contessa** — supporting warm neutral (reserved for future use).
- **Alerts:** Info, Success, Pending, Warning, Danger.

**Color semantics for entry states.** The vivid brand color (Mulberry) sits on Sketches, not Decisions. This inverts the usual convention where the brand color marks the "final" state. In Reckon, the vivid warm signal marks the alive/evolving state; the sober cool signal marks the settled/archival state. The Library scans as a landscape — pink cards = still thinking, blue-grey cards = in the record.

**Note on opacity:** several tokens are not pure colors (secondary text at A90, default border at A55). Carried through into Tailwind config.

**Theme:** Light mode is v0.1. Dark mode parked for v0.2.

---

## Voice

Microcopy is flowing and design-anchored, never corporate. No "Submit" or "Are you sure?" energy.

Examples: sidebar CTA is "+ New Sketch", not "Create entry". Promotion is "Lock in as decision". Reversal is "Break the seal". Empty-state resets say "Loosen one and try again", not "No results found". Destructive confirmations use the erased/won't come back register, not the "Are you sure?" register.

The Reckoning is written in a design director's voice — observational, never Socratic, never asks questions of the user. See § The Reckoning below.

---

## Domain

`reckonapp.com` is taken (unrelated registrant). `reckon.design` is also taken (dormant site). Other Reckon-named entities exist in unrelated categories.

Through v0.1 build, preview lives at `reckon-a5q.pages.dev`. Custom domain is a launch-day swap, not a mid-build switch. Current candidate: `reckonwebapp.com` (confirmed available). Final choice deferred until shipping.

---

## Data model

### Entry

A single unit of captured thinking. Has a state.

**Fields:**

- `id` (uuid)
- `title` (string, required)
- `context` (text — the problem or situation)
- `options` (array — what was considered)
- `choice` (text — what was picked, populated when state = decision)
- `rationale` (text — why)
- `state` (`sketch` | `decision`)
- `projectId` (foreign key, optional — can be unassigned)
- `tags` (array of strings)
- `createdAt` (timestamp)
- `sealedAt` (timestamp, populated when state = decision)
- `isDemo` (boolean, flags demo-loaded entries for scoped-delete)

### Project

- `id` (uuid)
- `name` (string)
- `createdAt` (timestamp)

### Reckoning

- `id` (uuid)
- `title` (AI-generated, short, editorial)
- `rangeStart` (timestamp)
- `rangeEnd` (timestamp)
- `entryTotals` (object: decisions, sketches counts for the range)
- `findings` (array — see § The Reckoning for structure)
- `proseSummary` (text)
- `createdAt` (timestamp)

---

## Screens (v0.1)

### 1. Home / Today → Session 5 (design), Session 15 (build)

- Greeting zone (time-aware, design-anchored copy: "Back at the board...", "Mid-iteration?", "Fresh canvas")
- Two main cards side-by-side:
  - **Today:** count of sketches/decisions today, list of today's entries, prominent capture access (New Sketch CTA at card footer)
  - **Latest Reckoning:** full prose preview (not a teaser — show the actual synthesis), source credit ("Drawn from [Project]"), link to open the full document
- **This week at a glance:** 7-bar horizontal chart showing daily activity, hoverable per-bar tooltip. Today's bar in Mulberry, past days in San Marino. Delta badge ("24% vs last week") in the top-right.
- **Recent by project:** 3–4 most recently touched projects with counts and last-activity dates

Global search bar was considered and cut for v0.1. Reachable via Cmd+K in v0.2 if it earns its way in.

Empty state: zones gracefully empty for first-time real users; Demo Mode populates everything.

---

### 2. New Sketch (the capture form) → Session 6

- Light, fast, single-screen modal
- Header: "New Sketch" until saved, then just "Sketch" (empty → filled → sealed = New Sketch → Sketch → Decision)
- Project as a header pill (Combobox with fuzzy find, "No project" option, "Create '[typed]'" for no-match)
- Fields: title (as the modal's own title, editorial weight), context, options (radio group, at-save an option becomes the choice), rationale, tags
- Tab navigation between fields
- ⌘+Enter to save (affordance TBC with Claude Code)
- Save Sketch CTA (primary)
- Internal target: feels fast enough to fill in under 60 seconds (no visible timer, design constraint only)

**Persistence rule (create mode):** nothing is written to storage until the user commits with Save Sketch (button or ⌘+Enter). Closing the modal with ✕ discards everything typed. No autosave, no draft state, no "unsaved changes" prompt. The Sketch itself is Reckon's draft primitive — a pre-Sketch draft layer would be a category of its own and isn't warranted for v0.1. This keeps the Library honest (only intentionally-saved entries live there) and avoids ghost entries from abandoned modals.

**Empty option rows persist.** Adding an option row and leaving it blank does not strip it on blur or on save. Empty rows are scaffolding for thinking, and stripping them punishes the "I'm about to type here" moment. Empty rows are filtered out only at Lock-in time, when a Sketch becomes a Decision.

---

### 3. Library → design pass added during session-based re-baseline

Card grid grouped by project, with an Unassigned bucket at bottom grouped by date (Today / This Week / Earlier).

- Card layout (not list), with tag chips for visual hierarchy
- Card differentiation: Sketch (Mulberry icon top-right, "Sketch · date · N options open" footer) vs. Decision (San Marino checkmark top-right, checkmark + chosen option + date in a soft San Marino footer)
- Card states: Default → Hover → Destructive
- Filter: by state (Sketches / Decisions / All), by project (dropdown), by tag (chip row, AND behavior)
- Fuzzy search across title / context / options / choice / rationale
- Sort: Recent, Oldest (A–Z dropped for scope reasons)
- Header summary: "N entries · N decisions, N sketches" — updates live with filters
- Empty state: "Nothing matches" with reset filters CTA
- Project actions (via ... menu on section header): Rename inline, Delete with confirmation banner ("Delete this project? Its N entries will be moved to Unassigned")
- Entry actions: Delete via inline card confirmation ("This decision will be erased. There's no undo.")

---

### 4. Entry Detail → Session 6

Modal — settled, not open for revisiting. Opens over whatever screen the user is on. Route-based Entry Detail (`/entry/:id`) was considered and rejected for v0.1: shareable entry URLs are meaningless in a local-only app, since a shared link would resolve against the visitor's own empty IndexedDB. Routes only become relevant in v0.2 alongside cloud sync or public sharing.

- View or edit a single Sketch or Decision
- Header: icon, state label ("Sketch" or "Decision"), project pill, timestamp, close
- Fields as prose sections with Label/Default eyebrows (CONTEXT, OPTIONS YOU'RE WEIGHING, RATIONALE, TAGS)
- Edit-in-place for all fields on Sketches

**Edit-mode persistence rule.** Once a Sketch exists, edits flow into it as they happen: text fields save on blur, structured fields (options, tags, project) save on mutation. There is no Save button in edit mode and no autosave debounce — IndexedDB writes are effectively instant locally, and a debounce would only invent a "did it save?" gap that then wants a saved-indicator, which is a rabbit hole not worth v0.1. The ✕ button is the only exit and closes cleanly; there is no cancel/discard, because everything is already saved. A "revert this session's changes" affordance is parked for v0.2 if it ever earns its way in.

**Deletion of options in edit mode is intentionally frictionless.** The radio-group model means only one option can be chosen at Lock-in, so removing an unwanted option row (× on the row) writes immediately with no confirmation dialog. Exploration should be low-friction; ceremony lives at Lock-in, not at every micro-edit. This stance may be revisited after real user feedback but is locked for v0.1.

- **Sketch state:** prominent "Lock in as decision" CTA with press-and-hold gesture (HOLD pill visible). Ceremony without a separate confirmation modal.
- **Decision state:** unselected options rendered with strikethrough (the archaeology of the thinking, not discarded chaff). Sealed section at the bottom with wax-seal monogram and "Sealed [date/time]" + "Break the seal" reversal affordance. Tags remain editable; core content is locked.

---

### 5. Reckoning → Session 12 (design), Session 13 (build)

Manual trigger only in v0.1: "Reckon with this week" / "Reckon with this month". Custom range officially cut for v0.1 (calendar component cost not justified at v0.1 scope). No background or scheduled generation.

**Layout:** left = the rendered Reckoning document. Right sidebar = "PAST RECKONINGS" browsable list. Above the document = COMPOSE panel showing what would happen if you generate a new one (range totals + projects covered + button).

**Document structure:**

- **Header:** AI-generated title (Domine, editorial), range dates, week totals (decisions + sketches locked in range — *independent* of what any Finding cites), "Reckoned [date]" sealed badge
- **WHAT THE RECORD SHOWS** section — numbered Findings (01, 02...):
  - Each Finding = short thematic title + concrete pattern statement in prose
  - Selective bolding inside prose for scannable keywords
  - Evidence chips per the rule below
- **PROSE SUMMARY** section — copy-able paragraph, distinct card, Copy button scoped only to this section

**Evidence pattern rule (load-bearing):**

Chips inside a Finding point at specific entries — particulars, threads, exceptions. If the Finding is a claim about the shape of the whole range (a proportion, a frequency, a distribution), the sentence carries its own evidence and there are no chips. The count IS the evidence. No Library escape hatch. No threshold logic.

Consequences:
- Some Findings will be prose-only. That's intentional.
- Findings that name an exception get one chip for the outlier, visually differentiated (soft amber tint, EXCEPTION label in mono).
- The Reckoning does not link out to Library. It's a summary artifact, not a router.

**Voice constraints for the AI prompt:**

- Observational, not Socratic. Never asks questions of the user.
- Designer vocabulary used naturally, never as jargon-drop.
- States what happened, names patterns, points at exceptions.
- Frequency claims stated as ratios ("Six of seven decisions...") — honest and cross-checkable.
- Titles read like something a design director would write at the end of a week.
- The title itself is often the sharpest observation ("A week of deferrals, not commitments").

**History behavior:**

- Sidebar renders all past Reckonings (list scrolls if it outgrows viewport)
- Active Reckoning marked with Mulberry dot; hover = soft San Marino background
- Clicking swaps the document view
- With real archive volume, cap the list at ~10 with a "View all" link into Library

**Auto / scheduled generation is parked for v0.2** — Reckon is local-only, no server-side scheduler is worth building at this scope. Manual trigger is the intentional design constraint, not a technical shortcut.

Minimum-data threshold before a Reckoning is generatable (e.g., "you need at least N decisions to reckon") — TBD during Session 16 empty state work.

---

### 6. Settings → design pass added during session-based re-baseline

Drawer pattern (right-side slide-over), **not a route**. The nav item opens the drawer over whatever screen the user is currently on; there is no `/settings` URL. If a deep-linkable Settings ever becomes useful, it's a small v0.2 addition.

**STARTER PACK section:**

- Demo data card with status ("Loaded · N sample projects") and stats ("14 Sketches · 21 Decisions · 4 Reckonings")
- Two secondary actions (state-swapping — not both visible at once):
  - **Load demo data** — when demo is not loaded (first visit or after Clear)
  - **Reset to fresh demo** — when demo is loaded, restores original demo, discarding modifications
- **Clear demo data** — ghost destructive button. Scoped delete (removes entries where `isDemo === true`). Non-destructive to user-captured entries.

**YOUR DATA section:**

- Export as JSON card with description, "Last exported · [date/never]" status, primary Download button ("Download reckon-export.json")
- **Clear all local data** — outline destructive button. Full wipe. All entries, all projects, all Reckonings. Nuclear option.

**Footer:** "Reckon · v0.1 · Local-only · no account"

**Destructive button hierarchy across the app (three-tier system):**

- **Ghost destructive** — contextual, small-scope (Clear demo data, individual entry deletes on cards)
- **Outline destructive** — elevated, real-scope (Clear all local data, project deletes) — visual weight designed to not compete chromatically with the Mulberry primary
- **Solid destructive** — reserved for the commitment button inside confirmation dialogs

Confirmation dialogs always use solid destructive (once committed to the confirmation step, the user is in "I mean it" mode regardless of the entry-point weight).

**About lives on its own nav item, not inline here.**

---

## Never-cut pillars

Four things that *are* the product. If Week 3 is at risk, cut everything else first (JSON export → Reckoning history → Recent by Project → Weekly activity strip → Fuzzy search), but never these:

1. The capture flow (Sketch → Decision)
2. The Library
3. At least one working Reckoning
4. Demo Mode (15–20 pre-loaded sample entries — load-bearing for the portfolio audience)

---

## v0.2 candidates (parked, not cut)

- Sketch-to-prompt generation
- Auto / scheduled Reckoning generation
- Multi-user / shared workspaces
- Cloud sync across devices
- Dark mode
- Mobile / responsive layouts
- Richer entry media
- Public sharing of individual Reckonings as read-only URLs
- Export beyond JSON
- Global search (Cmd+K)
- Route-based Entry Detail (only meaningful alongside cloud sync or public sharing — parked as a bundle)
- Custom range on Reckoning trigger
- Minimum-data threshold logic for Reckoning generation (may land in v0.1 via empty-state work)
- Custom domain swap

---

## Documentation contract

Reckon has four living documents. Each owns one thing.

| File | Owns |
|---|---|
| `Product_Spec.md` (this file) | Product intent, screens, voice, scope discipline |
| `CLAUDE.md` | Implementation source of truth (stack, tokens, accessibility, dev commands) |
| `Variable_Inventory.md` | Figma ↔ code token contract |
| `Component_Conventions.md` | Naming, variants, states, exceptions log |

Drift between them is a bug. See `CLAUDE.md` § Documentation contract for sync rules.

# Reckon — Variable Inventory

_Last updated: 2026-06-12_

Companion to CLAUDE.md. Source of truth for the Figma ↔ code naming contract.

## How this works

Same string in three places. A Figma variable named `bg/page` becomes `--color-bg-page` in `globals.css` and `bg-bg-page` as a Tailwind utility. Pick the role name once in Figma, everything downstream follows.

When handing a screen to Claude Code, list the variables it uses (see Handoff template at the bottom). Claude Code writes the CSS and the JSX. The inventory below tells it what each name means.

**Naming heads-up:** Figma allows commas in variable names (e.g. `stroke-1,25`), but CSS only accepts dots or dashes. All variable names in this inventory use dashes from the start. Stroke fractionals are `stroke-1-25` (dash) — no rename needed before handoff.

---

## Color

Two tiers. Primitives are hidden raw ramps; semantic tokens are role-named aliases.

### Primitives (33 vars, hidden from picker)

Primitives are scope-hidden (`[]`) so they don't appear in fill/stroke pickers — they're consumed only via semantic aliases.

| Family | Range | Notes |
|---|---|---|
| `base/white` | `#FFFFFF` | Used by `bg/surface`, `bg/sidebar`, `text/on-action`, `icon/on-action` |
| `mulberry/50` → `mulberry/950` | Full ramp (11 steps) | Brand primary; full ramp locked |
| `sanmarino/50` → `sanmarino/950` | Full ramp (11 steps) | Base/secondary; full ramp locked |
| `sanmarino/600-a90` | `rgba(61, 93, 145, 0.9)` | Alpha-baked for `text/secondary`, `icon/secondary` |
| `sanmarino/200-a55` | `rgba(206, 216, 233, 0.55)` | Alpha-baked for `border/default` |
| `info/500` | `#5E78F6` | Anchor only; full ramp deferred |
| `success/100` | `#E3F5E4` | Soft success surface |
| `success/200` | `#C9E9CC` | Soft success border |
| `success/500` | `#4DAA57` | Vivid success |
| `success/700` | `#2E6734` | Text/icon on soft success |
| `pending/500` | `#EABB08` | Anchor only |
| `warning/500` | `#DD6031` | Anchor only |
| `danger/500` | `#FF3B2A` | Anchor only |

Code syntax: `var(--color-<name>)` — e.g. `var(--color-mulberry-600)`, `var(--color-sanmarino-600-a90)`.

**Alpha note:** when a token bakes in alpha, set the alpha on a dedicated alpha-baked **primitive**, not on the alias — Figma aliases inherit alpha from the source, they don't layer it.

### Semantic (46 vars, mode: `Light`)

Mode set up for forward compatibility with Dark mode (v0.2+); only `Light` is populated today.

#### Backgrounds (12)

| Token | Aliases to | Role |
|---|---|---|
| `bg/page` | `sanmarino/50` | App background |
| `bg/surface` | `base/white` | Cards, sidebar surfaces |
| `bg/sidebar` | `base/white` | Sidebar (separate alias so v0.2 dark mode can split) |
| `bg/hover` | `sanmarino/50` | Default row / button hover |
| `bg/sunken` | `sanmarino/50` | Icon tile backgrounds, chart-bar tracks (recessed surfaces) |
| `bg/accent` | `mulberry/50` | Active nav item, selected row |
| `bg/highlight` | `sanmarino/100` | Subtle emphasis surface |
| `bg/tooltip` | `sanmarino/950` | Dark tooltip background |
| `bg/input-addon` | `sanmarino/50` | Input prefixes / affixes |
| `bg/chart-bar` | `sanmarino/500` | Default chart bar fill |
| `bg/chart-bar-today` | `mulberry/500` | Present-day chart bar fill |
| `bg/success` | `success/100` | Soft success surface (tags, alerts) |

Scope: `FRAME_FILL, SHAPE_FILL`.

#### Borders (5)

| Token | Aliases to | Role |
|---|---|---|
| `border/default` | `sanmarino/200-a55` | Card outlines |
| `border/highlight` | `sanmarino/300` | Emphasized borders |
| `border/focus` | `mulberry/600` | Focus rings |
| `border/divider` | `sanmarino/100` | Dividers, separators |
| `border/success` | `success/200` | Border on soft success surface |

Scope: `STROKE_COLOR`.

#### Text (10)

| Token | Aliases to | Role |
|---|---|---|
| `text/headline` | `sanmarino/950` | H1, H2, wordmark |
| `text/paragraph` | `sanmarino/800` | Body copy |
| `text/secondary` | `sanmarino/600-a90` | Meta, supporting labels (alpha baked) |
| `text/muted` | `sanmarino/300` | Placeholders, captions |
| `text/disabled` | `sanmarino/300` | Disabled text — **TBD**: will be revised when a real use case lands (opacity-based or new shade) |
| `text/on-action` | `base/white` | Text on vivid mulberry button |
| `text/on-accent` | `mulberry/700` | Text on soft mulberry surface (active nav) |
| `text/on-success` | `success/700` | Text on soft success surface (the green tag) |
| `text/action` | `mulberry/600` | Mulberry-colored body text (links, accents) |
| `text/strong` | `sanmarino/600` | 100% alpha sibling of `text/secondary` — emphasis below headline weight |

Scope: `TEXT_FILL`.

#### Icons (10)

Mirrors `text/*` plus mulberry/success additions. Scoped versatile (`FRAME_FILL`, `SHAPE_FILL`, `STROKE_COLOR`) so it works for both stroke-based Lucide icons and filled glyphs.

| Token | Aliases to | Role |
|---|---|---|
| `icon/headline` | `sanmarino/950` | Icons matching headline weight |
| `icon/paragraph` | `sanmarino/800` | Icons matching paragraph weight |
| `icon/default` | `sanmarino/600` | Default UI icon (nav, list items) |
| `icon/secondary` | `sanmarino/600-a90` | Softer icons |
| `icon/muted` | `sanmarino/300` | Low-emphasis / placeholder icons |
| `icon/disabled` | `sanmarino/300` | Disabled icons — **TBD** alongside `text/disabled` |
| `icon/on-action` | `base/white` | Icon on vivid mulberry button |
| `icon/action` | `mulberry/600` | Mulberry-colored icon (accent, default state) |
| `icon/on-accent` | `mulberry/700` | Icon on soft mulberry surface (active nav) |
| `icon/on-success` | `success/700` | Icon on soft success surface |

#### Action (4)

| Token | Aliases to | Role |
|---|---|---|
| `action/primary` | `mulberry/600` | Primary CTA |
| `action/primary-hover` | `mulberry/700` | Primary CTA hover (next ramp step — never opacity) |
| `action/secondary` | `sanmarino/700` | Secondary CTA |
| `action/secondary-hover` | `sanmarino/800` | Secondary CTA hover |

Scope: versatile (`FRAME_FILL`, `SHAPE_FILL`, `STROKE_COLOR`, `TEXT_FILL`).

#### Status (5, vivid)

| Token | Aliases to |
|---|---|
| `status/info` | `info/500` |
| `status/success` | `success/500` |
| `status/pending` | `pending/500` |
| `status/warning` | `warning/500` |
| `status/danger` | `danger/500` |

Scope: `FRAME_FILL`, `SHAPE_FILL`, `TEXT_FILL`.

For soft success surfaces (tag, alert, banner), use the role-family tokens: `bg/success`, `border/success`, `text/on-success`, `icon/on-success`. The vivid `status/*` tokens are for chip/badge/dot use.

---

## Spacing

Single collection, FLOAT, scope `GAP` (covers itemSpacing + padding). 4px scale mirroring Tailwind.

| Figma | CSS | Tailwind | Pixels |
|---|---|---|---|
| `space-0` | `--spacing-0` | `gap-0`, `p-0` | 0 |
| `space-0-5` | `--spacing-0-5` | `gap-0.5`, `p-0.5` | 2 |
| `space-1` | `--spacing-1` | `gap-1`, `p-1` | 4 |
| `space-2` | `--spacing-2` | `gap-2`, `p-2` | 8 |
| `space-3` | `--spacing-3` | `gap-3`, `p-3` | 12 |
| `space-4` | `--spacing-4` | `gap-4`, `p-4` | 16 |
| `space-5` | `--spacing-5` | `gap-5`, `p-5` | 20 |
| `space-6` | `--spacing-6` | `gap-6`, `p-6` | 24 |
| `space-8` | `--spacing-8` | `gap-8`, `p-8` | 32 |
| `space-10` | `--spacing-10` | `gap-10`, `p-10` | 40 |
| `space-12` | `--spacing-12` | `gap-12`, `p-12` | 48 |
| `space-16` | `--spacing-16` | `gap-16`, `p-16` | 64 |
| `space-20` | `--spacing-20` | `gap-20`, `p-20` | 80 |
| `space-24` | `--spacing-24` | `gap-24`, `p-24` | 96 |

Skip `space-7`, `space-9`, `space-11`, etc. Add only when a real screen calls for them.

---

## Radius

Single collection, FLOAT, scope `CORNER_RADIUS`. Locked. Maps 1:1 to Tailwind defaults.

| Figma | CSS | Tailwind | Pixels |
|---|---|---|---|
| `rounded-none` | `--radius-none` | `rounded-none` | 0 |
| `rounded-xs` | `--radius-xs` | `rounded-xs` | 2 |
| `rounded-sm` | `--radius-sm` | `rounded-sm` | 4 |
| `rounded-md` | `--radius-md` | `rounded-md` | 6 |
| `rounded-lg` | `--radius-lg` | `rounded-lg` | 8 |
| `rounded-xl` | `--radius-xl` | `rounded-xl` | 10 |
| `rounded-2xl` | `--radius-2xl` | `rounded-2xl` | 12 |
| `rounded-3xl` | `--radius-3xl` | `rounded-3xl` | 16 |
| `rounded-4xl` | `--radius-4xl` | `rounded-4xl` | 24 |
| `rounded-5xl` | `--radius-5xl` | `rounded-5xl` | 32 |
| `rounded-full` | `--radius-full` | `rounded-full` | 9999 |

---

## Stroke

Single collection, FLOAT, scope `STROKE_FLOAT`. Used for icon strokes AND UI border widths (cards, inputs, focus ring widths). Dash-named throughout — no comma → dash rename needed.

| Figma | CSS | Pixels |
|---|---|---|
| `stroke-1` | `--stroke-1` | 1 |
| `stroke-1-25` | `--stroke-1-25` | 1.25 |
| `stroke-1-5` | `--stroke-1-5` | 1.5 |
| `stroke-1-75` | `--stroke-1-75` | 1.75 |
| `stroke-2` | `--stroke-2` | 2 |
| `stroke-2-25` | `--stroke-2-25` | 2.25 |
| `stroke-2-5` | `--stroke-2-5` | 2.5 |
| `stroke-2-75` | `--stroke-2-75` | 2.75 |
| `stroke-3` | `--stroke-3` | 3 |

For focus state width, encode at the component level (Default → Hover → Focus → Disabled variants) rather than as a global border-width semantic — focus state usually pairs width with offset, ring color, and shadow, which a single token can't capture.

---

## Typography

Three axes: family, size + line-height, weight. Variables cover family and size; weight + line-height + text-case live inside Text Styles (Figma can't variable-ize font-weight).

### Families (3 STRING, scope `FONT_FAMILY`)

| Figma var | Value | Tailwind utility | Code syntax shown in Dev Mode |
|---|---|---|---|
| `font-display` | `Domine` | `font-display` | `font-display` |
| `font-sans` | `Space Grotesk` | `font-sans` (default) | `font-sans` |
| `font-mono` | `JetBrains Mono` | `font-mono` | `font-mono` |

### Sizes (9 FLOAT, scope `FONT_SIZE`)

Line-height is set inside each Text Style, not at the variable level. Code syntax in Dev Mode is the bare utility name (no `var()` wrapper) since variable name and Tailwind utility match exactly.

| Token | Tailwind | Pixels |
|---|---|---|
| `text-xs` | `text-xs` | 12 |
| `text-sm` | `text-sm` | 14 |
| `text-base` | `text-base` | 16 |
| `text-lg` | `text-lg` | 18 |
| `text-xl` | `text-xl` | 20 |
| `text-2xl` | `text-2xl` | 24 |
| `text-3xl` | `text-3xl` | 30 |
| `text-4xl` | `text-4xl` | 36 |
| `text-5xl` | `text-5xl` | 48 |

`text-4xl` and `text-5xl` aren't used by any active text style but remain defined for future use.

### Available font weights (loaded in `index.html`)

| Family | Weights loaded | Used in styles |
|---|---|---|
| Domine | 700 (Bold) | Display/H1, Display/H2, Display/Card, Wordmark |
| Space Grotesk | 300, 400, 500, 600, 700 | Body/*, Caption/*, Heading/Small, Label/Default |
| JetBrains Mono | 400, 500 | Mono/Caption-*, Mono/Body-* |

Note: `index.html` previously loaded Domine 400/500/600 and JetBrains Mono 700 — trimmed after Domine's available styles in Figma were confirmed as Regular/Bold only and `Count` (the only JetBrains Mono Bold style) was removed. Space Grotesk 300 (Light) and 600 (Semi Bold) are currently loaded but unused by any active style; left in for future use.

### Text Styles (16)

Each style binds its family and size to the Typography variables. Weight, line-height, text-case, and letter-spacing are baked into the style directly. The Tailwind shorthand goes in the Description field for Dev Mode visibility.

**Display (Domine, all Bold):**

| Text Style | Size / LH (px) | Tailwind shorthand |
|---|---|---|
| `Display/H1` | 30 / 36 | `font-display text-3xl font-bold` |
| `Display/H2` | 24 / 32 | `font-display text-2xl font-bold` |
| `Display/Card` | 20 / 28 | `font-display text-xl font-bold` |
| `Wordmark` | 30 / 36 | `font-display text-3xl font-bold` |

**Heading (Space Grotesk):**

| Text Style | Style | Size / LH (px) | Tailwind shorthand |
|---|---|---|---|
| `Heading/Small` | Bold | 16 / 24 | `text-base font-bold` |

**Body (Space Grotesk 14, lowercase):**

| Text Style | Style | Tailwind shorthand |
|---|---|---|
| `Body/Default` | Regular | `text-sm` |
| `Body/Medium` | Medium | `text-sm font-medium` |
| `Body/Emphasis` | Bold | `text-sm font-bold` |

**Caption (Space Grotesk 12, lowercase):**

| Text Style | Style | Tailwind shorthand |
|---|---|---|
| `Caption/Regular` | Regular | `text-xs` |
| `Caption/Medium` | Medium | `text-xs font-medium` |
| `Caption/Bold` | Bold | `text-xs font-bold` |

**Label (Space Grotesk 12, UPPER + tracking-wide):**

| Text Style | Style | Tailwind shorthand |
|---|---|---|
| `Label/Default` | Medium | `text-xs font-medium uppercase tracking-wide` |

**Mono (JetBrains Mono, lowercase):**

| Text Style | Style | Size / LH (px) | Tailwind shorthand |
|---|---|---|---|
| `Mono/Caption-Regular` | Regular | 12 / 16 | `font-mono text-xs` |
| `Mono/Caption-Medium` | Medium | 12 / 16 | `font-mono text-xs font-medium` |
| `Mono/Body-Regular` | Regular | 14 / 20 | `font-mono text-sm` |
| `Mono/Body-Medium` | Medium | 14 / 20 | `font-mono text-sm font-medium` |

`Wordmark` and `Display/H1` share specs (Domine 30 Bold) but are kept as distinct styles for role clarity. The `Mono/Caption-*` and `Mono/Body-*` naming mirrors the `Caption/*` and `Body/*` families 1:1 — pick a Space Grotesk style, swap the prefix for `Mono/` to get its monospace equivalent.

---

## Effect Styles

Authored directly in Figma, not via variables. CSS values to land in `globals.css` during the rename pass.

| Figma effect style | Description (Dev Mode) | CSS to add to `@theme` |
|---|---|---|
| `shadow-xs` | `shadow-xs` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `shadow-sm` | `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.10)` |
| `shadow-md` | `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)` |
| `shadow-lg` | `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10)` |
| `shadow-xl` | `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.10)` |
| `shadow-2xl` | `shadow-2xl` | `0 25px 50px -12px rgb(0 0 0 / 0.25)` |
| `focus ring` | `shadow-focus` | `0 0 0 3px rgb(200 59 134 / 0.30)` (mulberry/600 @ 30%, spread 3) |

---

## What's deferred

- **Disabled state direction** (`text/disabled`, `icon/disabled`) — both alias `sanmarino/300` for now (same as muted). Will be revised when a real disabled use case appears in a screen, likely via opacity rather than a new shade.
- **`status/*-on` tokens** for info, pending, warning, danger — the "dark text/icon on the vivid status surface" variant. Need the matching `/900` shades from full ramps which don't exist yet.
- **Full ramps** for info, pending, warning, danger — only `/500` anchors exist today. Add when first screen needs them.
- **Contessa primitive** — was a placeholder in the original draft, not created. May be repurposed or removed.
- **Foundations documentation page** — the 🎨 Foundations page in Figma is still empty. To populate after this inventory rewrite: color swatches per ramp, semantic role examples, spacing bars, radius row, type specimen.
- **`globals.css` rename pass + `index.html` font-trim commit** — both pending; will land together in their own session so the live preview rebuilds once with consistent state. See `memory/project_reckon_deferred_followups.md`.

---

## Handoff template

When prompting Claude Code with a screen, include the variable manifest. Example:

> Implementing the [Screen Name] screen.
>
> **Variables used:**
> - **Colors:** `bg/page`, `bg/surface`, `text/headline`, `text/paragraph`, `text/secondary`, `action/primary`, `action/primary-hover`, `border/default`
> - **Spacing:** `space-3`, `space-4`, `space-6`, `space-8`
> - **Radius:** `rounded-2xl`, `rounded-full`
> - **Stroke:** `stroke-1-5` (icons)
> - **Text styles:** `Display/H1`, `Display/Card`, `Body/Default`, `Caption/Medium`, `Mono/Caption-Regular`
> - **Effect styles:** `shadow-md`, `shadow-focus`
>
> Add any missing tokens to `globals.css` first (refer to `docs/Variable_Inventory.md` for canonical names). Then build the component using Tailwind utilities. Match Figma exactly. If anything looks ambiguous, ask/discuss before guessing.

That's the contract. Lock the names once, then the screens build themselves.

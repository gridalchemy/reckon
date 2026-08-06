# Reckon — Variable Inventory

_Last updated: 2026-08-06_

Companion to CLAUDE.md. Source of truth for the Figma ↔ code naming contract.

## How this works

Same string in three places. A Figma variable named `bg/page` becomes `--color-bg-page` in `globals.css` and `bg-bg-page` as a Tailwind utility. Pick the role name once in Figma, everything downstream follows.

**Code syntax:** every Figma variable also carries a WEB code syntax of `var(--color-<name>)` (slashes → dashes) so Dev Mode surfaces the CSS reference. This is **not** auto-persisted — Figma only *suggests* it; it must be set explicitly when the variable is created (the plugin API leaves `codeSyntax` empty otherwise).

When handing a screen to Claude Code, list the variables it uses (see Handoff template at the bottom). Claude Code writes the CSS and the JSX. The inventory below tells it what each name means.

**Naming heads-up:** Figma allows commas in variable names (e.g. `stroke-1,25`), but CSS only accepts dots or dashes. All variable names in this inventory use dashes from the start. Stroke fractionals are `stroke-1-25` (dash) — no rename needed before handoff.

---

## Color

Two tiers. Primitives are hidden raw ramps; semantic tokens are role-named aliases.

### Primitives (hidden from picker)

Primitives are scope-hidden (`[]`) so they don't appear in fill/stroke pickers — they're consumed only via semantic aliases.

| Family | Range | Notes |
|---|---|---|
| `base/white` | `#FFFFFF` | Used by `bg/surface`, `bg/sidebar`, `text/on-action`, `icon/on-action`, `text/on-badge-inverse`, `text/on-destructive`, `icon/on-destructive` |
| `base/white-a80` | `rgba(255, 255, 255, 0.80)` | Alpha-baked for `text/on-primary-subtle` (HOLD label on primary surface) |
| `base/white-a45` | `rgba(255, 255, 255, 0.45)` | Alpha-baked for `border/on-primary-subtle` (HOLD outline on primary surface) |
| `mulberry/50` → `mulberry/950` | Full ramp (11 steps) | Brand primary; full ramp locked |
| `mulberry/100-a55` | `rgba(255, 217, 236, 0.55)` | Alpha-baked for `bg/accent-highlight` — adapts via blend on layered surfaces |
| `mulberry/950-a50` | `rgba(82, 15, 51, 0.50)` | Alpha-baked for `border/wax` (matte dot rim + sealed border) |
| `sanmarino/50` → `sanmarino/950` | Full ramp (11 steps) | Base/secondary; full ramp locked |
| `sanmarino/600-a90` | `rgba(61, 93, 145, 0.9)` | Alpha-baked for `text/secondary`, `icon/secondary` |
| `sanmarino/300-a20` | `rgba(162, 183, 215, 0.20)` | Alpha-baked for `bg/section-subtle` (decision card footer tint) |
| `sanmarino/300-a28` | `rgba(162, 183, 215, 0.28)` | Alpha-baked for `bg/section-subtle-hover` |
| `sanmarino/200-a65` | `rgba(206, 216, 233, 0.65)` | Alpha-baked for `border/default` |
| `sanmarino/950-a42` | `rgba(27, 36, 54, 0.42)` | Alpha-baked for `bg/backdrop` (modal / drawer scrim) |
| `info/500` | `#5E78F6` | Anchor only; full ramp deferred |
| `success/100` | `#E3F5E4` | Soft success surface |
| `success/200` | `#C9E9CC` | Soft success border |
| `success/500` | `#4DAA57` | Vivid success |
| `success/700` | `#2E6734` | Text/icon on soft success |
| `pending/500` | `#EABB08` | Anchor only |
| `warning/100` | `#FAE8DA` | Soft warning surface |
| `warning/200` | `#F4CEB4` | Soft warning border |
| `warning/500` | `#DD6031` | Anchor only |
| `warning/700` | `#AC3722` | Text/icon on soft warning |
| `danger/100` | `#FFE0E1` | Soft danger surface |
| `danger/200` | `#FFC7C9` | Soft danger border |
| `danger/500` | `#FA3D44` | Vivid danger — Strawberry Red (true red, replaces earlier orange-red `#FF3B2A`) |
| `danger/700` | `#C31219` | Text/icon color on white surface; primary destructive button fill |
| `danger/800` | `#A11318` | Text/icon on soft danger surface; primary destructive button hover fill |
| `danger/100-a80` | `rgba(255, 224, 225, 0.80)` | Alpha-baked for `bg/danger`, `bg/destructive-ghost` |
| `danger/200-a82` | `rgba(255, 199, 201, 0.82)` | Alpha-baked for `bg/destructive-ghost-strong` |
| `graychateau/50` | `#F9FAFB` | Disabled palette — softest neutral (used by `bg/disabled`) |
| `graychateau/100` | `#F3F4F6` | Disabled palette |
| `graychateau/200` | `#E4E7EC` | Disabled palette (used by `border/disabled`) |
| `graychateau/300` | `#D0D5DC` | Disabled palette |
| `graychateau/400` | `#97A1AF` | Disabled palette — text/icon on disabled surfaces (used by `text/disabled`, `icon/disabled`) |
| `graychateau/500` | `#697382` | Disabled palette |
| `graychateau/600` | `#485666` | Disabled palette |
| `graychateau/700` | `#344254` | Disabled palette |
| `graychateau/800` | `#1C2A3A` | Disabled palette |
| `graychateau/900` | `#0E182A` | Disabled palette |
| `graychateau/950` | `#010714` | Disabled palette — strongest |

Code syntax: `var(--color-<name>)` — e.g. `var(--color-mulberry-600)`, `var(--color-sanmarino-600-a90)`.

**Alpha note:** when a token bakes in alpha, set the alpha on a dedicated alpha-baked **primitive**, not on the alias — Figma aliases inherit alpha from the source, they don't layer it.

**Ramp policy:** three foundational families — `mulberry` (brand), `sanmarino` (base), `graychateau` (neutral) — ship as complete 11-step ramps, because a foundational neutral is coherent, cheap, and routinely reached for even when only a few steps are wired today (graychateau uses 50/200/400 for the disabled palette). The semantic-alert families (`success`, `warning`, `danger`, `info`, `pending`) ship *partial* by design. So "add only when a screen needs it" governs the alert ramps — not the three foundational ones, which are kept whole on purpose.

### Semantic (mode: `Light`)

Mode set up for forward compatibility with Dark mode (v0.2+); only `Light` is populated today.

#### Backgrounds

| Token | Aliases to | Role |
|---|---|---|
| `bg/page` | `sanmarino/50` | App background |
| `bg/surface` | `base/white` | Cards, sidebar surfaces |
| `bg/sidebar` | `base/white` | Sidebar (separate alias so v0.2 dark mode can split) |
| `bg/hover` | `sanmarino/50` | Default row / button hover |
| `bg/sunken` | `sanmarino/50` | Icon tile backgrounds, chart-bar tracks (recessed surfaces) |
| `bg/accent` | `mulberry/50` | Active nav item, selected row |
| `bg/accent-highlight` | `mulberry/100-a55` | Accent surface for layered contexts (e.g. Decision icon tile when row is hovered) — alpha-baked so it gains saturation against tinted backgrounds |
| `bg/highlight` | `sanmarino/100` | Subtle emphasis surface (sanmarino-keyed counterpart of `bg/accent-highlight`) |
| `bg/tooltip` | `sanmarino/950` | Dark tooltip background |
| `bg/input-addon` | `sanmarino/50` | Input prefixes / affixes |
| `bg/chart-bar` | `sanmarino/500` | Default chart bar fill |
| `bg/chart-bar-today` | `mulberry/500` | Present-day chart bar fill |
| `bg/success` | `success/100` | Soft success surface (tags, alerts) |
| `bg/warning` | `warning/100` | Soft warning surface (badge "warning" state) |
| `bg/neutral` | `sanmarino/100` | Neutral badge state — same value as `bg/highlight` but distinct role |
| `bg/danger` | `danger/100-a80` | Soft danger surface (cards, alerts, badge "danger" state) — alpha-baked so it works on layered surfaces |
| `bg/disabled` | `graychateau/50` | Disabled surface (buttons, inputs) |
| `bg/inverse` | `sanmarino/950` | Deepest dark surface (filter chip active state) |
| `bg/badge-inverse` | `sanmarino/800` | Dark badge variant fill (one step lighter than `bg/inverse`) |
| `bg/backdrop` | `sanmarino/950-a42` | Modal / drawer scrim — alpha-baked so it darkens whatever sits behind it |
| `bg/section-subtle` | `sanmarino/300-a20` | Tinted subsection within a surface (e.g. decision card footer) |
| `bg/section-subtle-hover` | `sanmarino/300-a28` | Hover on `bg/section-subtle` (e.g. trash icon hover on decision card footer) |
| `bg/destructive-ghost` | `danger/100-a80` | Ghost destructive button hover on white/normal surface — same value as `bg/danger`, distinct role |
| `bg/destructive-ghost-strong` | `danger/200-a82` | Ghost destructive button hover on stacked colored surface |
| `bg/wax` | `mulberry/800` | Wax Seal — matte dot fill, melt state fill, sealed inner disc (exposes `mulberry/800` which is otherwise hidden) |

Scope: `FRAME_FILL, SHAPE_FILL`.

#### Borders

| Token | Aliases to | Role |
|---|---|---|
| `border/default` | `sanmarino/200-a65` | Card outlines |
| `border/highlight` | `sanmarino/300` | Emphasized borders |
| `border/focus` | `mulberry/600` | Focus rings |
| `border/divider` | `sanmarino/100` | Dividers, separators |
| `border/success` | `success/200` | Border on soft success surface |
| `border/warning` | `warning/200` | Border on soft warning surface |
| `border/neutral` | `sanmarino/200` | Border on neutral badge — opaque counterpart to `border/default` (which is `sanmarino/200-a65`) |
| `border/danger` | `danger/200` | Border on soft danger surface (soft danger cards, alerts, badge "danger" state) |
| `border/disabled` | `graychateau/200` | Border on disabled surfaces |
| `border/badge-inverse` | `sanmarino/950` | Border on `bg/badge-inverse` — same value as `bg/inverse` but distinct role |
| `border/wax` | `mulberry/950-a50` | Wax Seal — matte dot rim, sealed border |
| `border/on-primary-subtle` | `base/white-a45` | Translucent white border on primary surface (Wax Seal's HOLD outline; reusable for other outline-on-vivid patterns) |

Scope: `STROKE_COLOR`.

#### Text

| Token | Aliases to | Role |
|---|---|---|
| `text/headline` | `sanmarino/950` | H1, H2, wordmark |
| `text/paragraph` | `sanmarino/800` | Body copy |
| `text/secondary` | `sanmarino/600-a90` | Meta, supporting labels (alpha baked) |
| `text/secondary-solid` | `sanmarino/600` | Opaque (100%) sibling of `text/secondary` — for use on non-white surfaces where alpha behavior is undesirable |
| `text/muted` | `sanmarino/300` | Placeholders, captions |
| `text/disabled` | `graychateau/400` | Disabled text |
| `text/on-action` | `base/white` | Text on vivid mulberry button |
| `text/on-action-secondary` | `sanmarino/700` | Text on the soft `action/secondary` button — needs sanmarino/700 for contrast on the sanmarino/50 surface. Same value as `text/strong`, distinct role; mirrors `text/on-destructive` |
| `text/on-accent` | `mulberry/700` | Text on soft mulberry surface (active nav) |
| `text/on-success` | `success/700` | Text on soft success surface (the green tag) |
| `text/on-warning` | `warning/700` | Text on soft warning surface |
| `text/on-neutral` | `sanmarino/700` | Text on neutral badge (700 over 600 for accessibility — better contrast on sanmarino/100) |
| `text/on-badge-inverse` | `base/white` | Text on `bg/badge-inverse` (dark badge variant) |
| `text/danger` | `danger/700` | Destructive-colored text on white/normal surface (mirrors `text/action` for danger) |
| `text/on-danger` | `danger/800` | Text on soft danger surface (`bg/danger`) — one step deeper for contrast |
| `text/on-destructive` | `base/white` | Text on primary destructive button (`action/destructive`) |
| `text/on-primary-subtle` | `base/white-a80` | Translucent white text on primary surface (Wax Seal's HOLD label; reusable for other translucent-on-vivid patterns) |
| `text/action` | `mulberry/600` | Mulberry-colored body text (links, accents) |
| `text/action-strong` | `mulberry/700` | Emphasized mulberry text — stronger variant of `text/action`. Same primitive as `text/on-accent` but distinct standalone role |
| `text/strong` | `sanmarino/700` | Emphasized text — stronger than `text/secondary`, softer than `text/paragraph`. Same primitive as `text/on-neutral` but distinct standalone role |

Scope: `TEXT_FILL`.

#### Icons

Mirrors `text/*` plus mulberry/success additions. Scoped versatile (`FRAME_FILL`, `SHAPE_FILL`, `STROKE_COLOR`) so it works for both stroke-based Lucide icons and filled glyphs.

| Token | Aliases to | Role |
|---|---|---|
| `icon/headline` | `sanmarino/950` | Icons matching headline weight |
| `icon/paragraph` | `sanmarino/800` | Icons matching paragraph weight |
| `icon/default` | `sanmarino/600` | Default UI icon (nav, list items) |
| `icon/secondary` | `sanmarino/600-a90` | Softer icons |
| `icon/muted` | `sanmarino/300` | Low-emphasis / placeholder icons |
| `icon/disabled` | `graychateau/400` | Disabled icons |
| `icon/on-action` | `base/white` | Icon on vivid mulberry button |
| `icon/on-action-secondary` | `sanmarino/700` | Icon on the soft `action/secondary` button — mirrors `text/on-action-secondary` |
| `icon/action` | `mulberry/600` | Mulberry-colored icon (accent, default state) |
| `icon/action-strong` | `mulberry/700` | Emphasized mulberry icon — mirrors `text/action-strong`. Same primitive as `icon/on-accent` but distinct standalone role |
| `icon/on-accent` | `mulberry/700` | Icon on soft mulberry surface (active nav) |
| `icon/strong` | `sanmarino/700` | Emphasized icon — mirrors `text/strong`. Same primitive as `icon/on-neutral`, distinct standalone role |
| `icon/on-success` | `success/700` | Icon on soft success surface |
| `icon/on-warning` | `warning/700` | Icon on soft warning surface |
| `icon/on-neutral` | `sanmarino/700` | Icon on neutral badge |
| `icon/danger` | `danger/700` | Destructive-colored icon on white/normal surface (mirrors `icon/action` for danger) |
| `icon/on-danger` | `danger/800` | Icon on soft danger surface (`bg/danger`) |
| `icon/on-destructive` | `base/white` | Icon on primary destructive button (`action/destructive`) |

#### Action

| Token | Aliases to | Role |
|---|---|---|
| `action/primary` | `mulberry/600` | Primary CTA |
| `action/primary-hover` | `mulberry/700` | Primary CTA hover (next ramp step — never opacity) |
| `action/secondary` | `sanmarino/50` | Secondary CTA — soft sanmarino fill (avoids competing with mulberry primary in hierarchy). Same value as `bg/sunken` but distinct role |
| `action/secondary-hover` | `sanmarino/100` | Secondary CTA hover (next ramp step, same value as `bg/highlight`) |
| `action/destructive` | `danger/700` | Destructive CTA (delete, remove — irreversible actions) |
| `action/destructive-hover` | `danger/800` | Destructive CTA hover (next ramp step) |

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

For soft surfaces (tag, alert, banner, Badge component), use the role-family tokens: `bg/<status>`, `border/<status>`, `text/on-<status>`, `icon/on-<status>` — currently `success`, `warning`, `neutral`, and `danger` follow this pattern. The vivid `status/*` tokens are for chip/badge/dot use. Add the `info` and `pending` soft surfaces when first screen needs them (will need /100, /200, /700 primitives).

### Danger vs destructive

Two red-keyed vocabularies that read like synonyms but split cleanly by **outcome**, not appearance:

- **`danger/*`** — non-interactive *status / feedback*: error text, soft alert surfaces, badges, borders on those surfaces. A member of the status family above (`bg/success`, `bg/warning`, `bg/danger`), sharing its grammar. Also owns the shared red text color (`text/danger`, `icon/danger`), which a *ghost* destructive control borrows for its resting label — exactly as a ghost mulberry button borrows `text/action`.
- **`destructive/*`** — the interactive *control that destroys something*, in **every** variant (solid fill + hover, ghost hover surfaces, white foregrounds on the solid fill). An action variant, sibling to `action/primary` / `action/secondary` — what shadcn calls `variant="destructive"`.

The line is *outcome*, not visual weight: a ghost delete is as destructive as a solid one, so both live under `destructive/*`. What forced two words: `text/on-danger` was already the dark-text-on-soft-surface role (parallel to `text/on-success`), so white-text-on-the-solid-button needed its own name — `text/on-destructive` — mirroring how mulberry splits `text/on-accent` (soft surface) from `text/on-action` (vivid button).

Current working rule — to be validated once destructive components are built, not treated as locked. Component-level usage (which Button Type binds which token, etc.) lands in `Component_Conventions.md` when those components exist.

---

## Spacing

Single collection, FLOAT, scope `GAP` (covers itemSpacing + padding). 4px scale mirroring Tailwind.

| Figma | CSS | Tailwind | Pixels |
|---|---|---|---|
| `space-0` | `--spacing-0` | `gap-0`, `p-0` | 0 |
| `space-0-5` | `--spacing-0-5` | `gap-0.5`, `p-0.5` | 2 |
| `space-1` | `--spacing-1` | `gap-1`, `p-1` | 4 |
| `space-1-5` | `--spacing-1-5` | `gap-1.5`, `p-1.5` | 6 |
| `space-2` | `--spacing-2` | `gap-2`, `p-2` | 8 |
| `space-2-5` | `--spacing-2-5` | `gap-2.5`, `p-2.5` | 10 |
| `space-3` | `--spacing-3` | `gap-3`, `p-3` | 12 |
| `space-3-5` | `--spacing-3-5` | `gap-3.5`, `p-3.5` | 14 |
| `space-4` | `--spacing-4` | `gap-4`, `p-4` | 16 |
| `space-5` | `--spacing-5` | `gap-5`, `p-5` | 20 |
| `space-6` | `--spacing-6` | `gap-6`, `p-6` | 24 |
| `space-7` | `--spacing-7` | `gap-7`, `p-7` | 28 |
| `space-8` | `--spacing-8` | `gap-8`, `p-8` | 32 |
| `space-9` | `--spacing-9` | `gap-9`, `p-9` | 36 |
| `space-10` | `--spacing-10` | `gap-10`, `p-10` | 40 |
| `space-11` | `--spacing-11` | `gap-11`, `p-11` | 44 |
| `space-12` | `--spacing-12` | `gap-12`, `p-12` | 48 |
| `space-14` | `--spacing-14` | `gap-14`, `p-14` | 56 |
| `space-16` | `--spacing-16` | `gap-16`, `p-16` | 64 |
| `space-20` | `--spacing-20` | `gap-20`, `p-20` | 80 |
| `space-24` | `--spacing-24` | `gap-24`, `p-24` | 96 |

Skip `space-13`, `space-15`, `space-17`, `space-18`, `space-19`, etc. Add only when a real screen calls for them.

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
| `text-22` | `text-22` | 22 |
| `text-2xl` | `text-2xl` | 24 |
| `text-3xl` | `text-3xl` | 30 |
| `text-4xl` | `text-4xl` | 36 |
| `text-5xl` | `text-5xl` | 48 |

`text-4xl` and `text-5xl` aren't used by any active text style but remain defined for future use. `text-22` is pixel-named (not t-shirt sized) since 22 falls between the standard `text-xl` (20) and `text-2xl` (24) — pragmatic outlier in the otherwise t-shirt scale.

### Available font weights (self-hosted from `/public/fonts/`)

Declared via `@font-face` in `src/styles/globals.css`. No runtime requests to `fonts.googleapis.com` or `fonts.gstatic.com` — visitor IPs are not transferred to Google LLC. See `project_reckon_compliance_security` memory for the GDPR rationale.

| Family | Weights loaded | Used in styles |
|---|---|---|
| Domine | 700 (Bold) | Display/H1, Display/H2, Display/Card, Display/Small, Wordmark |
| Space Grotesk | 300, 400, 500, 600, 700 | Body/*, Caption/*, Heading/*, Label/Default |
| JetBrains Mono | 400, 500 | Mono/Caption-*, Mono/Body-* |

Notes:
- `index.html` previously loaded Domine 400/500/600 and JetBrains Mono 700 — trimmed after Domine's available styles in Figma were confirmed as Regular/Bold only and `Count` (the only JetBrains Mono Bold style) was removed. Space Grotesk 300 (Light) and 600 (Semi Bold) are currently loaded but unused by any active style; left in for future use.
- Adding or removing a weight is now a two-step manual chore: download the new `.woff2` from google-webfonts-helper into `public/fonts/`, then add its `@font-face` block in `globals.css`. Keep this table and the `@font-face` block in sync — they are the same contract, split across two files.

### Text Styles (18)

Each style binds its family and size to the Typography variables. Weight, line-height, text-case, and letter-spacing are baked into the style directly. The Tailwind shorthand goes in the Description field for Dev Mode visibility.

**Display (Domine, all Bold):**

| Text Style | Size / LH (px) | Tailwind shorthand |
|---|---|---|
| `Display/H1` | 30 / 36 | `font-display text-3xl font-bold` |
| `Display/H2` | 24 / 32 | `font-display text-2xl font-bold` |
| `Display/Card` | 20 / 28 | `font-display text-xl font-bold` |
| `Display/Small` | 18 / 28 | `font-display text-lg font-bold` |
| `Wordmark` | 30 / 36 | `font-display text-3xl font-bold` |

**Exception:** the Wax Seal component's "R" monogram uses Domine 18/16 Bold (line-height smaller than font-size) for visual centering inside the 44px sealed disc. This is a one-off geometric hack — not a repeatable typographic style — and is handled inline in the WaxSeal component, not as a shared text style. See `docs/Component_Conventions.md` for the rationale when the component is built.

**Heading (Space Grotesk, all Bold):**

| Text Style | Size / LH (px) | Tailwind shorthand |
|---|---|---|
| `Heading/Medium` | 22 / 28 | `text-22 font-bold` |
| `Heading/Small` | 16 / 24 | `text-base font-bold` |

**Body (Space Grotesk, lowercase):**

| Text Style | Style | Size / LH (px) | Tailwind shorthand |
|---|---|---|---|
| `Body/Lead` | Regular | 16 / 24 | `text-base` |
| `Body/Default` | Regular | 14 / 20 | `text-sm` |
| `Body/Medium` | Medium | 14 / 20 | `text-sm font-medium` |
| `Body/Emphasis` | Bold | 14 / 20 | `text-sm font-bold` |

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

Authored directly in Figma, not via variables. CSS values live in `globals.css` (shipped in commit `fb4bf61`).

| Figma effect style | Description (Dev Mode) | CSS to add to `@theme` |
|---|---|---|
| `shadow-xs` | `shadow-xs` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `shadow-sm` | `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.10)` |
| `shadow-md` | `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)` |
| `shadow-lg` | `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10)` |
| `shadow-xl` | `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.10)` |
| `shadow-2xl` | `shadow-2xl` | `0 25px 50px -12px rgb(0 0 0 / 0.25)` |
| `shadow-3xl` | `shadow-3xl` | `-20px 0 60px -20px rgb(0 0 0 / 0.35)` (lateral shadow for Settings Drawer sliding from right edge) |
| `focus ring` | `shadow-focus` | `0 0 0 3px rgb(200 59 134 / 0.30)` (mulberry/600 @ 30%, spread 3) |

---

## What's deferred

- **Full ramps** for `info` and `pending` — only `/500` anchors exist today. (`success`, `warning`, and `danger` already carry partial ramps: success `/100 /200 /500 /700`, warning `/100 /200 /500 /700`, danger `/100 /200 /500 /700 /800`.) Extend only when a screen needs the missing steps — the alert families are partial by design (see **Ramp policy** under Primitives).
- **Foundations documentation page** — the 🎨 Foundations page in Figma is still empty. To populate when time allows: color swatches per ramp, semantic role examples, spacing bars, radius row, type specimen.

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

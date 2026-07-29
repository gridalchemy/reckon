# Reckon — Component Conventions

_Last updated: 2026-07-29_

How components are named, shaped, and described in Figma — so that v0.1 and everything after stay consistent. Companion to `CLAUDE.md` (product / voice rules) and `Variable_Inventory.md` (the token contract).

Read top to bottom the first time. After that, the **Cheat sheet** at the bottom is the daily reference.

---

## When to consult this doc

- Before naming a new component, variant, property, or layer
- Before adding a new variant axis to an existing component
- Before writing a component description
- When the variant matrix feels "off" — usually it's the dead-cell rule (see § Variant matrix)

---

## 1 — Naming

### Components

- **PascalCase, singular noun.** `Button`, `Card`, `SectionHeader`, `EntryRow`, `WeeklyStrip`, `ChartBar`, `FeaturedIcons`.
- No prefixes like `App` or `UI`. The repo is Reckon — context is implied.
- Composite components keep the same convention. `WeeklyStrip` is built from a `Badge` + 7 × `ChartBar` + `Tooltip`. The name describes the *thing*, not its decomposition.

Avoid: `Sidebar Component`, `Button Group`, `Card V2`. Generic suffixes signal indecision.

### Variant property names

- **TitleCase, single word where possible.** `Type`, `State`, `Size`, `Tone`.
- Multi-word property names use TitleCase too: `With Icon`, `Left Icon`, `Assigned Project`.
- Property names are *axis-of-variation* labels. They answer "what makes these variants different from each other?"

The four canonical axes Reckon uses:

| Property | Purpose | Used on |
|---|---|---|
| `Type` | Visual treatment / family | Button, EntryRow |
| `State` | Interaction state | Most components |
| `Size` | Physical scale | FeaturedIcons |
| `Tone` | Semantic color tone | Badge |

### Variant values

- **TitleCase, abbreviated consistently.** `Default`, `Hover`, `Focus`, `Selected`, `Up`, `Flat`, `Down`, `Sketch`, `Decision`, `Md`, `Sm`.
- Multi-word values use a separator. `Focus/Typing` (slash) is the combined state on Input.
- **Pick an abbreviation and stick with it.** `Md` and `Sm` — never `Medium` and `Small` in one component and `Md` / `Sm` in another. The FeaturedIcons matrix is the precedent.

### Layer names inside components

The single best quality signal in a design system is whether layers are named.

- **Auto-named layers are bugs.** Anything matching `Frame \d+` should be renamed before merging. The EntryRow rename (`Frame 15528` → `Row`) and the Sidebar Footer renames (`Wrapper` → `Footer Row`, `Wrapper` → `Datenschutz Link`) were both this category.
- **Use role names, not type names.** `Bar`, `Fill`, `Labels`, `Trailing`, `Content`, `DayDate`, `Count`. Never `Frame`, `Rectangle`, `Wrapper`, `Container`, `Text` (unless `Text` actually describes the layer's role, which it almost never does).
- **Slot regions carry slot names.** `Content`, `Trailing`, `Labels`. Short, role-based.
- **Container layers carry container names.** `Header`, `Footer`, `Footer Row`, `BarRow`, `HeaderRow`, `StatBlock`. Position + role.

### Component property names

- **camelCase.** `label`, `icon`, `value`, `dayDate`, `count`, `dayName`, `date`, `lastTouched`, `decisions`, `name`, `project`, `time`, `hasTrailing`.
- TEXT properties get the noun for what they hold: `label`, `value`, `name`, `count`.
- BOOLEAN properties start with `has` (or use a verb): `hasTrailing`.
- INSTANCE_SWAP properties get the noun for the swappable thing: `icon`, `IconSwap`.

**One inconsistency to fix going forward:** older booleans use TitleCase with spaces (`Assigned Project`, `With Icon`, `Left Icon`); newer ones use camelCase (`hasTrailing`). New BOOLEAN properties should use camelCase to match the rest. Old ones can stay until there's a reason to touch them.

---

## 2 — Variant matrix

### Choosing variant axes

A property earns variant status when:

- It changes visual treatment significantly (color, shape, layout)
- All combinations with other properties are real (or the dead-cell rule applies — see below)
- The total variant count stays manageable (rule of thumb: under 30)

A property should be a **component property** (TEXT / BOOLEAN / INSTANCE_SWAP) instead when:

- It changes content but not structure (`label`, `value`, `icon`)
- It's a toggleable affordance (`hasTrailing`, `With Icon`, `Assigned Project`)
- It's a swappable sub-component (`icon`, `IconSwap`)

### Dead cells — the FeaturedIcons rule

When a variant property only applies to a subset of another axis, you get "dead cells" in the matrix.

FeaturedIcons has `Size=Sm/Md × Type=Sketch/Decision × State=Default/Hover`. But `Sm` doesn't visually respond to hover — small icons just don't. So `Size=Sm, State=Hover` is semantically dead.

**The fix:** create the dead cells as visual duplicates of their `State=Default` counterparts. The matrix stays complete, Figma's variant validator doesn't warn, and the intent is documented in the component description:

> *"Hover deepens the fill on Md only; on Sm, Hover is intentionally identical to Default — small icons don't respond visually to hover."*

The alternative (splitting into separate `FeaturedIconSm` / `FeaturedIconMd` components) is worse: doubles the maintenance and creates a worse instance-picker experience.

### Variant explosion warning signs

- More than ~30 variants total
- Adding a new axis triples the count
- Most cells share visuals with their neighbors

When you hit these, the fix is usually to **convert one of the axes into a component property** or to **split into a separate component**. Button sits at 15 variants (5 Type × 3 State). It works. A sixth Type would push it close to the limit.

---

## 3 — Component properties

### TEXT

For any text that consumers will routinely change. Always link the text node's `characters` reference to the property — never leave text as a direct-override pattern. Linking means the property shows in the inspector, and there's no risk of the override silently breaking if the source layer is renamed.

**Defaults are pragmatic.** They don't have to be the "perfect" generic. `label` on Button defaults to `"Button"`, which makes all 15 variants look identical in the gallery view. That's a trade-off: TEXT defaults can't vary per variant in Figma. We optimize for the *override at instance time*, not the gallery preview.

### BOOLEAN

For visibility toggles (`hasTrailing`, `With Icon`, `Assigned Project`) and on/off affordances.

Link to the target node's `visible` reference. Don't use BOOLEAN as a stand-in for a State variant — if hovering changes more than visibility, it's a State.

### INSTANCE_SWAP

For sub-component slots — icons mainly. The default is the most-common case (`plus` for Button, `home` for NavItem, `search` for Input).

**Exception logged on Button:** the `icon` swap is only linked across Primary / Secondary / Ghost variants. Link Md and Link Sm keep their `arrow-right` hardcoded because the arrow is semantic to the Link type, not a customization point. Consumers wanting a different icon on a Link button should detach.

### Defaults

- **TEXT default** = whatever the variant gallery should show. Tooltip's `dayDate` default keeps the original trailing-space alignment from the manual build (`"Sun, Jun 1    "`) so the layout doesn't shift.
- **BOOLEAN default** = whichever state is the more common starting point. `hasTrailing` defaults to `true` because both Home-screen instances of SectionHeader use a trailing slot.
- **INSTANCE_SWAP default** = the most common icon for this component's usage.

---

## 4 — Slots and composition

Composition beats variant multiplication. Two patterns are in use across Reckon.

### Slot pattern

The component has a named region (an auto-layout frame) that consumers fill via instance override or detach.

- **Card** has a `Content` slot — accepts any layout (eyebrow + meta, headline + prose, project rows, charts).
- **SectionHeader** has a `Trailing` slot — accepts a Caption label ("Last 7 days"), a Link Sm ("View all projects →"), or nothing (via the `hasTrailing` boolean).

Slots are conventional auto-layout frames named with the slot role (`Content`, `Trailing`). Figma's plugin API can't yet create the new "Slot" node type — convert a frame to a slot manually via the Figma UI if/when the feature stabilizes.

### Compose-instead pattern

When a behavior is the combination of two existing components, **don't add a variant**. Compose at the parent level.

- ChartBar's `State=Hover` shows the highlighted border. The *tooltip-on-hover* is composed in WeeklyStrip (a Tooltip instance overlaid above the hovered bar), not baked into a `State=Hover-with-Tooltip` variant.
- NavItem's `State=Selected` wins over Hover. There's no combined `Selected+Hover` variant — selected wins, no extra hover styling on top.

The reason is simple: if every interaction combination becomes its own variant, the matrix explodes and overrides stop working. Composition keeps the component vocabulary small and the layered behavior emergent.

---

## 5 — States and tokens

### State value vocabulary

| State | Visual treatment | Token rule |
|---|---|---|
| `Default` | Resting state | Base tokens |
| `Hover` | Anticipates click | **Next step deeper on the color ramp** (mulberry-600 → mulberry-700). Never opacity-based lightening. |
| `Focus` | Keyboard focus | `Box Shadow/shadow-focus` applied on top of Default |
| `Filled` | Has user-entered content (Input) | Distinct from Focus — Focus reads as "cursor here," Filled reads as "content here." Both earn their own variant. |
| `Selected` | Active route or item | `bg/accent` background, `text/on-accent` text |
| `Disabled` | Unavailable affordance | **Per-component-class** — see "Disabled strategy" below |

### Border on hover

For non-text surfaces (cards, bars, rows), Hover steps the border:

`border/default` (sanmarino-200 at α 0.55) → `border/highlight` (sanmarino-300 at α 1.0)

The contrast is intentional. If it feels too sharp in a given context, tune `border/default` at the token level (bump alpha to 0.65), not at the component level. Token changes propagate everywhere.

### Disabled strategy

Two patterns apply depending on the component class:

| Component class | Approach | Why |
|---|---|---|
| **Buttons** (and typed CTAs) | **Opacity 75% on the matching Default per Type** | Preserves type semantics: a disabled Primary still reads as the main mulberry CTA in an unavailable state, not just a generic disabled control. |
| **Surfaces / inputs / structural elements** | **Designated disabled tokens** (`text/disabled`, `icon/disabled`, future `bg/disabled` / `border/disabled`) | Type semantics don't apply; the surface itself should read "unavailable" via dedicated tokens, not opacity. |

The 75% threshold for buttons hits 3:1 contrast across all Type × Default combos — well above the UI-component floor.

### Accessibility floor

From `CLAUDE.md`, repeated here because it's load-bearing for every component:

- 4.5:1 for body text, 3:1 for large text and UI components
- Hover and focus states must darken; never use opacity-based lightening
- Disabled is the documented exception, but only for buttons (opacity-based) — surfaces use designated tokens

---

## 6 — Description field

Every component gets a description. Two sentences, Reckon voice. The description is documentation that sits with the asset, not in a separate sheet — that's why it matters.

### Voice

- **Flowing, design-anchored.** "The bare surface — a soft white panel that holds whatever you stack inside it."
- **Never corporate.** Skip "This component is used for..." / "The Button component allows users to..."
- **Reference real usage by name.** "Home uses this for 'This week at a glance' and 'Recent by project.'"
- **State the trade-offs and intentional decisions.** "Sm is intentionally identical to Default — small icons don't respond visually to hover."

### Content checklist

1. What the component is (one sentence)
2. Key properties and how to use them (one sentence)
3. Any intentional exception or composition rule (only if there is one)

### Examples

> **Card** — "A soft surface to hold whatever you stack inside — entries, prose, charts, project rows. Drop content into the Content slot; the card hugs the height. Bound to bg/surface and border/default, with rounded-2xl corners and space-6 of breathing room."

> **Badge** — "A delta pill showing change vs the previous period. Tone=Up (green, trending-up icon) for higher, Tone=Flat (sanmarino neutral, minus icon) for unchanged, Tone=Down (warning amber, trending-down icon) for lower — amber over red because Reckon is observational, not punitive. The icon and tone color are bound to the Tone variant; set the text via value."

> **NavItem** — "A row in the sidebar nav — icon + label. Swap the icon via the IconSwap property, set the text via the label property. State=Selected blocks hover styling (no combined Selected+Hover variant — selected wins)."

---

## 7 — Known exceptions (the gotchas log)

Decisions that look inconsistent on inspection but are intentional. Each one earns its place because the alternative was worse.

| Component | Exception | Reason |
|---|---|---|
| **FeaturedIcons** | Sm/Hover variants are duplicates of Sm/Default | Small icons don't visually respond to hover. Splitting into two components is worse than carrying two duplicate cells. |
| **Button** | `icon` INSTANCE_SWAP only applies to Primary / Secondary / Ghost; Link Md/Sm keep arrow-right hardcoded | Arrow-right is semantic to the Link type. A swap default would make Link buttons show `plus` — wrong. |
| **Button** | `label` TEXT default is `"Button"` (variants all show "Button" in the gallery) | TEXT defaults can't vary per variant in Figma. We optimize for the override at instance time, not the gallery view. |
| **ChartBar** | Source Fill is fixed at 72h; per-bar height in WeeklyStrip uses detached copies | Figma's plugin API doesn't allow size overrides on instance children. In React, heights will be driven by data per bar and this constraint disappears. |
| **WeeklyStrip** | 7 ChartBar instances are detached, not linked | Same Figma constraint as above. The composite is a showcase; the real app drives heights via data. |
| **NavItem** | No combined `Selected+Hover` variant | Selected wins; no extra hover styling layered on top. Cleaner than a fourth state. |
| **Tooltip** | Structural punctuation (`·`) lives in the component, not in props | The dot is a visual rhythm device, not user content. Only content-shaped fields (`dayDate`, `count`) earn property status; separators categorically don't. Useful test for any future component: does this hold *content* the consumer would sensibly change? If no, it stays in the component. |
| **Button** | Disabled = opacity 75% on the matching Default per Type (not a unified grey disabled) | Preserves Type semantics. Disabled Primary still reads as the main mulberry CTA, just unavailable. Surfaces/inputs will use designated disabled tokens instead — see § States and tokens. |
| **Button** | Secondary uses a soft (sanmarino-50/100) surface, not the saturated dark sanmarino | A fully saturated Secondary competes with Primary for visual emphasis. The light surface gives Primary the saturated lane and Secondary the soft lane — clearer hierarchy, modern systems convention (shadcn, Linear, Vercel). |
| **WaxSeal** *(logged ahead of build)* | The "R" monogram uses Domine 18/16 — line-height smaller than font-size — instead of a shared text style | A one-off geometric hack to visually center a single-glyph monogram in the 44px sealed disc. Encoding it as a text style would pollute the ramp. Handled inline in the component with a comment noting why. |

---

## Cheat sheet

```
COMPONENT NAME       PascalCase, singular noun                 Card, EntryRow, WeeklyStrip
VARIANT PROPERTY     TitleCase (single word preferred)         Type, State, Size, Tone
VARIANT VALUE        TitleCase, abbreviated consistently       Default, Hover, Md, Sm, Up
LAYER NAME           Role-based, never auto-named              Bar, Fill, Labels, Trailing
COMPONENT PROPERTY   camelCase nouns / `has`+noun booleans     label, icon, hasTrailing

DESCRIPTION          2 sentences, Reckon voice, name real usages

WHEN TO USE A VARIANT:        Visual treatment changes significantly
WHEN TO USE A PROPERTY:       Content / affordance changes only

DEAD CELL RULE:               Fill irrelevant cells with duplicates of the
                              applicable Default. Document in description.

HOVER TOKEN RULE:             Step deeper on the ramp (border/default
                              → border/highlight). Never opacity-lightening.

FOCUS RULE:                   Apply Box Shadow/shadow-focus on top of Default.

COMPOSE INSTEAD OF MULTIPLY:  Two existing components combined → compose
                              at the parent level. Don't bake into a variant.

NAMED, NOT AUTO:              Rename every Frame N before merging.
```

---

_Sources of truth alongside this file: `CLAUDE.md` for product / voice rules, `Variable_Inventory.md` for the token contract, the Figma file for the components themselves._

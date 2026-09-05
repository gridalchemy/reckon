/**
 * The Entry data model — a single unit of captured thinking.
 *
 * Source of truth: docs/Product_Spec.md § Data model. Fields mirror that
 * section 1:1; do not add fields here without updating the spec in the
 * same session.
 */

export type EntryState = "sketch" | "decision"

/**
 * A single option in a Sketch's "options you're weighing" list.
 *
 * Provisional shape for Session 8a — 8b finalizes the full shape when the
 * radio-group UI lands and we decide where the "currently leaning toward"
 * state lives (on the row itself, or on the Entry as a separate field).
 * Storage helpers only need `id` + `text`.
 */
export interface Option {
  id: string
  text: string
}

export interface Entry {
  id: string
  title: string
  context: string
  options: Option[]
  /** Populated when `state === "decision"`. The text of the chosen option. */
  choice?: string
  rationale: string
  state: EntryState
  /**
   * Optional foreign key to Project.id. `undefined` = "No project" (the
   * Unassigned bucket in the Library). No sentinel string — Product Spec
   * § Entry ↔ Project link is explicit that undefined is the shape.
   */
  projectId?: string
  tags: string[]
  createdAt: number
  /** Populated when `state === "decision"`. */
  sealedAt?: number
  /**
   * Binary flag for demo-loaded entries so Settings → "Clear demo data" can
   * scoped-delete them without touching user-captured entries.
   *
   * Stored as `0 | 1` (not `boolean`) because IndexedDB does not accept
   * boolean values as index keys — the § Data model calls this a boolean,
   * which describes intent; the numeric encoding is the storage shape that
   * lets `by-isDemo` actually be an index (see `src/lib/db.ts`).
   *
   * 1 = demo-loaded. 0 = user-captured (default).
   */
  isDemo: 0 | 1
}

/**
 * The Project data model — a lightweight grouping label for entries.
 *
 * Source of truth: docs/Product_Spec.md § Data model. Nothing else lives on
 * a Project in v0.1 (no color, no archive flag, no description) — if a
 * screen needs more, add it here and in the spec in the same session.
 */

export interface Project {
  id: string
  name: string
  createdAt: number
}

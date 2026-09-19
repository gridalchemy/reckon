import { ArrowUp, X as XIcon } from "lucide-react"
import { cn } from "cn"

import type { Option } from "@/types/entry"

/**
 * A single row in the New Sketch modal's "Options you're weighing" list,
 * and in the Entry Detail edit mode when Session 9 wires that up.
 *
 * Replaces the old RadioGroup pattern with a Lean-pill affordance
 * (Design 2, Figma 1867:2430). Rationale:
 * - Sketches are exploratory; a required-feeling radio was misleading
 *   ("pick one" pressure when the spec is optional).
 * - Radios don't natively deselect — a user who click-tested three
 *   options was stuck with whichever they clicked last.
 * - The Lean pill is a toggle: click Lean → the pill fills in mulberry
 *   as "Leaning"; click Leaning → back to nothing. Single-lean across
 *   the whole options list (leaning Option B auto-unleans Option A;
 *   parent enforces this via its onLean handler).
 *
 * Visibility rules per Figma:
 * - Empty row: × is hover-revealed; no Lean pill (leaning toward
 *   nothing is meaningless).
 * - Filled + not-leaning: Lean pill (ghost outline) hover-revealed; ×
 *   hover-revealed.
 * - Leaning: Leaning pill (solid mulberry) always visible; × hover-
 *   revealed.
 * - Sealed (Session 10): Leaning pill at opacity-75, no × at all — the
 *   `sealed` prop switches the row into read-only mode.
 *
 * Keyboard access:
 * - `group-focus-within:*` variants mirror `group-hover:*` on both
 *   pills and ×, so a keyboard user tabbing into the input sees the
 *   same affordances as a mouse user hovering.
 */

export interface OptionRowProps {
  option: Option
  /** 0-based index; drives the placeholder ("Option A", "Option B", …). */
  index: number
  /** True when this row is the currently-leaned option. */
  isLeaning: boolean
  /** True when the entry is sealed (Decision) — Session 10. Read-only. */
  sealed?: boolean
  onTextChange: (id: string, text: string) => void
  onLean: (id: string) => void
  onUnlean: () => void
  onRemove: (id: string) => void
}

export function OptionRow({
  option,
  index,
  isLeaning,
  sealed = false,
  onTextChange,
  onLean,
  onUnlean,
  onRemove,
}: OptionRowProps) {
  const hasText = option.text.trim().length > 0
  const letter = String.fromCharCode(65 + (index % 26))
  const placeholder = `Option ${letter}`

  return (
    <div
      className={cn(
        // min-h-10 keeps every row at 40px so the row doesn't bounce
        // when the Leaning pill appears/disappears (the pill's height
        // exceeds the bare input's, and without min-h the row shrinks
        // to whichever child is tallest per state).
        "group flex min-h-10 items-center gap-3.5 rounded-lg p-2 transition-colors",
        !sealed && "hover:bg-bg-hover focus-within:bg-bg-hover",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {sealed ? (
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm leading-5 text-text-strong",
              isLeaning ? "font-medium" : "font-normal",
            )}
          >
            {option.text || placeholder}
          </span>
        ) : (
          <input
            type="text"
            value={option.text}
            onChange={(e) => onTextChange(option.id, e.target.value)}
            placeholder={placeholder}
            aria-label={option.text.trim() || placeholder}
            className={cn(
              "min-w-0 flex-1 bg-transparent text-sm leading-5 text-text-strong outline-none placeholder:text-text-muted",
              isLeaning ? "font-medium" : "font-normal",
            )}
          />
        )}

        {/* Lean pill — only surfaces for filled, not-leaning rows on
            row hover / focus-within. Meaningless on empty rows. */}
        {hasText && !isLeaning && !sealed ? (
          <button
            type="button"
            onClick={() => onLean(option.id)}
            aria-label={`Lean toward "${option.text.trim()}"`}
            className="hidden shrink-0 items-center gap-1 rounded-full border-[1.25px] border-border-default bg-bg-surface px-2 py-1 text-xs font-medium leading-4 text-text-secondary transition-colors hover:border-action-primary hover:text-text-action focus-visible:shadow-focus focus-visible:outline-none group-focus-within:inline-flex group-hover:inline-flex"
          >
            <ArrowUp className="size-3" strokeWidth={2} aria-hidden />
            Lean
          </button>
        ) : null}

        {/* Leaning pill — always visible when this row is the leaned
            option. Click un-leans (returns to nothing-leaned). Sealed
            renders at opacity-75 with the click disabled. */}
        {isLeaning ? (
          <button
            type="button"
            onClick={sealed ? undefined : onUnlean}
            disabled={sealed}
            aria-label={sealed ? "Chosen option" : "Un-lean this option"}
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full bg-action-primary px-2 py-1 text-xs font-medium leading-4 text-text-on-action transition-opacity focus-visible:shadow-focus focus-visible:outline-none",
              sealed && "cursor-default opacity-75",
            )}
          >
            <ArrowUp className="size-3" strokeWidth={2} aria-hidden />
            Leaning
          </button>
        ) : null}
      </div>

      {/* Remove × — always in the layout so its appearance doesn't shift
          the row, invisible until hover or focus-within. Available on
          empty rows too (a misclick on + Add option shouldn't lock the
          user out of removing the row). Not rendered when sealed. */}
      {!sealed ? (
        <button
          type="button"
          onClick={() => onRemove(option.id)}
          aria-label={`Remove ${option.text.trim() || placeholder}`}
          className="shrink-0 text-text-secondary opacity-0 transition-[color,opacity] hover:text-text-headline focus-visible:opacity-100 focus-visible:shadow-focus focus-visible:outline-none group-focus-within:opacity-100 group-hover:opacity-100"
        >
          <XIcon className="size-[14px]" strokeWidth={2} aria-hidden />
        </button>
      ) : null}
    </div>
  )
}

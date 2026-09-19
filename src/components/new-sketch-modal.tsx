import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Plus, X as XIcon } from "lucide-react"
import { useCallback, useState } from "react"

import { OptionRow } from "@/components/option-row"
import { ProjectCombobox } from "@/components/project-combobox"
import { Button } from "@/components/ui/button"
import { FeaturedIcons } from "@/components/ui/featured-icons"
import { createEntry } from "@/lib/db"
import type { Option } from "@/types/entry"

/**
 * The New Sketch capture modal (Figma node 1823:2642). Composed directly
 * from Base UI's Dialog primitive rather than the shadcn Dialog wrapper —
 * the wrapper is optimized for standard header/description dialogs, and
 * our layout is bespoke (six divided sections, custom header pill, custom
 * backdrop treatment).
 *
 * Persistence rule (Product Spec § New Sketch — create mode):
 * - Nothing is written to storage until Save Sketch (button or ⌘/Ctrl+Enter).
 * - Closing with ✕ discards everything. No autosave, no draft state.
 * - Empty option rows persist through save (§ Empty option rows persist).
 *   Empties are filtered out only at Lock-in (Session 10).
 *
 * Options use the Lean-pill pattern (Design 2, Figma 1867:2430) — see
 * OptionRow. RadioGroup was dropped after the mid-session UX call: a
 * required-feeling radio was misleading for an exploratory Sketch, and
 * radios can't natively deselect. Lean is a proper toggle, single-lean
 * across the list (leaning Option B auto-unleans Option A).
 *
 * The modal is controlled from the outside (Sidebar owns `open`), so any
 * future trigger (Home card CTA, keyboard shortcut) can raise the state
 * up to a shared parent without changing this component.
 */

export interface NewSketchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Optional notify hook — fires with the new entry's id after a save. */
  onSaved?: (entryId: string) => void
}

const makeEmptyOption = (): Option => ({
  id: crypto.randomUUID(),
  text: "",
})

interface ValidationErrors {
  title?: string
  context?: string
  options?: string
}

export function NewSketchModal({
  open,
  onOpenChange,
  onSaved,
}: NewSketchModalProps) {
  const [title, setTitle] = useState("")
  const [projectId, setProjectId] = useState<string | undefined>(undefined)
  const [context, setContext] = useState("")
  const [options, setOptions] = useState<Option[]>(() => [
    makeEmptyOption(),
    makeEmptyOption(),
  ])
  const [choiceOptionId, setChoiceOptionId] = useState<string | undefined>(
    undefined,
  )
  const [rationale, setRationale] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagDraft, setTagDraft] = useState("")
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [saving, setSaving] = useState(false)

  const reset = useCallback(() => {
    setTitle("")
    setProjectId(undefined)
    setContext("")
    setOptions([makeEmptyOption(), makeEmptyOption()])
    setChoiceOptionId(undefined)
    setRationale("")
    setTags([])
    setTagDraft("")
    setErrors({})
  }, [])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  const validate = (): ValidationErrors => {
    const next: ValidationErrors = {}
    if (!title.trim()) next.title = "Give your sketch a title."
    if (!context.trim())
      next.context = "What prompted this? A line or two is enough."
    if (!options.some((o) => o.text.trim()))
      next.options = "Add at least one option to weigh."
    return next
  }

  const handleSave = async () => {
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      const entry = await createEntry({
        title: title.trim(),
        context: context.trim(),
        options,
        choiceOptionId,
        rationale: rationale.trim(),
        state: "sketch",
        projectId,
        tags,
      })
      onSaved?.(entry.id)
      reset()
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  const handleAddOption = () => {
    setOptions((prev) => [...prev, makeEmptyOption()])
  }

  const handleRemoveOption = (id: string) => {
    setOptions((prev) => {
      const next = prev.filter((o) => o.id !== id)
      // If the leaning option was removed, clear the leaning state so
      // choiceOptionId never points at an id that no longer exists.
      if (choiceOptionId === id) {
        setChoiceOptionId(undefined)
      }
      // Removing an option can also clear the "at least one option"
      // validation if the removal happened to be an empty row while a
      // filled one remained, or fire it if the last filled row is gone.
      // clearErrorIfValid only clears; it never adds errors from typing,
      // so this is safe.
      clearErrorIfValid(
        "options",
        next.some((o) => o.text.trim().length > 0),
      )
      return next
    })
  }

  const handleLean = (id: string) => {
    // Single-lean across the list: leaning Option B auto-unleans Option A
    // because there's only one choiceOptionId slot.
    setChoiceOptionId(id)
  }

  const handleUnlean = () => {
    setChoiceOptionId(undefined)
  }

  // Clear a validation error the moment the field it's attached to becomes
  // valid again. Errors only appear after Save is clicked; once the user
  // starts fixing them, they should not linger. Never SETS new errors from
  // typing — that would validate pre-emptively.
  const clearErrorIfValid = (
    field: keyof ValidationErrors,
    isValid: boolean,
  ) => {
    if (errors[field] && isValid) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    clearErrorIfValid("title", value.trim().length > 0)
  }

  const handleContextChange = (value: string) => {
    setContext(value)
    clearErrorIfValid("context", value.trim().length > 0)
  }

  const handleOptionTextChange = (id: string, text: string) => {
    setOptions((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, text } : o))
      clearErrorIfValid(
        "options",
        next.some((o) => o.text.trim().length > 0),
      )
      return next
    })
  }

  const commitTag = () => {
    const trimmed = tagDraft.trim()
    if (!trimmed) return
    if (tags.includes(trimmed)) {
      setTagDraft("")
      return
    }
    setTags((prev) => [...prev, trimmed])
    setTagDraft("")
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      commitTag()
    } else if (e.key === "Backspace" && !tagDraft && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1))
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  // ⌘+Enter (Mac) / Ctrl+Enter (Windows/Linux) triggers Save. Attached to
  // the Popup itself so it only fires when focus is inside the modal —
  // Base UI already handles Escape → close.
  const handlePopupKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      void handleSave()
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        {/* No enter/exit animations — Base UI's data-ending-style waits for
            a transitionend/animationend on the popup to unmount, and the
            base-nova + tw-animate-css combo doesn't cleanly fire either
            for it (the `exit` keyframe has no 0% frame, animation-fill-mode
            is `none`, so the animation loops without a clean end event).
            Skipping animation entirely for v0.1; a follow-up can revisit
            with a `transition-*` (not `animate-*`) approach that fires a
            reliable transitionend, or use actionsRef.unmount(). */}
        <DialogPrimitive.Backdrop
          data-slot="dialog-overlay"
          className="fixed inset-0 z-40 bg-bg-backdrop backdrop-blur-xs"
        />
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          onKeyDown={handlePopupKeyDown}
          className="fixed top-1/2 left-1/2 z-50 flex w-[555px] min-w-[476px] max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-3xl border border-border-default bg-bg-surface shadow-md outline-none"
        >
          {/* Header: featured icon + label, project pill, close */}
          <div className="flex items-center justify-between gap-5 border-b border-border-divider px-6 pt-5 pb-5">
            <div className="flex min-w-0 items-center gap-2">
              <FeaturedIcons type="sketch" size="sm" />
              <span className="font-sans text-base font-bold leading-6 text-text-headline">
                New Sketch
              </span>
            </div>
            <div className="flex items-center gap-5">
              <ProjectCombobox
                value={projectId}
                onValueChange={setProjectId}
              />
              <DialogPrimitive.Close
                // Container is 30px so the hover bg has 6px of padding on
                // each side of the 18px icon. Base state has no bg, so the
                // extra area is invisible; on hover the bg-bg-hover fill
                // + rounded-md make the icon sit inside a soft square.
                // Matches Figma 1825:3009.
                className="flex size-[30px] items-center justify-center rounded-md p-1.5 text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-headline focus-visible:shadow-focus focus-visible:outline-none"
                aria-label="Close"
              >
                <XIcon className="size-[18px]" strokeWidth={2} aria-hidden />
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Title (editorial weight) */}
          <div className="border-b border-border-divider px-6 pt-4 pb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="What are you working through?"
              className="w-full bg-transparent font-display text-xl font-bold leading-7 text-text-headline outline-none placeholder:text-text-muted"
              autoFocus
              aria-invalid={errors.title ? "true" : undefined}
            />
            {errors.title ? (
              <p className="mt-1 text-xs text-text-danger" role="alert">
                {errors.title}
              </p>
            ) : null}
          </div>

          {/* Context */}
          <div className="flex flex-col gap-2 border-b border-border-divider px-6 pt-4 pb-4">
            <label
              htmlFor="new-sketch-context"
              className="font-sans text-xs font-medium uppercase leading-4 tracking-[0.3px] text-text-secondary"
            >
              Context
            </label>
            <textarea
              id="new-sketch-context"
              value={context}
              onChange={(e) => handleContextChange(e.target.value)}
              placeholder="What prompted this? What's the constraint?"
              rows={2}
              className="w-full resize-none bg-transparent font-sans text-sm leading-5 text-text-paragraph outline-none placeholder:text-text-muted"
              aria-invalid={errors.context ? "true" : undefined}
            />
            {errors.context ? (
              <p className="text-xs text-text-danger" role="alert">
                {errors.context}
              </p>
            ) : null}
          </div>

          {/* Options you're weighing (Design 2 — Lean pill, not radio) */}
          <div className="flex flex-col gap-2.5 border-b border-border-divider px-6 pt-4 pb-4">
            <span className="font-sans text-xs font-medium uppercase leading-4 tracking-[0.3px] text-text-secondary">
              Options you&rsquo;re weighing
            </span>
            <div className="flex flex-col gap-1">
              {options.map((option, index) => (
                <OptionRow
                  key={option.id}
                  option={option}
                  index={index}
                  isLeaning={choiceOptionId === option.id}
                  onTextChange={handleOptionTextChange}
                  onLean={handleLean}
                  onUnlean={handleUnlean}
                  onRemove={handleRemoveOption}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              onClick={handleAddOption}
              className="self-start rounded-xl px-4 py-1.5"
            >
              <Plus className="size-[18px]" strokeWidth={2} aria-hidden />
              Add option
            </Button>
            {errors.options ? (
              <p className="text-xs text-text-danger" role="alert">
                {errors.options}
              </p>
            ) : null}
          </div>

          {/* Rationale */}
          <div className="flex flex-col gap-2 border-b border-border-divider px-6 pt-4 pb-4">
            <label
              htmlFor="new-sketch-rationale"
              className="font-sans text-xs font-medium uppercase leading-4 tracking-[0.3px] text-text-secondary"
            >
              Rationale
            </label>
            <textarea
              id="new-sketch-rationale"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="The reasoning you'd want to remember later..."
              rows={2}
              className="w-full resize-none bg-transparent font-sans text-sm leading-5 text-text-paragraph outline-none placeholder:text-text-muted"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2 border-b border-border-divider px-6 pt-4 pb-4">
            <span className="font-sans text-xs font-medium uppercase leading-4 tracking-[0.3px] text-text-secondary">
              Tags
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  // Tag base sizing matches the Figma Tag component
                  // (1823:2968): px-2 py-1, text-xs, gap-1. Hover swaps
                  // border-default → border-highlight (bg stays sunken)
                  // per Figma Tag Hover (1823:2971).
                  className="inline-flex items-center gap-1 rounded-full border border-border-default bg-bg-sunken px-2 py-1 text-xs leading-4 text-text-strong transition-colors hover:border-border-highlight"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-text-secondary transition-colors hover:text-text-headline focus-visible:shadow-focus focus-visible:outline-none"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <XIcon className="size-3" strokeWidth={2} aria-hidden />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={commitTag}
                placeholder="Type a tag, press Enter"
                className="min-w-[140px] flex-1 bg-transparent font-sans text-sm leading-5 text-text-paragraph outline-none placeholder:text-text-muted"
              />
            </div>
          </div>

          {/* Footer: Save Sketch primary CTA */}
          <div className="flex items-center justify-end px-6 py-3.5">
            <Button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="rounded-xl px-4 py-1.5"
            >
              Save Sketch
            </Button>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

import { cva, type VariantProps } from "class-variance-authority"
import { Lightbulb } from "lucide-react"
import { cn } from "cn"

/**
 * The wax-seal indicator that marks an entry as a Sketch (lightbulb) or a
 * Decision (checkmark). See docs/Component_Conventions.md — this is the
 * FeaturedIcons component in the design system (Figma node 709:1703).
 *
 * v0.1 scope (Session 8b):
 * - Only the Sketch variant is implemented; that's what the New Sketch
 *   modal header needs.
 * - Only the Sm size is implemented (16px icon in a 28px pill).
 * - No Hover state — per the Figma component doc, Sm's Hover is
 *   intentionally identical to Default; small icons don't respond
 *   visually to hover. Md gets the hover treatment when Session 9 builds
 *   the Library cards.
 *
 * The CVA scaffold below carries the full variant axes (`type` and
 * `size`) up-front so Session 9 can extend them additively without
 * refactoring the API.
 */

const featuredIconsVariants = cva(
  "inline-flex items-center justify-center shrink-0",
  {
    variants: {
      type: {
        sketch: "bg-bg-accent text-mulberry-700",
        // TODO(Session 9): Decision variant — sanmarino-tinted background,
        // Check icon. Left as a placeholder using the same bg for now so
        // the API is stable; Library work will lock the exact tokens.
        decision: "bg-bg-accent text-mulberry-700",
      },
      size: {
        sm: "size-7 rounded-md p-1.5",
        // TODO(Session 9): Md size for Library cards — larger padding,
        // larger inner icon (24px?), plus the Hover treatment noted in
        // the Figma component doc ("Hover deepens the fill on Md only").
        md: "size-7 rounded-md p-1.5",
      },
    },
    defaultVariants: {
      type: "sketch",
      size: "sm",
    },
  },
)

export interface FeaturedIconsProps
  extends VariantProps<typeof featuredIconsVariants> {
  className?: string
}

export function FeaturedIcons({
  type = "sketch",
  size = "sm",
  className,
}: FeaturedIconsProps) {
  // Session 9 branches these two lines: Decision swaps in the Check icon
  // and Md swaps the inner size to `size-6`. Both are single-line changes
  // when the Library work forces them.
  const Icon = Lightbulb
  const innerSize = "size-4"

  return (
    <span
      className={cn(featuredIconsVariants({ type, size }), className)}
      data-slot="featured-icons"
      aria-hidden
    >
      <Icon className={innerSize} strokeWidth={2} />
    </span>
  )
}

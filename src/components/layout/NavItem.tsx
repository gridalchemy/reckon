import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

/**
 * A row in the sidebar nav — icon + label.
 *
 * Mirrors the NavItem component in Figma (node 813:394): three variants —
 * Default, Hover, Selected. Selected wins over Hover (no combined state).
 * Icon color follows text color via `currentColor` — our semantic tokens are
 * paired 1:1 across text/*, icon/* families (sanmarino/600 = text-secondary-solid
 * = icon-default; sanmarino/700 = text-strong = icon-strong; mulberry/700 =
 * text-on-accent = icon-on-accent), so one color class covers both.
 *
 * Polymorphic wrapper: pass `to` for a routed item (renders a react-router
 * <Link>) or `onClick` for a non-routed action (renders a <button>). The
 * caller — Sidebar — decides which. Selection is passed in, not derived
 * internally, so a single source of truth (useLocation) lives up-tree.
 */
interface NavItemProps {
  icon: LucideIcon
  label: string
  selected?: boolean
  /** Present for routed items (Home, Library, Reckoning, About). */
  to?: string
  /** Present for action items that don't change the URL (Settings drawer). */
  onClick?: () => void
}

export default function NavItem({
  icon: Icon,
  label,
  selected = false,
  to,
  onClick,
}: NavItemProps) {
  const className = cn(
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    "focus-visible:shadow-focus focus-visible:outline-none",
    selected
      ? "bg-bg-accent text-text-on-accent"
      : "text-text-secondary-solid hover:bg-bg-hover hover:text-text-strong",
  )
  const ariaCurrent = selected ? "page" : undefined

  const body = (
    <>
      <Icon className="size-5 shrink-0" strokeWidth={2} aria-hidden />
      <span className="leading-5">{label}</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} aria-current={ariaCurrent} className={className}>
        {body}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={ariaCurrent}
      className={className}
    >
      {body}
    </button>
  )
}

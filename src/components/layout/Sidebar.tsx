import { Home, Info, Library, Plus, Settings2, Sparkles } from "lucide-react"
import { useLocation } from "react-router-dom"

import NavItem from "@/components/layout/NavItem"

/**
 * The lefthand rail. Mirrors the Sidebar frame in Figma (node 760:2176):
 * Reckon wordmark, "+ New Sketch" primary CTA, five nav items (Home, Library,
 * Reckoning above the divider; Settings, About below), and the legal footer
 * (v0.1 · Datenschutz · Impressum) pinned to the bottom.
 *
 * Active state is derived from the current route (useLocation) so the URL is
 * the single source of truth. Settings is a <button> that fires a placeholder
 * — the drawer lands in Session 11. "+ New Sketch" is likewise a placeholder
 * — the capture flow lands in Session 8.
 */

const ROUTED_ITEMS = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Library, label: "Library", to: "/library" },
  { icon: Sparkles, label: "Reckoning", to: "/reckoning" },
] as const

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="sticky top-0 flex h-screen w-[248px] shrink-0 flex-col gap-5 border-r border-border-default bg-bg-sidebar px-5 py-7">
      {/* Header: wordmark + primary CTA */}
      <div className="flex flex-col gap-5">
        <p className="py-1 font-display text-3xl font-bold leading-9 text-text-headline">
          Reckon
        </p>

        <button
          type="button"
          onClick={() => console.log("New Sketch — Session 8")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-action-primary px-4 py-1.5 text-sm font-medium text-text-on-action shadow-sm transition-colors hover:bg-action-primary-hover focus-visible:shadow-focus focus-visible:outline-none"
        >
          <Plus className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />
          <span className="leading-5">New Sketch</span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex w-full flex-col gap-1">
        {ROUTED_ITEMS.map(({ icon, label, to }) => (
          <NavItem
            key={to}
            icon={icon}
            label={label}
            to={to}
            selected={pathname === to}
          />
        ))}
        {/* Div, not <hr>: Tailwind preflight doesn't reset hr's UA margin-block,
            which in some browsers leaks 8px vertical spacing that visually shifts
            everything below the divider away from its hitbox. */}
        <div
          role="separator"
          aria-orientation="horizontal"
          className="h-px w-full bg-border-divider"
        />
        <NavItem
          icon={Settings2}
          label="Settings"
          onClick={() => console.log("Settings drawer — Session 11")}
        />
        <NavItem
          icon={Info}
          label="About"
          to="/about"
          selected={pathname === "/about"}
        />
      </nav>

      {/* Footer: pushed to bottom of the rail */}
      <footer className="mt-auto flex items-center justify-center gap-1.5 text-xs leading-4 text-text-secondary-solid">
        <span>v0.1</span>
        <span aria-hidden>·</span>
        {/* Inactive placeholders — swap to <a href="/datenschutz"> and
            <a href="/impressum"> when compliance content lands. */}
        <span>Datenschutz</span>
        <span aria-hidden>·</span>
        <span>Impressum</span>
      </footer>
    </aside>
  )
}

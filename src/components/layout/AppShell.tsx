import { Outlet, useLocation } from "react-router-dom"

import Sidebar from "@/components/layout/Sidebar"

/**
 * App shell: sidebar rail on the left, active route rendered in <Outlet />
 * on the right. The min-h-screen + flex row lets the sidebar stretch to full
 * viewport height so its footer can pin to the bottom via `mt-auto`.
 *
 * Background: Home gets the `.bg-canvas-dots` treatment per locked
 * decision #9 (dotted-canvas surface); everywhere else stays on the flat
 * `bg-bg-page`. The Home-only scope is intentional — the dot alpha / tile
 * needs real-browser eyeballing before we roll it out app-wide. Promotion
 * is a one-line change: drop the `pathname === "/"` check so the dots
 * always render.
 *
 * String-concatenated instead of via `cn()` because tailwind-merge doesn't
 * know `.bg-canvas-dots` is a background-image-only utility and could
 * dedupe it against `bg-bg-page` under the shared `bg-*` prefix. Direct
 * concatenation keeps both classes on the element for the browser to
 * layer naturally.
 */
export default function AppShell() {
  const { pathname } = useLocation()
  const canvasDots = pathname === "/" ? " bg-canvas-dots" : ""

  return (
    <div className={`flex min-h-screen items-stretch bg-bg-page${canvasDots}`}>
      <Sidebar />
      <main className="min-w-0 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

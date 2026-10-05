import { Outlet } from "react-router-dom"

import Sidebar from "@/components/layout/Sidebar"

/**
 * App shell: sidebar rail on the left, active route rendered in <Outlet />
 * on the right. The min-h-screen + flex row lets the sidebar stretch to full
 * viewport height so its footer can pin to the bottom via `mt-auto`.
 *
 * Background: every screen carries the `.bg-canvas-dots` treatment per
 * locked decision #9 (dotted-canvas surface), layered over `bg-bg-page`.
 * Scope was Home-only through Session 8 while the dot values were being
 * eyeballed; they settled 2026-10-05 and the route check came out, so the
 * canvas is now uniform across the app. Values and the reasoning behind
 * them live in `globals.css` under "Canvas dots".
 *
 * Both classes are written out together rather than composed via `cn()`:
 * tailwind-merge doesn't know `.bg-canvas-dots` is a background-image-only
 * utility and could dedupe it against `bg-bg-page` under the shared `bg-*`
 * prefix. Keeping them as one literal string lets the browser layer them
 * naturally.
 */
export default function AppShell() {
  return (
    <div className="flex min-h-screen items-stretch bg-bg-page bg-canvas-dots">
      <Sidebar />
      <main className="min-w-0 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

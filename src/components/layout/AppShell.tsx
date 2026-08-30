import { Outlet } from "react-router-dom"

import Sidebar from "@/components/layout/Sidebar"

/**
 * App shell: sidebar rail on the left, active route rendered in <Outlet />
 * on the right. The min-h-screen + flex row lets the sidebar stretch to full
 * viewport height so its footer can pin to the bottom via `mt-auto`.
 */
export default function AppShell() {
  return (
    <div className="flex min-h-screen items-stretch bg-bg-page">
      <Sidebar />
      <main className="min-w-0 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

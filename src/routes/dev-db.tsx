import { useCallback, useEffect, useState } from "react"

import {
  clearAllData,
  createEntry,
  createProject,
  listEntries,
  listProjects,
} from "@/lib/db"
import type { Entry } from "@/types/entry"
import type { Project } from "@/types/project"

/**
 * Dev-only readback surface for the IndexedDB storage layer built in
 * Session 8a. Not a real screen — no Figma, no design polish. Its only
 * reason to exist is to verify that entries and projects round-trip through
 * IndexedDB correctly before UI is wired in Session 8b, and to stay as the
 * scratch surface for 8b (create an entry via the modal, come back here to
 * see it appear in the JSON dump).
 *
 * Deleted in Session 9 when the Library becomes the real testing surface.
 * Route registration is DEV-gated in `src/App.tsx`.
 */
export default function DevDbRoute() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [busy, setBusy] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const [nextEntries, nextProjects] = await Promise.all([
      listEntries(),
      listProjects(),
    ])
    setEntries(nextEntries)
    setProjects(nextProjects)
  }, [])

  useEffect(() => {
    // Dev-only scratch page; refresh() reads from IndexedDB (an external
    // system) and setState in the catch runs after promise resolution, not
    // synchronously within the effect body. Suspense + use() would be the
    // idiomatic React 19 answer but is overkill for a route that gets
    // deleted in Session 9.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh().catch((err: unknown) =>
      setLastError(err instanceof Error ? err.message : String(err)),
    )
  }, [refresh])

  const seed = async () => {
    setBusy(true)
    setLastError(null)
    try {
      const project = await createProject(
        `Test project · ${new Date().toLocaleTimeString()}`,
      )
      await createEntry({
        title: "What if onboarding was a single screen?",
        context:
          "Three steps feels like two too many. Name, workspace, done — could the whole thing fit on one screen? The risk is losing the guided feeling for less technical folks.",
        options: [
          { id: crypto.randomUUID(), text: "One screen — name + workspace" },
          { id: crypto.randomUUID(), text: "Keep step two for SSO setup" },
          { id: crypto.randomUUID(), text: "Progressive hints over three days" },
        ],
        rationale:
          "Our audience skews technical. Cutting steps is the highest-leverage change — hints can come later without a redesign.",
        state: "sketch",
        projectId: project.id,
        tags: ["onboarding", "simplicity"],
      })
      await createEntry({
        title: "Ship the redesigned settings drawer",
        context: "Prior settings pattern was a full route. Drawer keeps context.",
        options: [
          { id: crypto.randomUUID(), text: "Right-side drawer" },
          { id: crypto.randomUUID(), text: "Modal overlay" },
          { id: crypto.randomUUID(), text: "Slide from top" },
        ],
        choice: "Right-side drawer",
        rationale: "Slide-over preserves the underlying task. Modal breaks flow.",
        state: "decision",
        projectId: project.id,
        tags: ["settings", "shipped"],
        sealedAt: Date.now(),
      })
      await createEntry({
        title: "Unassigned Sketch — no project attached",
        context: "Verifying that projectId undefined works end-to-end.",
        options: [{ id: crypto.randomUUID(), text: "Just one option" }],
        rationale: "",
        state: "sketch",
        tags: [],
      })
      await refresh()
    } catch (err: unknown) {
      setLastError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const wipe = async () => {
    setBusy(true)
    setLastError(null)
    try {
      await clearAllData()
      await refresh()
    } catch (err: unknown) {
      setLastError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold text-text-headline">
          /dev/db
        </h1>
        <p className="text-sm text-text-secondary">
          IndexedDB storage-layer readback. Dev-only. Deleted in Session 9 once
          the Library becomes the real testing surface. Refresh the page after
          seeding to prove persistence.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void seed()}
          disabled={busy}
          className="rounded-md bg-action-primary px-4 py-2 text-sm font-medium text-text-on-action shadow-sm transition-colors hover:bg-action-primary-hover focus-visible:shadow-focus focus-visible:outline-none disabled:opacity-75"
        >
          Seed 3 test entries
        </button>
        <button
          type="button"
          onClick={() => void wipe()}
          disabled={busy}
          className="rounded-md border border-border-default bg-bg-surface px-4 py-2 text-sm font-medium text-text-headline transition-colors hover:bg-mulberry-50 focus-visible:shadow-focus focus-visible:outline-none disabled:opacity-75"
        >
          Clear all
        </button>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={busy}
          className="rounded-md border border-border-default bg-bg-surface px-4 py-2 text-sm font-medium text-text-headline transition-colors hover:bg-mulberry-50 focus-visible:shadow-focus focus-visible:outline-none disabled:opacity-75"
        >
          Refresh
        </button>
        <p className="ml-2 font-mono text-xs text-text-secondary">
          entries: {entries.length} · projects: {projects.length}
        </p>
      </div>

      {lastError ? (
        <p className="rounded-md border border-border-default bg-bg-surface p-3 font-mono text-xs text-mulberry-700">
          error: {lastError}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex min-w-0 flex-col gap-2">
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-secondary">
            entries ({entries.length})
          </h2>
          <pre className="max-h-[70vh] overflow-auto rounded-md border border-border-default bg-graychateau-50 p-3 font-mono text-xs leading-relaxed text-text-headline">
            {JSON.stringify(entries, null, 2)}
          </pre>
        </section>
        <section className="flex min-w-0 flex-col gap-2">
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-secondary">
            projects ({projects.length})
          </h2>
          <pre className="max-h-[70vh] overflow-auto rounded-md border border-border-default bg-graychateau-50 p-3 font-mono text-xs leading-relaxed text-text-headline">
            {JSON.stringify(projects, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  )
}

/**
 * IndexedDB storage layer for Reckon.
 *
 * Single database (`reckon`, v1) with two object stores: `entries` and
 * `projects`. Schema mirrors docs/Product_Spec.md § Data model. All helpers
 * return typed promises; UUIDs via `crypto.randomUUID()`; timestamps as
 * `Date.now()` numbers.
 *
 * Consumers should not touch the raw `idb` API — always go through the
 * helpers here so the transaction boundaries and type contracts stay in one
 * place.
 *
 * Note on `isDemo` encoding: § Data model calls this field a boolean, but
 * IndexedDB does not accept boolean values as index keys. To keep `by-isDemo`
 * as a real index (needed by Settings → "Clear demo data" without full-table
 * scans once Demo Mode is loaded), the field is stored as `0 | 1` at the
 * storage layer. See `src/types/entry.ts` for the same note on the type side.
 */

import { openDB, type DBSchema, type IDBPDatabase } from "idb"

import type { Entry, EntryState } from "@/types/entry"
import type { Project } from "@/types/project"

const DB_NAME = "reckon"
const DB_VERSION = 1

interface ReckonDB extends DBSchema {
  entries: {
    key: string
    value: Entry
    indexes: {
      "by-state": EntryState
      "by-project": string
      "by-createdAt": number
      "by-isDemo": 0 | 1
    }
  }
  projects: {
    key: string
    value: Project
    indexes: {
      "by-createdAt": number
    }
  }
}

let dbPromise: Promise<IDBPDatabase<ReckonDB>> | null = null

/**
 * Opens (or returns the cached) IndexedDB connection. Idempotent — the same
 * promise is reused for the lifetime of the tab, so callers pay the open
 * cost once and the browser doesn't juggle multiple connections.
 */
export function getDB(): Promise<IDBPDatabase<ReckonDB>> {
  if (!dbPromise) {
    dbPromise = openDB<ReckonDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const entries = db.createObjectStore("entries", { keyPath: "id" })
        entries.createIndex("by-state", "state")
        entries.createIndex("by-project", "projectId")
        entries.createIndex("by-createdAt", "createdAt")
        entries.createIndex("by-isDemo", "isDemo")

        const projects = db.createObjectStore("projects", { keyPath: "id" })
        projects.createIndex("by-createdAt", "createdAt")
      },
    })
  }
  return dbPromise
}

// ─── Entries ────────────────────────────────────────────────────────────────

/**
 * Input for `createEntry`. Everything the caller must know or want to set;
 * `id`, `createdAt`, and the `isDemo` default are stamped by the helper.
 */
export interface CreateEntryInput {
  title: string
  context: string
  options: Entry["options"]
  rationale: string
  state: EntryState
  projectId?: string
  tags: string[]
  /** Populated when `state === "decision"`. */
  choice?: string
  /** Populated when `state === "decision"`. */
  sealedAt?: number
  /** Defaults to `0` (user-captured). Demo Mode passes `1`. */
  isDemo?: 0 | 1
}

export async function createEntry(input: CreateEntryInput): Promise<Entry> {
  const entry: Entry = {
    id: crypto.randomUUID(),
    title: input.title,
    context: input.context,
    options: input.options,
    choice: input.choice,
    rationale: input.rationale,
    state: input.state,
    projectId: input.projectId,
    tags: input.tags,
    createdAt: Date.now(),
    sealedAt: input.sealedAt,
    isDemo: input.isDemo ?? 0,
  }
  const db = await getDB()
  await db.put("entries", entry)
  return entry
}

export async function getEntry(id: string): Promise<Entry | undefined> {
  const db = await getDB()
  return db.get("entries", id)
}

/**
 * Merge-patches an entry by id. `id` and `createdAt` are immutable — the
 * patch type excludes them so callers can't accidentally break provenance.
 * Business rules (e.g. sketch → decision requires `sealedAt` and `choice`)
 * live in the caller, not here — this helper is deliberately unopinionated.
 */
export async function updateEntry(
  id: string,
  patch: Partial<Omit<Entry, "id" | "createdAt">>,
): Promise<Entry> {
  const db = await getDB()
  const existing = await db.get("entries", id)
  if (!existing) {
    throw new Error(`updateEntry: entry not found (${id})`)
  }
  const updated: Entry = { ...existing, ...patch }
  await db.put("entries", updated)
  return updated
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await getDB()
  await db.delete("entries", id)
}

export interface ListEntriesFilter {
  state?: EntryState
  projectId?: string
}

/**
 * Returns entries, optionally filtered by `state` and/or `projectId`. When
 * both are supplied we index-scan by state (usually the smaller half) and
 * filter the result — IDB has no compound indexes and the entry volume
 * we're targeting (hundreds, not millions) doesn't justify one.
 */
export async function listEntries(
  filter?: ListEntriesFilter,
): Promise<Entry[]> {
  const db = await getDB()
  if (filter?.state && filter.projectId !== undefined) {
    const byState = await db.getAllFromIndex(
      "entries",
      "by-state",
      filter.state,
    )
    return byState.filter((e) => e.projectId === filter.projectId)
  }
  if (filter?.state) {
    return db.getAllFromIndex("entries", "by-state", filter.state)
  }
  if (filter?.projectId !== undefined) {
    return db.getAllFromIndex("entries", "by-project", filter.projectId)
  }
  return db.getAll("entries")
}

export async function listDemoEntries(): Promise<Entry[]> {
  const db = await getDB()
  return db.getAllFromIndex("entries", "by-isDemo", IDBKeyRange.only(1))
}

/**
 * Scoped-delete for Settings → "Clear demo data". Removes entries where
 * `isDemo === 1`; leaves user-captured entries untouched. Note that this
 * does not touch projects — Demo Mode's projects clear via `clearAllData`
 * or through the Settings flow when it lands.
 */
export async function clearDemoEntries(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction("entries", "readwrite")
  const demoIds = await tx.store
    .index("by-isDemo")
    .getAllKeys(IDBKeyRange.only(1))
  await Promise.all(demoIds.map((id) => tx.store.delete(id)))
  await tx.done
}

/**
 * The nuclear option — wipes both stores. Backs Settings → "Clear all local
 * data". Runs both clears in one transaction so the two stores can't fall
 * out of sync if the tab crashes mid-clear.
 */
export async function clearAllData(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(["entries", "projects"], "readwrite")
  await Promise.all([
    tx.objectStore("entries").clear(),
    tx.objectStore("projects").clear(),
  ])
  await tx.done
}

// ─── Projects ───────────────────────────────────────────────────────────────

export async function createProject(name: string): Promise<Project> {
  const project: Project = {
    id: crypto.randomUUID(),
    name,
    createdAt: Date.now(),
  }
  const db = await getDB()
  await db.put("projects", project)
  return project
}

export async function getProject(id: string): Promise<Project | undefined> {
  const db = await getDB()
  return db.get("projects", id)
}

export async function renameProject(
  id: string,
  name: string,
): Promise<Project> {
  const db = await getDB()
  const existing = await db.get("projects", id)
  if (!existing) {
    throw new Error(`renameProject: project not found (${id})`)
  }
  const updated: Project = { ...existing, name }
  await db.put("projects", updated)
  return updated
}

/**
 * Deletes a project and moves its entries to Unassigned (`projectId` set to
 * `undefined`). Entries are never deleted by project deletion — that would
 * be surprising, and the Library's Unassigned bucket exists precisely to
 * catch them. Both the project delete and the entry unassign run in one
 * transaction so a crash mid-run can't leave orphaned `projectId` values
 * pointing at a project that no longer exists.
 */
export async function deleteProject(id: string): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(["entries", "projects"], "readwrite")
  const orphaned = await tx
    .objectStore("entries")
    .index("by-project")
    .getAll(id)
  await Promise.all(
    orphaned.map((entry) =>
      tx.objectStore("entries").put({ ...entry, projectId: undefined }),
    ),
  )
  await tx.objectStore("projects").delete(id)
  await tx.done
}

/**
 * Returns all projects, oldest first. The `by-createdAt` index is used
 * here so the Combobox's default order is stable across sessions — the
 * caller (Session 8b) can re-sort if the design ever calls for it.
 */
export async function listProjects(): Promise<Project[]> {
  const db = await getDB()
  return db.getAllFromIndex("projects", "by-createdAt")
}

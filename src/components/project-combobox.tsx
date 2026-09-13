import Fuse from "fuse.js"
import { Check, ChevronDown } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { cn } from "cn"

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { createProject, listProjects } from "@/lib/db"
import type { Project } from "@/types/project"

/**
 * The project chooser in the New Sketch modal header — a Combobox built by
 * composing shadcn's Popover (floating dropdown) with Command (searchable
 * list). Fuse.js handles fuzzy matching over project names.
 *
 * Interaction model:
 * - Empty state (no project selected): pill shows "No project" + chevron.
 *   Clicking opens the dropdown.
 * - Selected state: pill shows the project name + chevron. Clicking opens
 *   the dropdown to change.
 * - To clear a selection: open the dropdown and pick "No project".
 *
 * (The Figma design shows a `×` affordance on the pill when a project is
 * selected. In code we defer that to a follow-up — it would require a
 * nested button inside the Popover trigger, which is an a11y anti-pattern
 * unless carefully handled. The "No project" option in the dropdown gives
 * the user the same clear affordance without the nesting.)
 *
 * The component owns its own projects list (fetched once on mount) so
 * consumers just pass a `value` / `onValueChange` pair — same shape as
 * shadcn's Select. Creating a new project happens inline: type text that
 * doesn't match any project → "Create '[typed]'" appears in the dropdown
 * → clicking it calls `createProject` and selects the returned project.
 */

export interface ProjectComboboxProps {
  /** Selected project's id. `undefined` = "No project" (unassigned). */
  value: string | undefined
  /** Called with the new selected id, or `undefined` to clear. */
  onValueChange: (projectId: string | undefined) => void
  className?: string
}

export function ProjectCombobox({
  value,
  onValueChange,
  className,
}: ProjectComboboxProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  // Load projects once on mount. If the modal opens more than once in the
  // same session and a project was created elsewhere in between (there is
  // no such path in 8b, but Session 9 might add one), we can revisit this
  // by refetching on `open` transitions.
  useEffect(() => {
    void listProjects().then(setProjects)
  }, [])

  const fuse = useMemo(
    () => new Fuse(projects, { keys: ["name"], threshold: 0.4 }),
    [projects],
  )

  const filteredProjects = useMemo(() => {
    const trimmed = search.trim()
    if (!trimmed) return projects
    return fuse.search(trimmed).map((result) => result.item)
  }, [fuse, projects, search])

  const trimmedSearch = search.trim()
  const exactMatchExists = projects.some(
    (p) => p.name.toLowerCase() === trimmedSearch.toLowerCase(),
  )
  const showCreate = trimmedSearch.length > 0 && !exactMatchExists

  const selectedProject = projects.find((p) => p.id === value)
  const triggerLabel = selectedProject?.name ?? "No project"

  const handleCreate = async () => {
    const project = await createProject(trimmedSearch)
    setProjects((prev) => [...prev, project])
    onValueChange(project.id)
    setSearch("")
    setOpen(false)
  }

  const handleSelectProject = (projectId: string) => {
    onValueChange(projectId)
    setSearch("")
    setOpen(false)
  }

  const handleSelectNoProject = () => {
    onValueChange(undefined)
    setSearch("")
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "inline-flex max-w-[220px] items-center gap-1.5 rounded-full border border-border-default bg-bg-sunken px-2.5 py-1 text-sm text-text-strong shadow-xs transition-colors hover:border-border-highlight hover:bg-bg-highlight focus-visible:shadow-focus focus-visible:outline-none",
          className,
        )}
      >
        <span className="truncate">{triggerLabel}</span>
        <ChevronDown
          className="size-4 shrink-0 text-text-secondary"
          strokeWidth={1.25}
          aria-hidden
        />
      </PopoverTrigger>
      {/* PopoverContent rendered conditionally on `open` for the same
          reason as NewSketchModal (see Sidebar.tsx) — Base UI's ending
          state gets stuck in this base-nova + Base UI combo, so the
          popover stays in the DOM at opacity 1 after close (only
          pointer-events: none). Conditional render unmounts it cleanly
          when `open` flips false. */}
      {open ? (
        <PopoverContent
          className="w-[265px] p-0"
          align="start"
          sideOffset={6}
        >
          {/* Command has its own filter; we're using Fuse externally so we
              turn cmdk's built-in filter off with shouldFilter={false}.
              We control cmdk's `value` prop to point at the chosen item —
              that way the highlight (bg-bg-hover) starts on the chosen
              row on open, and moves cleanly to whichever row the user
              hovers next. Chosen identity is signaled by the checkmark
              alone; the bg follows the cursor. Sentinel "__no-project__"
              is used when nothing is selected. */}
          <Command
            shouldFilter={false}
            value={value ?? "__no-project__"}
          >
            <CommandInput
              placeholder="Find or create…"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {/* Headless CommandGroup wraps "No project" so it gets the
                  same p-1 outer padding the Projects section has —
                  otherwise the row's bg would touch the dividers. */}
              <CommandGroup>
                <CommandItem
                  value="__no-project__"
                  onSelect={handleSelectNoProject}
                  className="cursor-pointer"
                >
                  <span className="min-w-0 flex-1 truncate">No project</span>
                  {value === undefined ? (
                    <Check
                      className="ml-auto size-4 text-icon-action"
                      aria-hidden
                    />
                  ) : null}
                </CommandItem>
              </CommandGroup>

              {(filteredProjects.length > 0 || showCreate) ? (
                <CommandSeparator />
              ) : null}

              {filteredProjects.length > 0 ? (
                <CommandGroup heading="Projects">
                  {filteredProjects.map((project) => (
                    <CommandItem
                      key={project.id}
                      value={project.id}
                      onSelect={() => handleSelectProject(project.id)}
                      className="cursor-pointer"
                    >
                      <span className="min-w-0 flex-1 truncate">
                        {project.name}
                      </span>
                      {value === project.id ? (
                        <Check
                          className="ml-auto size-4 text-icon-action"
                          aria-hidden
                        />
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {showCreate ? (
                <CommandGroup>
                  <CommandItem
                    value="__create__"
                    onSelect={() => void handleCreate()}
                    className="cursor-pointer text-text-strong"
                  >
                    Create &ldquo;{trimmedSearch}&rdquo;
                  </CommandItem>
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      ) : null}
    </Popover>
  )
}

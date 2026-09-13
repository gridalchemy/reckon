import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "cn"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SearchIcon } from "lucide-react"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      // No horizontal padding on the outer container — otherwise dividers
      // (CommandSeparator and the CommandInput border-b) would inherit the
      // inset and stop short of the popup edges. Per-row inset for the
      // highlight bg comes from each CommandGroup's own `p-1`, not from
      // this container.
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-xl! bg-popover text-popover-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0",
          className
        )}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    // Reckon overrides the base-nova shadcn default (which wrapped the input
    // in an InputGroup with a bg-input/30 fill) to match the Figma design:
    // flat surface, search icon left, single hairline divider under the row.
    <div
      data-slot="command-input-wrapper"
      className="flex items-center gap-2 border-b border-border-divider px-3"
    >
      <SearchIcon className="size-4 shrink-0 text-icon-strong" aria-hidden />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-10 w-full bg-transparent py-3 text-sm text-text-strong placeholder:text-text-muted outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      // Group heading uses the Label/Default text style from Figma:
      // uppercase + tracking + text-headline color. Overrides the shadcn
      // default which rendered it in muted-foreground without transforms.
      className={cn(
        "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:leading-4 **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-[0.3px] **:[[cmdk-group-heading]]:text-text-headline",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      // Full-width divider: no horizontal margin, uses the explicit
      // divider token. The `Command` container has no horizontal padding
      // (see comment there), so this reaches the popup edges cleanly.
      // Per-row inset for highlight bgs lives on each CommandGroup, not
      // on this separator.
      className={cn("h-px bg-border-divider", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      // data-selected fires on cmdk keyboard/mouse hover. Reckon uses
      // bg-bg-hover (#F4F6FB) — one subtle step above surface — instead
      // of the shadcn default bg-muted (#E9EDF5), which reads too dark
      // for a dropdown row. Text color stays as parent (text-strong).
      //
      // Note: cmdk stamps data-selected="false" on every non-selected
      // item (not just omits the attribute), so the shorthand
      // `data-selected:` variant (which compiles to `[data-selected]`
      // — attribute-presence only) would light up every row. Use the
      // explicit value match `data-[selected=true]:` instead.
      className={cn(
        "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-bg-hover [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      {/*
        Base-nova ships an invisible <CheckIcon opacity-0> here that only
        becomes visible when the item has `data-checked=true`. Reckon
        manages checkmarks explicitly at the usage site (see
        ProjectCombobox) — the always-rendered invisible icon sits to the
        right of any visible trailing element and pushes it leftward
        (with ml-auto both fight for the right edge). Removed to keep
        the visible checkmark flush right.
      */}
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}

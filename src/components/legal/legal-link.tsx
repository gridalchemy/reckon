import type { ReactNode } from "react"

const LINK_CLASSES =
  "rounded-sm text-text-action underline underline-offset-2 transition-colors hover:text-text-action-strong focus-visible:shadow-focus focus-visible:outline-none"

/** Inline link inside legal copy. External targets open in a new tab. */
export function LegalLink({
  href,
  external = false,
  children,
}: {
  href: string
  external?: boolean
  children: ReactNode
}) {
  return (
    <a
      href={href}
      className={LINK_CLASSES}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  )
}


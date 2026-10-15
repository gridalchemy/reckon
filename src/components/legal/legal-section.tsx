import type { ReactNode } from "react"

/** One titled block on a legal page. */
export function LegalSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg font-bold text-text-headline">
        {title}
      </h2>
      <div className="flex flex-col gap-2 text-sm text-text-paragraph">
        {children}
      </div>
    </section>
  )
}

import { useState, type ReactNode } from "react"

import { cn } from "cn"

/**
 * Shared shell for the legal pages (Impressum, Datenschutz).
 *
 * German is the legally binding version and the default; English is a
 * courtesy translation behind a small DE/EN toggle. Each page passes both
 * titles and a render function that returns the body for the active
 * language — two languages on two pages don't justify an i18n library.
 *
 * The toggle mirrors the Reckoning range toggle's shape (rounded-square
 * segments in a bordered container) but keeps Mulberry for the selected
 * segment, since switching language is a different job than picking a range.
 */

export type LegalLang = "de" | "en"

const LANGS: { value: LegalLang; label: string; name: string }[] = [
  { value: "de", label: "DE", name: "Deutsch" },
  { value: "en", label: "EN", name: "English" },
]

type LegalPageProps = {
  title: Record<LegalLang, string>
  children: (lang: LegalLang) => ReactNode
}

export function LegalPage({ title, children }: LegalPageProps) {
  const [lang, setLang] = useState<LegalLang>("de")

  return (
    <article
      lang={lang}
      className="mx-auto flex max-w-2xl flex-col gap-6 rounded-xl border border-border-default bg-bg-surface p-8 shadow-sm"
    >
      <header className="flex items-start justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-text-headline">
          {title[lang]}
        </h1>

        <div
          role="group"
          aria-label="Sprache / Language"
          className="flex shrink-0 gap-0.5 rounded-xl border border-border-default bg-bg-surface p-1"
        >
          {LANGS.map(({ value, label, name }) => (
            <button
              key={value}
              type="button"
              lang={value}
              aria-pressed={lang === value}
              aria-label={name}
              onClick={() => setLang(value)}
              className={cn(
                "rounded-lg px-2.5 py-1 font-mono text-xs font-medium transition-colors focus-visible:shadow-focus focus-visible:outline-none",
                lang === value
                  ? "bg-action-primary text-text-on-action"
                  : "text-text-secondary-solid hover:bg-bg-highlight hover:text-text-strong"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {lang === "en" ? (
        <p className="rounded-lg bg-bg-sunken px-3 py-2 text-xs text-text-strong">
          This English version is a courtesy translation. The German version is
          legally binding.
        </p>
      ) : null}

      {children(lang)}
    </article>
  )
}

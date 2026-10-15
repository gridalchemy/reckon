import { LegalLink } from "@/components/legal/legal-link"
import { LEGAL_EMAIL } from "@/lib/legal"

/** The responsible person's email as a mailto link. */
export function LegalEmail() {
  return <LegalLink href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</LegalLink>
}

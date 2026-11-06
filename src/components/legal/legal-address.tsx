import { Fragment } from "react"

import { LEGAL_ADDRESS_LINES } from "@/lib/legal"

/** The responsible person's postal address, one line per row. */
export function LegalAddress() {
  return LEGAL_ADDRESS_LINES.map((line, index) => (
    <Fragment key={line}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ))
}

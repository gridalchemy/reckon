import { LegalEmail } from "@/components/legal/legal-email"
import { LegalLink } from "@/components/legal/legal-link"
import { LegalPage } from "@/components/legal/legal-page"
import { LegalSection } from "@/components/legal/legal-section"
import { LEGAL_NAME } from "@/lib/legal"

/**
 * Impressum (legal notice), German + English.
 *
 * Content follows Lia's portfolio Impressum:
 * name + region + email, no postal address — a deliberate choice made
 * 2026-10-15 after the c/o options fell through. Reckon sits behind
 * Cloudflare Access (invite-only), which keeps it a small, individually
 * invited circle. Name and email come from build-time env vars
 * (src/lib/legal.ts) so they stay out of the public repo.
 *
 * No liability paragraph citations on purpose: the common "§§ 8 bis 10 DDG"
 * template wording is wrong (verified against the DDG, 2026-10-15).
 */

function ImpressumDe() {
  return (
    <>
      <LegalSection title="Angaben gemäß § 5 DDG">
        <p>
          {LEGAL_NAME}
          <br />
          Rheinland-Pfalz, Deutschland
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          E-Mail: <LegalEmail />
        </p>
        <p>
          Der Nutzung dieser Kontaktdaten zur Übersendung nicht ausdrücklich
          angeforderter Werbung wird hiermit widersprochen.
        </p>
      </LegalSection>

      <LegalSection title="Über dieses Projekt">
        <p>
          Reckon ist ein privates, nicht-kommerzielles Portfolio-Projekt. Es
          gibt keine Werbung, keine Bezahlfunktionen und keine
          Gewinnerzielungsabsicht. Reckon ist derzeit nur auf persönliche
          Einladung zugänglich. Einträge, die Sie in Reckon anlegen, bleiben
          lokal in Ihrem Browser gespeichert.
        </p>
      </LegalSection>

      <LegalSection title="Haftung für Inhalte">
        <p>
          Die Inhalte dieser Anwendung wurden mit Sorgfalt erstellt. Für ihre
          Richtigkeit, Vollständigkeit und Aktualität kann ich jedoch keine
          Gewähr übernehmen. Sobald mir eine konkrete Rechtsverletzung bekannt
          wird, entferne ich die betreffenden Inhalte umgehend.
        </p>
      </LegalSection>

      <LegalSection title="Haftung für Links">
        <p>
          Reckon enthält vereinzelt Links zu externen Websites. Zum Zeitpunkt
          der Verlinkung waren keine Rechtsverstöße erkennbar. Für die Inhalte
          verlinkter Seiten sind ausschließlich deren Betreiber verantwortlich.
          Werden mir Rechtsverletzungen bekannt, entferne ich den betreffenden
          Link umgehend.
        </p>
      </LegalSection>

      <LegalSection title="Urheberrecht">
        <p>
          Design und Inhalte von Reckon unterliegen dem deutschen
          Urheberrecht. Vervielfältigung, Bearbeitung und Verbreitung außerhalb
          der Grenzen des Urheberrechts bedürfen meiner schriftlichen
          Zustimmung. Downloads und Kopien sind nur für den privaten,
          nicht-kommerziellen Gebrauch gestattet.
        </p>
      </LegalSection>

      <LegalSection title="Schriften">
        <p>
          Reckon verwendet die Schriften Domine, Space Grotesk und JetBrains
          Mono, alle lizenziert unter der SIL Open Font License 1.1. Sie werden
          direkt von diesem Server ausgeliefert, es werden dabei keine Daten an
          Google übertragen. Urheber- und Lizenzhinweise:{" "}
          {/* Relative URL so it survives the *.pages.dev → custom-domain swap. */}
          <LegalLink href="/fonts/LICENSES.txt" external>
            LICENSES.txt
          </LegalLink>
          .
        </p>
      </LegalSection>
    </>
  )
}

function ImpressumEn() {
  return (
    <>
      <LegalSection title="Information pursuant to § 5 DDG">
        <p>
          {LEGAL_NAME}
          <br />
          Rhineland-Palatinate, Germany
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Email: <LegalEmail />
        </p>
        <p>
          Use of these contact details for sending unsolicited advertising is
          hereby objected to.
        </p>
      </LegalSection>

      <LegalSection title="About this project">
        <p>
          Reckon is a private, non-commercial portfolio project. There are no
          ads, no payments, and no intent to make a profit. Reckon is currently
          available by personal invitation only. Entries you create in Reckon
          stay stored locally in your browser.
        </p>
      </LegalSection>

      <LegalSection title="Liability for content">
        <p>
          The content of this application was created with care. I can't,
          however, guarantee that it is accurate, complete, or up to date. As
          soon as I learn of a specific legal violation, I'll remove the
          content in question right away.
        </p>
      </LegalSection>

      <LegalSection title="Liability for links">
        <p>
          Reckon occasionally links to external websites. No legal violations
          were apparent at the time of linking. The operators of linked sites
          are solely responsible for their content. If I learn of a legal
          violation, I'll remove the link in question right away.
        </p>
      </LegalSection>

      <LegalSection title="Copyright">
        <p>
          Reckon's design and content are protected by German copyright law.
          Reproduction, adaptation, and distribution beyond what copyright law
          permits require my written consent. Downloads and copies are
          permitted for private, non-commercial use only.
        </p>
      </LegalSection>

      <LegalSection title="Fonts">
        <p>
          Reckon uses the typefaces Domine, Space Grotesk, and JetBrains Mono,
          all licensed under the SIL Open Font License 1.1. They're served
          directly from this server, so no data is sent to Google. Copyright
          and license notices:{" "}
          <LegalLink href="/fonts/LICENSES.txt" external>
            LICENSES.txt
          </LegalLink>
          .
        </p>
      </LegalSection>
    </>
  )
}

export default function ImpressumRoute() {
  return (
    <LegalPage title={{ de: "Impressum", en: "Legal notice" }}>
      {(lang) => (lang === "de" ? <ImpressumDe /> : <ImpressumEn />)}
    </LegalPage>
  )
}

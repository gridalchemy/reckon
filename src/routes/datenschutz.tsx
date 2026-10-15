import { LegalEmail } from "@/components/legal/legal-email"
import { LegalLink } from "@/components/legal/legal-link"
import { LegalPage } from "@/components/legal/legal-page"
import { LegalSection } from "@/components/legal/legal-section"
import { LEGAL_NAME } from "@/lib/legal"

/**
 * Datenschutzerklärung (privacy policy), German + English.
 *
 * Covers only what Reckon does today: Cloudflare Pages hosting, Cloudflare
 * Access (invite-only gate, one-time PIN by email), IndexedDB local storage,
 * self-hosted fonts, email contact, GDPR rights. Facts checked against
 * primary sources on 2026-10-15 (Cloudflare privacy policy + DPA + Access
 * docs, TDDDG § 25, LfDI RLP imprint).
 *
 * Must be revised BEFORE any of these go live: the Reckoning's Anthropic API
 * call via the Worker (Session 11), any analytics or error telemetry, or a
 * custom domain.
 */

function DatenschutzDe() {
  return (
    <>
      <LegalSection title="Verantwortliche">
        <p>
          {LEGAL_NAME}
          <br />
          Rheinland-Pfalz, Deutschland
          <br />
          E-Mail: <LegalEmail />
        </p>
      </LegalSection>

      <LegalSection title="Auf einen Blick">
        <p>
          Reckon ist ein privates, nicht-kommerzielles Portfolio-Projekt und
          derzeit nur auf persönliche Einladung zugänglich. Es gibt keine
          Analyse- oder Tracking-Werkzeuge, keine Werbung und keine
          Benutzerkonten. Die Einträge, die Sie in Reckon anlegen, verlassen
          Ihren Browser nicht.
        </p>
      </LegalSection>

      <LegalSection title="Hosting">
        <p>
          Reckon wird über Cloudflare Pages bereitgestellt. Anbieter ist die
          Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA.
          Beim Aufruf verarbeitet Cloudflare technisch notwendige Daten,
          insbesondere Ihre IP-Adresse, den Zeitpunkt des Zugriffs, die
          aufgerufene Adresse und Angaben zu Ihrem Browser, um die Anwendung
          auszuliefern und vor Angriffen zu schützen.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes
          Interesse liegt in einer sicheren und zuverlässigen Bereitstellung.
          Cloudflare verarbeitet die Daten in meinem Auftrag. Daten können
          dabei in die USA übermittelt werden; Cloudflare ist nach dem EU-US
          Data Privacy Framework zertifiziert, für das ein
          Angemessenheitsbeschluss der EU-Kommission besteht (Art. 45 DSGVO).
        </p>
      </LegalSection>

      <LegalSection title="Zugangsschutz (Cloudflare Access)">
        <p>
          Der Zugang zu Reckon ist auf eingeladene Personen beschränkt. Bei der
          Anmeldung geben Sie Ihre E-Mail-Adresse ein und erhalten von
          Cloudflare einen einmaligen Code per E-Mail. Verarbeitet werden dabei
          Ihre E-Mail-Adresse, Ihre IP-Adresse, das daraus abgeleitete Land
          sowie der Zeitpunkt der Anmeldung. Diese Anmeldeprotokolle kann ich
          einsehen.
        </p>
        <p>
          Ihre E-Mail-Adresse steht auf der Einladungsliste, weil Sie mit mir
          Kontakt aufgenommen haben oder ich Sie eingeladen habe. Ich entferne
          sie, sobald Sie das wünschen oder die Einladung nicht mehr benötigt
          wird.
        </p>
        <p>
          Nach erfolgreicher Anmeldung setzt Cloudflare ein technisch
          notwendiges Cookie (CF_Authorization), das Ihre Sitzung bestätigt
          und standardmäßig nach 24 Stunden abläuft.
        </p>
        <p>
          Rechtsgrundlage für die Verarbeitung ist Art. 6 Abs. 1 lit. f DSGVO;
          mein berechtigtes Interesse liegt darin, ein unveröffentlichtes
          Projekt nur einem ausgewählten Personenkreis zugänglich zu machen.
          Das Cookie ist nach § 25 Abs. 2 Nr. 2 TDDDG unbedingt erforderlich
          und bedarf keiner Einwilligung.
        </p>
      </LegalSection>

      <LegalSection title="Speicherung in Ihrem Browser">
        <p>
          Sketches, Entscheidungen und Projekte, die Sie in Reckon anlegen,
          werden ausschließlich lokal in Ihrem Browser gespeichert (IndexedDB).
          Sie werden weder an mich noch an Dritte übertragen, und ich habe
          keinen Zugriff darauf. Sie können diese Daten jederzeit löschen,
          indem Sie die Websitedaten für Reckon in Ihrem Browser entfernen.
        </p>
        <p>
          Diese Speicherung ist nach § 25 Abs. 2 Nr. 2 TDDDG unbedingt
          erforderlich, um die von Ihnen gewünschte Funktion bereitzustellen.
        </p>
      </LegalSection>

      <LegalSection title="Schriften">
        <p>
          Alle Schriften werden direkt von diesem Server geladen. Es besteht
          keine Verbindung zu Google oder anderen Schriftanbietern.
        </p>
      </LegalSection>

      <LegalSection title="Kontakt per E-Mail">
        <p>
          Wenn Sie mir schreiben, verwende ich Ihre Angaben ausschließlich, um
          Ihre Anfrage zu beantworten, und lösche sie, sobald sie dafür nicht
          mehr benötigt werden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
        </p>
      </LegalSection>

      <LegalSection title="Ihre Rechte">
        <p>
          Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung
          (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung
          (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch gegen die
          Verarbeitung (Art. 21). Schreiben Sie mir dazu einfach eine E-Mail.
        </p>
        <p>
          Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde
          beschweren (Art. 77 DSGVO). Zuständig ist: Der Landesbeauftragte für
          den Datenschutz und die Informationsfreiheit Rheinland-Pfalz,
          Hintere Bleiche 34, 55116 Mainz,{" "}
          <LegalLink href="https://www.datenschutz.rlp.de/" external>
            datenschutz.rlp.de
          </LegalLink>
          .
        </p>
      </LegalSection>

      <LegalSection title="Änderungen">
        <p>
          Reckon ist ein laufendes Projekt. Diese Erklärung wird angepasst,
          bevor neue Funktionen weitere Daten verarbeiten, etwa die geplante
          KI-gestützte Reckoning-Funktion.
        </p>
      </LegalSection>
    </>
  )
}

function DatenschutzEn() {
  return (
    <>
      <LegalSection title="Controller">
        <p>
          {LEGAL_NAME}
          <br />
          Rhineland-Palatinate, Germany
          <br />
          Email: <LegalEmail />
        </p>
      </LegalSection>

      <LegalSection title="At a glance">
        <p>
          Reckon is a private, non-commercial portfolio project and is
          currently available by personal invitation only. There are no
          analytics or tracking tools, no ads, and no user accounts. The
          entries you create in Reckon never leave your browser.
        </p>
      </LegalSection>

      <LegalSection title="Hosting">
        <p>
          Reckon is served via Cloudflare Pages, provided by Cloudflare, Inc.,
          101 Townsend St., San Francisco, CA 94107, USA. When you open Reckon,
          Cloudflare processes technically necessary data, in particular your
          IP address, the time of access, the requested address, and details
          about your browser, to deliver the application and protect it from
          attacks.
        </p>
        <p>
          The legal basis is Art. 6(1)(f) GDPR. My legitimate interest is
          delivering the application securely and reliably. Cloudflare
          processes this data on my behalf. Data may be transferred to the
          USA; Cloudflare is certified under the EU-U.S. Data Privacy
          Framework, which is covered by an adequacy decision of the European
          Commission (Art. 45 GDPR).
        </p>
      </LegalSection>

      <LegalSection title="Access protection (Cloudflare Access)">
        <p>
          Access to Reckon is limited to invited people. To sign in, you enter
          your email address and receive a one-time code from Cloudflare by
          email. This processes your email address, your IP address, the
          country derived from it, and the time of sign-in. I can view these
          sign-in logs.
        </p>
        <p>
          Your email address is on the invitation list because you contacted
          me or I invited you. I'll remove it whenever you ask, or once the
          invitation is no longer needed.
        </p>
        <p>
          After you sign in, Cloudflare sets a technically necessary cookie
          (CF_Authorization) that confirms your session and expires after 24
          hours by default.
        </p>
        <p>
          The legal basis is Art. 6(1)(f) GDPR; my legitimate interest is
          making an unreleased project available to a chosen group of people
          only. The cookie is strictly necessary under § 25(2) no. 2 TDDDG and
          doesn't require consent.
        </p>
      </LegalSection>

      <LegalSection title="Storage in your browser">
        <p>
          Sketches, decisions, and projects you create in Reckon are stored
          only locally in your browser (IndexedDB). They're never sent to me
          or to third parties, and I have no access to them. You can delete
          this data at any time by clearing Reckon's site data in your
          browser.
        </p>
        <p>
          This storage is strictly necessary under § 25(2) no. 2 TDDDG to
          provide the feature you asked for.
        </p>
      </LegalSection>

      <LegalSection title="Fonts">
        <p>
          All fonts load directly from this server. There's no connection to
          Google or any other font provider.
        </p>
      </LegalSection>

      <LegalSection title="Contact by email">
        <p>
          If you write to me, I use your details only to answer your message
          and delete them once they're no longer needed for that. The legal
          basis is Art. 6(1)(f) GDPR.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          You have the right of access (Art. 15 GDPR), rectification (Art.
          16), erasure (Art. 17), restriction of processing (Art. 18), data
          portability (Art. 20), and objection to processing (Art. 21). Just
          send me an email.
        </p>
        <p>
          You can also lodge a complaint with a data protection supervisory
          authority (Art. 77 GDPR). The competent authority is: Der
          Landesbeauftragte für den Datenschutz und die Informationsfreiheit
          Rheinland-Pfalz, Hintere Bleiche 34, 55116 Mainz,{" "}
          <LegalLink href="https://www.datenschutz.rlp.de/" external>
            datenschutz.rlp.de
          </LegalLink>
          .
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          Reckon is a work in progress. This policy will be updated before new
          features process additional data, such as the planned AI-powered
          Reckoning.
        </p>
      </LegalSection>
    </>
  )
}

export default function DatenschutzRoute() {
  return (
    <LegalPage title={{ de: "Datenschutz", en: "Privacy policy" }}>
      {(lang) => (lang === "de" ? <DatenschutzDe /> : <DatenschutzEn />)}
    </LegalPage>
  )
}

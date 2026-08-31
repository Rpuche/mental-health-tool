# CLAUDE.md

## Projekt

Arbeitstitel der Plattform: **Bridge**.

Hackathon-Projekt für **"Hack for Humanity Summer 2026"**, Track **Mental Health**.

Die Plattform richtet sich an Menschen, die sich aus Angst vor Beurteilung nicht
trauen, eine Fachperson aufzusuchen. Sie senkt die Hürde für den ersten Kontakt,
indem der Einstieg anonym und kostenlos ist.

## Ablauf für Nutzer

1. **Kostenloser, anonymer Telefon-Trial-Call** mit einer geprüften, fest
   angestellten Fachperson. Keine Registrierung, keine echte Identität nötig.
2. **Registrierung mit echter Identität** für bezahlte, nicht-anonyme
   Folgetermine.

Die Anonymität gilt ausschliesslich für den Trial-Call. Alles danach läuft mit
verifizierter Identität.

## KI-Charakter

Ein Charakter: **Kawauso** (ein Otter – Otter stehen für Gelassenheit und
Zufriedenheit). Er führt das Gespräch in drei Phasen, ohne sie anzukündigen:

1. **Fachrichtung einordnen** — ordnet das Anliegen einer Fachrichtung zu.
   Eine Einordnung, nie eine Diagnose.
2. **Fachpersonen zeigen** — nennt Beispielprofile aus `lib/experts.ts`
   (Platzhalterdaten, keine echten Personen) und weist darauf hin, dass es
   Beispiele sind.
3. **Auf das erste Gespräch vorbereiten** — nimmt verbreitete Befürchtungen
   vorweg („zu einer Fachperson zu gehen heisst nicht, dass mit einem etwas
   nicht stimmt") und erklärt, wie ein Erstgespräch üblicherweise abläuft.

### Ton

Freundlich und ruhig. **Nie klinisch, nie wertend.** Keine Diagnosen, keine
Fachsprache, kein Beurteilen des Nutzers. Die KI-Charaktere ersetzen keine
Fachperson — sie führen zu einer hin.

## Tech-Stack

- **Next.js** mit **TypeScript**
- Anbindung an die **Google Gemini API** (`@google/genai`, Modell `gemini-2.5-flash`) für die KI-Charaktere

## Struktur

```
app/
  page.tsx              View 1 - Splash, verlinkt auf /start
  start/page.tsx        View 2 - "The First Step", verlinkt auf /hub
  hub/page.tsx          View 3 - die drei Karten
  hub/why/page.tsx      Panel "Why Bridge"
  hub/how/page.tsx      Panel "How it works"
  kawauso/page.tsx      Der Chat mit Kawauso
  experts/[fieldId]/page.tsx  Fachpersonen einer Fachrichtung
  settings/page.tsx     Platzhalter, noch ohne Funktion
  api/chat/route.ts     Weiterleitung an die Google Gemini API
components/Chat.tsx     Chat-UI (Verlauf + Eingabefeld)
components/RichText.tsx Kleiner Markdown-Renderer fuer Kawausos Antworten
components/ExpertCard.tsx  Profilkarte mit Mock-Terminwahl
components/HubShell.tsx Rahmen fuer /hub, die Panels und /experts
components/HubCard.tsx  Eine der drei Hub-Karten
components/Navbar.tsx   Wortmarke, Settings, Sprach-Platzhalter
components/OtterIcon.tsx  Linien-Illustration von Kawauso
components/Icons.tsx    Linien-Icons der Hub-Karten
lib/fieldMatch.ts       Parser fuer den Fachrichtungs-Marker
lib/characters.ts       Metadaten des Charakters (auch client-seitig)
lib/prompts.ts          System-Prompt – nur serverseitig
lib/experts.ts          Beispiel-Fachpersonen (Platzhalterdaten)
lib/types.ts            Typen für Chatverlauf und /api/chat
```

Der Client schickt nur die Charakter-ID (`kawauso`); den System-Prompt wählt
der Server aus. Prompts gehören nie ins Browser-Bundle.

## Gestaltung

Bewusst **ein** dunkler Look, kein Hell/Dunkel-Umschalter: tiefes Petrol mit
indigo Verlauf (`app/globals.css`), Text durchgehend hell für starken Kontrast.
Komponenten verwenden daher keine `dark:`-Varianten — die würden nur greifen,
wenn das System auf Dunkel steht.

Darüber liegt eine Glas-Ebene. Drei CSS-Klassen in `globals.css` tragen das:

- `.glass` — Milchglasfläche: `backdrop-filter`, halbtransparentes Weiss,
  1px-Rand, Innenkante als Lichtreflex plus weicher Schlagschatten.
- `.glass-interactive` — Hover hebt die Karte 3px an und verstärkt den Blur.
  Nur unter `@media (hover: hover)`, sonst löst es auf Touch beim Tippen aus.
- `.press` — kurzes Zusammendrücken auf `:active` für Buttons.

Der Hintergrund (`components/AmbientBackground.tsx`) sind drei weiche
Radialverläufe, die in 96 bis 152 Sekunden pro Durchgang driften. Bewusst
Radialverläufe statt geblurter Formen: es animieren nur Transforms, der
Compositor erledigt das, nichts wird neu gezeichnet.

Kein `framer-motion` — die geforderten Effekte (Karten-Lift, Press-Feedback,
Fade mit leichtem Scale) sind CSS-Transitions. Eine Motion-Bibliothek würde
alle betroffenen Seiten zu Client-Komponenten machen; sie sind derzeit
Server-Komponenten.

Gemessen statt geschätzt (Skripte liefen über CDP gegen den Prod-Build):
**55 Textelemente auf sieben Ansichten, alle über WCAG AA**, das schwächste
5,72:1 bei 4,5:1 Anforderung. Mobil (390px) 60 fps ohne einen Frame über 32ms,
auch bei 4x und 6x CPU-Drosselung. Bei `prefers-reduced-motion: reduce` stehen
Hintergrund und Seitenübergänge still — der Blur bleibt, das ist keine
Bewegung.

Die Navigation rendert **nicht** das Root-Layout, sondern jede Seite selbst:
Splash und Intro sollen ohne jede Chrome auskommen.

Der Einstiegs-Flow besteht aus echten Routen (`/`, `/start`, `/hub`, dazu
`/hub/why` und `/hub/how`), nicht aus React-State. Navigiert wird mit
`next/link`, der Zurück-Button funktioniert dadurch nativ an jeder Stelle. Alle
diese Seiten sind Server-Komponenten; die Übergänge sind CSS-Animationen aus
`globals.css`, die bei jedem Routen-Mount neu laufen.

## Fachrichtungs-Marker

Kawauso nennt im Chat **keine** Fachpersonen. Stattdessen haengt es an die
Nachricht, in der es sich auf eine Fachrichtung festlegt, eine letzte Zeile:

```
[[FIELD_MATCH:stress-work-burnout]]
```

`app/api/chat/route.ts` schneidet den Marker heraus (`lib/fieldMatch.ts`),
prueft die ID gegen `lib/experts.ts` und liefert sie getrennt vom Text als
`{ reply, fieldMatch }`. Die Chat-UI zeigt daraufhin einen Button auf
`/experts/<id>`. Eine erfundene ID wird verworfen und nur geloggt — so
entsteht nie ein Link auf eine Seite ohne Fachpersonen.

Die Feld-IDs in `lib/experts.ts` sind damit ein Vertrag zwischen Prompt, Route
und Seite: wer eine ID aendert, muss alle drei Stellen im Blick haben.

## Sitzungsraum

Nach der Terminwahl bietet `components/ExpertCard.tsx` einen Raum auf der
oeffentlichen Jitsi-Instanz an (`meet.jit.si`) — ohne Konto, ohne API-Key.
Der Raumname entsteht pro Buchung aus 128 Zufallsbits
(`bridge-<32 Hex>`) und enthaelt bewusst nichts Personenbezogenes: keinen
Namen, keine Fachrichtung, keine Uhrzeit. Damit ist die URL weder ratbar noch
verraet sie, wer sich worueber trifft. Derselbe Mechanismus traegt den
kostenlosen anonymen Erstkontakt und spaetere bezahlte Sitzungen.

Der Raum laeuft in einem iframe auf der Seite; ein Link daneben oeffnet ihn
alternativ in einem eigenen Fenster. Im Prototyp oeffnet er sofort, produktiv
wuerde er erst zur Terminzeit freigeschaltet — der Hinweis dazu steht neben
dem Button.

Der Raum wird per URL-Hash konfiguriert: `config.prejoinPageEnabled=false`
und `config.prejoinConfig.enabled=false` (alter und neuer Schalter),
`config.requireDisplayName=false` sowie `userInfo.displayName` mit einem pro
Beitritt neu gezogenen Label `Guest-XXXX`. Niemand tippt also einen Namen, und
zwei Personen im selben Raum bleiben unterscheidbar.

Zwei Einschraenkungen der oeffentlichen Instanzen, beide im Browser geprueft:

- **meet.jit.si** laesst sich einbetten, verlangt aber fuer das *Starten* eines
  Raums eine angemeldete Person. Anonyme Erstteilnehmende sehen „Die Konferenz
  wurde noch nicht gestartet". Produktiv passt das (die Fachperson moderiert),
  fuer eine Ein-Personen-Demo nicht.
- **meet.ffmuc.net** laesst anonym sofort hinein (Label sichtbar, kein
  Namensfeld), verbietet aber Einbetten per `X-Frame-Options` — dort geht nur
  der Link in ein eigenes Fenster.

Der Host steht als Konstante `JITSI_HOST` in `components/ExpertCard.tsx`.

Zu bedenken vor einem echten Einsatz: bei oeffentlichen Instanzen laufen Audio
und Video ueber fremde Server. Fuer den Produktivbetrieb waere eine eigene
Jitsi-Instanz oder JaaS noetig — damit entfaellt auch die Moderations-Huerde.

## Sprachen

Oberfläche, System-Prompt und Kawausos Antworten sind **Englisch**. Einzige
Ausnahme: der Name des Krisendiensts „Die Dargebotene Hand" bleibt als
Eigenname stehen. Der Sprach-Button in der Navigation ist ein Platzhalter für
spätere Mehrsprachigkeit.

## Befehle

```bash
npm run dev     # Entwicklungsserver
npm run build   # Produktions-Build (prüft auch TypeScript)
npm run lint    # ESLint
```

Vor dem ersten Start `GOOGLE_API_KEY` in `.env.local` eintragen
(Vorlage: `.env.example`).

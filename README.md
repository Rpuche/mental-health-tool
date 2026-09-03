# Bridge

**A free, anonymous first conversation with a qualified mental health professional — for people who have been putting it off.**

Hackathon prototype · Hack for Humanity Summer 2026 · Mental Health track

---

## The problem

Most people who could use a conversation never have one. Not because help is
missing, but because asking for it still feels like an admission: that you
could not cope on your own, that something is wrong with you, that it will
follow you around in a file or a diagnosis. So it gets postponed — until it is
"bad enough", until there is time, until it passes by itself.

The hardest part is not the therapy. It is the first step.

## The idea

Bridge removes everything that makes that first step expensive. You start by
talking to **Kawauso**, an otter and the guide of the platform, in an anonymous
chat: no account, no real name, nothing recorded about you.

1. **Kawauso listens.** It asks a few open questions, one at a time, until it
   understands what is actually going on. It never rushes to a conclusion.
2. **It points to one field** — anxiety, sleep, grief, work, and so on — and
   explains why it fits. That is an orientation, never a diagnosis.
3. **You see the professionals** who work in that field: role, languages, city,
   practice. Filters for city and spoken language narrow the list.
4. **You book a slot** and join an **anonymous session room** — a video/audio
   call that needs no account and no name, with camera and microphone off
   until you turn them on.

The chat is the suggested way in, but not the only one: `/experts` lists every
field, so anyone who already knows what they are looking for — or whose chat is
unavailable — can pick a field themselves and land on the same page of
professionals.

The first phone conversation is free and anonymous. Only afterwards, and only
if you want to continue, do you register with your real identity for paid
follow-up sessions.

## Who this is for

**On the user side:** people who could benefit from talking to a professional
but avoid it — out of fear of being judged, because of the stigma still
attached to it, or from a conviction that it would not help anyway. That is a
broad group. It is not tied to a particular diagnosis, age or background, and
you do not have to consider yourself unwell to belong to it.

**On the professional side:** qualified, licensed psychologists in a permanent
employment position, including those who have just started their first post and
are still building a client base — not students or trainees without a licence.
For them, Bridge is flexible additional availability, and a way to reach people
who would otherwise rarely find their way into a regular practice.

## Related work

Neither half of this is new on its own. AI-driven intake and matching already
exists: Limbic Access is used for referral and triage in clinical and NHS
settings, and chatbot templates for intake in existing practices are widely
available commercially. Free, anonymous emotional support also exists — 7 Cups
and HearMe connect people with trained volunteer listeners at no cost and
without an account.

What does not appear to exist yet as a public consumer product is the
combination: genuine end-to-end anonymity carried through to a routed
conversation with a real, licensed, employed professional, in a single free
first call.

## Getting started

Requires Node.js 20 or newer.

```bash
git clone <repository-url>
cd mental-health-tool
npm install
```

Create a `.env.local` in the project root with a Google Gemini API key
(free tier is enough — get one at
[aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)):

```bash
GOOGLE_API_KEY=your-key-here
```

`.env.example` exists as a template. Then:

```bash
npm run dev
```

and open [http://localhost:3000](http://localhost:3000).

Without a key the app still runs — every page renders, only Kawauso's replies
return a clear error.

Other scripts: `npm run build` (production build, also type-checks) and
`npm run lint`.

## Project structure

```
app/
  page.tsx                    Splash — the wordmark, one tap to continue
  start/page.tsx              "The First Step" — what this is, in two paragraphs
  hub/page.tsx                Three ways in: Why Bridge · How it works · Kawauso
  hub/why, hub/how            The longer explanations behind the first two cards
  kawauso/page.tsx            The anonymous chat
  experts/page.tsx            All fields at a glance — the browse-first way in
  experts/[fieldId]/page.tsx  Professionals for one field: city and language
                              filters, mock booking, anonymous session room
  settings/page.tsx           Placeholder, no function yet
  api/chat/route.ts           Server route to the Gemini API

components/
  Chat.tsx                    Chat UI, markdown rendering, field-match button
  ExpertCard.tsx              Profile card, mock booking, Jitsi session room
  ExpertList.tsx              Profile list with city and language filters
  HubShell.tsx / HubCard.tsx  Shared frame and cards for the hub
  AmbientBackground.tsx       Slow gradient fields behind the glass surfaces
  RichText.tsx                Small markdown renderer (bold, italic, lists)
  OtterIcon.tsx / Icons.tsx   Line illustrations

lib/
  characters.ts               Kawauso's metadata (client-safe, no prompt)
  prompts.ts                  The system prompt — server-side only
  experts.ts                  Fields and example professionals
  fieldMatch.ts               Parses Kawauso's field marker
  types.ts                    Chat message and API types
```

**How the field recommendation reaches the UI:** Kawauso ends the message in
which it settles on a field with a marker, `[[FIELD_MATCH:stress-work-burnout]]`.
The API route strips the marker from the visible text, validates the ID against
`lib/experts.ts`, and returns it as structured data. The chat then shows a
button to that field's professionals. An invented ID is discarded, so a
hallucinated field never becomes a broken link.

## Safety design

This is a mental health context, so several decisions are deliberate rather
than incidental:

- **No diagnoses.** Kawauso places a concern in a *field* and says so
  explicitly. It is instructed never to name a disorder or an illness, and to
  answer "do I have X?" by saying that this is not its role.
- **Crisis handling.** If there are signs of an acute crisis or risk of
  self-harm, Kawauso names it calmly and points to immediate help: emergency
  **112** and the Swiss crisis line **Die Dargebotene Hand** at **143**. Those
  numbers also sit in a footer that stays visible on every screen.
- **Honest about what it is.** Kawauso introduces itself as an AI guide, not a
  professional, and never stands in for the person you will actually talk to.
- **Real professionals.** The people behind the first call are qualified and
  permanently employed — not trainees, not a directory of strangers, and not
  people paid per booking.
- **Anonymous session rooms.** Each booking gets a room name from 128 random
  bits (`bridge-<32 hex>`), so it cannot be guessed or enumerated. The URL
  carries no name, no field and no time. The prejoin screen is skipped, a
  throwaway label (`Guest-7F3A`) is filled in so nobody types their own name,
  and **camera and microphone start muted** — you turn them on yourself.
- **Paced conversation.** Kawauso may not jump to a recommendation after a
  single sentence: it needs a couple of genuine exchanges first, and a question
  the person deflected does not count as one.

## Prototype scope

This is a hackathon prototype, not a production system. What is real, and what
is not:

| Real | Mock / placeholder |
| --- | --- |
| The chat with Kawauso (Gemini API) | The professional profiles — invented people |
| Field recommendation and matching | The bookable time slots — static data |
| The session room (public Jitsi Meet) | Booking is not stored anywhere and notifies nobody |
| Crisis references and safety prompting | Registration, payment and the settings page |

The app says so where it matters: profile pages label the profiles as examples,
and a booking confirmation states plainly that nothing was booked.

Two things a production version would need first: the session rooms run on the
public `meet.jit.si` instance, so audio and video pass through third-party
servers — a self-hosted Jitsi or JaaS would be required. And the professional
starts the room as moderator, which is the intended flow, but means a
single-person demo waits on the "not started yet" screen.

**Verifying the professionals.** The prototype does not check anyone's
credentials — the profiles are invented, so there is nothing to verify. A real
version could check a registration number against an official register
(PsyReg in Switzerland), verify an employer email domain, use a third-party
identity service such as Persona or Onfido, or review submitted documents by
hand. A registry check combined with a manual review before a profile goes
live would be the preferred starting point: a public professional register is
the most authoritative and directly verifiable source of licensure,
third-party identity verification is comparatively costly to run continuously,
and a light manual review closes the gap a registry alone cannot cover —
whether the person is currently employed.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Google Gemini via `@google/genai` · Jitsi Meet for the session rooms.

The interface is a single dark, frosted-glass look over a deep teal and indigo
palette. Text contrast was measured against the rendered background rather than
estimated — 55 text elements across seven views, all above WCAG AA. All motion
is disabled under `prefers-reduced-motion`.

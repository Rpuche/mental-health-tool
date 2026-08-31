"use client";

import { useState } from "react";

import type { Expert } from "@/lib/experts";

/**
 * One professional's profile, with a mock booking panel and the session room.
 *
 * The slots are static prototype data and nothing is stored anywhere — the
 * confirmation says so, so no one mistakes this for a real appointment.
 *
 * The room itself is real: a Jitsi Meet room on the public instance, which
 * needs no account and no API key. The same mechanism serves the free
 * anonymous first call and a later paid session — the only difference is who
 * has agreed to meet, never the room mechanics.
 */

/** Two rosters, picked by position, so the cards do not all look identical. */
const SLOT_SETS = [
  ["Tue 09:00", "Tue 14:30", "Wed 11:00", "Thu 16:15", "Fri 08:45"],
  ["Mon 10:30", "Wed 13:00", "Thu 09:15", "Fri 15:45", "Sat 10:00"],
];

/**
 * A fresh room name per booking: 128 random bits, so the room cannot be
 * guessed or enumerated by anyone else on the public instance.
 *
 * Deliberately free of anything personal — no name, no field, no time, no ID
 * of the person booking. The URL alone reveals nothing about who is meeting
 * or what about, which is what keeps the anonymous first call anonymous.
 */
function createRoomName(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const random = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  return `bridge-${random}`;
}

/**
 * A throwaway label for this join, e.g. "Guest-7F3A".
 *
 * Drawn fresh every time someone enters the room, so nobody has to type a
 * name, yet two people in the same room stay distinguishable.
 */
function createGuestLabel(): string {
  const bytes = new Uint8Array(2);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  )
    .join("")
    .toUpperCase();
  return `Guest-${suffix}`;
}

/**
 * Which Jitsi instance hosts the rooms.
 *
 * meet.jit.si is the only public instance that can be embedded here: it sends
 * no X-Frame-Options.
 *
 * It also only lets an authenticated participant start a room, which is
 * exactly the shape this platform wants: the professional moderates and opens
 * the session, and the anonymous participant joins afterwards without
 * entering a name. Until the professional has started it, the guest side
 * waits — so a one-person demo stays on that waiting screen by design.
 *
 * Community instances such as meet.ffmuc.net let anyone open a room straight
 * away, but refuse embedding via X-Frame-Options, so they would only work
 * through the "separate window" link. Switching host is a one-line change.
 */
const JITSI_HOST = "meet.jit.si";

/**
 * Room URL with Jitsi's iframe config in the hash: no prejoin screen, no
 * request for a real name, and the guest label filled in up front.
 *
 * prejoinPageEnabled is the older switch and prejoinConfig.enabled the
 * current one — both are set so the screen stays skipped across Jitsi
 * versions on the public instance.
 */
function sessionUrl(room: string, guest: string): string {
  const config = [
    "config.prejoinPageEnabled=false",
    "config.prejoinConfig.enabled=false",
    "config.requireDisplayName=false",
    // Camera and microphone start off; the participant turns them on inside
    // the call if they want to. Nobody is broadcast before they mean to be.
    "config.startWithVideoMuted=true",
    "config.startWithAudioMuted=true",
    `userInfo.displayName=%22${guest}%22`,
  ].join("&");
  return `https://${JITSI_HOST}/${room}#${config}`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export default function ExpertCard({
  expert,
  index,
}: {
  expert: Expert;
  index: number;
}) {
  const [isBooking, setIsBooking] = useState(false);
  const [slot, setSlot] = useState<string | null>(null);
  const [room, setRoom] = useState<string | null>(null);
  const [isInSession, setIsInSession] = useState(false);
  const [guest, setGuest] = useState<string | null>(null);
  const slots = SLOT_SETS[index % SLOT_SETS.length];

  /** Room name is drawn when the slot is taken, never during render. */
  function confirmSlot(option: string) {
    setSlot(option);
    setRoom(createRoomName());
    setGuest(null);
    setIsInSession(false);
  }

  /** A new label per join, drawn in the handler and never during render. */
  function joinSession() {
    setGuest(createGuestLabel());
    setIsInSession(true);
  }

  function reset() {
    setSlot(null);
    setRoom(null);
    setGuest(null);
    setIsInSession(false);
  }

  return (
    <article
      className={`glass rounded-3xl p-6 sm:p-7 ${
        isInSession ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Placeholder portrait: initials, no stock photography */}
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-teal-300/15 text-lg font-medium text-teal-200"
        >
          {initials(expert.name)}
        </span>

        <div className="min-w-0">
          <h2 className="text-lg font-medium">{expert.name}</h2>
          <p className="text-sm text-teal-50/78">{expert.role}</p>
          <p className="mt-1 text-sm text-teal-50/70">
            {expert.workplace}, {expert.city}
          </p>
          <p className="mt-1 text-sm text-teal-50/70">
            Speaks {expert.languages}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-teal-50/78">
        {expert.note}
      </p>

      {slot && room ? (
        <div className="rounded-2xl border border-teal-300/30 bg-teal-300/10 p-4 mt-5 backdrop-blur-sm">
          <p className="text-sm text-teal-50">
            {slot} is pencilled in with {expert.name.split(" ")[0]}.
          </p>
          <p className="mt-1 text-xs text-teal-50/72">
            Prototype &mdash; nothing was actually booked and no one has been
            notified.
          </p>

          {isInSession && guest ? (
            // Tall enough that Jitsi uses its full layout instead of the
            // compact one, with room underneath so the sticky crisis footer
            // never covers the call controls.
            <div className="mt-4 animate-[fade-up_0.4s_ease-out] pb-12">
              <iframe
                src={sessionUrl(room, guest)}
                title="Anonymous session room"
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                className="h-[70svh] min-h-[420px] w-full rounded-2xl border border-white/15 bg-black/40"
              />
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                <button
                  type="button"
                  onClick={() => setIsInSession(false)}
                  className="text-sm text-teal-200 underline-offset-4 hover:underline"
                >
                  Leave the room
                </button>
                <a
                  href={sessionUrl(room, guest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal-50/50 underline-offset-4 transition hover:text-teal-50/80 hover:underline"
                >
                  Open in a separate window instead
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <button
                type="button"
                onClick={joinSession}
                className="press rounded-full bg-teal-300 px-5 py-2.5 text-sm font-medium text-teal-950 shadow-lg shadow-teal-950/30 hover:bg-teal-200"
              >
                Join session
              </button>
              <p className="mt-3 max-w-prose text-xs leading-relaxed text-teal-50/70">
                The room opens once the professional has started the
                session &mdash; you join automatically, with no name required.
                In this prototype the link is live immediately so the flow can
                be shown; in production it would only appear at the appointment
                time. Either way it stays anonymous: the address is random and
                carries no name, no topic and no time, and you appear under a
                throwaway label. The same room serves the free first call and
                paid sessions later on.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={reset}
            className="mt-4 block text-sm text-teal-50/50 transition hover:text-teal-50/80"
          >
            Pick a different time
          </button>
        </div>
      ) : isBooking ? (
        <div className="mt-5 animate-[fade-up_0.4s_ease-out]">
          <p className="text-sm text-teal-50/78">
            Free times in the next few days:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {slots.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => confirmSlot(option)}
                className="press rounded-full border border-white/20 bg-white/[0.04] px-4 py-2 text-sm text-teal-50/85 hover:border-teal-200/50 hover:bg-white/[0.12]"
              >
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsBooking(false)}
            className="mt-4 text-sm text-teal-50/50 transition hover:text-teal-50/80"
          >
            Close
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsBooking(true)}
          className="press mt-5 rounded-full bg-teal-300 px-5 py-2.5 text-sm font-medium text-teal-950 shadow-lg shadow-teal-950/30 hover:bg-teal-200"
        >
          Book appointment
        </button>
      )}
    </article>
  );
}

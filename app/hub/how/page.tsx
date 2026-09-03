import type { Metadata } from "next";
import Link from "next/link";

import HubShell from "@/components/HubShell";

export const metadata: Metadata = {
  title: "How it works",
};

/**
 * Hub panel: the whole path from the first chat to a paid follow-up.
 * Its own route, so back returns to the hub without any state juggling.
 */
export default function HowItWorksPage() {
  return (
    <HubShell>
      <div className="animate-[fade-up_0.5s_ease-out] py-4">
        <Link
          href="/hub"
          className="mb-7 inline-block rounded-full px-3 py-2 text-sm text-teal-50/72 transition hover:bg-white/5 hover:text-teal-50"
        >
          &larr; Back
        </Link>

        <section className="max-w-2xl space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            How it works
          </h1>

          <p className="leading-relaxed text-teal-50/80">
            Three steps, and you can stop after any of them. Nothing costs
            anything until you have had a conversation and decided for yourself
            that you want another one.
          </p>

          <ol className="space-y-6">
            <Step
              number="1"
              title="Chat with Kawauso"
              text="An anonymous chat, in your own words and at your own pace. No account, no real name, nothing to prepare beforehand. Kawauso asks a few questions — one at a time, never an interrogation — to understand what has been going on for you."
            />
            <Step
              number="2"
              title="Find your field, and get ready"
              text="Kawauso places your concern in a field — anxiety, sleep, grief, work, and so on — and says why. That is an orientation, never a diagnosis. You then see professionals who work in that field, with the languages they speak and how they work. Before the call, Kawauso goes through the worries people usually have and what a first conversation actually looks like: around 20 to 30 minutes on the phone, a few open questions, no obligation at the end."
            />
            <Step
              number="3"
              title="The free call, then your decision"
              text="The first phone conversation is free and anonymous — no registration, no name, nothing recorded about you. Only afterwards, and only if you want to keep going, do you sign up with your real identity for paid follow-up sessions with the same professional."
            />
          </ol>

          <p className="leading-relaxed text-teal-50/80">
            Kawauso is the way in we would suggest: it listens first and finds
            the field that fits, so you do not have to know the answer in
            advance. If you already know what you are looking for, or would
            rather look around on your own, you can also{" "}
            <Link
              href="/experts"
              className="text-teal-50 underline-offset-4 hover:underline"
            >
              browse all fields directly
            </Link>{" "}
            and pick one yourself.
          </p>
        </section>
      </div>
    </HubShell>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <li className="flex gap-4">
      <span className="font-mono text-sm text-teal-300/80">{number}</span>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="mt-1.5 block text-sm leading-relaxed text-teal-50/75">
          {text}
        </span>
      </span>
    </li>
  );
}

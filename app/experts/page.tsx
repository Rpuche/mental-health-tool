import type { Metadata } from "next";
import Link from "next/link";

import HubShell from "@/components/HubShell";
import { EXPERTS, FIELDS } from "@/lib/experts";

export const metadata: Metadata = {
  title: "Professionals",
};

/**
 * All fields at a glance — the way in for anyone who would rather browse than
 * talk to Kawauso first, and the fallback if the chat is unavailable.
 */
export default function ExpertsIndexPage() {
  return (
    <HubShell centered={false}>
      <div className="animate-[fade-up_0.6s_ease-out]">
        <Link
          href="/kawauso"
          className="press inline-block rounded-full px-3 py-2 text-sm text-teal-50/72 hover:bg-white/10 hover:text-teal-50"
        >
          &larr; Back to the conversation
        </Link>

        <header className="mt-5 max-w-2xl">
          <p className="text-sm tracking-widest text-teal-50/65 uppercase">
            Professionals
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Browse by field
          </h1>
          <p className="mt-3 leading-relaxed text-teal-50/78">
            Pick the field that sounds closest to what is going on. If none of
            them quite fits, Kawauso can help you work that out in the chat
            &mdash; the first phone conversation is free and anonymous either
            way.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {FIELDS.map((field) => {
            const count = EXPERTS[field.id].length;

            return (
              <Link
                key={field.id}
                href={`/experts/${field.id}`}
                className="glass glass-interactive flex flex-col rounded-3xl p-6 sm:p-7"
              >
                <h2 className="text-lg font-medium">{field.label}</h2>
                <p className="mt-2 text-sm leading-relaxed text-teal-50/72">
                  Covers {field.covers}.
                </p>
                <p className="mt-4 text-xs text-teal-50/65">
                  {count} example {count === 1 ? "profile" : "profiles"}
                </p>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-teal-50/65">
          Example profiles from the prototype &mdash; these are not real people,
          and the available times are mock data.
        </p>
      </div>
    </HubShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import HubShell from "@/components/HubShell";

export const metadata: Metadata = {
  title: "Why Bridge",
};

/**
 * Hub panel: who this is for, and why the first step is the hard one.
 * Its own route, so back returns to the hub without any state juggling.
 */
export default function WhyBridgePage() {
  return (
    <HubShell>
      <div className="animate-[fade-up_0.5s_ease-out] py-4">
        <Link
          href="/hub"
          className="mb-7 inline-block rounded-full px-3 py-2 text-sm text-teal-50/72 transition hover:bg-white/5 hover:text-teal-50"
        >
          &larr; Back
        </Link>

        <section className="max-w-2xl space-y-5">
          <h1 className="text-3xl font-semibold tracking-tight">Why Bridge</h1>

          <p className="leading-relaxed text-teal-50/80">
            Most people who could use a conversation never have one. Not because
            help is not there, but because asking for it still feels like an
            admission &mdash; that you could not cope on your own, that
            something is wrong with you, that it will follow you around in a
            file, a diagnosis, or a look from someone who finds out.
          </p>

          <p className="leading-relaxed text-teal-50/80">
            So it gets postponed. Until it is bad enough to count. Until there
            is time. Until it passes on its own. Meanwhile the one thing that
            tends to help most &mdash; saying it out loud once, to someone who
            does this for a living &mdash; stays undone, sometimes for years.
          </p>

          <p className="leading-relaxed text-teal-50/80">
            Bridge is built for the step before all of that. One phone
            conversation you can have without giving your name, without a file
            being opened, and without deciding anything in advance. If it helps,
            you go on. If it does not, nothing happened: there is nothing to
            cancel and nothing on record.
          </p>

          <p className="leading-relaxed text-teal-50/80">
            The professionals here are qualified and permanently employed
            &mdash; not a directory of strangers you have to vet yourself, and
            not people paid per booking. Kawauso, the guide you meet first, is
            honest about what it is: an AI that helps you work out what you want
            to say. It never diagnoses, and it never stands in for the person
            you will actually talk to.
          </p>

          <p className="leading-relaxed text-teal-50/80">
            And you do not have to be in crisis to use this. &ldquo;Not bad
            enough&rdquo; is the most common reason people give for staying
            away, and it is the one we would most like to take off the table.
          </p>
        </section>
      </div>
    </HubShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ExpertList from "@/components/ExpertList";
import HubShell from "@/components/HubShell";
import { EXPERTS, FIELDS, getField } from "@/lib/experts";

/** One static page per field — the set is fixed and known at build time. */
export function generateStaticParams() {
  return FIELDS.map((field) => ({ fieldId: field.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}): Promise<Metadata> {
  const { fieldId } = await params;
  const field = getField(fieldId);
  return { title: field ? field.label : "Professionals" };
}

/**
 * The professionals working in one field. Reached from Kawauso's field match
 * in the chat, and built from the same placeholder data as the prompt.
 */
export default async function ExpertsPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  const { fieldId } = await params;
  const field = getField(fieldId);
  if (!field) notFound();

  const experts = EXPERTS[field.id];

  return (
    <HubShell centered={false}>
      <div className="animate-[fade-up_0.6s_ease-out]">
        <div className="flex flex-wrap items-center gap-1 text-sm">
          <Link
            href="/kawauso"
            className="press rounded-full px-3 py-2 text-teal-50/72 hover:bg-white/10 hover:text-teal-50"
          >
            &larr; Back to the conversation
          </Link>
          <span aria-hidden="true" className="text-teal-50/35">
            &middot;
          </span>
          <Link
            href="/experts"
            className="press rounded-full px-3 py-2 text-teal-50/72 hover:bg-white/10 hover:text-teal-50"
          >
            All fields
          </Link>
        </div>

        <header className="mt-5 max-w-2xl">
          <p className="text-sm tracking-widest text-teal-50/65 uppercase">
            Professionals
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {field.label}
          </h1>
          <p className="mt-3 leading-relaxed text-teal-50/78">
            This field covers {field.covers}. The first phone conversation is
            free and anonymous &mdash; you only give your name if you decide to
            keep going afterwards.
          </p>
        </header>

        <div className="mt-8">
          <ExpertList experts={experts} />
        </div>

        <p className="mt-8 text-xs text-teal-50/65">
          Example profiles from the prototype &mdash; these are not real people,
          and the available times are mock data.
        </p>
      </div>
    </HubShell>
  );
}

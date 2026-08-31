import type { Metadata } from "next";
import Link from "next/link";

import Chat from "@/components/Chat";
import Navbar from "@/components/Navbar";
import OtterIcon from "@/components/OtterIcon";
import { KAWAUSO } from "@/lib/characters";

export const metadata: Metadata = {
  title: "Kawauso",
};

/**
 * The chat with Kawauso — the only character on the platform.
 * Leads through three phases: field, professionals, preparation.
 */
export default function KawausoPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-5 py-6 sm:px-8">
        <header className="flex items-start gap-4">
          <span className="glass mt-1 rounded-2xl p-2 text-teal-200">
            <OtterIcon className="h-9 w-9" />
          </span>

          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {KAWAUSO.name}
            </h1>
            <p className="mt-1 text-sm text-teal-50/72">{KAWAUSO.tagline}</p>
          </div>

          <Link
            href="/hub"
            className="press ml-auto shrink-0 rounded-full px-3 py-2 text-sm text-teal-50/78 hover:bg-white/10 hover:text-teal-50"
          >
            Back
          </Link>
        </header>

        <div className="glass flex min-h-[60vh] flex-1 flex-col overflow-hidden rounded-3xl">
          <Chat />
        </div>

        <p className="pb-2 text-center text-xs text-teal-50/65">
          Kawauso is an AI guide, not a professional &mdash; and does not give
          diagnoses.
        </p>
      </main>
    </div>
  );
}

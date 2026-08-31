import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The First Step",
};

/**
 * View 2 of the entry flow: what this is, before anyone has to decide
 * anything. Continues to the hub.
 */
export default function StartPage() {
  return (
    <main className="flex min-h-svh animate-[fade-up_0.8s_ease-out] flex-col items-center justify-center gap-7 px-6 py-16 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
        The First Step
      </h1>

      <div className="max-w-2xl space-y-5 text-base leading-relaxed text-teal-50/80 sm:text-lg">
        <p>
          Bridge exists for a single conversation: free, anonymous, on the
          phone, with a real professional who is qualified and permanently
          employed here. No account, no real name, and nothing written down
          about you before you have decided anything at all.
        </p>
        <p>
          Most people who could use that conversation put it off for months
          &mdash; not because help is hard to find, but because starting feels
          like admitting something about yourself. Here, starting costs you
          nothing and commits you to nothing. You talk, you see how it feels,
          and only afterwards do you decide whether there is a next time.
        </p>
      </div>

      <Link
        href="/hub"
        className="press mt-1 rounded-full bg-teal-300 px-7 py-3 text-sm font-medium text-teal-950 shadow-lg shadow-teal-950/30 hover:bg-teal-200"
      >
        Continue
      </Link>
    </main>
  );
}

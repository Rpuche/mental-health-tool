import Link from "next/link";

import { ChevronDownIcon } from "@/components/Icons";

/**
 * View 1 of the entry flow: the splash.
 *
 * The whole screen is one link to /start, so tapping anywhere continues and
 * the keyboard reaches it too. The fade and the breathing hint are CSS
 * animations from globals.css, which disables them under
 * prefers-reduced-motion.
 */
export default function SplashPage() {
  return (
    <Link
      href="/start"
      aria-label="Begin"
      className="flex min-h-svh w-full cursor-pointer flex-col items-center justify-center gap-14 px-6 sm:gap-16"
    >
      <span className="flex animate-[fade-in_1.4s_ease-out] flex-col items-center gap-6">
        <span className="text-6xl font-semibold tracking-tight sm:text-8xl">
          Bridge
        </span>
        <span className="max-w-md text-center text-base leading-relaxed text-balance text-teal-50/78 sm:max-w-lg sm:text-lg">
          One free, anonymous phone conversation with a qualified professional
          &mdash; for anyone who has been putting it off.
        </span>
      </span>

      <span className="flex animate-[breathe_4s_ease-in-out_infinite] flex-col items-center gap-2 text-sm tracking-wide text-teal-50/72">
        tap to begin
        <ChevronDownIcon className="h-5 w-5" />
      </span>
    </Link>
  );
}

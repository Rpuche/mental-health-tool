import Link from "next/link";

/**
 * Navigation: wordmark on the left, settings and language on the right.
 *
 * Rendered by the pages that want it (the hub view, the chat, the settings
 * page) rather than by the root layout, so the splash and intro views stay
 * free of chrome.
 *
 * The language button is a placeholder for later multilingual support and has
 * no function yet.
 */
export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#08191e]/55 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-teal-50"
        >
          Bridge
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/settings"
            className="press rounded-full px-3 py-2 text-sm text-teal-50/78 hover:bg-white/10 hover:text-teal-50"
          >
            Settings
          </Link>

          <button
            type="button"
            title="Language — coming soon"
            aria-label="Change language"
            className="press rounded-full p-2 text-teal-50/78 hover:bg-white/10 hover:text-teal-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}

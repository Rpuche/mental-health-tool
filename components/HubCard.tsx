import Link from "next/link";

/**
 * One of the three equally weighted hub cards. Every card is a real link, so
 * back navigation from a card works natively.
 */
export default function HubCard({
  href,
  icon,
  accent,
  title,
  blurb,
}: {
  href: string;
  icon: React.ReactNode;
  /** Text colour class for the icon — the only thing that differs per card. */
  accent: string;
  title: string;
  blurb: string;
}) {
  return (
    <Link
      href={href}
      className="glass glass-interactive flex min-h-[150px] cursor-pointer flex-col items-start gap-4 rounded-3xl p-6 text-left sm:min-h-[280px] sm:gap-5 sm:p-7"
    >
      <span className={accent}>{icon}</span>
      <span className="mt-auto">
        <span className="block text-lg font-medium">{title}</span>
        <span className="mt-2 block text-sm leading-relaxed text-teal-50/72">
          {blurb}
        </span>
      </span>
    </Link>
  );
}

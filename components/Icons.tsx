/**
 * Line icons for the hub cards. Same visual language as OtterIcon:
 * currentColor, no fills, calm shapes.
 */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 120 120",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

/** "Why Bridge" — two figures, one turned towards the other. */
export function PeopleIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="43" cy="42" r="13" />
      <path d="M22 92c0-13 9.5-23 21-23s21 10 21 23" />
      <circle cx="79" cy="50" r="10" />
      <path d="M64 92c0-11 7-19 15.5-19S95 81 95 92" />
    </svg>
  );
}

/** "How it works" — three stations, one step up to the next. */
export function RouteIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M28 76.5 53.9 61.5M66.1 54.5 92 39.5" opacity="0.5" />
      <circle cx="22" cy="80" r="7" />
      <circle cx="60" cy="58" r="7" />
      <circle cx="98" cy="36" r="7" />
    </svg>
  );
}

/** Browsing a directory — four cards in a grid. */
export function GridIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="20" y="20" width="36" height="36" rx="9" />
      <rect x="64" y="20" width="36" height="36" rx="9" />
      <rect x="20" y="64" width="36" height="36" rx="9" />
      <rect x="64" y="64" width="36" height="36" rx="9" />
    </svg>
  );
}

/** Down arrow for the splash hint. */
export function ChevronDownIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

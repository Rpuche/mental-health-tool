/**
 * Kawauso – minimalistische Linien-Illustration eines Otters.
 *
 * Bewusst ruhig gehalten: keine übertriebene Mimik, keine Cartoon-Effekte.
 * Otter-Merkmale gegenüber einem Bären: kleine, seitlich sitzende Ohren und
 * eine breite, flache Schnauze.
 *
 * Nimmt die Textfarbe des Elternelements an (`currentColor`), Grösse über
 * die Klasse (z. B. `h-24 w-24`).
 */
export default function OtterIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Ohren – klein und seitlich, nicht oben wie bei einem Bären */}
      <circle cx="33" cy="36" r="7" />
      <circle cx="87" cy="36" r="7" />

      {/* Kopf */}
      <ellipse cx="60" cy="56" rx="33" ry="30" />

      {/* Augen */}
      <circle cx="48" cy="54" r="2.8" fill="currentColor" stroke="none" />
      <circle cx="72" cy="54" r="2.8" fill="currentColor" stroke="none" />

      {/* Schnauze – breit und flach */}
      <ellipse cx="60" cy="70" rx="19" ry="11" />

      {/* Nase */}
      <path
        d="M54 59c0-1.5 1.5-2.5 6-2.5s6 1 6 2.5c0 3-3 5.5-6 5.5s-6-2.5-6-5.5Z"
        fill="currentColor"
        stroke="none"
      />

      {/* Mund */}
      <path d="M60 64.5v3" />
      <path d="M60 67.5c0 3.5-4 5-7 3M60 67.5c0 3.5 4 5 7 3" />

      {/* Schnurrhaare */}
      <path d="M41 67 29 64.5M41 72l-12 1M79 67l12-2.5M79 72l12 1" />
    </svg>
  );
}

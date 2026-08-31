/**
 * The slow gradient fields behind everything else.
 *
 * Pure CSS (see globals.css): three soft radial fields drifting over one and
 * a half to two and a half minutes per pass. Only transforms animate, so the
 * compositor does the work and nothing repaints. Under
 * prefers-reduced-motion they stand still and simply become a static wash.
 *
 * Rendered once in the root layout, behind every page.
 */
export default function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <span className="ambient-a" />
      <span className="ambient-b" />
      <span className="ambient-c" />
    </div>
  );
}

import Navbar from "@/components/Navbar";

/**
 * Frame shared by /hub and its panels: navigation, centred content, and the
 * sticky crisis footer that stays visible on every screen size.
 */
export default function HubShell({
  children,
  /** Long pages (a list of profiles) start at the top instead of centred. */
  centered = true,
}: {
  children: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />

      <main
        className={`mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-8 sm:px-8 sm:py-12 ${
          centered ? "justify-center" : ""
        }`}
      >
        {children}
      </main>

      <footer className="sticky bottom-0 border-t border-white/10 bg-[#08191e]/70 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-5xl px-5 py-4 sm:px-8 sm:py-6">
          <p className="text-sm leading-relaxed text-teal-50/70">
            In a crisis, do not wait: emergency{" "}
            <span className="text-teal-50/90">112</span> &middot; Die Dargebotene
            Hand <span className="text-teal-50/90">143</span>, around the clock.
          </p>
        </div>
      </footer>
    </div>
  );
}

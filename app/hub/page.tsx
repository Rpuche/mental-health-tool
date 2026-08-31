import type { Metadata } from "next";

import HubCard from "@/components/HubCard";
import HubShell from "@/components/HubShell";
import { PeopleIcon, RouteIcon } from "@/components/Icons";
import OtterIcon from "@/components/OtterIcon";

export const metadata: Metadata = {
  title: "Hub",
};

/**
 * View 3 of the entry flow: three equally weighted ways in. Each card is a
 * route of its own, so back always steps back exactly one card.
 */
export default function HubPage() {
  return (
    <HubShell>
      <div className="grid animate-[fade-up_0.6s_ease-out] gap-4 sm:grid-cols-3 sm:gap-5">
        <HubCard
          href="/hub/why"
          icon={<PeopleIcon className="h-12 w-12" />}
          accent="text-amber-200/90"
          title="Why Bridge"
          blurb="Who this is for, and why the first step is the hard one — the fear of being judged, of making too much of it, of ending up in a file somewhere."
        />
        <HubCard
          href="/hub/how"
          icon={<RouteIcon className="h-12 w-12" />}
          accent="text-indigo-200/90"
          title="How it works"
          blurb="The whole path, start to finish: an anonymous chat, a field that fits your concern, a free call — and only then anything that costs money."
        />
        <HubCard
          href="/kawauso"
          icon={<OtterIcon className="h-12 w-12" />}
          accent="text-teal-200"
          title="Kawauso"
          blurb="Where it begins. An anonymous chat that listens first, points you to the right field, and helps you get ready for the call. No account needed."
        />
      </div>
    </HubShell>
  );
}

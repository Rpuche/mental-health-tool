import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Settings",
};

/**
 * Placeholder page. Settings have no function yet in the prototype.
 */
export default function SettingsPage() {
  const items = [
    { label: "Language", value: "English", note: "More languages coming soon" },
    { label: "Appearance", value: "Calm dark", note: "" },
    {
      label: "Account",
      value: "Not signed in",
      note: "Only needed for paid follow-up sessions",
    },
  ];

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-teal-50/72">
          Nothing here is active yet &mdash; this is a prototype.
        </p>

        <ul className="glass mt-8 divide-y divide-white/10 rounded-2xl">
          {items.map((item) => (
            <li
              key={item.label}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-4"
            >
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-sm text-teal-50/78">{item.value}</span>
              {item.note && (
                <span className="w-full text-xs text-teal-50/65">
                  {item.note}
                </span>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

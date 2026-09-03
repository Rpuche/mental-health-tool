"use client";

import { useMemo, useState } from "react";

import ExpertCard from "@/components/ExpertCard";
import type { Expert } from "@/lib/experts";

/**
 * The profiles of one field, with city and language filters.
 *
 * Both dropdowns are built from the data actually present in this field, so
 * they can never offer a value that matches nothing — and never miss one that
 * was added to lib/experts.ts later.
 */

const ANY = "Any";

/** "German, English" -> ["German", "English"] */
function splitLanguages(languages: string): string[] {
  return languages
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function sortedUnique(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export default function ExpertList({ experts }: { experts: Expert[] }) {
  const [city, setCity] = useState(ANY);
  const [language, setLanguage] = useState(ANY);

  const cities = useMemo(
    () => sortedUnique(experts.map((expert) => expert.city)),
    [experts],
  );
  const languages = useMemo(
    () => sortedUnique(experts.flatMap((expert) => splitLanguages(expert.languages))),
    [experts],
  );

  // Keep each expert's original position: it decides which mock slot roster
  // the card shows, and that should not shuffle when a filter changes.
  const visible = experts
    .map((expert, index) => ({ expert, index }))
    .filter(
      ({ expert }) =>
        (city === ANY || expert.city === city) &&
        (language === ANY || splitLanguages(expert.languages).includes(language)),
    );

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <Filter
          id="filter-city"
          label="City"
          value={city}
          options={cities}
          onChange={setCity}
        />
        <Filter
          id="filter-language"
          label="Language"
          value={language}
          options={languages}
          onChange={setLanguage}
        />
      </div>

      {visible.length > 0 ? (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-5">
          {visible.map(({ expert, index }) => (
            <ExpertCard key={expert.name} expert={expert} index={index} />
          ))}
        </div>
      ) : (
        <p className="glass mt-7 rounded-3xl p-6 text-sm leading-relaxed text-teal-50/78">
          No example profiles match that combination in this prototype &mdash;
          try a broader filter.
        </p>
      )}
    </div>
  );
}

function Filter({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs tracking-wide text-teal-50/65">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="glass press cursor-pointer rounded-full py-2.5 pr-9 pl-4 text-sm text-teal-50 outline-none focus:border-teal-300/60 focus:ring-2 focus:ring-teal-300/25"
      >
        {/* The popup itself is drawn by the OS — give the options a solid
            background so they stay readable against it. */}
        <option value={ANY} className="bg-[#0d2027] text-teal-50">
          {ANY}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#0d2027] text-teal-50">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

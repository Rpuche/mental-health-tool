/**
 * Fields and the example professionals working in them.
 *
 * Placeholder data only — no real people, no database. Field IDs are the
 * stable handles: Kawauso emits one as [[FIELD_MATCH:<id>]], the API route
 * validates it, and /experts/<id> renders the profiles below.
 */

export type FieldId =
  | "anxiety-panic"
  | "depression-low-motivation"
  | "stress-work-burnout"
  | "relationships-family"
  | "grief-loss"
  | "sleep"
  | "addiction";

export type Field = {
  id: FieldId;
  /** Display name, shown in the UI */
  label: string;
  /** What the field typically covers — context for Kawauso and for the page */
  covers: string;
};

export const FIELDS: Field[] = [
  {
    id: "anxiety-panic",
    label: "Anxiety & panic",
    covers:
      "worry that will not switch off, panic attacks, avoiding places or situations, constant tension in the body",
  },
  {
    id: "depression-low-motivation",
    label: "Depression & low motivation",
    covers:
      "stretches where everything feels heavy, loss of interest, guilt, not getting going in the morning",
  },
  {
    id: "stress-work-burnout",
    label: "Stress, work & burnout",
    covers:
      "pressure and overload at work, exhaustion that sleep does not fix, trouble switching off, boundaries",
  },
  {
    id: "relationships-family",
    label: "Relationships & family",
    covers:
      "recurring conflict, distance or loneliness in a relationship, family roles, separation",
  },
  {
    id: "grief-loss",
    label: "Grief & loss",
    covers:
      "the death of someone close, sudden loss, grief that does not follow anyone's timetable",
  },
  {
    id: "sleep",
    label: "Sleep",
    covers:
      "trouble falling or staying asleep, night-time rumination, days shaped by being tired",
  },
  {
    id: "addiction",
    label: "Addiction",
    covers:
      "alcohol, substances or behaviour that has taken up more room than intended — also for family members",
  },
];

export type Expert = {
  name: string;
  /** Professional role, deliberately without a pile of titles */
  role: string;
  /** Languages they hold sessions in */
  languages: string;
  city: string;
  workplace: string;
  /** One sentence that makes the person tangible */
  note: string;
};

export const EXPERTS: Record<FieldId, Expert[]> = {
  "anxiety-panic": [
    {
      name: "Lena Ammann",
      role: "Psychologist FSP",
      languages: "German, English",
      city: "Zurich",
      workplace: "Bridge Practice Kreis 4",
      note: "Works a lot with panic attacks and avoidance in everyday life.",
    },
    {
      name: "Marco Beti",
      role: "Psychotherapist",
      languages: "German, Italian",
      city: "Lugano",
      workplace: "Bridge Practice Lugano",
      note: "Calm, very structured way of talking.",
    },
  ],
  "depression-low-motivation": [
    {
      name: "Sarah Kunz",
      role: "Psychologist FSP",
      languages: "German, English",
      city: "Bern",
      workplace: "Bridge Practice Länggasse",
      note: "Focuses on stretches where everything feels heavy.",
    },
    {
      name: "Daniel Frei",
      role: "Psychotherapist",
      languages: "German, French",
      city: "Fribourg",
      workplace: "Bridge Practice Fribourg",
      note: "Often accompanies people who are seeking help for the first time.",
    },
  ],
  "stress-work-burnout": [
    {
      name: "Feliciano Rüegg",
      role: "Psychologist FSP",
      languages: "German, English",
      city: "Zurich",
      workplace: "Bridge Practice Oerlikon",
      note: "Works with exhaustion, pressure and boundaries at work.",
    },
    {
      name: "Reyna Locher",
      role: "Coach & psychotherapist",
      languages: "German",
      city: "Zug",
      workplace: "Bridge Practice Zug",
      note: "Plenty of experience with people in demanding jobs.",
    },
  ],
  "relationships-family": [
    {
      name: "Lorena Wyss",
      role: "Couples and family therapist",
      languages: "German, English",
      city: "Basel",
      workplace: "Bridge Practice Kleinbasel",
      note: "Also there for one-on-one conversations about a relationship.",
    },
    {
      name: "Jonas Sieber",
      role: "Psychotherapist",
      languages: "German",
      city: "Lucerne",
      workplace: "Bridge Practice Lucerne",
      note: "Calm, non-judgemental, experienced with family conflicts.",
    },
  ],
  "grief-loss": [
    {
      name: "Miriam Haas",
      role: "Psychologist FSP",
      languages: "German, English",
      city: "Bern",
      workplace: "Bridge Practice Breitenrain",
      note: "Accompanies grief without a schedule and without stage models.",
    },
    {
      name: "Peter Zwahlen",
      role: "Psychotherapist",
      languages: "German",
      city: "Thun",
      workplace: "Bridge Practice Thun",
      note: "Often works with sudden loss.",
    },
  ],
  sleep: [
    {
      name: "Raoul Brand",
      role: "Psychologist FSP",
      languages: "German, English",
      city: "Zurich",
      workplace: "Bridge Practice Enge",
      note: "Focuses on sleeplessness and night-time rumination.",
    },
    {
      name: "Romina Suter",
      role: "Psychotherapist",
      languages: "German, French",
      city: "Biel/Bienne",
      workplace: "Bridge Practice Biel",
      note: "Connects sleep topics with stress and daily structure.",
    },
  ],
  addiction: [
    {
      name: "Claudia Meier",
      role: "Psychologist FSP",
      languages: "German, English",
      city: "Winterthur",
      workplace: "Bridge Practice Winterthur",
      note: "Works without pressure and without abstinence as a precondition.",
    },
    {
      name: "Rafael Studer",
      role: "Addiction therapist",
      languages: "German, Italian",
      city: "Bellinzona",
      workplace: "Bridge Practice Bellinzona",
      note: "Also supports family members.",
    },
  ],
};

/** Looks up a field by ID — also serves as the guard for the chat marker. */
export function getField(id: string): Field | undefined {
  return FIELDS.find((field) => field.id === id);
}

/** The field list as a text block for the system prompt. */
export function fieldsForPrompt(): string {
  return FIELDS.map(
    (field) => `  - ${field.id} (${field.label}): ${field.covers}`,
  ).join("\n");
}

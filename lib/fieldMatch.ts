/**
 * Parses the field marker Kawauso appends when it has settled on a field:
 *
 *   [[FIELD_MATCH:stress-work-burnout]]
 *
 * The marker is stripped from the visible text and returned as structured
 * data. Deliberately free of imports so it can be exercised on its own.
 *
 * Whether the ID actually exists is not decided here — the caller checks it
 * against lib/experts.ts, so an invented ID never reaches the UI.
 */

/** Matches every marker in a message, however sloppily spaced. */
const MARKER = /\[\[\s*FIELD_MATCH\s*:\s*([a-z0-9-]+)\s*\]\]/gi;

export type FieldMatchResult = {
  /** The message without any marker, ready to display. */
  text: string;
  /** The ID from the first marker found, lowercased. */
  fieldId?: string;
};

export function extractFieldMatch(raw: string): FieldMatchResult {
  const first = new RegExp(MARKER.source, "i").exec(raw);

  const text = raw
    .replace(MARKER, "")
    // The marker sits on its own line; drop the blank line it leaves behind.
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return first ? { text, fieldId: first[1].toLowerCase() } : { text };
}

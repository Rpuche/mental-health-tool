/**
 * Metadata for the AI character.
 *
 * Note: this file deliberately contains NO system prompt — it is imported by
 * client components and therefore ends up in the browser bundle. The prompt
 * lives in `lib/prompts.ts` and stays server-side.
 */

export type CharacterId = "kawauso";

export const KAWAUSO = {
  id: "kawauso" as const,
  /** Otters — a byword for being calm and content. */
  name: "Kawauso",
  tagline: "Your anonymous first step. No account, no real name.",
  /** First message in the chat — UI only, never sent to the API. */
  greeting:
    "Hi, I'm Kawauso. Take your time — tell me in your own words what's going on, and we'll figure out together who might be a good fit for you.",
  placeholder: "What's on your mind?",
};

/** Type guard: did a valid character ID arrive in the request body? */
export function isCharacterId(value: unknown): value is CharacterId {
  return value === KAWAUSO.id;
}

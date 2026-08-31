import type { FieldId } from "./experts";

/**
 * A single message in the conversation.
 *
 * Deliberately reduced to plain text and two roles (prototype). These roles
 * are our own format — the route translates "assistant" into Gemini's "model"
 * so the UI stays provider-independent.
 */
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  /**
   * Set on an assistant message when Kawauso settled on a field. Drives the
   * button to the professionals; never sent back to the model.
   */
  fieldMatch?: FieldId;
};

/** Request body of /api/chat */
export type ChatRequest = {
  character: string;
  messages: ChatMessage[];
};

/** Response body of /api/chat */
export type ChatResponse = {
  /** The visible answer, with any field marker already stripped. */
  reply: string;
  /** The matched field, if this message carried a valid marker. */
  fieldMatch?: FieldId;
};

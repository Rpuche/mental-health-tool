import { ApiError, GoogleGenAI, type Content } from "@google/genai";
import { NextResponse } from "next/server";

import { isCharacterId } from "@/lib/characters";
import { getField } from "@/lib/experts";
import { extractFieldMatch } from "@/lib/fieldMatch";
import { getSystemPrompt } from "@/lib/prompts";
import type { ChatMessage, ChatRequest, ChatResponse } from "@/lib/types";

/**
 * POST /api/chat
 *
 * Takes the conversation so far and forwards it to the Google Gemini API. The
 * client only sends the character ID ("kawauso") — the server picks the
 * matching system prompt, so it neither reaches the browser nor can be
 * overridden by the client.
 *
 * The API key comes from the GOOGLE_API_KEY environment variable (.env.local).
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_API_KEY is missing. Add it to .env.local." },
      { status: 500 },
    );
  }

  // --- Validate the input --------------------------------------------------
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!isCharacterId(body.character)) {
    return NextResponse.json(
      { error: "Unknown character." },
      { status: 400 },
    );
  }

  const messages = body.messages;
  const isValidVerlauf =
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.every(
      (m: ChatMessage) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    );

  if (!isValidVerlauf) {
    return NextResponse.json(
      { error: "The conversation history is empty or malformed." },
      { status: 400 },
    );
  }

  // Gemini knows the roles "user" and "model" — our "assistant" is translated
  // here so components/Chat.tsx can stay as it is.
  const contents: Content[] = messages.map((nachricht) => ({
    role: nachricht.role === "assistant" ? "model" : "user",
    parts: [{ text: nachricht.content }],
  }));

  // --- Call Gemini ---------------------------------------------------------
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        // Plain text, no history — the model's standing instructions.
        systemInstruction: getSystemPrompt(body.character),
        // Answers are meant to be short — see the system prompt.
        maxOutputTokens: 2048,
        // Note: the model thinks by default. If response time hurts the
        // demo: thinkingConfig: { thinkingBudget: 0 }.
      },
    });

    // .text joins all text parts; undefined e.g. when blocked by safety.
    // The field marker is stripped here so it never reaches the chat bubble.
    const { text: reply, fieldId } = extractFieldMatch(response.text ?? "");

    // Only IDs that actually exist are passed on — an invented one is dropped
    // rather than turned into a link to a page with no professionals.
    const field = fieldId ? getField(fieldId) : undefined;
    if (fieldId && !field) {
      console.warn(`[api/chat] Unknown field ID in marker: ${fieldId}`);
    }

    if (!reply) {
      // finishReason helps when debugging (SAFETY, MAX_TOKENS, ...).
      console.error(
        "[api/chat] Empty answer",
        response.candidates?.[0]?.finishReason,
        response.promptFeedback,
      );
      return NextResponse.json(
        { error: "No answer came back. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json<ChatResponse>({
      reply,
      ...(field ? { fieldMatch: field.id } : {}),
    });
  } catch (error) {
    // The SDK throws ApiError carrying the HTTP status — branch on that.
    if (error instanceof ApiError) {
      console.error(`[api/chat] API error ${error.status}`, error);

      if (error.status === 401 || error.status === 403) {
        return NextResponse.json(
          { error: "The API key was rejected." },
          { status: 500 },
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Too many requests right now. Please wait a moment." },
          { status: 429 },
        );
      }
      return NextResponse.json(
        { error: "Kawauso can't be reached right now." },
        { status: 502 },
      );
    }

    console.error("[api/chat] Unexpected error", error);
    return NextResponse.json(
      { error: "Unexpected error." },
      { status: 500 },
    );
  }
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import RichText from "@/components/RichText";
import { KAWAUSO } from "@/lib/characters";
import { getField } from "@/lib/experts";
import type { ChatMessage, ChatResponse } from "@/lib/types";

/**
 * Chat-UI: Nachrichtenverlauf + Eingabefeld.
 *
 * Die Oberfläche ist Englisch; Kawauso selbst antwortet Deutsch (siehe
 * lib/prompts.ts).
 */
export default function Chat() {
  // Der Verlauf, der an die API geht. Die Begrüssung ist reine UI und steht
  // bewusst NICHT drin – die API erwartet als erste Nachricht "user".
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nach jeder neuen Nachricht ans Ende scrollen.
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  async function send(event: React.FormEvent) {
    event.preventDefault();

    const text = input.trim();
    if (!text || isSending) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: KAWAUSO.id,
          // Only role and text go to the model; fieldMatch is UI state.
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "The answer didn't come through.");
      }

      const data = (await response.json()) as ChatResponse;
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.reply,
          ...(data.fieldMatch ? { fieldMatch: data.fieldMatch } : {}),
        },
      ]);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Something went wrong.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Nachrichtenverlauf */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        <Bubble role="assistant">
          <RichText text={KAWAUSO.greeting} />
        </Bubble>

        {messages.map((message, index) => (
          <div key={index} className="space-y-3">
            <Bubble role={message.role}>
              {message.role === "assistant" ? (
                <RichText text={message.content} />
              ) : (
                <span className="whitespace-pre-wrap">{message.content}</span>
              )}
            </Bubble>

            {message.fieldMatch && <FieldMatchLink fieldId={message.fieldMatch} />}
          </div>
        ))}

        {isSending && (
          <Bubble role="assistant">
            <span className="opacity-60">typing …</span>
          </Bubble>
        )}

        {error && (
          <p className="rounded-xl bg-red-400/10 p-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <div ref={endRef} />
      </div>

      {/* Eingabefeld */}
      <form
        onSubmit={send}
        className="flex gap-2 border-t border-white/10 p-4"
      >
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={KAWAUSO.placeholder}
          disabled={isSending}
          className="flex-1 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2.5 text-sm text-teal-50 outline-none transition placeholder:text-teal-50/50 focus:border-teal-300/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-teal-300/25 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSending || input.trim().length === 0}
          className="press rounded-full bg-teal-300 px-5 py-2.5 text-sm font-medium text-teal-950 shadow-lg shadow-teal-950/30 hover:bg-teal-200 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}

/** Eine einzelne Nachrichtenblase. */
function Bubble({
  role,
  children,
}: {
  role: ChatMessage["role"];
  children: React.ReactNode;
}) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
          isUser
            ? "bg-teal-300 text-teal-950 shadow-md shadow-teal-950/25"
            : "border border-white/10 bg-white/[0.08] text-teal-50/90"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Appears under the message in which Kawauso settled on a field. Plain
 * client-side navigation in the same tab — no new window.
 */
function FieldMatchLink({ fieldId }: { fieldId: NonNullable<ChatMessage["fieldMatch"]> }) {
  const field = getField(fieldId);
  if (!field) return null;

  return (
    <Link
      href={`/experts/${field.id}`}
      className="press inline-flex animate-[fade-up_0.5s_ease-out] items-center gap-2 rounded-full bg-teal-300 px-5 py-2.5 text-sm font-medium text-teal-950 shadow-lg shadow-teal-950/30 hover:bg-teal-200"
    >
      See available professionals in {field.label}
      <span aria-hidden="true">&rarr;</span>
    </Link>
  );
}

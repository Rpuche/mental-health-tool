import type { ReactNode } from "react";

/**
 * Minimal markdown renderer for Kawauso's answers.
 *
 * Covers what the model actually produces — **bold**, *italic*, `code`,
 * bullet and numbered lists, blank-line paragraphs — instead of pulling in a
 * full markdown library. Everything becomes React elements, never raw HTML,
 * so no model output can inject markup.
 *
 * Only used for assistant messages: what a person types stays literal text.
 */

/** Splits on inline spans while keeping them (capturing group). */
const INLINE = /(\*\*[^*\n]+\*\*|__[^_\n]+__|\*[^*\n]+\*|_[^_\n]+_|`[^`\n]+`)/g;

const BULLET = /^\s*[-*+]\s+/;
const NUMBERED = /^\s*\d+[.)]\s+/;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text
    .split(INLINE)
    .filter((token) => token !== "")
    .map((token, index) => {
      const key = `${keyPrefix}-${index}`;

      if (
        (token.startsWith("**") && token.endsWith("**")) ||
        (token.startsWith("__") && token.endsWith("__"))
      ) {
        return (
          <strong key={key} className="font-semibold text-teal-50">
            {token.slice(2, -2)}
          </strong>
        );
      }

      if (
        (token.startsWith("*") && token.endsWith("*")) ||
        (token.startsWith("_") && token.endsWith("_"))
      ) {
        return <em key={key}>{token.slice(1, -1)}</em>;
      }

      if (token.startsWith("`") && token.endsWith("`")) {
        return (
          <code key={key} className="rounded bg-white/10 px-1 py-0.5 text-xs">
            {token.slice(1, -1)}
          </code>
        );
      }

      return <span key={key}>{token}</span>;
    });
}

export default function RichText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);

  return (
    <div className="space-y-3">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").filter((line) => line.trim() !== "");
        if (lines.length === 0) return null;

        const isBulleted = lines.every((line) => BULLET.test(line));
        const isNumbered = lines.every((line) => NUMBERED.test(line));

        if (isBulleted || isNumbered) {
          const items = lines.map((line, lineIndex) => (
            <li key={lineIndex} className="leading-relaxed">
              {renderInline(
                line.replace(isBulleted ? BULLET : NUMBERED, ""),
                `${blockIndex}-${lineIndex}`,
              )}
            </li>
          ));

          return isBulleted ? (
            <ul key={blockIndex} className="list-disc space-y-1 pl-5">
              {items}
            </ul>
          ) : (
            <ol key={blockIndex} className="list-decimal space-y-1 pl-5">
              {items}
            </ol>
          );
        }

        // A normal paragraph; single newlines inside it stay as line breaks.
        return (
          <p key={blockIndex} className="leading-relaxed">
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 && <br />}
                {renderInline(line, `${blockIndex}-${lineIndex}`)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

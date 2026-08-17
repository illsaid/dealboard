import { type ReactNode } from 'react';

const LINK_CLASS = 'underline decoration-ink-300 underline-offset-2 hover:text-ink-800';

// Matches [label](url) markdown links and bare https:// URLs.
// Order matters: markdown links are matched first so their inner URL isn't
// also caught by the bare-URL pattern.
const TOKEN_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<)\]]+)/g;

export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TOKEN_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // Markdown link: [label](url)
      parts.push(
        <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          {match[1]}
        </a>,
      );
    } else if (match[3]) {
      // Bare URL
      parts.push(
        <a key={match.index} href={match[3]} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          {match[3]}
        </a>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

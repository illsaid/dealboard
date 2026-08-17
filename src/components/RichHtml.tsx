import DOMPurify from 'dompurify';

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function plainTextToHtml(text: string): string {
  const paragraphs = text.split(/\n\n+/);
  return paragraphs
    .map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function sanitize(html: string): string {
  if (typeof window === 'undefined') return html;
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}

interface RichHtmlProps {
  html: string;
  className?: string;
}

export function RichHtml({ html, className }: RichHtmlProps) {
  if (!html) return null;

  const source = html.includes('<') ? html : plainTextToHtml(html);
  const clean = sanitize(source);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

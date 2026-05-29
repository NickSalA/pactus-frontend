import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { CONTRACT_STATUS_COLORS } from '@/lib/contractStatusColors';

type MarkdownRendererProps = {
  content: string;
};

const TOKEN_LINE_REGEX =
  /📊\s*Tokens de entrada:\s*\d+\s*\|\s*Tokens de salida:\s*\d+/;

function removeTokenLines(text: string): string {
  return text
    .split('\n')
    .filter((line) => !TOKEN_LINE_REGEX.test(line.trim()))
    .join('\n');
}

const DOCUMENT_STATES = [
  'DRAFT',
  'PENDING_SIGNATURE',
  'ACTIVE',
  'EXPIRING_SOON',
  'EXPIRED',
  'TERMINATED',
] as const;

const STATE_BADGE_CLASSES: Record<
  string,
  { bg: string; text: string; ring: string }
> = {
  DRAFT: { bg: 'bg-slate-100', text: 'text-slate-700', ring: 'ring-slate-200' },
  PENDING_SIGNATURE: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    ring: 'ring-blue-200',
  },
  ACTIVE: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200',
  },
  EXPIRING_SOON: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-200',
  },
  EXPIRED: {
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    ring: 'ring-slate-200',
  },
  TERMINATED: {
    bg: 'bg-zinc-100',
    text: 'text-zinc-700',
    ring: 'ring-zinc-200',
  },
};

function isDocumentState(text: string): boolean {
  return (DOCUMENT_STATES as readonly string[]).includes(
    text.trim().toUpperCase(),
  );
}

function renderDocumentStateBadge(text: string): React.ReactNode {
  const upperText = text
    .trim()
    .toUpperCase() as keyof typeof STATE_BADGE_CLASSES;
  const classes = STATE_BADGE_CLASSES[upperText] ?? {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    ring: 'ring-slate-200',
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${classes.bg} ${classes.text} ${classes.ring}`}
    >
      {text}
    </span>
  );
}

const components: Components = {
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-blue-50/30">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
      {children}
    </th>
  ),
  td: ({ children }) => {
    const textContent = typeof children === 'string' ? children.trim() : '';
    if (isDocumentState(textContent)) {
      return (
        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
          {renderDocumentStateBadge(textContent)}
        </td>
      );
    }
    return (
      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
        {children}
      </td>
    );
  },
  tbody: ({ children }) => (
    <tbody className="divide-y divide-slate-100">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="transition-colors duration-100 hover:bg-blue-50/40">
      {children}
    </tr>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-sm text-blue-700">
          {children}
        </code>
      );
    }
    return <code className={className}>{children}</code>;
  },
  pre: ({ children }) => (
    <pre className="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
      {children}
    </pre>
  ),
  h1: ({ children }) => (
    <h1 className="mt-6 mb-3 text-2xl font-bold text-slate-800">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-5 mb-2 text-xl font-bold text-slate-800">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-4 mb-2 text-base font-semibold uppercase tracking-wide text-slate-700">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-slate-700">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 list-none space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-none space-y-1.5">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="flex items-start gap-3 text-slate-700">
      <span className="mt-1.75 h-2 w-2 shrink-0 rounded-full bg-blue-400" />
      <span className="leading-relaxed">{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2 rounded-r-lg border-l-4 border-blue-300 bg-blue-50/50 py-2.5 pl-4 pr-3 italic text-slate-600">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-slate-200" />,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const cleanContent = removeTokenLines(content);

  return (
    <div className="min-w-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
}

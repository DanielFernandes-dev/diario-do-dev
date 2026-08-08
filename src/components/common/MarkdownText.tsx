import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownTextProps {
  content: string;
}

const components: Components = {
  h1: (props) => (
    <h1 className="mb-4 mt-6 text-2xl font-extrabold leading-tight text-white first:mt-0" {...props} />
  ),
  h2: (props) => (
    <h2 className="mb-3 mt-6 text-xl font-extrabold leading-tight text-white first:mt-0" {...props} />
  ),
  h3: (props) => (
    <h3 className="mb-2 mt-5 text-lg font-bold leading-snug text-white first:mt-0" {...props} />
  ),
  p: (props) => <p className="mb-4 break-words leading-7 text-zinc-300" {...props} />,
  a: (props) => (
    <a
      className="break-words text-ink-200 underline decoration-ink-400/40 underline-offset-2 transition-colors hover:text-ink-100"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: (props) => <ul className="mb-4 list-disc space-y-1 break-words pl-5 text-zinc-300" {...props} />,
  ol: (props) => <ol className="mb-4 list-decimal space-y-1 break-words pl-5 text-zinc-300" {...props} />,
  li: (props) => <li className="break-words leading-7" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-4 break-words border-l-4 border-ink-400/40 bg-zinc-900 py-2 pl-4 pr-3 text-zinc-300"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-white" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  del: (props) => <del className="text-zinc-500" {...props} />,
  hr: () => <hr className="my-6 border-zinc-700" />,
  img: (props) => (
    <img
      className="my-4 max-w-full rounded-2xl border border-zinc-700"
      {...props}
    />
  ),
  input: (props) => (
    <input
      className="mr-2 h-4 w-4 translate-y-0.5 accent-ink-400"
      type="checkbox"
      readOnly
      disabled
      {...props}
    />
  ),
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className ?? '');
    if (match) {
      return (
        <pre className="my-4 overflow-x-auto rounded-2xl border border-zinc-700 bg-[#0d1117] p-4 text-sm font-mono leading-6">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      );
    }
    return (
      <code
        className="rounded-md border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.85em] text-ink-200"
        {...props}
      >
        {children}
      </code>
    );
  },
  table: (props) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm text-zinc-300" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border border-zinc-700 bg-zinc-900 px-3 py-2 text-left font-semibold text-white" {...props} />
  ),
  td: (props) => <td className="border border-zinc-700 px-3 py-2" {...props} />,
};

export function MarkdownText({ content }: MarkdownTextProps) {
  return (
    <div className="text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

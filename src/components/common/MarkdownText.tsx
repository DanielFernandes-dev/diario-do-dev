interface MarkdownTextProps {
  content: string;
}

export function MarkdownText({ content }: MarkdownTextProps) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.replace(/```\w*\n?/, '').replace(/```$/, '');
          return (
            <pre
              key={index}
              className="my-4 overflow-x-auto rounded-2xl border border-zinc-700 bg-black p-4 text-sm font-mono text-zinc-100"
            >
              <code>{code}</code>
            </pre>
          );
        }
        return (
          <p key={index} className="mb-4 whitespace-pre-wrap text-base leading-7 text-zinc-300">
            {part}
          </p>
        );
      })}
    </div>
  );
}

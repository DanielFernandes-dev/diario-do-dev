import React, { useState } from 'react';
import { useComments } from './CommentContext';

interface CommentInputProps {
  parentId?: string;
  isReply?: boolean;
}

export function CommentInput({ parentId, isReply = false }: CommentInputProps) {
  const [content, setContent] = useState('');
  const { addComment, setReplyingTo } = useComments();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addComment(content, parentId);
    setContent('');
  };

  const handleCancel = () => {
    setReplyingTo(null);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className={`mt-2 ${isReply ? 'ml-0 pl-4' : ''}`}>
      <textarea
        className="min-h-[90px] w-full resize-y rounded-2xl border border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-ink-400/40 focus:bg-zinc-800"
        rows={isReply ? 2 : 3}
        placeholder={isReply ? "Escreva sua resposta..." : "Adicione um comentário... (suporta Markdown)"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end gap-2 mt-2">
        {isReply && (
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={!content.trim()}
          className="rounded-full bg-ink-500 px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-ink-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isReply ? 'Responder' : 'Comentar'}
        </button>
      </div>
    </form>
  );
}

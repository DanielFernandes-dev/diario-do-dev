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
    <form onSubmit={handleSubmit} className={`mt-2 ${isReply ? 'ml-0 border-l-2 border-gray-200 pl-4' : ''}`}>
      <textarea
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y min-h-[80px] bg-white text-gray-800 text-sm font-mono shadow-sm"
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
            className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={!content.trim()}
          className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors shadow-sm"
        >
          {isReply ? 'Responder' : 'Comentar'}
        </button>
      </div>
    </form>
  );
}

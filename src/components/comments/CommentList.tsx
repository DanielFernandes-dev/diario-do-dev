import React from 'react';
import { useComments } from './CommentContext';
import { CommentItem } from './CommentItem';

export function CommentList() {
  const { comments } = useComments();

  if (comments.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 py-10 text-center text-sm text-zinc-400">
        Nenhum comentário ainda. Seja o primeiro a compartilhar sua opinião ou fazer uma pergunta!
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {comments.map(comment => (
        <div key={comment.id} className="pt-2">
          <CommentItem comment={comment} />
        </div>
      ))}
    </div>
  );
}

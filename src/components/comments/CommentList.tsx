import React from 'react';
import { useComments } from './CommentContext';
import { CommentItem } from './CommentItem';

export function CommentList() {
  const { comments, sortBy } = useComments();

  // Sort root comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'relevant') {
      const scoreA = (a.likes ?? a.upvotes ?? 0);
      const scoreB = (b.likes ?? b.upvotes ?? 0);
      
      // 1. Unanswered questions priority
      if (a.isQuestion && !a.isAnswered && (!b.isQuestion || b.isAnswered)) return -1;
      if (b.isQuestion && !b.isAnswered && (!a.isQuestion || a.isAnswered)) return 1;
      
      // 2. Author's comments priority
      if (a.isAuthor && !b.isAuthor) return -1;
      if (b.isAuthor && !a.isAuthor) return 1;

      // 3. Score
      return scoreB - scoreA;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (comments.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200 mt-6">
        Nenhum comentário ainda. Seja o primeiro a compartilhar sua opinião ou fazer uma pergunta!
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {sortedComments.map(comment => (
        <div key={comment.id} className="pt-2">
          <CommentItem comment={comment} />
        </div>
      ))}
    </div>
  );
}

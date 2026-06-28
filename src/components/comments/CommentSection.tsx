import React from 'react';
import { MessageSquare, Flame, Clock } from 'lucide-react';
import { Comment } from '../../data/posts';
import { CommentProvider, useComments } from './CommentContext';
import { CommentInput } from './CommentInput';
import { CommentList } from './CommentList';

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

function CommentSectionInner() {
  const { sortBy, setSortBy, comments } = useComments();
  
  // Simple count for root and level 1 (accurate enough for demo)
  const totalComments = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0); 

  return (
    <div className="glass-panel mt-2 p-5 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink-500/10 text-ink-200">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Discussão <span className="ml-2 text-sm font-medium text-slate-400">({totalComments})</span>
          </h3>
        </div>

        <div className="flex w-full rounded-2xl border border-zinc-700 bg-zinc-900 p-1 sm:w-auto">
          <button
            onClick={() => setSortBy('relevant')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${
              sortBy === 'relevant' 
                ? 'bg-white text-slate-950 shadow-soft' 
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            Relevantes
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${
              sortBy === 'recent' 
                ? 'bg-white text-slate-950 shadow-soft' 
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            Recentes
          </button>
        </div>
      </div>

      <CommentInput />
      <CommentList />
    </div>
  );
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  return (
    <CommentProvider initialComments={initialComments}>
      <CommentSectionInner />
    </CommentProvider>
  );
}

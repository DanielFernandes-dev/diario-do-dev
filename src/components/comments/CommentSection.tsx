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
    <div className="bg-white border-t border-gray-100 p-4 sm:p-6 rounded-b-lg mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Discussão <span className="text-gray-500 font-normal text-sm ml-1">({totalComments})</span>
          </h3>
        </div>

        {/* Sort Options */}
        <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
          <button
            onClick={() => setSortBy('relevant')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
              sortBy === 'relevant' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Flame className="w-4 h-4" />
            Relevantes
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
              sortBy === 'recent' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
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

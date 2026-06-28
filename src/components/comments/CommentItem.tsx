import React, { useState } from 'react';
import { ArrowBigUp, MessageCircle, HelpCircle, CheckCircle, MoreHorizontal } from 'lucide-react';
import { Comment } from '../../data/posts';
import { useComments } from './CommentContext';
import { CommentInput } from './CommentInput';

interface CommentItemProps {
  comment: Comment;
  depth?: number;
}

const MAX_DEPTH = 2; // Allow root, level 1, level 2. Total 3 levels as requested.

export function CommentItem({ comment, depth = 0 }: CommentItemProps) {
  const { 
    likeComment, 
    toggleQuestionStatus, 
    replyingTo, 
    setReplyingTo 
  } = useComments();
  
  const [showMoreReplies, setShowMoreReplies] = useState(false);

  const isReplying = replyingTo === comment.id;
  const isAuthor = comment.isAuthor;

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const renderContent = (content: string) => {
    // Simple markdown code block support
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.replace(/```\w*\n?/, '').replace(/```$/, '');
        return (
          <pre key={index} className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto my-3 border border-gray-700 shadow-sm">
            <code>{code}</code>
          </pre>
        );
      }
      return <p key={index} className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">{part}</p>;
    });
  };

  return (
    <div className={`flex flex-col mt-5 ${depth > 0 ? 'ml-2 sm:ml-6 border-l-2 border-gray-100 pl-3 sm:pl-4' : ''}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {comment.author.avatar ? (
            <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm" />
          ) : (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${isAuthor ? 'bg-blue-600 text-white ring-2 ring-blue-100' : 'bg-gray-200 text-gray-700 ring-2 ring-gray-50'}`}>
              {comment.author.isAnonymous ? 'A' : comment.author.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content Box */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-sm font-semibold ${isAuthor ? 'text-blue-700' : 'text-gray-900'}`}>
              {comment.author.isAnonymous ? 'Anônimo' : comment.author.name}
            </span>
            {isAuthor && (
              <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                Autor
              </span>
            )}
            <span className="text-xs text-gray-500">• {formatDate(comment.createdAt)}</span>
            
            {comment.isQuestion && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1 ${comment.isAnswered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {comment.isAnswered ? <CheckCircle className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                {comment.isAnswered ? 'Respondida' : 'Pergunta'}
              </span>
            )}
          </div>

          <div className="mb-2">
            {renderContent(comment.content)}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mt-2">
            <button 
              onClick={() => likeComment(comment.id)} 
              className="flex items-center gap-1.5 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 -ml-2 rounded-md transition-colors"
            >
              <ArrowBigUp className="w-4 h-4" />
              <span>{comment.likes ?? comment.upvotes ?? 0}</span>
            </button>
            <button 
              onClick={() => setReplyingTo(isReplying ? null : comment.id)}
              className="flex items-center gap-1.5 hover:text-gray-800 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Responder</span>
            </button>

            {/* Toggle Question/Answered Status (Demo purpose, could be restricted to author) */}
            <button 
              onClick={() => toggleQuestionStatus(comment.id, comment.isQuestion ? 'isAnswered' : 'isQuestion')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${comment.isQuestion ? 'hover:text-green-600 hover:bg-green-50' : 'hover:text-yellow-600 hover:bg-yellow-50'}`}
              title={comment.isQuestion ? "Marcar como Respondida" : "Marcar como Pergunta"}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{comment.isQuestion ? 'Status' : 'Marcar dúvida'}</span>
            </button>
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <CommentInput parentId={comment.id} isReply />
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {depth >= MAX_DEPTH && !showMoreReplies ? (
                <button 
                  onClick={() => setShowMoreReplies(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 mt-3 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                  Ver mais {comment.replies.length} respostas
                </button>
              ) : (
                <div className="relative">
                  {/* Decorative thread line for deep nesting */}
                  {showMoreReplies && <div className="absolute -left-[1.35rem] top-0 bottom-0 w-px bg-gray-200" />}
                  {comment.replies.map(reply => (
                    <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

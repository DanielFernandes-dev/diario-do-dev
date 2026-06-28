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
          <pre key={index} className="my-3 overflow-x-auto rounded-2xl border border-zinc-700 bg-black p-4 text-sm font-mono text-zinc-100 shadow-none">
            <code>{code}</code>
          </pre>
        );
      }
      return <p key={index} className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{part}</p>;
    });
  };

  return (
    <div className={`mt-5 flex flex-col ${depth > 0 ? 'ml-2 border-l border-zinc-700 pl-3 sm:ml-6 sm:pl-5' : ''}`}>
      <div className="flex gap-3">
        <div className="mt-1 flex-shrink-0">
          {comment.author.avatar ? (
            <img src={comment.author.avatar} alt={comment.author.name} className="h-8 w-8 rounded-full ring-2 ring-zinc-700 shadow-sm" />
          ) : (
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black shadow-sm ${isAuthor ? 'bg-gradient-to-br from-ink-400 to-ink-700 text-white' : 'bg-zinc-800 text-white'}`}>
              {comment.author.isAnonymous ? 'A' : comment.author.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={`text-sm font-semibold ${isAuthor ? 'text-ink-200' : 'text-white'}`}>
              {comment.author.isAnonymous ? 'Anônimo' : comment.author.name}
            </span>
            {isAuthor && (
              <span className="rounded-full border border-ink-400/30 bg-ink-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-200">
                Autor
              </span>
            )}
            <span className="text-xs text-zinc-500">• {formatDate(comment.createdAt)}</span>
            
            {comment.isQuestion && (
              <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${comment.isAnswered ? 'border border-emerald-400/25 bg-emerald-400/10 text-emerald-200' : 'border border-amber-400/25 bg-amber-400/10 text-amber-200'}`}>
                {comment.isAnswered ? <CheckCircle className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                {comment.isAnswered ? 'Respondida' : 'Pergunta'}
              </span>
            )}
          </div>

          <div className="mb-3 rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
            {renderContent(comment.content)}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-400">
            <button 
              onClick={() => likeComment(comment.id)} 
              className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 transition-colors hover:border-ink-400/30 hover:bg-ink-500/10 hover:text-ink-200"
            >
              <ArrowBigUp className="w-4 h-4" />
              <span>{comment.likes ?? comment.upvotes ?? 0}</span>
            </button>
            <button 
              onClick={() => setReplyingTo(isReplying ? null : comment.id)}
              className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Responder</span>
            </button>

            <button 
              onClick={() => toggleQuestionStatus(comment.id, comment.isQuestion ? 'isAnswered' : 'isQuestion')}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors ${comment.isQuestion ? 'border-emerald-400/20 bg-emerald-400/10 hover:border-emerald-400/30 hover:text-emerald-200' : 'border-amber-400/20 bg-amber-400/10 hover:border-amber-400/30 hover:text-amber-200'}`}
              title={comment.isQuestion ? "Marcar como Respondida" : "Marcar como Pergunta"}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{comment.isQuestion ? 'Status' : 'Marcar dúvida'}</span>
            </button>
          </div>

          {isReplying && (
            <div className="mt-3 rounded-2xl border border-zinc-700 bg-zinc-900 p-3">
              <CommentInput parentId={comment.id} isReply />
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {depth >= MAX_DEPTH && !showMoreReplies ? (
                <button 
                  onClick={() => setShowMoreReplies(true)}
                  className="mt-3 flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
                >
                  <MoreHorizontal className="w-4 h-4" />
                  Ver mais {comment.replies.length} respostas
                </button>
              ) : (
                <div className="relative">
                  {showMoreReplies && <div className="absolute -left-[1.35rem] top-0 bottom-0 w-px bg-zinc-700" />}
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

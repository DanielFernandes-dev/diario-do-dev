import React, { useState } from 'react';
import { Heart, MessageCircle, HelpCircle, CheckCircle, MoreHorizontal, Pencil, Trash2, X, Check } from 'lucide-react';
import type { Comment } from '@/types/comment';
import { useComments } from './CommentContext';
import { CommentInput } from './CommentInput';
import { useAuth } from '@/context/AuthContext';
import { MarkdownText } from '@/components/common/MarkdownText';

interface CommentItemProps {
  comment: Comment;
  depth?: number;
}

const MAX_DEPTH = 2; // Allow root, level 1, level 2. Total 3 levels as requested.

// Recuo máximo por nível: 20px a 28px no desktop, menor em telas pequenas.
const TREE_INDENT = 'clamp(12px, 2.4vw, 26px)';
// Profundidades muito altas param de aumentar significativamente a indentação.
const TREE_INDENT_DEEP = 'clamp(8px, 1.6vw, 12px)';
const MAX_TREE_DEPTH = 3;
const CONNECTOR_TOP = 20; // Alinha o conector com o centro do avatar.

export function CommentItem({ comment, depth = 0 }: CommentItemProps) {
  const { 
    likeComment, 
    toggleQuestionStatus, 
    replyingTo, 
    setReplyingTo,
    deleteComment,
    editComment,
  } = useComments();
  
  const { currentUser, isAdmin } = useAuth();
  const [showMoreReplies, setShowMoreReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isReplying = replyingTo === comment.id;
  const isAuthor = comment.isAuthor;

  const isLiked = (comment.likedBy ?? []).some(
    (email) => email.toLowerCase() === currentUser?.email?.toLowerCase(),
  );

  // Determina se o usuário atual pode editar/deletar
  const canManage = isAdmin || (
    currentUser &&
    !!comment.authorId &&
    currentUser.email?.toLowerCase() === comment.authorId.toLowerCase()
  );

  const treeIndent = depth >= MAX_TREE_DEPTH ? TREE_INDENT_DEEP : TREE_INDENT;

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    await editComment(comment.id, editContent.trim());
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setIsDeleting(true);
    await deleteComment(comment.id);
    setIsDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <div className="w-full">
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
            {comment.editedAt && (
              <span className="text-xs text-zinc-600 italic">(editado)</span>
            )}
            
            {comment.isQuestion && (
              <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${comment.isAnswered ? 'border border-emerald-400/25 bg-emerald-400/10 text-emerald-200' : 'border border-amber-400/25 bg-amber-400/10 text-amber-200'}`}>
                {comment.isAnswered ? <CheckCircle className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                {comment.isAnswered ? 'Respondida' : 'Pergunta'}
              </span>
            )}

            {/* Actions: edit and delete for allowed users */}
            {canManage && !isEditing && (
              <div className="ml-auto flex items-center gap-1">
                <button
                  onClick={() => { setIsEditing(true); setConfirmDelete(false); }}
                  title="Editar comentário"
                  className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300"
                >
                  <Pencil className="w-3 h-3" />
                  <span className="hidden sm:inline">Editar</span>
                </button>

                {confirmDelete ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex items-center gap-1 rounded-full border border-red-400/40 bg-red-500/10 px-2 py-1 text-[11px] font-semibold text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-60"
                    >
                      <Trash2 className="w-3 h-3" />
                      {isDeleting ? 'Deletando...' : 'Confirmar'}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="flex items-center rounded-full border border-zinc-700 bg-zinc-900 p-1 text-zinc-400 transition-colors hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    title="Deletar comentário"
                    className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span className="hidden sm:inline">Deletar</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Comment content or edit mode */}
          {isEditing ? (
            <div className="mb-3 rounded-2xl border border-blue-400/30 bg-zinc-900 p-3">
              <textarea
                className="min-h-[80px] w-full resize-y rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-blue-400/40"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                autoFocus
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
                >
                  <X className="w-3 h-3" />
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving || !editContent.trim()}
                  className="flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="w-3 h-3" />
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-3 rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
              <MarkdownText content={comment.content} />
              {comment.audioUrl && (
                <audio
                  controls
                  src={comment.audioUrl}
                  preload="metadata"
                  className="mt-3 h-9 w-full max-w-md"
                />
              )}
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-400">
            <button 
              onClick={() => likeComment(comment.id)} 
              title={isLiked ? 'Descurtir' : 'Curtir'}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors ${isLiked ? 'border-ink-400/30 bg-ink-500/10 text-ink-200' : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-ink-400/30 hover:bg-ink-500/10 hover:text-ink-200'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
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
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {depth >= MAX_DEPTH && !showMoreReplies ? (
            <div className="flex" style={{ paddingLeft: treeIndent }}>
              <button 
                onClick={() => setShowMoreReplies(true)}
                className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
              >
                <MoreHorizontal className="w-4 h-4" />
                Ver mais {comment.replies.length} respostas
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Tronco vertical da árvore: percorre todas as respostas deste nível */}
              <div
                className="absolute top-2 bottom-1 w-px bg-zinc-700/70"
                style={{ left: '0px' }}
              />
              <div className="flex flex-col gap-4" style={{ paddingLeft: treeIndent }}>
                {comment.replies.map(reply => (
                  <div className="relative" key={reply.id}>
                    {/* Conector horizontal da linha da árvore até o card da resposta */}
                    <div
                      className="absolute h-px bg-zinc-700/70"
                      style={{ top: `${CONNECTOR_TOP}px`, left: `calc(0px - ${treeIndent})`, width: treeIndent }}
                    />
                    <CommentItem comment={reply} depth={depth + 1} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

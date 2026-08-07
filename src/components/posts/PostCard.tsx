import { useState } from 'react';
import { Heart, Clock, Star, Pencil, Trash2, X, Check } from 'lucide-react';
import { categories } from '@/data/categories';
import { useAuth } from '@/context/AuthContext';
import { formatRelativeDate } from '@/utils/formatters';
import type { Post as PostType, PostDraft } from '@/types/post';
import { CommentSection } from '@/components/comments/CommentSection';
import { PostActions } from '@/components/posts/PostActions';

interface PostCardProps {
  post: PostType;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onEditPost?: (postId: string, updated: PostDraft) => Promise<void>;
  onDeletePost?: (postId: string) => Promise<void>;
}

export function PostCard({ post, onLike, onComment, onEditPost, onDeletePost }: PostCardProps) {
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState<PostDraft | null>(null);
  const [tagsText, setTagsText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const category = categories.find((cat) => cat.id === post.categoryId);

  const { currentUser, isAdmin } = useAuth();

  const isLiked = (post.likedBy ?? []).some(
    (email) => email.toLowerCase() === currentUser?.email?.toLowerCase(),
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'iniciante': return 'text-emerald-300 border-emerald-400/20 bg-emerald-400/10';
      case 'intermediario': return 'text-amber-300 border-amber-400/20 bg-amber-400/10';
      case 'avancado': return 'text-rose-300 border-rose-400/20 bg-rose-400/10';
      default: return 'text-zinc-300 border-zinc-700 bg-zinc-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'iniciante': return 'Iniciante';
      case 'intermediario': return 'Intermediário';
      case 'avancado': return 'Avançado';
      default: return 'Desconhecido';
    }
  };

  const startEditing = () => {
    setEditDraft({
      title: post.title,
      summary: post.summary,
      content: post.content,
      categoryId: post.categoryId,
      readingTime: post.readingTime,
      difficulty: post.difficulty,
      tags: [...post.tags],
    });
    setTagsText(post.tags.join(', '));
    setConfirmDelete(false);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editDraft) return;
    setIsSaving(true);
    const tags = tagsText.split(',').map((tag) => tag.trim()).filter(Boolean);
    await onEditPost?.(post.id, { ...editDraft, tags });
    setIsSaving(false);
    setIsEditing(false);
    setEditDraft(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditDraft(null);
    setConfirmDelete(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setIsDeleting(true);
    await onDeletePost?.(post.id);
    setIsDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <div className="reddit-card">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => onLike?.(post.id)}
            title={isLiked ? 'Descurtir' : 'Curtir'}
            className={`vote-button ${isLiked ? 'active like' : ''}`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <span className={`rounded-2xl px-3 py-1 text-sm font-extrabold ${isLiked ? 'text-ink-200' : 'text-zinc-400'}`}>
            {post.likes}
          </span>
        </div>

        <div className="flex-1">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              {category && (
                <span className="category-badge" style={{ color: category.color }}>
                  {category.icon} {category.name}
                </span>
              )}
              <span className="text-zinc-600">•</span>
              <span>{formatRelativeDate(post.createdAt)}</span>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                <span>{post.readingTime} min de leitura</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isAdmin && !isEditing && (
                <>
                  <button
                    onClick={startEditing}
                    title="Editar post"
                    className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300"
                  >
                    <Pencil className="h-3 w-3" />
                    <span className="hidden sm:inline">Editar</span>
                  </button>

                  {confirmDelete ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-1 rounded-full border border-red-400/40 bg-red-500/10 px-2 py-1 text-[11px] font-semibold text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-60"
                      >
                        <Trash2 className="h-3 w-3" />
                        {isDeleting ? 'Deletando...' : 'Confirmar'}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="flex items-center rounded-full border border-zinc-700 bg-zinc-900 p-1 text-zinc-400 transition-colors hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      title="Deletar post"
                      className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="hidden sm:inline">Deletar</span>
                    </button>
                  )}
                </>
              )}

              <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getDifficultyColor(post.difficulty)}`}>
                <Star className="h-3 w-3" />
                {getDifficultyLabel(post.difficulty)}
              </span>
            </div>
          </div>

          {isEditing && editDraft ? (
            <div className="mb-5 rounded-2xl border border-blue-400/30 bg-zinc-900 p-4">
              <div className="mb-4 flex items-center gap-2">
                <Pencil className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-bold text-white">Editar post</span>
              </div>

              <div className="grid gap-4">
                <label className="grid gap-2">
                  <span className="text-xs font-semibold text-zinc-300">Título</span>
                  <input
                    value={editDraft.title}
                    onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })}
                    className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-blue-400/40"
                    placeholder="Título do post"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-semibold text-zinc-300">Resumo</span>
                  <input
                    value={editDraft.summary}
                    onChange={(e) => setEditDraft({ ...editDraft, summary: e.target.value })}
                    className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-blue-400/40"
                    placeholder="Resumo curto para o card do post"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-semibold text-zinc-300">Conteúdo</span>
                  <textarea
                    rows={6}
                    value={editDraft.content}
                    onChange={(e) => setEditDraft({ ...editDraft, content: e.target.value })}
                    className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-blue-400/40"
                    placeholder="Corpo do post"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="grid gap-2">
                    <span className="text-xs font-semibold text-zinc-300">Categoria</span>
                    <select
                      value={editDraft.categoryId}
                      onChange={(e) => setEditDraft({ ...editDraft, categoryId: e.target.value })}
                      className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-blue-400/40"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-semibold text-zinc-300">Tempo de leitura</span>
                    <input
                      type="number"
                      min={1}
                      value={editDraft.readingTime}
                      onChange={(e) => setEditDraft({ ...editDraft, readingTime: Number(e.target.value) })}
                      className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-blue-400/40"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-semibold text-zinc-300">Dificuldade</span>
                    <select
                      value={editDraft.difficulty}
                      onChange={(e) => setEditDraft({ ...editDraft, difficulty: e.target.value as PostDraft['difficulty'] })}
                      className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-blue-400/40"
                    >
                      <option value="iniciante">Iniciante</option>
                      <option value="intermediario">Intermediário</option>
                      <option value="avancado">Avançado</option>
                    </select>
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-xs font-semibold text-zinc-300">Tags (separadas por vírgula)</span>
                  <input
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-blue-400/40"
                    placeholder="React, Firebase, Firestore"
                  />
                </label>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
                >
                  <X className="h-3 w-3" />
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving || !editDraft.title.trim() || !editDraft.summary.trim() || !editDraft.content.trim()}
                  className="flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="h-3 w-3" />
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="mb-3 text-2xl font-extrabold leading-tight text-white transition-colors hover:text-ink-200">
                {post.title}
              </h2>

              <p className="mb-5 max-w-3xl text-sm leading-7 text-zinc-300">
                {post.summary}
              </p>

              {post.tags.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-200 transition-colors hover:border-ink-400/40 hover:bg-ink-500/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <PostActions
              commentCount={post.commentCount}
              isCommentsExpanded={isCommentsExpanded}
              onToggleComments={() => {
                setIsCommentsExpanded(!isCommentsExpanded);
                onComment?.(post.id);
              }}
            />

            <div className="flex items-center gap-3 text-xs text-zinc-400">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-8 w-8 rounded-2xl object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-400 to-ink-700 font-black text-white">
                  {post.author.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-semibold text-white">{post.author.name}</div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">
                  {post.author.isAnonymous ? 'Anônimo' : 'Autor'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCommentsExpanded && (
        <div className="mt-5 mx-auto max-w-3xl">
          <CommentSection postId={post.id} />
        </div>
      )}
    </div>
  );
}

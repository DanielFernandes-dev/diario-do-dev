import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Heart, Star, BookOpen } from 'lucide-react';
import { categories } from '@/data/categories';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/context/AuthContext';
import { formatRelativeDate } from '@/utils/formatters';
import { MarkdownText } from '@/components/common/MarkdownText';
import { CommentSection } from '@/components/comments/CommentSection';

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

export function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const { posts, loadingPosts, likePost } = usePosts();
  const { currentUser } = useAuth();

  const post = posts.find((post) => post.id === postId);
  const category = post ? categories.find((cat) => cat.id === post.categoryId) : undefined;

  const isLiked = post
    ? (post.likedBy ?? []).some((email) => email.toLowerCase() === currentUser?.email?.toLowerCase())
    : false;

  if (loadingPosts) {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="glass-panel p-10 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-ink-300" />
            <p className="text-sm text-zinc-400">Carregando post...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao feed
          </Link>
          <div className="glass-panel mt-6 py-14 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-zinc-500" />
            <div className="mb-2 text-lg font-semibold text-white">Post não encontrado</div>
            <div className="text-sm text-slate-400">O post pode ter sido removido.</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao feed
        </Link>

        <article className="reddit-card mt-6">
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

            <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getDifficultyColor(post.difficulty)}`}>
              <Star className="h-3 w-3" />
              {getDifficultyLabel(post.difficulty)}
            </span>
          </div>

          <h1 className="mb-5 break-words text-2xl font-extrabold leading-tight text-white sm:text-4xl">
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <p className="mb-6 break-words border-l-4 border-ink-400/40 bg-zinc-900 py-3 pl-4 pr-3 text-base leading-7 text-zinc-300">
            {post.summary}
          </p>

          <MarkdownText content={post.content} />

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => likePost(post.id)}
              title={isLiked ? 'Descurtir' : 'Curtir'}
              className={`vote-button ${isLiked ? 'active like' : ''}`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-extrabold">{post.likes}</span>
            </button>

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
        </article>

        <CommentSection postId={post.id} />
      </main>
    </div>
  );
}

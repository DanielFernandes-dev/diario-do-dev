import { useEffect, useState } from 'react';
import { BookOpen, Clock, Filter, LogIn, MessageSquare, RefreshCw, TrendingUp, Shuffle } from 'lucide-react';
import type { User } from 'firebase/auth';
import { categories } from '@/data/categories';
import type { Post, PostDraft, SortOption } from '@/types/post';
import { PostCard } from '@/components/posts/PostCard';
import { AdminComposer } from '@/components/posts/AdminComposer';

interface PostFeedProps {
  posts: Post[];
  selectedCategory: string | null;
  onClearCategory: () => void;
  sortBy: SortOption;
  onSortBy: (sort: SortOption) => void;
  isAdmin: boolean;
  currentUser: User | null;
  onLogin: () => void;
  onCreatePost: (draft: PostDraft) => Promise<void>;
  onLikePost: (postId: string) => Promise<void>;
  onEditPost: (postId: string, draft: PostDraft) => Promise<void>;
  onDeletePost: (postId: string) => Promise<void>;
  loadingPosts: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

const SORT_OPTIONS: { id: SortOption; label: string; icon: typeof Clock }[] = [
  { id: 'recent', label: 'Recentes', icon: Clock },
  { id: 'discussed', label: 'Discutidos', icon: MessageSquare },
];

export function PostFeed({
  posts,
  selectedCategory,
  onClearCategory,
  sortBy,
  onSortBy,
  isAdmin,
  currentUser,
  onLogin,
  onCreatePost,
  onLikePost,
  onEditPost,
  onDeletePost,
  loadingPosts,
  error,
  hasMore,
  onLoadMore,
  onRefresh,
}: PostFeedProps) {
  return (
    <div className="space-y-6">
      {isAdmin ? (
        <AdminComposer onCreate={onCreatePost} />
      ) : (
        <section className="glass-panel p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink-500/10 text-ink-200">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Publicação restrita ao admin</h2>
              <p className="mt-1 text-sm leading-7 text-zinc-400">
                Apenas o usuário admin pode criar novos posts. Outros usuários podem apenas comentar nos posts existentes.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-2">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || ''}
                          className="h-8 w-8 rounded-xl object-cover ring-1 ring-white/10"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-ink-400 to-ink-700 text-xs font-black text-white">
                          {(currentUser.displayName || currentUser.email || 'U').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-semibold text-zinc-200">
                        {currentUser.displayName || currentUser.email}
                      </span>
                    </div>
                    <button
                      onClick={onLogin}
                      title="Entrar com outra conta Google"
                      className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Trocar de conta
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onLogin}
                    className="inline-flex items-center gap-2 rounded-full bg-ink-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink-400"
                  >
                    <LogIn className="h-4 w-4" />
                    Entrar com Google
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {error && (
        <div className="glass-panel p-5 sm:p-6 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={onRefresh}
            className="mt-2 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </button>
        </div>
      )}

      <section className="glass-panel p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="section-label">Feed principal</div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold text-white">
                {selectedCategory ? 'Posts em' : 'Todos os posts'}
              </h2>
              {selectedCategory && (
                <button
                  onClick={onClearCategory}
                  className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
                >
                  Limpar filtro
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap rounded-2xl border border-zinc-700 bg-zinc-900 p-1 scrollbar-hide">
            <Filter className="ml-2 h-4 w-4 shrink-0 text-zinc-400" />
            <div className="flex shrink-0">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onSortBy(option.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                    sortBy === option.id
                      ? 'bg-white text-slate-950 shadow-soft'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  <option.icon className="mr-1 inline h-3 w-3" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={onLikePost}
              onEditPost={onEditPost}
              onDeletePost={onDeletePost}
            />
          ))
        ) : (
          <div className="glass-panel py-14 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-zinc-500" />
            <div className="mb-2 text-lg font-semibold text-white">
              Nenhum post encontrado nesta categoria
            </div>
            <div className="text-sm text-slate-400">
              Tente selecionar outra categoria ou volte mais tarde
            </div>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {loadingPosts || hasMore ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {loadingPosts && (
              <button
                disabled
                className="flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 py-3 text-sm font-semibold text-zinc-400"
              >
                <RefreshCw className="h-4 w-4 animate-spin" />
                Carregando...
              </button>
            )}
            
            {!loadingPosts && hasMore && (
              <button
                onClick={onLoadMore}
                className="flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-ink-400 hover:bg-zinc-800 hover:text-white"
              >
                <RefreshCw className="h-4 w-4" />
                Carregar mais posts
              </button>
            )}
            
            {!loadingPosts && hasMore && (
              <button
                onClick={onRefresh}
                className="flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-ink-400 hover:bg-zinc-800 hover:text-white"
              >
                <Shuffle className="h-4 w-4" />
                Página aleatória anterior
              </button>
            )}
          </div>
          
          {!loadingPosts && (
            <div className="text-xs text-zinc-500">
              Mostrando {posts.length} posts{hasMore ? ' (mais disponíveis)' : ''}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
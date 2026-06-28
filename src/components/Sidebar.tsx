import { categories } from '../data/categories';
import { MessageSquare, Code, BookOpen, HelpCircle, Sparkles } from 'lucide-react';
import type { Post } from '../data/posts';

interface SidebarProps {
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  posts: Post[];
  totalComments: number;
  profile: {
    name: string;
    avatar?: string;
    email?: string;
    bio: string;
  };
  className?: string;
}

export function Sidebar({ selectedCategory, onCategorySelect, posts, totalComments, profile, className }: SidebarProps) {
  const topPosts = [...posts]
    .sort((a, b) => (b.commentCount ?? 0) - (a.commentCount ?? 0))
    .slice(0, 3);

  const topTags = Array.from(
    posts.reduce((map, post) => {
      post.tags.forEach((tag) => map.set(tag, (map.get(tag) ?? 0) + 1));
      return map;
    }, new Map<string, number>()),
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const questions = posts
    .filter((post) => post.commentCount > 0)
    .slice(0, 3)
    .map((post) => post.title);

  return (
    <aside className={className || "w-full"}>
      <div className="sticky top-24 space-y-4">
        <div className="sidebar-section">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="section-label">Mapa do conteúdo</div>
              <h3 className="mt-1 text-lg font-bold text-white">Categorias</h3>
            </div>
            <Sparkles className="h-5 w-5 text-ink-300" />
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect?.(category.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left text-sm transition-all ${
                  selectedCategory === category.id
                    ? 'border-ink-400/40 bg-ink-500/10 text-ink-200'
                    : 'border-transparent bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="flex-1 font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-ink-300" />
            <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">
              Mais Discutidos
            </h3>
          </div>
          <div className="space-y-3">
            {topPosts.length > 0 ? (
              topPosts.map((post) => (
                <div key={post.id} className="group cursor-pointer rounded-2xl border border-zinc-700 bg-zinc-900 p-3 transition-colors hover:border-zinc-600 hover:bg-zinc-800">
                  <h4 className="mb-2 line-clamp-2 text-sm font-semibold text-white group-hover:text-ink-200">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{post.commentCount} comentários</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-3 text-xs text-zinc-400">
                Sem posts publicados ainda.
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-section">
          <div className="mb-4 flex items-center gap-2">
            <Code className="h-4 w-4 text-ink-300" />
            <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">
              Tecnologias
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag]) => (
              <button key={tag} className="glass-chip text-xs">
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <div className="mb-4 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-ink-300" />
            <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">
              Perguntas
            </h3>
          </div>
          <div className="space-y-2">
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <div key={index} className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3">
                  <p className="line-clamp-2 text-xs leading-relaxed text-amber-100">{question}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-3 text-xs text-zinc-400">
                As perguntas vão aparecer quando houver comentários.
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-section">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-ink-300" />
            <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">
              Sobre o autor
            </h3>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-10 w-10 rounded-2xl object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-400 to-ink-700 font-black text-white">
                  {profile.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-semibold text-white">{profile.name}</div>
                <div className="text-xs text-zinc-400">{profile.email || 'Autenticado com Firebase'}</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">{profile.bio}</p>
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-xs text-zinc-300">
              {posts.length} posts publicados e {totalComments} comentários registrados.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

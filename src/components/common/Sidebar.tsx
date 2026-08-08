import { MessageSquare, BookOpen } from 'lucide-react';
import { FitText } from '@/components/common/FitText';
import type { Post } from '@/types/post';

interface SidebarProps {
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

export function Sidebar({ posts, totalComments, profile, className }: SidebarProps) {
  const topPosts = [...posts]
    .sort((a, b) => (b.commentCount ?? 0) - (a.commentCount ?? 0))
    .slice(0, 3);

  return (
    <aside className={className || "w-full"}>
      <div className="space-y-4 lg:sticky lg:top-24">
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
            <BookOpen className="h-4 w-4 text-ink-300" />
            <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">
              Sobre o autor
            </h3>
          </div>
          <div className="space-y-3 break-words text-sm text-slate-300">
            <div className="flex min-w-0 items-center gap-3">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-10 w-10 shrink-0 rounded-2xl object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-400 to-ink-700 font-black text-white">
                  {profile.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="truncate font-semibold text-white">{profile.name}</div>
                <FitText text={profile.email || 'Autenticado com Firebase'} className="text-zinc-400" />
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

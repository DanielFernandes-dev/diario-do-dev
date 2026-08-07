import { ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface FeedStatsProps {
  profile: {
    name: string;
    avatar?: string;
    email?: string;
    bio: string;
  };
  postCount: number;
  commentCount: number;
}

export function FeedStats({ profile, postCount, commentCount }: FeedStatsProps) {
  const { currentUser, handleLogout } = useAuth();

  return (
    <div className="sticky top-24 space-y-4">
      <div className="sidebar-section text-center">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="mx-auto mb-4 h-20 w-20 rounded-[1.5rem] object-cover ring-1 ring-white/10"
          />
        ) : (
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-ink-400 via-ink-500 to-ink-700 text-2xl font-black text-white">
            {profile.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <h3 className="text-xl font-extrabold text-white">{profile.name}</h3>
        <p className="mt-1 text-sm text-zinc-400">{profile.email || 'Perfil autenticado com Firebase'}</p>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          {profile.bio}
        </p>
        {currentUser && (
          <button
            onClick={handleLogout}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        )}
      </div>

      <div className="sidebar-section">
        <div className="section-label">Estatísticas</div>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3">
            <span className="text-zinc-400">Posts publicados</span>
            <span className="font-semibold text-white">{postCount}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3">
            <span className="text-zinc-400">Total de comentários</span>
            <span className="font-semibold text-white">{commentCount}</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl bg-ink-500 px-4 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-ink-400"
        >
          <span>Ver no GitHub</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

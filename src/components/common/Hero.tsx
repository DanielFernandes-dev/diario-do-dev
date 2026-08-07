import { Layers, Sparkles } from 'lucide-react';
import type { User } from 'firebase/auth';
import { categories } from '@/data/categories';

interface HeroProps {
  postCount: number;
  commentCount: number;
  loadingPosts: boolean;
  onAbout: () => void;
  currentUser: User | null;
  onLogin: () => void;
}

export function Hero({ postCount, commentCount, loadingPosts, onAbout, currentUser, onLogin }: HeroProps) {
  return (
    <section className="glass-panel mb-8 overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="glass-chip">
              <Sparkles className="h-4 w-4 text-ink-300" />
              Novo design editorial
            </span>
            <span className="glass-chip">
              <Layers className="h-4 w-4 text-ink-300" />
              Feed técnico
            </span>
          </div>
          <h1 className="section-title">
            Diário de experiências reais, bugs resolvidos e decisões de arquitetura.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            Um espaço para publicar aprendizados práticos do dia a dia de desenvolvimento,
            com leitura rápida, comentários em profundidade e organização por temas.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#feed"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
            >
              Explorar posts
            </a>
            <button
              onClick={onAbout}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Sobre o projeto
            </button>
            {!currentUser && (
              <button
                onClick={onLogin}
                className="rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
              >
                Entrar com Google
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[360px]">
          <div className="rounded-3xl border border-zinc-700 bg-zinc-900 p-4">
            <div className="text-2xl font-extrabold text-white">{postCount}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">Posts</div>
          </div>
          <div className="rounded-3xl border border-zinc-700 bg-zinc-900 p-4">
            <div className="text-2xl font-extrabold text-white">{categories.length}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">Categorias</div>
          </div>
          <div className="rounded-3xl border border-zinc-700 bg-zinc-900 p-4">
            <div className="text-2xl font-extrabold text-white">{commentCount}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">Comentários</div>
          </div>
          <div className="rounded-3xl border border-zinc-700 bg-zinc-900 p-4">
            <div className="text-2xl font-extrabold text-white">
              {loadingPosts ? '...' : '100%'}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">Firebase</div>
          </div>
        </div>
      </div>
    </section>
  );
}

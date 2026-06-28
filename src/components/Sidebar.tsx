import { categories } from '../data/categories';
import { MessageSquare, Code, BookOpen, HelpCircle, Sparkles } from 'lucide-react';

interface SidebarProps {
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
}

export function Sidebar({ selectedCategory, onCategorySelect }: SidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 lg:block">
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
            {categories.map(category => (
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
            {[
              { title: 'TypeScript: Como tipagem salvou meu projeto', comments: 45 },
              { title: 'Como resolvi um memory leak em React', comments: 34 },
              { title: 'Implementando CI/CD do zero com GitHub Actions', comments: 28 }
            ].map((post, index) => (
              <div key={index} className="group cursor-pointer rounded-2xl border border-zinc-700 bg-zinc-900 p-3 transition-colors hover:border-zinc-600 hover:bg-zinc-800">
                <h4 className="mb-2 line-clamp-2 text-sm font-semibold text-white group-hover:text-ink-200">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{post.comments} comentários</span>
                </div>
              </div>
            ))}
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
            {[
              'React', 'TypeScript', 'Node.js', 'Docker',
              'PostgreSQL', 'GraphQL', 'AWS', 'Kubernetes'
            ].map(tag => (
              <button
                key={tag}
                className="glass-chip text-xs"
              >
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
            {[
              'Como decidir quais índices criar?',
              'Qual foi o maior desafio técnico?',
              'Como lidar com bibliotecas sem tipagem?'
            ].map((question, index) => (
              <div key={index} className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3">
              <p className="line-clamp-2 text-xs leading-relaxed text-amber-100">{question}</p>
              </div>
            ))}
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
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-400 to-ink-700 font-black text-white">
                JD
              </div>
              <div>
                <div className="font-semibold text-white">João Developer</div>
                <div className="text-xs text-zinc-400">Full Stack Developer</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              Desenvolvedor com 8+ anos de experiência compartilhando aprendizados reais,
              bugs resolvidos e decisões de arquitetura do dia a dia.
            </p>
        </div>
        </div>
      </div>
    </aside>
  );
}

import { useState } from 'react';
import { mockPosts } from '../data/posts';
import { categories } from '../data/categories';
import { Post } from '../components/Post';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { TrendingUp, Clock, MessageSquare, Filter, BookOpen, Sparkles, Layers, ArrowRight } from 'lucide-react';

type SortOption = 'recent' | 'popular' | 'discussed';

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const filteredPosts = mockPosts.filter(post => 
    !selectedCategory || post.categoryId === selectedCategory
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'popular':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'discussed':
        return b.comments.length - a.comments.length;
      default:
        return 0;
    }
  });

  const handleAbout = () => {
    setShowAbout(!showAbout);
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onAbout={handleAbout}
      />
      
      <main className="relative pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                  <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5">
                    Explorar posts
                  </button>
                  <button
                    onClick={handleAbout}
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Sobre o projeto
                  </button>
                </div>
              </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[360px]">
                <div className="rounded-3xl border border-zinc-700 bg-zinc-900 p-4">
                  <div className="text-2xl font-extrabold text-white">{mockPosts.length}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">Posts</div>
                </div>
                <div className="rounded-3xl border border-zinc-700 bg-zinc-900 p-4">
                  <div className="text-2xl font-extrabold text-white">{categories.length}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">Categorias</div>
                </div>
                <div className="rounded-3xl border border-zinc-700 bg-zinc-900 p-4">
                  <div className="text-2xl font-extrabold text-white">{mockPosts.reduce((acc, post) => acc + post.comments.length, 0)}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">Comentários</div>
                </div>
                <div className="rounded-3xl border border-zinc-700 bg-zinc-900 p-4">
                  <div className="text-2xl font-extrabold text-white">100%</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">Mock local</div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
            <Sidebar 
              selectedCategory={selectedCategory || undefined}
              onCategorySelect={setSelectedCategory}
            />

            <div className="space-y-6">
              <section className="glass-panel p-5 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                  <div className="section-label">Feed principal</div>
                    <div className="mt-2 flex items-center gap-3">
                      <h2 className="text-3xl font-extrabold text-white">
                        {selectedCategory ? 'Posts em' : 'Todos os posts'}
                      </h2>
                      {selectedCategory && (
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
                        >
                          Limpar filtro
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                      {selectedCategory
                        ? `Conteúdos sobre ${categories.find(cat => cat.id === selectedCategory)?.name}`
                        : 'Relatos técnicos, aprendizados e experiências reais do dia a dia de desenvolvimento'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 p-1">
                    <Filter className="ml-2 h-4 w-4 text-zinc-400" />
                    <div className="flex">
                      <button
                        onClick={() => setSortBy('recent')}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                          sortBy === 'recent' 
                            ? 'bg-white text-slate-950 shadow-soft' 
                            : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        <Clock className="mr-1 inline h-3 w-3" />
                        Recentes
                      </button>
                      <button
                        onClick={() => setSortBy('popular')}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                          sortBy === 'popular' 
                            ? 'bg-white text-slate-950 shadow-soft' 
                            : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        <TrendingUp className="mr-1 inline h-3 w-3" />
                        Populares
                      </button>
                      <button
                        onClick={() => setSortBy('discussed')}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                          sortBy === 'discussed' 
                            ? 'bg-white text-slate-950 shadow-soft' 
                            : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        <MessageSquare className="mr-1 inline h-3 w-3" />
                        Discutidos
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <div className="space-y-4">
                {sortedPosts.length > 0 ? (
                  sortedPosts.map(post => (
                    <Post 
                      key={post.id} 
                      post={post}
                      onUpvote={(postId) => console.log('Upvote:', postId)}
                      onDownvote={(postId) => console.log('Downvote:', postId)}
                      onComment={(postId) => console.log('Comment:', postId)}
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
            </div>

            <aside className="hidden xl:block">
              <div className="sticky top-24 space-y-4">
                <div className="sidebar-section text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-ink-400 via-ink-500 to-ink-700 text-2xl font-black text-white shadow-none">
                    JD
                  </div>
                  <h3 className="text-xl font-extrabold text-white">João Developer</h3>
                  <p className="mt-1 text-sm text-zinc-400">Full Stack Developer</p>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Compartilhando experiências reais, bugs resolvidos e decisões técnicas do cotidiano de desenvolvimento.
                  </p>
                </div>

                <div className="sidebar-section">
                  <div className="section-label">Estatísticas</div>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3">
                      <span className="text-zinc-400">Posts publicados</span>
                      <span className="font-semibold text-white">{mockPosts.length}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3">
                      <span className="text-zinc-400">Total de comentários</span>
                      <span className="font-semibold text-white">
                        {mockPosts.reduce((acc, post) => acc + post.comments.length, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3">
                      <span className="text-zinc-400">Categorias</span>
                      <span className="font-semibold text-white">{categories.length}</span>
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
            </aside>
          </div>
        </div>
      </main>

      {/* Modal Sobre */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleAbout}
          />
          <div className="relative glass-panel w-full max-w-md p-6">
            <h2 className="text-2xl font-extrabold text-white">Sobre o projeto</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <p>
                Este é um blog técnico onde compartilho minhas experiências reais como desenvolvedor.
              </p>
              <p>
                Aqui você encontrará relatos sobre bugs resolvidos, decisões de arquitetura, 
                aprendizados e desafios do dia a dia.
              </p>
              <p>
                Sinta-se à vontade para comentar, fazer perguntas e compartilhar suas próprias 
                experiências nos comentários!
              </p>
            </div>
            <button
              onClick={handleAbout}
              className="mt-6 w-full rounded-full bg-white px-4 py-3 font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-80 overflow-y-auto border-r border-zinc-800 bg-black/95 p-4">
              <Sidebar 
                selectedCategory={selectedCategory || undefined}
                onCategorySelect={(categoryId) => {
                  setSelectedCategory(categoryId);
                  setSidebarOpen(false);
                }}
              />
          </div>
        </div>
      )}
    </div>
  );
}

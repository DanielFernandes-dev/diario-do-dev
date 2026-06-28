import { useState } from 'react';
import { mockPosts } from '../data/posts';
import { categories } from '../data/categories';
import { Post } from '../components/Post';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { TrendingUp, Clock, MessageSquare, Filter, BookOpen } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onAbout={handleAbout}
      />
      
      <div className="pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {/* Sidebar Esquerda */}
            <Sidebar 
              selectedCategory={selectedCategory || undefined}
              onCategorySelect={setSelectedCategory}
            />

            {/* Feed Principal */}
            <main className="flex-1">
              {/* Header do Feed */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {selectedCategory ? 'Posts em' : 'Todos os Posts'}
                    </h1>
                    {selectedCategory && (
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Ver todos
                      </button>
                    )}
                  </div>
                  
                  {/* Ordenação */}
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setSortBy('recent')}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                          sortBy === 'recent' 
                            ? 'bg-white text-gray-900 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Clock className="h-3 w-3 inline mr-1" />
                        Recentes
                      </button>
                      <button
                        onClick={() => setSortBy('popular')}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                          sortBy === 'popular' 
                            ? 'bg-white text-gray-900 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        Populares
                      </button>
                      <button
                        onClick={() => setSortBy('discussed')}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                          sortBy === 'discussed' 
                            ? 'bg-white text-gray-900 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <MessageSquare className="h-3 w-3 inline mr-1" />
                        Discutidos
                      </button>
                    </div>
                  </div>
                </div>

                {/* Descrição do Blog */}
                <div className="text-gray-600 text-sm">
                  {selectedCategory 
                    ? `Posts sobre ${categories.find(cat => cat.id === selectedCategory)?.name}`
                    : 'Relatos técnicos, aprendizados e experiências reais do dia a dia de desenvolvimento'
                  }
                </div>
              </div>

              {/* Lista de Posts */}
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
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-600 text-lg mb-2">
                      Nenhum post encontrado nesta categoria
                    </div>
                    <div className="text-gray-500 text-sm">
                      Tente selecionar outra categoria ou volte mais tarde
                    </div>
                  </div>
                )}
              </div>
            </main>

            {/* Sidebar Direita - Sobre o Autor */}
            <aside className="w-80 hidden xl:block">
              {/* Perfil do Autor */}
              <div className="sidebar-section">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">JD</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">João Developer</h3>
                  <p className="text-sm text-gray-600 mb-3">Full Stack Developer</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Compartilhando experiências reais, bugs resolvidos e decisões técnicas 
                    do cotidiano de desenvolvimento.
                  </p>
                </div>
              </div>

              {/* Estatísticas do Blog */}
              <div className="sidebar-section">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-3">
                  Estatísticas
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Posts publicados</span>
                    <span className="font-medium text-gray-900">{mockPosts.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total de comentários</span>
                    <span className="font-medium text-gray-900">
                      {mockPosts.reduce((acc, post) => acc + post.comments.length, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Categorias</span>
                    <span className="font-medium text-gray-900">{categories.length}</span>
                  </div>
                </div>
              </div>

              {/* Link para GitHub */}
              <div className="sidebar-section">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Ver no GitHub
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Modal Sobre */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleAbout}
          />
          <div className="relative bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sobre o Blog</h2>
            <div className="text-gray-600 space-y-3">
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
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white overflow-y-auto">
            <div className="p-4">
              <Sidebar 
                selectedCategory={selectedCategory || undefined}
                onCategorySelect={(categoryId) => {
                  setSelectedCategory(categoryId);
                  setSidebarOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

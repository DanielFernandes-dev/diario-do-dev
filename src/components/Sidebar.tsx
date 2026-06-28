import { categories } from '../data/categories';
import { TrendingUp, MessageSquare, Code, BookOpen, HelpCircle } from 'lucide-react';

interface SidebarProps {
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
}

export function Sidebar({ selectedCategory, onCategorySelect }: SidebarProps) {
  return (
    <aside className="w-64 hidden lg:block">
      {/* Categorias Técnicas */}
      <div className="sidebar-section">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-reddit-textSecondary mb-3">
          Categorias Técnicas
        </h3>
        <div className="space-y-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategorySelect?.(category.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500'
                  : 'text-reddit-text hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="flex-1 text-left">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts Mais Comentados */}
      <div className="sidebar-section">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-reddit-textSecondary mb-3 flex items-center">
          <MessageSquare className="h-4 w-4 mr-1" />
          Mais Discutidos
        </h3>
        <div className="space-y-3">
          {[
            { title: 'TypeScript: Como tipagem salvou meu projeto', comments: 45 },
            { title: 'Como resolvi um memory leak em React', comments: 34 },
            { title: 'Implementando CI/CD do zero com GitHub Actions', comments: 28 }
          ].map((post, index) => (
            <div key={index} className="cursor-pointer group">
              <h4 className="text-sm font-medium text-reddit-text group-hover:text-blue-600 line-clamp-2 mb-1">
                {post.title}
              </h4>
              <div className="flex items-center space-x-2 text-xs text-reddit-textSecondary">
                <MessageSquare className="h-3 w-3" />
                <span>{post.comments} comentários</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags Populares */}
      <div className="sidebar-section">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-reddit-textSecondary mb-3 flex items-center">
          <Code className="h-4 w-4 mr-1" />
          Tecnologias Populares
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            'React', 'TypeScript', 'Node.js', 'Docker', 
            'PostgreSQL', 'GraphQL', 'AWS', 'Kubernetes'
          ].map(tag => (
            <button
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Perguntas em Aberto */}
      <div className="sidebar-section">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-reddit-textSecondary mb-3 flex items-center">
          <HelpCircle className="h-4 w-4 mr-1" />
          Perguntas em Aberto
        </h3>
        <div className="space-y-2">
          {[
            'Como decidir quais índices criar?',
            'Qual foi o maior desafio técnico?',
            'Como lidar com bibliotecas sem tipagem?'
          ].map((question, index) => (
            <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
              <p className="text-xs text-yellow-800 line-clamp-2">{question}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sobre o Autor */}
      <div className="sidebar-section">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-reddit-textSecondary mb-3 flex items-center">
          <BookOpen className="h-4 w-4 mr-1" />
          Sobre o Autor
        </h3>
        <div className="text-sm text-reddit-text space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">JD</span>
            </div>
            <div>
              <div className="font-medium">João Developer</div>
              <div className="text-xs text-reddit-textSecondary">Full Stack Developer</div>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-reddit-textSecondary">
            Desenvolvedor com 8+ anos de experiência compartilhando aprendizados reais, 
            bugs resolvidos e decisões de arquitetura do dia a dia.
          </p>
        </div>
      </div>
    </aside>
  );
}

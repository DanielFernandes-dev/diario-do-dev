import { Search, User, Menu, Info } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onAbout?: () => void;
}

export function Navbar({ onToggleSidebar, onAbout }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-reddit-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo e Menu Mobile */}
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center ml-2 lg:ml-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">JD</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-semibold text-reddit-text">
                  João Developer
                </span>
                <span className="text-reddit-textSecondary text-sm ml-2">· Blog Técnico</span>
              </div>
            </div>
          </div>

          {/* Barra de Busca */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar temas técnicos..."
                className="w-full pl-10 pr-4 py-2 bg-reddit-light border border-reddit-border rounded-full text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Ações Direita */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={onAbout}
              className="hidden sm:flex items-center px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors"
            >
              <Info className="h-4 w-4 mr-1" />
              Sobre
            </button>
            
            <div className="flex items-center">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

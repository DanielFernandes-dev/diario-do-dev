import { Search, User, Menu, Info } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onAbout?: () => void;
}

export function Navbar({ onToggleSidebar, onAbout }: NavbarProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-2 text-zinc-200 transition-colors hover:bg-zinc-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-400 via-ink-500 to-ink-700 text-sm font-black text-white shadow-none">
                JD
              </div>
              <div className="hidden sm:block">
                <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-500">
                  Diario do Dev
                </div>
                <div className="text-sm font-semibold text-white">
                  João Developer <span className="text-zinc-500">· Blog Técnico</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden max-w-xl flex-1 md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar artigos, bugs, stacks ou ideias..."
                className="w-full rounded-full border border-zinc-700 bg-zinc-900 py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-ink-400/50 focus:bg-zinc-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAbout}
              className="hidden items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800 sm:flex"
            >
              <Info className="h-4 w-4" />
              Sobre
            </button>
            <button className="rounded-full border border-zinc-700 bg-zinc-900 p-2 text-zinc-200 transition-colors hover:bg-zinc-800">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

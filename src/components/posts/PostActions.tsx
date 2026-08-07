import { MessageCircle, Share2, Bookmark } from 'lucide-react';

interface PostActionsProps {
  commentCount: number;
  isCommentsExpanded: boolean;
  onToggleComments: () => void;
}

export function PostActions({ commentCount, isCommentsExpanded, onToggleComments }: PostActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
      <button
        onClick={onToggleComments}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 transition-colors ${
          isCommentsExpanded
            ? 'border-ink-400/40 bg-ink-500/10 text-ink-200'
            : 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800'
        }`}
      >
        <MessageCircle className="h-4 w-4" />
        <span>{commentCount} comentários</span>
      </button>

      <button className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800">
        <Share2 className="h-4 w-4" />
        <span>Compartilhar</span>
      </button>

      <button className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800">
        <Bookmark className="h-4 w-4" />
        <span>Salvar</span>
      </button>
    </div>
  );
}

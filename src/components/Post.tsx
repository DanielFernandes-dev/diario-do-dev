import { useState } from 'react';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Share2, Bookmark, Clock, Star } from 'lucide-react';
import { Post as PostType } from '../data/posts';
import { categories } from '../data/categories';
import { CommentSection } from './comments/CommentSection';

interface PostProps {
  post: PostType;
  onUpvote?: (postId: string) => void;
  onDownvote?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export function Post({ post, onUpvote, onDownvote, onComment }: PostProps) {
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const category = categories.find(cat => cat.id === post.categoryId);
  const userVote = null; // TODO: Implement user vote state
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'agora';
    if (diffInHours < 24) return `há ${diffInHours}h`;
    if (diffInHours < 48) return 'ontem';
    
    return date.toLocaleDateString('pt-BR');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'iniciante': return 'text-emerald-300 border-emerald-400/20 bg-emerald-400/10';
      case 'intermediario': return 'text-amber-300 border-amber-400/20 bg-amber-400/10';
      case 'avancado': return 'text-rose-300 border-rose-400/20 bg-rose-400/10';
      default: return 'text-zinc-300 border-zinc-700 bg-zinc-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'iniciante': return 'Iniciante';
      case 'intermediario': return 'Intermediário';
      case 'avancado': return 'Avançado';
      default: return 'Desconhecido';
    }
  };

  const score = post.upvotes - post.downvotes;

  return (
    <div className="reddit-card">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => onUpvote?.(post.id)}
            className={`vote-button ${userVote === 'upvote' ? 'active upvote' : ''}`}
          >
            <ArrowBigUp className="h-5 w-5" />
          </button>
          <span className={`rounded-2xl px-3 py-1 text-sm font-extrabold ${score >= 0 ? 'text-ink-200' : 'text-blue-300'}`}>
            {score}
          </span>
          <button
            onClick={() => onDownvote?.(post.id)}
            className={`vote-button ${userVote === 'downvote' ? 'active downvote' : ''}`}
          >
            <ArrowBigDown className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              {category && (
                <span className="category-badge" style={{ color: category.color }}>
                  {category.icon} {category.name}
                </span>
              )}
              <span className="text-zinc-600">•</span>
              <span>{formatDate(post.createdAt)}</span>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                <span>{post.readingTime} min de leitura</span>
              </div>
            </div>

            <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getDifficultyColor(post.difficulty)}`}>
              <Star className="h-3 w-3" />
              {getDifficultyLabel(post.difficulty)}
            </span>
          </div>

          <h2 className="mb-3 text-2xl font-extrabold leading-tight text-white transition-colors hover:text-ink-200">
            {post.title}
          </h2>

          <p className="mb-5 max-w-3xl text-sm leading-7 text-zinc-300">
            {post.summary}
          </p>

          {post.tags.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-200 transition-colors hover:border-ink-400/40 hover:bg-ink-500/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <button
                onClick={() => {
                  setIsCommentsExpanded(!isCommentsExpanded);
                  onComment?.(post.id);
                }}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 transition-colors ${
                  isCommentsExpanded
                    ? 'border-ink-400/40 bg-ink-500/10 text-ink-200'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800'
                }`}
                >
                  <MessageCircle className="h-4 w-4" />
                <span>{post.commentCount} comentários</span>
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

          <div className="flex items-center gap-3 text-xs text-zinc-400">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-8 w-8 rounded-2xl object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-400 to-ink-700 font-black text-white">
                  {post.author.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-semibold text-white">{post.author.name}</div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">
                  {post.author.isAnonymous ? 'Anônimo' : 'Autor'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isCommentsExpanded && (
        <div className="mt-5">
          <CommentSection postId={post.id} />
        </div>
      )}
    </div>
  );
}

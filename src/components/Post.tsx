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
      case 'iniciante': return 'text-green-600 bg-green-50';
      case 'intermediario': return 'text-yellow-600 bg-yellow-50';
      case 'avancado': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
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

  const unansweredQuestions = post.comments.filter(c => c.isQuestion && !c.isAnswered).length;

  return (
    <div className="reddit-card">
      <div className="flex">
        {/* Sistema de Votação */}
        <div className="flex flex-col items-center mr-4">
          <button
            onClick={() => onUpvote?.(post.id)}
            className={`vote-button ${userVote === 'upvote' ? 'active upvote' : ''}`}
          >
            <ArrowBigUp className="h-5 w-5" />
          </button>
          <span className={`font-semibold text-sm ${userVote === 'upvote' ? 'text-reddit-upvote' : userVote === 'downvote' ? 'text-reddit-downvote' : ''}`}>
            {post.upvotes - post.downvotes}
          </span>
          <button
            onClick={() => onDownvote?.(post.id)}
            className={`vote-button ${userVote === 'downvote' ? 'active downvote' : ''}`}
          >
            <ArrowBigDown className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo do Post */}
        <div className="flex-1">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-xs text-reddit-textSecondary">
              {category && (
                <span
                  className="category-badge"
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  {category.icon} {category.name}
                </span>
              )}
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{post.readingTime} min de leitura</span>
              </div>
            </div>
            
            {/* Badge de Dificuldade */}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(post.difficulty)}`}>
              <Star className="h-3 w-3 inline mr-1" />
              {getDifficultyLabel(post.difficulty)}
            </span>
          </div>

          {/* Título */}
          <h2 className="text-xl font-semibold text-reddit-text mb-3 hover:text-blue-600 cursor-pointer leading-tight">
            {post.title}
          </h2>

          {/* Resumo */}
          <p className="text-reddit-text text-sm mb-4 leading-relaxed">
            {post.summary}
          </p>

          {/* Tags Técnicas */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Alerta de Perguntas Não Respondidas */}
          {unansweredQuestions > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <MessageCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-800 font-medium">
                  {unansweredQuestions} pergunta{unansweredQuestions > 1 ? 's' : ''} sem resposta
                </span>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-xs text-reddit-textSecondary">
              <button
                onClick={() => {
                  setIsCommentsExpanded(!isCommentsExpanded);
                  onComment?.(post.id);
                }}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${isCommentsExpanded ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments.length} comentário{post.comments.length !== 1 ? 's' : ''}</span>
              </button>
              
              <button className="flex items-center space-x-1 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors">
                <Share2 className="h-4 w-4" />
                <span>Compartilhar</span>
              </button>
              
              <button className="flex items-center space-x-1 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors">
                <Bookmark className="h-4 w-4" />
                <span>Salvar</span>
              </button>
            </div>

            {/* Indicador de Autor */}
            <div className="flex items-center space-x-2 text-xs text-reddit-textSecondary">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">JD</span>
              </div>
              <span>João Developer</span>
            </div>
          </div>
        </div>
      </div>
      
      {isCommentsExpanded && (
        <CommentSection postId={post.id} initialComments={post.comments} />
      )}
    </div>
  );
}

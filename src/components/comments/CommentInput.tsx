import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useComments } from './CommentContext';
import { useAuth } from '@/context/AuthContext';
import { t } from '@/i18n';

interface CommentInputProps {
  parentId?: string;
  isReply?: boolean;
}

export function CommentInput({ parentId, isReply = false }: CommentInputProps) {
  const [content, setContent] = useState('');
  const { addComment, setReplyingTo } = useComments();
  const { currentUser, handleGoogleLogin } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;
    addComment(content, parentId);
    setContent('');
  };

  const handleCancel = () => {
    setReplyingTo(null);
    setContent('');
  };

  if (!currentUser) {
    return (
      <div className={`mt-2 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 p-4 text-center ${isReply ? 'ml-0 pl-4' : ''}`}>
        <p className="mb-3 text-sm text-zinc-400">
          {t('comments.login_for', { action: isReply ? t('comments.reply') : t('comments.comment') })}
        </p>
        <button
          onClick={handleGoogleLogin}
          className="inline-flex items-center gap-2 rounded-full bg-ink-500 px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-ink-400"
        >
          <LogIn className="h-4 w-4" />
          {t('comments.enter_with_google')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`mt-2 ${isReply ? 'ml-0 pl-4' : ''}`}>
      <div className="mb-2 flex items-center gap-2">
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt={currentUser.displayName || ''}
            className="h-7 w-7 rounded-xl object-cover ring-1 ring-white/10"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-ink-400 to-ink-700 text-xs font-black text-white">
            {(currentUser.displayName || currentUser.email || 'U').slice(0, 2).toUpperCase()}
          </div>
        )}
        <span className="text-xs font-semibold text-zinc-300">
          {currentUser.displayName || currentUser.email}
        </span>
      </div>
      <textarea
        className="min-h-[90px] w-full resize-y rounded-2xl border border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-ink-400/40 focus:bg-zinc-800"
        rows={isReply ? 2 : 3}
        placeholder={isReply ? t('comments.write_reply') : t('comments.add_comment_placeholder') }
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end gap-2 mt-2">
        {isReply && (
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
          >
            {t('comments.cancel')}
          </button>
        )}
        <button
          type="submit"
          disabled={!content.trim()}
          className="rounded-full bg-ink-500 px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-ink-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isReply ? t('comments.reply_button') : t('comments.comment_button')}
        </button>
      </div>
    </form>
  );
}

import React, { createContext, useContext } from 'react';
import { useComments as useCommentsHook } from '@/hooks/useComments';
import type { CommentsContextValue } from '@/hooks/useComments';

const CommentContext = createContext<CommentsContextValue | undefined>(undefined);

export function CommentProvider({
  children,
  postId,
}: {
  children: React.ReactNode;
  postId: string;
}) {
  const value = useCommentsHook(postId);

  return <CommentContext.Provider value={value}>{children}</CommentContext.Provider>;
}

export function useComments() {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Comment } from '../../data/posts';

interface CommentContextType {
  comments: Comment[];
  addComment: (content: string, parentId?: string) => void;
  likeComment: (commentId: string) => void;
  toggleQuestionStatus: (commentId: string, status: 'isQuestion' | 'isAnswered') => void;
  replyingTo: string | null;
  setReplyingTo: (commentId: string | null) => void;
  sortBy: 'relevant' | 'recent';
  setSortBy: (sort: 'relevant' | 'recent') => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ 
  children, 
  initialComments 
}: { 
  children: React.ReactNode;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevant' | 'recent'>('relevant');

  // Helper recursivo para atualizar comentários aninhados
  const updateCommentRecursive = (
    list: Comment[], 
    id: string, 
    updater: (c: Comment) => Comment
  ): Comment[] => {
    return list.map(c => {
      if (c.id === id) {
        return updater(c);
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: updateCommentRecursive(c.replies, id, updater) };
      }
      return c;
    });
  };

  const addComment = useCallback((content: string, parentId?: string) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substring(7),
      content,
      author: {
        name: 'João Developer', // Mock do autor do blog
        isAnonymous: false
      },
      createdAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      likes: 0,
      isAuthor: true,
      replies: [],
      parentId
    };

    if (!parentId) {
      setComments(prev => [newComment, ...prev]);
    } else {
      setComments(prev => updateCommentRecursive(prev, parentId, (c) => ({
        ...c,
        replies: [...c.replies, newComment]
      })));
    }
    setReplyingTo(null);
  }, []);

  const likeComment = useCallback((commentId: string) => {
    setComments(prev => updateCommentRecursive(prev, commentId, (c) => ({
      ...c,
      likes: (c.likes ?? c.upvotes ?? 0) + 1
    })));
  }, []);

  const toggleQuestionStatus = useCallback((commentId: string, status: 'isQuestion' | 'isAnswered') => {
    setComments(prev => updateCommentRecursive(prev, commentId, (c) => ({
      ...c,
      [status]: !c[status]
    })));
  }, []);

  return (
    <CommentContext.Provider value={{
      comments,
      addComment,
      likeComment,
      toggleQuestionStatus,
      replyingTo,
      setReplyingTo,
      sortBy,
      setSortBy
    }}>
      {children}
    </CommentContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentProvider');
  }
  return context;
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ADMIN_EMAILS } from '@/lib/firebase';
import {
  addComment as addCommentService,
  deleteComment as deleteCommentService,
  editComment as editCommentService,
  likeComment as likeCommentService,
  setCommentStatus,
  subscribeComments,
} from '@/services/comments.service';
import { buildCommentTree, sortCommentTree, type CommentSort } from '@/utils/commentTree';
import type { Comment } from '@/types/comment';

export interface CommentsContextValue {
  comments: Comment[];
  addComment: (content: string, parentId?: string, audioUrl?: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  toggleQuestionStatus: (commentId: string, status: 'isQuestion' | 'isAnswered') => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  editComment: (commentId: string, newContent: string) => Promise<void>;
  replyingTo: string | null;
  setReplyingTo: (commentId: string | null) => void;
  sortBy: CommentSort;
  setSortBy: (sort: CommentSort) => void;
}

export function useComments(postId: string): CommentsContextValue {
  const [flatComments, setFlatComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<CommentSort>('relevant');
  const { currentUser } = useAuth();

  useEffect(() => {
    return subscribeComments(postId, setFlatComments);
  }, [postId]);

  const comments = useMemo(() => {
    const tree = buildCommentTree(flatComments);
    return sortCommentTree(tree, sortBy);
  }, [flatComments, sortBy]);

  const addComment = useCallback(
    async (content: string, parentId?: string, audioUrl?: string) => {
      const email = currentUser?.email?.toLowerCase();
      const isAdmin = !!email && ADMIN_EMAILS.includes(email);

      await addCommentService(postId, {
        content,
        author: {
          name: currentUser?.displayName || currentUser?.email || 'Usuário',
          avatar: currentUser?.photoURL || undefined,
          isAnonymous: !currentUser,
        },
        authorId: currentUser?.email ?? null,
        isAuthor: isAdmin,
        parentId: parentId ?? null,
        audioUrl: audioUrl ?? null,
      });

      setReplyingTo(null);
    },
    [currentUser, postId],
  );

  const likeComment = useCallback(
    async (commentId: string) => {
      const email = currentUser?.email?.toLowerCase();
      if (!email) return;

      const target = flatComments.find((comment) => comment.id === commentId);
      if (!target) return;

       const alreadyLiked = (target.likedBy ?? []).some((e: string) => e.toLowerCase() === email);
      await likeCommentService(postId, commentId, email, alreadyLiked);
    },
    [currentUser, flatComments, postId],
  );

  const toggleQuestionStatus = useCallback(
    async (commentId: string, status: 'isQuestion' | 'isAnswered') => {
      const target = flatComments.find((comment) => comment.id === commentId);
      if (!target) return;

      await setCommentStatus(postId, commentId, status, !target[status]);
    },
    [flatComments, postId],
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      await deleteCommentService(postId, commentId);
    },
    [postId],
  );

  const editComment = useCallback(
    async (commentId: string, newContent: string) => {
      await editCommentService(postId, commentId, newContent);
    },
    [postId],
  );

  return {
    comments,
    addComment,
    likeComment,
    toggleQuestionStatus,
    deleteComment,
    editComment,
    replyingTo,
    setReplyingTo,
    sortBy,
    setSortBy,
  };
}

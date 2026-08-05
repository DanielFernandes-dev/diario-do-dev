import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addDoc, deleteDoc, increment, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Comment } from '../../data/posts';
import { ADMIN_EMAILS } from '../../lib/firebase';
import { commentDoc, postCommentsCollection, postDoc, toDateValue } from '../../lib/firestore';
import { useAuth } from '../../context/AuthContext';

interface CommentContextType {
  comments: Comment[];
  addComment: (content: string, parentId?: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  toggleQuestionStatus: (commentId: string, status: 'isQuestion' | 'isAnswered') => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  editComment: (commentId: string, newContent: string) => Promise<void>;
  replyingTo: string | null;
  setReplyingTo: (commentId: string | null) => void;
  sortBy: 'relevant' | 'recent';
  setSortBy: (sort: 'relevant' | 'recent') => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

type FirestoreComment = Omit<Comment, 'createdAt' | 'replies' | 'editedAt'> & {
  createdAt: unknown;
  editedAt?: unknown;
  replies?: Comment[];
  parentId?: string | null;
};

const buildTree = (items: Comment[]) => {
  const nodes = new Map<string, Comment>();
  const roots: Comment[] = [];

  items.forEach((item) => {
    nodes.set(item.id, { ...item, replies: [] });
  });

  items.forEach((item) => {
    const node = nodes.get(item.id);
    if (!node) return;

    if (item.parentId && nodes.has(item.parentId)) {
      nodes.get(item.parentId)?.replies.push(node);
      return;
    }

    roots.push(node);
  });

  return roots;
};

const compareRelevant = (a: Comment, b: Comment) => {
  const scoreA = a.likes ?? a.upvotes ?? 0;
  const scoreB = b.likes ?? b.upvotes ?? 0;

  if (a.isQuestion && !a.isAnswered && (!b.isQuestion || b.isAnswered)) return -1;
  if (b.isQuestion && !b.isAnswered && (!a.isQuestion || a.isAnswered)) return 1;
  if (a.isAuthor && !b.isAuthor) return -1;
  if (b.isAuthor && !a.isAuthor) return 1;
  return scoreB - scoreA;
};

const sortTree = (items: Comment[], sortBy: 'relevant' | 'recent'): Comment[] => {
  const sorted = [...items].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
    return compareRelevant(a, b);
  });

  return sorted.map((item) => ({
    ...item,
    replies: sortTree(item.replies ?? [], sortBy),
  }));
};

function mapSnapshotComment(id: string, data: FirestoreComment): Comment {
  return {
    id,
    content: data.content,
    author: data.author,
    createdAt: toDateValue(data.createdAt),
    upvotes: data.upvotes ?? 0,
    downvotes: data.downvotes ?? 0,
    likes: data.likes ?? data.upvotes ?? 0,
    isAuthor: data.isAuthor ?? false,
    replies: data.replies ?? [],
    parentId: data.parentId,
    isQuestion: data.isQuestion ?? false,
    isAnswered: data.isAnswered ?? false,
    editedAt: data.editedAt ? toDateValue(data.editedAt) : undefined,
  };
}

export function CommentProvider({
  children,
  postId,
}: {
  children: React.ReactNode;
  postId: string;
}) {
  const [flatComments, setFlatComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevant' | 'recent'>('relevant');

  const { currentUser } = useAuth();

  useEffect(() => {
    const commentsQuery = query(postCommentsCollection(postId), orderBy('createdAt', 'asc'));

    return onSnapshot(commentsQuery, (snapshot) => {
      setFlatComments(
        snapshot.docs.map((docSnapshot) =>
          mapSnapshotComment(docSnapshot.id, docSnapshot.data() as FirestoreComment),
        ),
      );
    });
  }, [postId]);

  const comments = useMemo(() => {
    const tree = buildTree(flatComments);
    return sortTree(tree, sortBy);
  }, [flatComments, sortBy]);

  const addComment = useCallback(async (content: string, parentId?: string) => {
    const email = currentUser?.email?.toLowerCase();
    const isAdmin = !!email && ADMIN_EMAILS.includes(email);

    await addDoc(postCommentsCollection(postId), {
      content,
      author: {
        name: currentUser?.displayName || currentUser?.email || 'Usuário',
        avatar: currentUser?.photoURL || undefined,
        isAnonymous: !currentUser,
      },
      createdAt: serverTimestamp(),
      upvotes: 0,
      downvotes: 0,
      likes: 0,
      isAuthor: isAdmin,
      replies: [],
      parentId: parentId ?? null,
      isQuestion: false,
      isAnswered: false,
    });

    await updateDoc(postDoc(postId), {
      commentCount: increment(1),
    });

    setReplyingTo(null);
  }, [currentUser, postId]);

  const likeComment = useCallback(async (commentId: string) => {
    await updateDoc(commentDoc(postId, commentId), {
      likes: increment(1),
      upvotes: increment(1),
    });
  }, [postId]);

  const toggleQuestionStatus = useCallback(async (commentId: string, status: 'isQuestion' | 'isAnswered') => {
    const target = flatComments.find((comment) => comment.id === commentId);
    if (!target) return;

    await updateDoc(commentDoc(postId, commentId), {
      [status]: !target[status],
    });
  }, [flatComments, postId]);

  const deleteComment = useCallback(async (commentId: string) => {
    await deleteDoc(commentDoc(postId, commentId));
    await updateDoc(postDoc(postId), {
      commentCount: increment(-1),
    });
  }, [postId]);

  const editComment = useCallback(async (commentId: string, newContent: string) => {
    await updateDoc(commentDoc(postId, commentId), {
      content: newContent,
      editedAt: serverTimestamp(),
    });
  }, [postId]);

  return (
    <CommentContext.Provider
      value={{
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
      }}
    >
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

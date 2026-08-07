import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toDateValue } from '@/utils/formatters';
import type { Comment } from '@/types/comment';

const postDoc = (postId: string) => doc(db, 'posts', postId);

const postCommentsCollection = (postId: string) => collection(db, 'posts', postId, 'comments');

const commentDoc = (postId: string, commentId: string) =>
  doc(db, 'posts', postId, 'comments', commentId);

export const mapComment = (id: string, data: Record<string, unknown>): Comment => ({
  id,
  content: String(data.content ?? ''),
  author: {
    name: String((data.author as { name?: string } | undefined)?.name ?? 'Usuário'),
    avatar: (data.author as { avatar?: string } | undefined)?.avatar,
    isAnonymous: Boolean((data.author as { isAnonymous?: boolean } | undefined)?.isAnonymous ?? false),
  },
  authorId: data.authorId ? String(data.authorId) : undefined,
  createdAt: toDateValue(data.createdAt),
  upvotes: Number(data.upvotes ?? 0),
  downvotes: Number(data.downvotes ?? 0),
  likes: Number(data.likes ?? data.upvotes ?? 0),
  likedBy: Array.isArray(data.likedBy) ? (data.likedBy as string[]) : [],
  isAuthor: Boolean(data.isAuthor ?? false),
  replies: (data.replies as Comment[]) ?? [],
  parentId: data.parentId ? String(data.parentId) : undefined,
  isQuestion: Boolean(data.isQuestion ?? false),
  isAnswered: Boolean(data.isAnswered ?? false),
  editedAt: data.editedAt ? toDateValue(data.editedAt) : undefined,
});

export interface AddCommentInput {
  content: string;
  author: Comment['author'];
  authorId: string | null;
  isAuthor: boolean;
  parentId?: string | null;
}

export const subscribeComments = (
  postId: string,
  onChange: (comments: Comment[]) => void,
): Unsubscribe => {
  const commentsQuery = query(postCommentsCollection(postId), orderBy('createdAt', 'asc'));
  return onSnapshot(commentsQuery, (snapshot) => {
    onChange(snapshot.docs.map((docSnapshot) => mapComment(docSnapshot.id, docSnapshot.data())));
  });
};

export const addComment = (postId: string, input: AddCommentInput) =>
  Promise.all([
    addDoc(postCommentsCollection(postId), {
      content: input.content,
      author: input.author,
      authorId: input.authorId,
      createdAt: serverTimestamp(),
      upvotes: 0,
      downvotes: 0,
      likes: 0,
      likedBy: [],
      isAuthor: input.isAuthor,
      replies: [],
      parentId: input.parentId ?? null,
      isQuestion: false,
      isAnswered: false,
    }),
    updateDoc(postDoc(postId), {
      commentCount: increment(1),
    }),
  ]);

export const likeComment = (postId: string, commentId: string, email: string, alreadyLiked: boolean) =>
  updateDoc(
    commentDoc(postId, commentId),
    alreadyLiked
      ? { likedBy: arrayRemove(email), likes: increment(-1) }
      : { likedBy: arrayUnion(email), likes: increment(1) },
  );

export const setCommentStatus = (
  postId: string,
  commentId: string,
  status: 'isQuestion' | 'isAnswered',
  value: boolean,
) => updateDoc(commentDoc(postId, commentId), { [status]: value });

export const deleteComment = (postId: string, commentId: string) =>
  Promise.all([
    deleteDoc(commentDoc(postId, commentId)),
    updateDoc(postDoc(postId), {
      commentCount: increment(-1),
    }),
  ]);

export const editComment = (postId: string, commentId: string, newContent: string) =>
  updateDoc(commentDoc(postId, commentId), {
    content: newContent,
    editedAt: serverTimestamp(),
  });

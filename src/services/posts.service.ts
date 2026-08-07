import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toDateValue } from '@/utils/formatters';
import type { Post, PostDraft } from '@/types/post';

const postsCollection = collection(db, 'posts');

const postDoc = (postId: string) => doc(db, 'posts', postId);

const postCommentsCollection = (postId: string) => collection(db, 'posts', postId, 'comments');

export const mapPost = (id: string, data: Record<string, unknown>): Post => ({
  id,
  title: String(data.title ?? ''),
  content: String(data.content ?? ''),
  summary: String(data.summary ?? ''),
  categoryId: String(data.categoryId ?? 'frontend'),
  author: {
    name: String((data.author as { name?: string } | undefined)?.name ?? 'Admin'),
    avatar: (data.author as { avatar?: string } | undefined)?.avatar,
    isAnonymous: Boolean((data.author as { isAnonymous?: boolean } | undefined)?.isAnonymous ?? false),
  },
  createdAt: toDateValue(data.createdAt),
  readingTime: Number(data.readingTime ?? 5),
  difficulty: (data.difficulty as Post['difficulty']) ?? 'iniciante',
  likes: Number(data.likes ?? data.upvotes ?? 0),
  likedBy: Array.isArray(data.likedBy) ? (data.likedBy as string[]) : [],
  commentCount: Number(data.commentCount ?? 0),
  tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
});

export const subscribePosts = (onChange: (posts: Post[]) => void): Unsubscribe =>
  onSnapshot(query(postsCollection), (snapshot) => {
    onChange(snapshot.docs.map((docSnapshot) => mapPost(docSnapshot.id, docSnapshot.data())));
  });

export const createPost = (draft: PostDraft, author: Post['author']) =>
  addDoc(postsCollection, {
    ...draft,
    author,
    createdAt: serverTimestamp(),
    likes: 0,
    likedBy: [],
    commentCount: 0,
  });

export const updatePost = (postId: string, updated: PostDraft) =>
  updateDoc(postDoc(postId), { ...updated });

export const deletePost = async (postId: string) => {
  const commentsSnapshot = await getDocs(postCommentsCollection(postId));
  const batch = writeBatch(db);
  commentsSnapshot.docs.forEach((comment) => batch.delete(comment.ref));
  batch.delete(postDoc(postId));
  await batch.commit();
};

export const likePost = (postId: string, email: string, alreadyLiked: boolean) =>
  updateDoc(
    postDoc(postId),
    alreadyLiked
      ? { likedBy: arrayRemove(email), likes: increment(-1) }
      : { likedBy: arrayUnion(email), likes: increment(1) },
  );

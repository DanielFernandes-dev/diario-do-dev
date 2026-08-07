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
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  startAt,
  updateDoc,
  writeBatch,
  type Unsubscribe,
  QueryConstraint,
  where,
  limit,
  type DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toDateValue } from '@/utils/formatters';
import type { Post, PostDraft, SortOption } from '@/types/post';

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

/**
 * Subscribe to posts with pagination and sorting
 * @param onChange Callback when posts change
 * @param pageSize Number of posts per page (default: 20)
 * @param sortBy Sort option: 'recent' or 'discussed'
 * @param categoryId Optional category filter
 * @param cursor Optional document cursor to start from
 * @returns Unsubscribe function
 */
export const subscribePaginatedPosts = (
  onChange: (posts: Post[]) => void,
  pageSize = 20,
  sortBy: SortOption = 'recent',
  categoryId: string | null = null,
  cursor: DocumentSnapshot<unknown> | null = null,
): Unsubscribe => {
  let constraints: QueryConstraint[] = [];

  // Add ordering based on sortBy
  switch (sortBy) {
    case 'recent':
      constraints.push(orderBy('createdAt', 'desc'));
      break;
    case 'discussed':
      constraints.push(orderBy('commentCount', 'desc'));
      break;
    default:
      constraints.push(orderBy('createdAt', 'desc'));
  }

  // Add category filter if specified
  if (categoryId) {
    constraints.push(where('categoryId', '==', categoryId));
  }

  // Add pagination
  if (cursor) {
    constraints.push(startAfter(cursor));
  }
  constraints.push(limit(pageSize));

  const postsQuery = query(postsCollection, ...constraints);

  return onSnapshot(postsQuery, (snapshot) => {
    onChange(snapshot.docs.map((docSnapshot) => mapPost(docSnapshot.id, docSnapshot.data())));
  });
};

/**
 * Get a single page of posts (non-realtime)
 * @param pageSize Number of posts per page
 * @param sortBy Sort option
 * @param categoryId Optional category filter
 * @param cursor Optional document cursor to start from
 * @returns Promise with posts and cursor for next page
 */
export const getPostsPage = async (
  pageSize = 20,
  sortBy: SortOption = 'recent',
  categoryId: string | null = null,
  cursor: DocumentSnapshot<unknown> | null = null,
): Promise<{ posts: Post[]; nextCursor: DocumentSnapshot<unknown> | null }> => {
  let constraints: QueryConstraint[] = [];

  // Add ordering based on sortBy
  switch (sortBy) {
    case 'recent':
      constraints.push(orderBy('createdAt', 'desc'));
      break;
    case 'discussed':
      constraints.push(orderBy('commentCount', 'desc'));
      break;
    default:
      constraints.push(orderBy('createdAt', 'desc'));
  }

  // Add category filter if specified
  if (categoryId) {
    constraints.push(where('categoryId', '==', categoryId));
  }

  // Add pagination
  if (cursor) {
    constraints.push(startAfter(cursor));
  }
  constraints.push(limit(pageSize));

  const postsQuery = query(postsCollection, ...constraints);
  const snapshot = await getDocs(postsQuery);

  const posts = snapshot.docs.map((docSnapshot) => mapPost(docSnapshot.id, docSnapshot.data()));
  const nextCursor = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  return { posts, nextCursor };
};

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

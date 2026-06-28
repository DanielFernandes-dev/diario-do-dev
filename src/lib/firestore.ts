import { collection, doc, type DocumentData, type QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export const postsCollection = collection(db, 'posts');

export const postDoc = (postId: string) => doc(db, 'posts', postId);

export const postCommentsCollection = (postId: string) => collection(db, 'posts', postId, 'comments');

export const commentDoc = (postId: string, commentId: string) => doc(db, 'posts', postId, 'comments', commentId);

export const toDateValue = (value: unknown): Date => {
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  if (value && typeof value === 'object' && 'seconds' in value) {
    const seconds = Number((value as { seconds: number }).seconds);
    const nanos = Number((value as { nanoseconds?: number }).nanoseconds ?? 0);
    return new Date(seconds * 1000 + Math.floor(nanos / 1_000_000));
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
};

export const fromDoc = <T extends DocumentData>(snapshot: QueryDocumentSnapshot<T>) => ({
  id: snapshot.id,
  ...snapshot.data(),
});

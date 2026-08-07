import type { Comment } from '@/types/comment';

export type CommentSort = 'relevant' | 'recent';

const buildTree = (items: Comment[]): Comment[] => {
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

const compareRelevant = (a: Comment, b: Comment): number => {
  const scoreA = a.likes ?? a.upvotes ?? 0;
  const scoreB = b.likes ?? b.upvotes ?? 0;

  if (a.isQuestion && !a.isAnswered && (!b.isQuestion || b.isAnswered)) return -1;
  if (b.isQuestion && !b.isAnswered && (!a.isQuestion || a.isAnswered)) return 1;
  if (a.isAuthor && !b.isAuthor) return -1;
  if (b.isAuthor && !a.isAuthor) return 1;
  return scoreB - scoreA;
};

const sortTree = (items: Comment[], sortBy: CommentSort): Comment[] => {
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

export const buildCommentTree = (items: Comment[]): Comment[] => buildTree(items);

export const sortCommentTree = (items: Comment[], sortBy: CommentSort): Comment[] =>
  sortTree(items, sortBy);

export const countComments = (list: Comment[]): number =>
  list.reduce((acc, item) => acc + 1 + countComments(item.replies ?? []), 0);

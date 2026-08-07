import { Timestamp } from 'firebase/firestore';

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

export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'agora';
  if (diffInHours < 24) return `há ${diffInHours}h`;
  if (diffInHours < 48) return 'ontem';

  return date.toLocaleDateString('pt-BR');
};

export const formatCommentDate = (date: Date): string =>
  new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

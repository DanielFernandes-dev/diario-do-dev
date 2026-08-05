export interface Post {
  id: string;
  title: string;
  content: string;
  summary: string;
  categoryId: string;
  author: {
    name: string;
    avatar?: string;
    isAnonymous: boolean;
  };
  createdAt: Date;
  readingTime: number;
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
  upvotes: number;
  downvotes: number;
  commentCount: number;
  tags: string[];
}

export interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    isAnonymous: boolean;
  };
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  likes?: number;
  isAuthor?: boolean;
  replies: Comment[];
  parentId?: string;
  isQuestion?: boolean;
  isAnswered?: boolean;
  editedAt?: Date;
}

export type PostDifficulty = 'iniciante' | 'intermediario' | 'avancado';

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
  difficulty: PostDifficulty;
  likes: number;
  likedBy: string[];
  commentCount: number;
  tags: string[];
}

export type PostDraft = Pick<
  Post,
  'title' | 'summary' | 'content' | 'categoryId' | 'readingTime' | 'difficulty' | 'tags'
>;

export type SortOption = 'recent' | 'discussed';

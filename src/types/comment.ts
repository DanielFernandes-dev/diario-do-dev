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
  likedBy?: string[];
  isAuthor?: boolean;
  authorId?: string;
  replies: Comment[];
  parentId?: string;
  isQuestion?: boolean;
  isAnswered?: boolean;
  editedAt?: Date;
  audioUrl?: string;
}

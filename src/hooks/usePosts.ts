import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  createPost as createPostService,
  deletePost as deletePostService,
  likePost as likePostService,
  subscribePosts,
  updatePost as updatePostService,
} from '@/services/posts.service';
import type { Post, PostDraft } from '@/types/post';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribePosts((next) => {
      setPosts(next);
      setLoadingPosts(false);
    });

    return unsubscribe;
  }, []);

  const createPost = useCallback(async (draft: PostDraft, author: Post['author']) => {
    await createPostService(draft, author);
  }, []);

  const updatePost = useCallback(async (postId: string, draft: PostDraft) => {
    await updatePostService(postId, draft);
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    await deletePostService(postId);
  }, []);

  const likePost = useCallback(
    async (postId: string) => {
      const email = currentUser?.email?.toLowerCase();
      if (!email) return;

      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const alreadyLiked = (post.likedBy ?? []).some((e) => e.toLowerCase() === email);
      await likePostService(postId, email, alreadyLiked);
    },
    [currentUser, posts],
  );

  return {
    posts,
    loadingPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
  };
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  createPost as createPostService,
  deletePost as deletePostService,
  likePost as likePostService,
  updatePost as updatePostService,
} from '@/services/posts.service';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  onSnapshot,
  getDocs,
  type DocumentSnapshot,
} from 'firebase/firestore';
import { mapPost } from '@/services/posts.service';
import type { Post, PostDraft, SortOption } from '@/types/post';

export function usePosts(
  sortBy: SortOption = 'recent',
  categoryId: string | null = null,
  pageSize: number = 20,
  enablePagination: boolean = true,
) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<DocumentSnapshot<unknown> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { currentUser } = useAuth();
  
  // Ref to store the unsubscribe function
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Reset pagination when sort, category, or pageSize changes
  useEffect(() => {
    // Clean up previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    
    // Reset state
    setPosts([]);
    setCursor(null);
    setHasMore(true);
    setLoadingPosts(true);
    setError(null);
  }, [sortBy, categoryId, pageSize, currentUser]);

  // Set up subscription for posts
  useEffect(() => {
    // The subscription is tied to sort/category/page size only.
    // The cursor is intentionally NOT a dependency: it changes on
    // pagination and must not recreate the subscription (which would
    // cause an infinite reload loop).
    const paginationCursor = null; // subscription always starts from the first page

    if (!enablePagination) {
      // Non-paginated version (loads all posts) - for backwards compatibility
      const postsQuery = query(
        collection(db, 'posts'),
        ...buildQueryConstraints(sortBy, categoryId, null, 0) // 0 means no limit
      );

      unsubscribeRef.current = onSnapshot(postsQuery, (snapshot) => {
        try {
          setPosts(snapshot.docs.map((doc) => mapPost(doc.id, doc.data())));
          setLoadingPosts(false);
          setError(null);
        } catch (err) {
          console.error('Error in posts snapshot:', err);
          setError('Failed to load posts');
          setLoadingPosts(false);
        }
      });
    } else {
      // Paginated version
      loadInitialPage();

      // Set up real-time subscription for the first page
      const currentPageQuery = query(
        collection(db, 'posts'),
        ...buildQueryConstraints(sortBy, categoryId, paginationCursor, pageSize)
      );

      unsubscribeRef.current = onSnapshot(currentPageQuery, (snapshot) => {
        try {
          // Only update if we're on the first page (cursor is null)
          // For paginated real-time, this gets complex - simplifying for now
          if (!paginationCursor) {
            setPosts(snapshot.docs.map((doc) => mapPost(doc.id, doc.data())));
            setHasMore(snapshot.docs.length === pageSize);
          }
          setLoadingPosts(false);
          setError(null);
        } catch (err) {
          console.error('Error in paginated posts snapshot:', err);
          setError('Failed to load posts');
          setLoadingPosts(false);
        }
      });
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [sortBy, categoryId, pageSize, enablePagination, currentUser]);

  const loadInitialPage = useCallback(async () => {
    try {
      setLoadingPosts(true);
      setError(null);
      
      const snapshot = await getDocs(
        query(
          collection(db, 'posts'),
          ...buildQueryConstraints(sortBy, categoryId, null, pageSize)
        )
      );
      
      const pagePosts = snapshot.docs.map((doc) => 
        mapPost(doc.id, doc.data())
      );
      
      setPosts(pagePosts);
      
      // Set cursor for next page
      setCursor(snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null);
      setHasMore(snapshot.docs.length === pageSize);
      
      setLoadingPosts(false);
    } catch (err) {
      console.error('Error loading initial page:', err);
      setError('Failed to load posts');
      setLoadingPosts(false);
    }
  }, [sortBy, categoryId, pageSize]);

  const loadMorePosts = useCallback(async () => {
    if (!hasMore || loadingPosts || !cursor) return;

    try {
      setLoadingPosts(true);
      setError(null);
      
      const snapshot = await getDocs(
        query(
          collection(db, 'posts'),
          ...buildQueryConstraints(sortBy, categoryId, cursor, pageSize)
        )
      );
      
      const newPosts = snapshot.docs.map((doc) => 
        mapPost(doc.id, doc.data())
      );
      
      setPosts(prev => [...prev, ...newPosts]);
      
      // Update cursor
      setCursor(snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null);
      setHasMore(snapshot.docs.length === pageSize);
      
      setLoadingPosts(false);
    } catch (err) {
      console.error('Error loading more posts:', err);
      setError('Failed to load more posts');
      setLoadingPosts(false);
    }
  }, [hasMore, loadingPosts, cursor, sortBy, categoryId, pageSize]);

  const refreshPosts = useCallback(async () => {
    setCursor(null);
    setHasMore(true);
    setPosts([]);
    await loadInitialPage();
  }, [loadInitialPage]);

  return {
    posts,
    loadingPosts,
    error,
    hasMore,
    loadMorePosts,
    refreshPosts,
    createPost: useCallback(async (draft: PostDraft, author: Post['author']) => {
      await createPostService(draft, author);
      // Refetch after creation
      await refreshPosts();
    }, [refreshPosts]),
    updatePost: useCallback(async (postId: string, draft: PostDraft) => {
      await updatePostService(postId, draft);
      // Refetch after update
      await refreshPosts();
    }, [refreshPosts]),
    deletePost: useCallback(async (postId: string) => {
      await deletePostService(postId);
      // Refetch after deletion
      await refreshPosts();
    }, [refreshPosts]),
    likePost: useCallback(
      async (postId: string) => {
        const email = currentUser?.email?.toLowerCase();
        if (!email) return;

        const post = posts.find((p) => p.id === postId);
        if (!post) return;

        const alreadyLiked = (post.likedBy ?? []).some((e) => e.toLowerCase() === email);
        
        // Update the specific post in state optimistically
        setPosts(prev => 
          prev.map(p => 
            p.id === postId 
              ? { 
                  ...p, 
                  likes: alreadyLiked ? p.likes - 1 : p.likes + 1,
                  likedBy: alreadyLiked 
                    ? (p.likedBy ?? []).filter(e => e.toLowerCase() !== email)
                    : [...(p.likedBy ?? []), email]
                }
              : p
          )
        );
        
        // Also update in Firestore
        await likePostService(postId, email, alreadyLiked);
      },
      [currentUser, posts]
    ),
  };
}

// Helper function to build query constraints
function buildQueryConstraints(
  sortBy: SortOption,
  categoryId: string | null,
  cursor: DocumentSnapshot<unknown> | null,
  pageSize: number
): any[] {
  const constraints: any[] = [];

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

  // Add pagination (only if pageSize > 0)
  if (pageSize > 0) {
    if (cursor) {
      constraints.push(startAfter(cursor));
    }
    constraints.push(limit(pageSize));
  }

  return constraints;
}
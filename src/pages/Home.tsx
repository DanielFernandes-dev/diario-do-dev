import { useMemo, useState } from 'react';
import { Sidebar } from '@/components/common/Sidebar';
import { PostFeed } from '@/components/posts/PostFeed';
import { FeedStats } from '@/components/stats/FeedStats';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import type { PostDraft, SortOption } from '@/types/post';

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const { currentUser, isAdmin, handleGoogleLogin } = useAuth();
  const { posts, createPost, updatePost, deletePost, likePost } = usePosts();

  const filteredPosts = posts.filter((post) => !selectedCategory || post.categoryId === selectedCategory);

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'popular':
          return b.likes - a.likes;
        case 'discussed':
          return b.commentCount - a.commentCount;
        default:
          return 0;
      }
    });
  }, [filteredPosts, sortBy]);

  const totalComments = posts.reduce((acc, post) => acc + post.commentCount, 0);

  const profile = useMemo(
    () => ({
      name: currentUser?.displayName || currentUser?.email || 'Autor do diário',
      avatar: currentUser?.photoURL || undefined,
      email: currentUser?.email || undefined,
      bio: currentUser
        ? 'Perfil autenticado pelo Firebase. Os dados de publicação e identidade vêm da conta conectada.'
        : 'Faça login com Google para publicar como admin e visualizar o perfil autenticado no projeto.',
    }),
    [currentUser],
  );

  const topTags = useMemo(
    () =>
      Array.from(
        posts.reduce((map, post) => {
          post.tags.forEach((tag) => map.set(tag, (map.get(tag) ?? 0) + 1));
          return map;
        }, new Map<string, number>()),
      ).sort(([, a], [, b]) => b - a),
    [posts],
  );

  const handleCreatePost = async (draft: PostDraft) => {
    if (!isAdmin) return;
    await createPost(draft, {
      name: currentUser?.displayName || currentUser?.email || 'Admin',
      avatar: currentUser?.photoURL || undefined,
      isAnonymous: false,
    });
  };

  return (
    <div className="min-h-screen">
      <main className="relative pb-16 pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_320px]" id="feed">
            <Sidebar
              className="hidden w-72 shrink-0 lg:block"
              posts={posts}
              totalComments={totalComments}
              profile={profile}
            />

            <PostFeed
              posts={sortedPosts}
              selectedCategory={selectedCategory}
              onClearCategory={() => setSelectedCategory(null)}
              sortBy={sortBy}
              onSortBy={setSortBy}
              isAdmin={isAdmin}
              currentUser={currentUser}
              onLogin={handleGoogleLogin}
              onCreatePost={handleCreatePost}
              onLikePost={likePost}
              onEditPost={updatePost}
              onDeletePost={deletePost}
            />

            <aside className="hidden xl:block">
              <FeedStats
                profile={profile}
                postCount={posts.length}
                commentCount={totalComments}
                topTags={topTags}
              />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

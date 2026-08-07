import { useMemo, useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Sidebar } from '@/components/common/Sidebar';
import { Hero } from '@/components/common/Hero';
import { PostFeed } from '@/components/posts/PostFeed';
import { FeedStats } from '@/components/stats/FeedStats';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import type { PostDraft, SortOption } from '@/types/post';

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const { currentUser, isAdmin, handleGoogleLogin } = useAuth();
  const { posts, loadingPosts, createPost, updatePost, deletePost, likePost } = usePosts();

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
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onAbout={() => setShowAbout(!showAbout)}
        profileName={profile.name}
        profileAvatar={profile.avatar}
      />

      <main className="relative pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Hero
            postCount={posts.length}
            commentCount={totalComments}
            loadingPosts={loadingPosts}
            onAbout={() => setShowAbout(!showAbout)}
            currentUser={currentUser}
            onLogin={handleGoogleLogin}
          />

          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_320px]" id="feed">
            <Sidebar
              className="hidden w-72 shrink-0 lg:block"
              selectedCategory={selectedCategory || undefined}
              onCategorySelect={setSelectedCategory}
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

      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAbout(false)}
          />
          <div className="relative glass-panel w-full max-w-md p-6">
            <h2 className="text-2xl font-extrabold text-white">Sobre o projeto</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <p>
                Este é um blog técnico onde compartilho minhas experiências reais como desenvolvedor.
              </p>
              <p>
                Aqui você encontrará relatos sobre bugs resolvidos, decisões de arquitetura,
                aprendizados e desafios do dia a dia.
              </p>
              <p>
                Sinta-se à vontade para comentar, fazer perguntas e compartilhar suas próprias
                experiências nos comentários!
              </p>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="mt-6 w-full rounded-full bg-white px-4 py-3 font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-80 overflow-y-auto border-r border-zinc-800 bg-black/95 p-4">
            <Sidebar
              selectedCategory={selectedCategory || undefined}
              onCategorySelect={(categoryId) => {
                setSelectedCategory(categoryId);
                setSidebarOpen(false);
              }}
              posts={posts}
              totalComments={totalComments}
              profile={profile}
            />
          </div>
        </div>
      )}
    </div>
  );
}

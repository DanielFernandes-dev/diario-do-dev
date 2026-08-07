import { useState } from 'react';
import { BookOpen, PenSquare, Plus } from 'lucide-react';
import { categories } from '@/data/categories';
import type { PostDraft } from '@/types/post';

interface AdminComposerProps {
  onCreate: (post: PostDraft) => void;
}

const initialDraft: PostDraft = {
  title: '',
  summary: '',
  content: '',
  categoryId: 'frontend',
  readingTime: 5,
  difficulty: 'iniciante',
  tags: [],
};

export function AdminComposer({ onCreate }: AdminComposerProps) {
  const [draft, setDraft] = useState<PostDraft>(initialDraft);
  const [tagsText, setTagsText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    onCreate({
      ...draft,
      tags,
    });

    setDraft(initialDraft);
    setTagsText('');
  };

  return (
    <section className="glass-panel mb-8 p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-500/10 text-ink-200">
          <PenSquare className="h-5 w-5" />
        </div>
        <div>
          <div className="section-label">Painel admin</div>
          <h2 className="mt-1 text-xl font-extrabold text-white">Publicar novo post</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-zinc-200">Título</span>
            <input
              required
              value={draft.title}
              onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-ink-400/40 focus:bg-zinc-800"
              placeholder="Título do post"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-zinc-200">Categoria</span>
            <select
              value={draft.categoryId}
              onChange={(e) => setDraft((prev) => ({ ...prev, categoryId: e.target.value }))}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-ink-400/40 focus:bg-zinc-800"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-zinc-200">Resumo</span>
          <input
            required
            value={draft.summary}
            onChange={(e) => setDraft((prev) => ({ ...prev, summary: e.target.value }))}
            className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-ink-400/40 focus:bg-zinc-800"
            placeholder="Resumo curto para o card do post"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-zinc-200">Conteúdo</span>
          <textarea
            required
            rows={6}
            value={draft.content}
            onChange={(e) => setDraft((prev) => ({ ...prev, content: e.target.value }))}
            className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-ink-400/40 focus:bg-zinc-800"
            placeholder="Corpo do post"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-zinc-200">Tempo de leitura</span>
            <input
              type="number"
              min={1}
              required
              value={draft.readingTime}
              onChange={(e) => setDraft((prev) => ({ ...prev, readingTime: Number(e.target.value) }))}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-ink-400/40 focus:bg-zinc-800"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-zinc-200">Dificuldade</span>
            <select
              value={draft.difficulty}
              onChange={(e) => setDraft((prev) => ({ ...prev, difficulty: e.target.value as PostDraft['difficulty'] }))}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-ink-400/40 focus:bg-zinc-800"
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-zinc-200">Tags</span>
            <input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-ink-400/40 focus:bg-zinc-800"
              placeholder="React, Firebase, Firestore"
            />
          </label>
        </div>

        <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <BookOpen className="h-4 w-4" />
            Apenas o admin pode publicar novos posts.
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-ink-500 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-ink-400"
          >
            <Plus className="h-4 w-4" />
            Publicar post
          </button>
        </div>
      </form>
    </section>
  );
}

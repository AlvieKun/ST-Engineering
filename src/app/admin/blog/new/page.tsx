'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createPost } from '../../actions';
import PublishControls from '@/components/PublishControls';

type Project = { id: string; title: string };

export default function NewPost() {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Fetch projects for the dropdown
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []))
      .catch(() => setProjects([]));
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const f = new FormData(e.currentTarget);
    try {
      await createPost({
        title: f.get('title'),
        slug: f.get('slug'),
        excerpt: f.get('excerpt'),
        content: f.get('content'),
        publishStatus: f.get('publishStatus') || 'DRAFT',
        scheduledAt: f.get('scheduledAt') || '',
        projectId: f.get('projectId') || '',
        tags: String(f.get('tags') || '')
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean),
      });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to save draft');
    }
  }

  return (
    <main className="container max-w-4xl py-16">
      <Link href="/admin/blog" className="font-mono text-xs text-[var(--muted)]">
        ← Writing
      </Link>
      <div className="mb-10 mt-8">
        <p className="eyebrow mb-4">CMS / New post</p>
        <h1 className="title">Publish a thought.</h1>
      </div>

      <form onSubmit={submit} className="space-y-8">
        <Field name="title" label="Title" placeholder="A clear technical argument" required />
        <Field
          name="slug"
          label="Slug"
          placeholder="a-clear-technical-argument"
          required
        />
        <Field
          name="excerpt"
          label="Excerpt"
          placeholder="The sentence that makes someone read"
          required
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Field name="tags" label="Tags" placeholder="RAG, Systems, Evaluation" />
          <label>
            <span className="mb-2 block font-mono text-xs text-[var(--muted)]">
              Related project
            </span>
            <select
              name="projectId"
              className="w-full border-b grid-line bg-transparent py-3 outline-none"
            >
              <option value="">None</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <PublishControls publishStatus="DRAFT" scheduledAt={null} />

        <label className="block">
          <span className="mb-2 block font-mono text-xs text-[var(--muted)]">
            Content · Markdown
          </span>
          <textarea
            name="content"
            required
            rows={18}
            placeholder={'## The argument\n\nWrite the build log here...\n\n```typescript\nconst result = await evaluate()\n```'}
            className="w-full border grid-line bg-transparent p-4 font-mono text-sm leading-6 outline-none focus:border-[var(--accent)]"
          />
        </label>

        {error && (
          <p
            role="alert"
            className="border-l-2 border-[var(--accent)] pl-4 text-sm text-[var(--accent)]"
          >
            {error}
          </p>
        )}

        <div className="flex items-center gap-4 border-t grid-line pt-7">
          <button
            style={{ color: 'var(--paper)', backgroundColor: 'var(--ink)' }}
            className="px-5 py-3 font-mono text-xs"
          >
            {saved ? 'Draft saved' : 'Save draft'}
          </button>
          <Link href="/admin/blog" className="font-mono text-xs text-[var(--muted)]">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

function Field({
  name,
  label,
  placeholder,
  required = false,
}: {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-xs text-[var(--muted)]">{label}</span>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full border-b grid-line bg-transparent px-0 py-3 text-lg outline-none focus:border-[var(--accent)]"
      />
    </label>
  );
}

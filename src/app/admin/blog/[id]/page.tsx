'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { updatePost, deletePost } from '../../actions';

type PostData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishStatus: string;
  projectId: string | null;
  tags: { tag: { id: string; name: string } }[];
};

type Project = { id: string; title: string };

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<PostData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    params.then(({ id }) => {
      Promise.all([
        fetch(`/api/posts/${id}`).then((res) => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        }),
        fetch('/api/projects').then((res) => res.json()),
      ])
        .then(([postData, projectsData]) => {
          setPost(postData.post);
          setProjects(projectsData.projects || []);
        })
        .catch(() => setPost(null))
        .finally(() => setLoading(false));
    });
  }, [params]);

  if (loading) {
    return (
      <main className="container max-w-4xl py-16">
        <p className="text-[var(--muted)]">Loading...</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="container max-w-4xl py-16">
        <p className="text-[var(--muted)]">Post not found.</p>
        <Link href="/admin/blog" className="mt-4 inline-block font-mono text-xs text-[var(--accent)]">
          ← Back to writing
        </Link>
      </main>
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const f = new FormData(e.currentTarget);
    if (!post) return;
    try {
      await updatePost(post.id, {
        title: f.get('title'),
        slug: f.get('slug'),
        excerpt: f.get('excerpt'),
        content: f.get('content'),
        publishStatus: f.get('publishStatus'),
        projectId: f.get('projectId') || '',
        tags: String(f.get('tags') || '')
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean),
      });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to save');
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    if (!post) return;
    try {
      await deletePost(post.id);
      window.location.href = '/admin/blog';
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to delete');
    }
  }

  return (
    <main className="container max-w-4xl py-16">
      <Link href="/admin/blog" className="font-mono text-xs text-[var(--muted)]">
        ← Writing
      </Link>
      <div className="mb-10 mt-8 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-4">CMS / Edit post</p>
          <h1 className="title">Update post.</h1>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="font-mono text-xs text-red-500 hover:text-red-700"
        >
          Delete post
        </button>
      </div>

      <form onSubmit={submit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="title" label="Title" defaultValue={post.title} required />
          <Field name="slug" label="Slug" defaultValue={post.slug} required />
        </div>

        <Field name="excerpt" label="Excerpt" defaultValue={post.excerpt} required />

        <div className="grid gap-6 md:grid-cols-2">
          <Field name="tags" label="Tags" defaultValue={post.tags.map((t) => t.tag.name).join(', ')} />

          <label>
            <span className="mb-2 block font-mono text-xs text-[var(--muted)]">
              Related project
            </span>
            <select
              name="projectId"
              defaultValue={post.projectId || ''}
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

        <label className="block">
          <span className="mb-2 block font-mono text-xs text-[var(--muted)]">
            Publish status
          </span>
          <select
            name="publishStatus"
            defaultValue={post.publishStatus}
            className="w-full border grid-line bg-transparent p-3"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block font-mono text-xs text-[var(--muted)]">
            Content · Markdown
          </span>
          <textarea
            name="content"
            required
            rows={18}
            defaultValue={post.content}
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

        {saved && (
          <p className="border-l-2 border-green-500 pl-4 text-sm text-green-600">
            Changes saved successfully.
          </p>
        )}

        <div className="flex items-center gap-4 border-t grid-line pt-7">
          <button
            style={{ color: 'var(--paper)', backgroundColor: 'var(--ink)' }}
            className="px-5 py-3 font-mono text-xs"
          >
            {saved ? 'Saved' : 'Save changes'}
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
  defaultValue = '',
  required = false,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-xs text-[var(--muted)]">{label}</span>
      <input
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="w-full border-b grid-line bg-transparent px-0 py-3 text-lg outline-none focus:border-[var(--accent)]"
      />
    </label>
  );
}

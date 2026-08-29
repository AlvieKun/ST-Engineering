'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { updateProject, deleteProject } from '../../actions';
import MediaUpload from '@/components/MediaUpload';
import PublishControls from '@/components/PublishControls';

type ProjectData = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  status: string;
  publishStatus: string;
  featured: boolean;
  categories: string[];
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  documentationUrl: string;
  paperUrl: string;
  huggingFaceUrl: string;
  datasetUrl: string;
  thumbnailUrl: string | null;
  heroImageUrl: string | null;
  pitchDeckUrl: string | null;
  scheduledAt: string | null;
  problem: string;
  solution: string;
  implementation: string;
  engineeringDecisions: string;
  benchmarkResults: string;
  failureAnalysis: string;
  lessonsLearned: string;
};

export default function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pitchDeckUrl, setPitchDeckUrl] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/projects/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then((data) => {
          setProject(data.project);
          setImageUrl(data.project.thumbnailUrl || data.project.heroImageUrl || null);
          setPitchDeckUrl(data.project.pitchDeckUrl || null);
        })
        .catch(() => setProject(null))
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

  if (!project) {
    return (
      <main className="container max-w-4xl py-16">
        <p className="text-[var(--muted)]">Project not found.</p>
        <Link href="/admin/projects" className="mt-4 inline-block font-mono text-xs text-[var(--accent)]">
          ← Back to projects
        </Link>
      </main>
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const f = new FormData(e.currentTarget);
    if (!project) return;
    try {
      await updateProject(project.id, {
        title: f.get('title'),
        slug: f.get('slug'),
        shortDescription: f.get('shortDescription'),
        content: f.get('content') || '',
        status: f.get('status'),
        publishStatus: f.get('publishStatus'),
        featured: f.get('featured') === 'on',
        categories: [f.get('category') || 'AI'],
        technologies: String(f.get('technologies') || '')
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean),
        githubUrl: f.get('githubUrl') || '',
        demoUrl: f.get('demoUrl') || '',
        thumbnailUrl: imageUrl || '',
        heroImageUrl: imageUrl || '',
        pitchDeckUrl: pitchDeckUrl || '',
        problem: f.get('problem') || '',
        solution: f.get('solution') || '',
        implementation: f.get('implementation') || '',
        engineeringDecisions: f.get('engineeringDecisions') || '',
        benchmarkResults: f.get('benchmarkResults') || '',
        failureAnalysis: f.get('failureAnalysis') || '',
        lessonsLearned: f.get('lessonsLearned') || '',
      });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to save');
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    if (!project) return;
    try {
      await deleteProject(project.id);
      window.location.href = '/admin/projects';
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to delete');
    }
  }

  return (
    <main className="container max-w-4xl py-16">
      <Link href="/admin/projects" className="font-mono text-xs text-[var(--muted)]">
        ← Projects
      </Link>
      <div className="mb-10 mt-8 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-4">CMS / Edit project</p>
          <h1 className="title">Update system.</h1>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="font-mono text-xs text-red-500 hover:text-red-700"
        >
          Delete project
        </button>
      </div>

      <form onSubmit={submit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="title" label="Title" defaultValue={project.title} required />
          <Field name="slug" label="Slug" defaultValue={project.slug} required />
        </div>

        <Field
          name="shortDescription"
          label="Short description"
          defaultValue={project.shortDescription}
          required
        />

        <div className="grid gap-6 md:grid-cols-3">
          <label className="block">
            <span className="mb-2 block font-mono text-xs text-[var(--muted)]">Status</span>
            <select
              name="status"
              defaultValue={project.status}
              className="w-full border grid-line bg-transparent p-3"
            >
              <option value="IDEA">Idea</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>



          <label className="block">
            <span className="mb-2 block font-mono text-xs text-[var(--muted)]">Category</span>
            <select
              name="category"
              defaultValue={project.categories[0] || 'AI'}
              className="w-full border grid-line bg-transparent p-3"
            >
              <option value="AI">AI</option>
              <option value="AI / RAG">AI / RAG</option>
              <option value="Agents">Agents</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Systems">Systems</option>
              <option value="Machine Learning">Machine Learning</option>
            </select>
          </label>
        </div>

        <PublishControls
          publishStatus={project.publishStatus}
          scheduledAt={project.scheduledAt}
        />

        <label className="flex items-center gap-3 font-mono text-xs">
          <input
            name="featured"
            type="checkbox"
            defaultChecked={project.featured}
          />{' '}
          Featured project
        </label>

        <Field name="githubUrl" label="GitHub URL" defaultValue={project.githubUrl} />
        <Field name="demoUrl" label="Demo URL" defaultValue={project.demoUrl} />
        <Field
          name="technologies"
          label="Technologies"
          defaultValue={project.technologies.join(', ')}
        />

        {/* ── Project Media ── */}
        <section className="border-t grid-line pt-8">
          <p className="eyebrow mb-6">Project Media</p>
          <div className="grid gap-8 md:grid-cols-2">
            <MediaUpload
              label="Cover Image"
              type="image"
              value={imageUrl}
              onChange={setImageUrl}
              folder={`projects/${project.id}`}
            />
            <MediaUpload
              label="Pitch Deck"
              type="deck"
              value={pitchDeckUrl}
              onChange={setPitchDeckUrl}
              folder={`projects/${project.id}`}
            />
          </div>
        </section>

        <label className="block">
          <span className="mb-2 block font-mono text-xs text-[var(--muted)]">
            Technical implementation (Markdown)
          </span>
          <textarea
            name="content"
            rows={10}
            defaultValue={project.content}
            className="w-full border grid-line bg-transparent p-4 font-mono text-sm outline-none focus:border-[var(--accent)]"
          />
        </label>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block font-mono text-xs text-[var(--muted)]">Problem</span>
            <textarea
              name="problem"
              rows={4}
              defaultValue={project.problem}
              className="w-full border grid-line bg-transparent p-4 font-mono text-sm outline-none focus:border-[var(--accent)]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs text-[var(--muted)]">Solution</span>
            <textarea
              name="solution"
              rows={4}
              defaultValue={project.solution}
              className="w-full border grid-line bg-transparent p-4 font-mono text-sm outline-none focus:border-[var(--accent)]"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block font-mono text-xs text-[var(--muted)]">
            Engineering decisions
          </span>
          <textarea
            name="engineeringDecisions"
            rows={4}
            defaultValue={project.engineeringDecisions}
            className="w-full border grid-line bg-transparent p-4 font-mono text-sm outline-none focus:border-[var(--accent)]"
          />
        </label>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block font-mono text-xs text-[var(--muted)]">
              Failure analysis
            </span>
            <textarea
              name="failureAnalysis"
              rows={4}
              defaultValue={project.failureAnalysis}
              className="w-full border grid-line bg-transparent p-4 font-mono text-sm outline-none focus:border-[var(--accent)]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs text-[var(--muted)]">
              Lessons learned
            </span>
            <textarea
              name="lessonsLearned"
              rows={4}
              defaultValue={project.lessonsLearned}
              className="w-full border grid-line bg-transparent p-4 font-mono text-sm outline-none focus:border-[var(--accent)]"
            />
          </label>
        </div>

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
          <Link href="/admin/projects" className="font-mono text-xs text-[var(--muted)]">
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

import Link from 'next/link';
import { Edit3, ExternalLink, Plus } from 'lucide-react';
import { getAllProjects } from '@/lib/content';

export default async function AdminProjects() {
  const projects = await getAllProjects();

  return (
    <main className="container py-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-4">CMS / Projects</p>
          <h1 className="title">Project registry.</h1>
        </div>
        <Link
          href="/admin/projects/new"
          style={{ color: 'var(--paper)', backgroundColor: 'var(--ink)' }}
          className="flex items-center gap-2 px-4 py-3 font-mono text-xs"
        >
          <Plus size={14} /> New project
        </Link>
      </div>

      <div className="overflow-x-auto border-t grid-line">
        <div className="grid min-w-[650px] grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 border-b grid-line py-3 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
          <span>Project</span>
          <span>Status</span>
          <span>Category</span>
          <span>Featured</span>
          <span>Actions</span>
        </div>

        {projects.map((p) => (
          <div
            key={p.id}
            className="grid min-w-[650px] grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 border-b grid-line py-5 text-sm items-center"
          >
            <span className="font-bold">{p.title}</span>
            <span className="font-mono text-xs text-[var(--muted)]">{p.publishStatus}</span>
            <span className="text-xs text-[var(--muted)]">
              {p.categories[0] || 'Uncategorized'}
            </span>
            <span className="font-mono text-xs">{p.featured ? 'Yes' : '—'}</span>
            <span className="flex gap-3">
              <Link href={`/projects/${p.slug}`} aria-label="Preview">
                <ExternalLink size={15} />
              </Link>
              <Link href={`/admin/projects/${p.id}`} aria-label="Edit">
                <Edit3 size={15} />
              </Link>
            </span>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="py-16 text-center text-[var(--muted)]">
            No projects yet. Create your first project.
          </div>
        )}
      </div>
    </main>
  );
}

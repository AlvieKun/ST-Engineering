'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Project } from '@/lib/content';
import ProjectCard from '@/components/ProjectCard';

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const cats = [
    'All',
    ...Array.from(new Set(initialProjects.map((p) => p.category))),
  ];

  const shown = useMemo(
    () =>
      initialProjects
        .filter(
          (p) =>
            (filter === 'All' || p.category === filter) &&
            (p.title + p.summary + p.tags.join(' '))
              .toLowerCase()
              .includes(query.toLowerCase())
        )
        .sort((a, b) => Number(b.featured) - Number(a.featured)),
    [query, filter, initialProjects]
  );

  return (
    <main className="container py-20">
      <div className="mb-16">
        <p className="eyebrow mb-5">
          The archive · {String(initialProjects.length).padStart(2, '0')} systems
        </p>
        <h1 className="title max-w-3xl">
          Things I've built
          <br />
          <span className="text-[var(--accent)]">and measured.</span>
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">
          A selection of production experiments, platform work, and research translated into working
          software.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-5 border-y grid-line py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          <SlidersHorizontal size={15} className="mr-2 shrink-0 text-[var(--muted)]" />
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={
                filter === c ? { color: 'var(--paper)', backgroundColor: 'var(--ink)' } : undefined
              }
              className={`whitespace-nowrap px-3 py-2 font-mono text-[11px] ${
                filter === c ? '' : 'text-[var(--muted)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 border-b grid-line pb-2">
          <Search size={16} className="text-[var(--muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects"
            className="w-full bg-transparent text-sm outline-none md:w-44"
          />
        </label>
      </div>

      <div>
        {shown.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
        {!shown.length && (
          <div className="border-t grid-line py-16 text-center text-[var(--muted)]">
            No projects found. Try another search.
          </div>
        )}
      </div>
    </main>
  );
}

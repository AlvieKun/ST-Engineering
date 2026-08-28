'use client';

import { useState } from 'react';
import type { Post } from '@/lib/content';
import PostCard from '@/components/PostCard';

export default function BlogClient({ initialPosts }: { initialPosts: Post[] }) {
  const [tag, setTag] = useState('All');

  const tags = ['All', ...Array.from(new Set(initialPosts.flatMap((p) => p.tags)))];

  const shown = tag === 'All' ? initialPosts : initialPosts.filter((p) => p.tags.includes(tag));

  return (
    <main className="container py-20">
      <div className="mb-16 grid gap-8 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="eyebrow mb-5">
            Technical journal · {String(initialPosts.length).padStart(2, '0')} entries
          </p>
          <h1 className="title">
            Notes from
            <br />
            <span className="text-[var(--accent)]">the work.</span>
          </h1>
        </div>
        <p className="max-w-md self-end text-lg leading-8 text-[var(--muted)]">
          Build logs, benchmark notes, and honest accounts of the decisions behind useful AI systems.
        </p>
      </div>

      <div className="mb-7 flex gap-2 overflow-x-auto border-y grid-line py-4">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            style={
              tag === t ? { color: 'var(--paper)', backgroundColor: 'var(--ink)' } : undefined
            }
            className={`whitespace-nowrap px-3 py-2 font-mono text-[11px] ${
              tag === t ? '' : 'text-[var(--muted)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        {shown.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
        {!shown.length && (
          <div className="border-t grid-line py-16 text-center text-[var(--muted)]">
            No posts found with this tag.
          </div>
        )}
      </div>
    </main>
  );
}

import Link from 'next/link';
import { Edit3, ExternalLink, Plus } from 'lucide-react';
import { getAllPosts } from '@/lib/content';

export default async function AdminBlog() {
  const posts = await getAllPosts();

  return (
    <main className="container py-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-4">CMS / Writing</p>
          <h1 className="title">Editorial desk.</h1>
        </div>
        <Link
          href="/admin/blog/new"
          style={{ color: 'var(--paper)', backgroundColor: 'var(--ink)' }}
          className="flex items-center gap-2 px-4 py-3 font-mono text-xs"
        >
          <Plus size={14} /> New post
        </Link>
      </div>

      <div className="overflow-x-auto border-t grid-line">
        <div className="grid min-w-[650px] grid-cols-[2fr_1fr_1fr_100px] gap-4 border-b grid-line py-3 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
          <span>Title</span>
          <span>Project</span>
          <span>Published</span>
          <span>Actions</span>
        </div>

        {posts.map((p) => (
          <div
            key={p.id}
            className="grid min-w-[650px] grid-cols-[2fr_1fr_1fr_100px] gap-4 border-b grid-line py-5 text-sm items-center"
          >
            <span className="font-bold">{p.title}</span>
            <span className="text-xs text-[var(--muted)]">
              {p.project?.title || '—'}
            </span>
            <span className="font-mono text-xs">
              {p.publishStatus === 'PUBLISHED'
                ? p.publishedAt
                  ? new Date(p.publishedAt).toLocaleDateString()
                  : 'Published'
                : p.publishStatus}
            </span>
            <span className="flex gap-3">
              <Link href={`/blog/${p.slug}`} aria-label="Preview">
                <ExternalLink size={15} />
              </Link>
              <Link href={`/admin/blog/${p.id}`} aria-label="Edit">
                <Edit3 size={15} />
              </Link>
            </span>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="py-16 text-center text-[var(--muted)]">
            No posts yet. Write your first post.
          </div>
        )}
      </div>
    </main>
  );
}

import Link from 'next/link';
import { ArrowRight, FilePlus2, FolderKanban, Mail } from 'lucide-react';
import { getAllProjects, getAllPosts, getProjectCounts, getPostCounts } from '@/lib/content';
import { prisma } from '@/lib/prisma';
import AdminLogout from './AdminLogout';

export const dynamic = 'force-dynamic';

export default async function Admin() {
  let projects: any[] = [];
  let posts: any[] = [];
  let projectCounts = { total: 0, published: 0, scheduled: 0, drafts: 0 };
  let postCounts = { total: 0, published: 0, scheduled: 0, drafts: 0 };
  let dbError: string | null = null;
  let unreadMessages = 0;

  try {
    [projects, posts, projectCounts, postCounts] = await Promise.all([
      getAllProjects(),
      getAllPosts(),
      getProjectCounts(),
      getPostCounts(),
    ]);
    if (process.env.DATABASE_URL) {
      unreadMessages = await prisma.contactMessage.count({ where: { read: false } });
    }
  } catch (err) {
    dbError = err instanceof Error ? err.message : 'Database query failed';
  }

  return (
    <main className="container py-16">
      <div className="flex flex-col justify-between gap-6 border-b grid-line pb-10 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-4">Private workspace</p>
          <h1 className="title">Control room.</h1>
          <p className="mt-5 text-[var(--muted)]">Manage the work that represents your work.</p>
        </div>
        <div className="flex items-center gap-5">
          <AdminLogout />
          <Link
            href="/admin/messages"
            className="flex items-center gap-1 font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)]"
          >
            <Mail size={13} />
            Messages
            {unreadMessages > 0 && (
              <span className="ml-1 rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] text-white">
                {unreadMessages}
              </span>
            )}
          </Link>
          <Link
            href="/admin/settings"
            className="font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)]"
          >
            Settings
          </Link>
          <Link
            href="/admin/projects/new"
            style={{ color: 'var(--paper)', backgroundColor: 'var(--ink)' }}
            className="flex items-center gap-2 px-4 py-3 font-mono text-xs"
          >
            <FolderKanban size={14} /> New project
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 border grid-line px-4 py-3 font-mono text-xs"
          >
            <FilePlus2 size={14} /> New post
          </Link>
        </div>
      </div>

      {dbError && (
        <div className="my-6 border-l-2 border-[var(--accent)] bg-[var(--panel)] p-4 text-sm text-[var(--accent)]">
          Database error: {dbError}. Ensure DATABASE_URL is set in Vercel environment variables.
        </div>
      )}

      <div className="grid gap-3 py-10 md:grid-cols-4">
        {[
          ['Projects', projectCounts.total],
          ['Published', projectCounts.published],
          ['Scheduled', projectCounts.scheduled + postCounts.scheduled],
          ['Drafts', projectCounts.drafts + postCounts.drafts],
        ].map(([label, value]) => (
          <div key={String(label)} className="border grid-line p-5">
            <div className="font-mono text-xs text-[var(--muted)]">{label}</div>
            <div className="mt-3 text-4xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <AdminList title="Projects" href="/admin/projects">
          {projects.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="flex justify-between border-t grid-line py-4 text-sm"
            >
              <span>{p.title}</span>
              <span className="font-mono text-xs text-[var(--muted)]">{p.publishStatus}</span>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="border-t grid-line py-4 text-sm text-[var(--muted)]">
              {dbError ? 'Unable to load projects.' : 'No projects yet.'}
            </div>
          )}
        </AdminList>

        <AdminList title="Recent writing" href="/admin/blog">
          {posts.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="flex justify-between border-t grid-line py-4 text-sm"
            >
              <span>{p.title}</span>
              <span className="font-mono text-xs text-[var(--muted)]">{p.publishStatus}</span>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="border-t grid-line py-4 text-sm text-[var(--muted)]">
              {dbError ? 'Unable to load posts.' : 'No posts yet.'}
            </div>
          )}
        </AdminList>
      </div>
    </main>
  );
}

function AdminList({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link href={href} className="flex items-center gap-1 font-mono text-xs text-[var(--accent)]">
          Manage <ArrowRight size={13} />
        </Link>
      </div>
      {children}
    </section>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getPostBySlug, getProjectBySlug } from '@/lib/content';

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const project = post.projectId ? await getProjectBySlug(post.projectId) : null;

  return (
    <main className="container py-16">
      <Link
        href="/blog"
        className="mb-16 inline-flex items-center gap-2 font-mono text-xs text-[var(--muted)]"
      >
        <ArrowLeft size={14} /> Back to writing
      </Link>

      <article className="mx-auto max-w-4xl">
        <header className="border-b grid-line pb-12">
          <div className="mb-6 flex flex-wrap gap-4 font-mono text-xs text-[var(--muted)]">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
            {post.tags.map((t) => (
              <span key={t} className="text-[var(--accent)]">
                #{t}
              </span>
            ))}
          </div>
          <h1 className="title max-w-3xl">{post.title}</h1>
          <p className="mt-7 max-w-2xl text-xl leading-8 text-[var(--muted)]">
            {post.excerpt}
          </p>
          {project && (
            <Link
              href={`/projects/${project.slug}`}
              className="mt-8 inline-flex items-center gap-2 border grid-line px-4 py-3 font-mono text-xs"
            >
              Part of: {project.title}
              <ArrowUpRight size={14} />
            </Link>
          )}
        </header>

        <div className="prose-tech py-14">{render(post.content)}</div>
      </article>
    </main>
  );
}

function render(text: string) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
    if (line.startsWith('```')) return null;
    if (line.startsWith('const '))
      return (
        <pre key={i}>
          <code>{line}</code>
        </pre>
      );
    return line ? <p key={i}>{line}</p> : <div key={i} className="h-3" />;
  });
}

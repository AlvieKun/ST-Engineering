import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, FileText } from 'lucide-react';
import { getProjectBySlug, getRelatedPosts } from '@/lib/content';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);

  if (!p) notFound();

  const related = await getRelatedPosts(p.id);

  return (
    <main className="container py-16">
      <Link
        href="/projects"
        className="mb-14 inline-flex items-center gap-2 font-mono text-xs text-[var(--muted)]"
      >
        <ArrowLeft size={14} /> Back to projects
      </Link>

      <header className="grid gap-10 border-b grid-line pb-16 md:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="mb-6 flex gap-4">
            <span className="eyebrow">{p.category}</span>
            <span className="font-mono text-xs text-[var(--muted)]">
              {p.status} · {p.year}
            </span>
          </div>
          <h1 className="title">{p.title}</h1>
          <p className="mt-7 max-w-xl text-xl leading-8 text-[var(--muted)]">
            {p.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {Object.entries(p.links).map(([key, url]) => (
              <a
                key={key}
                href={url}
                className="flex items-center gap-2 border grid-line px-4 py-2 font-mono text-xs capitalize"
              >
                {key}
                <ArrowUpRight size={13} />
              </a>
            ))}
            {p.pitchDeckUrl && (
              <a
                href={p.pitchDeckUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border grid-line px-4 py-2 font-mono text-xs text-[var(--accent)]"
              >
                <FileText size={13} />
                View Pitch Deck
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </div>
        <div className="flex items-end">
          {p.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.imageUrl}
              alt={p.title}
              className="w-full border border-[var(--ink)] object-cover"
            />
          ) : (
            <div className="w-full border border-[var(--ink)] bg-[var(--panel)] p-6 font-mono text-xs leading-7">
              <span className="text-[var(--accent)]">// architecture</span>
              <br />
              {p.architecture.split(' → ').map((x, i, arr) => (
                <span key={x}>
                  {x}
                  {i < arr.length - 1 && (
                    <>
                      <br />
                      <span className="text-[var(--accent)]">↓</span>
                      <br />
                    </>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Cover image banner (if image exists, show it full-width above metrics) */}
      {p.imageUrl && (
        <section className="border-b grid-line py-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.imageUrl}
            alt={p.title}
            className="mx-auto max-h-[480px] w-full object-contain"
          />
        </section>
      )}

      {p.metrics.length > 0 && (
        <section className="grid gap-12 border-b grid-line py-16 md:grid-cols-[180px_1fr]">
          <div className="eyebrow">01 / At a glance</div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {p.metrics.map((m) => (
              <div key={m.label} className="border grid-line p-5">
                <div className="text-3xl font-bold tracking-tight">{m.value}</div>
                <div className="mt-2 font-mono text-xs text-[var(--accent)]">{m.label}</div>
                <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{m.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <ArticleSection n="02" title="The problem" text={p.problem} />
      <ArticleSection n="03" title="The solution" text={p.solution} />
      <ArticleSection n="04" title="Technical implementation" text={p.implementation} />
      <ArticleSection n="05" title="Engineering decisions" text={p.decisions} />

      <section className="grid gap-12 border-t grid-line py-16 md:grid-cols-[180px_1fr]">
        <div className="eyebrow">06 / Failure analysis</div>
        <div className="border-l-2 border-[var(--accent)] pl-6">
          <p className="prose-tech whitespace-pre-line">
            {p.failure ||
              'This project is still early; failure analysis will be added as experiments run.'}
          </p>
        </div>
      </section>

      <ArticleSection n="07" title="Lessons learned" text={p.lessons} />

      {related.length > 0 && (
        <section className="border-t grid-line py-16">
          <p className="eyebrow mb-7">Related writing</p>
          <div className="grid gap-3 md:grid-cols-2">
            {related.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.id}
                className="flex items-center justify-between border grid-line p-5 font-bold hover:text-[var(--accent)]"
              >
                {post.title}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function ArticleSection({
  n,
  title,
  text,
}: {
  n: string;
  title: string;
  text: string;
}) {
  return (
    <section className="grid gap-12 border-t grid-line py-16 md:grid-cols-[180px_1fr]">
      <div className="eyebrow">
        {n} / {title}
      </div>
      <p className="prose-tech whitespace-pre-line">{text}</p>
    </section>
  );
}

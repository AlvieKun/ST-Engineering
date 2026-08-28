import Link from 'next/link';
import { ArrowRight, Mail, MapPin } from 'lucide-react';
import { getPublishedProjects, getPublishedPosts, getSiteSettingsData } from '@/lib/content';
import ProjectCard from '@/components/ProjectCard';
import PostCard from '@/components/PostCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [projects, posts, settings] = await Promise.all([
    getPublishedProjects(),
    getPublishedPosts(),
    getSiteSettingsData(),
  ]);

  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <main>
      <section className="container border-b grid-line py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="eyebrow mb-7">Available for ambitious problems · 2026</p>
            <h1 className="display max-w-5xl">
              {settings.adminEmail ? 'Sarthak Tallamraju' : 'Sarthak Tallamraju'}
              <br />
              <span className="text-[var(--accent)]">builds systems.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--muted)]">
              Building AI projects, software, developer tools, and experimental systems — turning
              ideas into things that actually work.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/projects"
                style={{ color: 'var(--paper)', backgroundColor: 'var(--ink)' }}
                className="flex items-center gap-3 px-5 py-3 text-sm font-bold"
              >
                View projects <ArrowRight size={16} />
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-3 border grid-line px-5 py-3 text-sm font-bold"
              >
                Read the journal <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-end border-l grid-line pl-6 md:pl-10">
            <p className="font-mono text-xs leading-6 text-[var(--muted)]">01 / POSITION</p>
            <p className="mt-5 text-2xl font-bold leading-tight">
              Computer Science & Design student
              <br />→ Builder / AI explorer
            </p>
            <p className="mt-6 text-sm leading-6 text-[var(--muted)]">
              Second-year student at SUTD. I build from scratch, experiment with AI and emerging
              technologies, and work out how to turn interesting ideas into working products.
            </p>
            <div className="mt-8 flex items-center gap-2 font-mono text-xs">
              <MapPin size={14} className="text-[var(--accent)]" /> Singapore · SUTD
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-4">Selected work</p>
            <h2 className="title">Proof, not promises.</h2>
          </div>
          <Link
            href="/projects"
            className="hidden items-center gap-2 font-mono text-xs md:flex"
          >
            All projects <ArrowRight size={14} />
          </Link>
        </div>
        <div>
          {featuredProjects.length > 0 ? (
            featuredProjects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)
          ) : (
            <div className="border-t grid-line py-16 text-center text-[var(--muted)]">
              No projects published yet.
            </div>
          )}
        </div>
      </section>

      <section className="bg-[var(--panel)] py-20">
        <div className="container">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="eyebrow mb-4">From the notebook</p>
              <h2 className="title">
                Build logs
                <br />
                & field notes.
              </h2>
            </div>
            <div>
              {posts.length > 0 ? (
                posts.slice(0, 3).map((p) => <PostCard key={p.id} post={p} />)
              ) : (
                <div className="py-8 text-[var(--muted)]">No posts published yet.</div>
              )}
              <Link
                href="/blog"
                className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-[var(--accent)]"
              >
                Browse all writing <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container border-t grid-line py-16">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="eyebrow mb-4">Open channel</p>
            <h2 className="text-3xl font-bold tracking-tight">Have a hard problem?</h2>
          </div>
          <a
            href="mailto:sarthak.tallamraju@gmail.com"
            className="flex items-center gap-3 text-lg font-bold hover:text-[var(--accent)]"
          >
            <Mail size={18} /> sarthak.tallamraju@gmail.com <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </main>
  );
}

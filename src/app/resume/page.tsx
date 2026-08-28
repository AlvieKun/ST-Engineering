import { Download } from 'lucide-react';
import { getSiteSettingsData } from '@/lib/content';

export default async function Resume() {
  const site = await getSiteSettingsData();

  if (!site.resumeVisible || !site.resumeUrl) {
    return (
      <main className="container py-20">
        <p className="eyebrow mb-5">Resume</p>
        <h1 className="title">
          Not public
          <br />
          <span className="text-[var(--accent)]">yet.</span>
        </h1>
        <p className="prose-tech mt-8">The resume is currently private.</p>
      </main>
    );
  }

  return (
    <main className="container py-20">
      <div className="flex flex-col justify-between gap-8 border-b grid-line pb-12 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-5">Profile / selected focus</p>
          <h1 className="title">
            Student builder.
            <br />
            <span className="text-[var(--accent)]">Serious about systems.</span>
          </h1>
        </div>
        <a
          href={site.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border grid-line px-4 py-3 font-mono text-xs"
        >
          <Download size={14} /> Resume link
        </a>
      </div>

      <div className="grid gap-12 py-12 md:grid-cols-[180px_1fr]">
        <div className="eyebrow">Education</div>
        <div>
          <div className="border-t grid-line py-5">
            <div className="flex justify-between font-mono text-xs text-[var(--muted)]">
              <span>Singapore University of Technology and Design (SUTD)</span>
              <span>Year 2</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold">Computer Science & Design</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
              Exploring the intersection of software, AI, design, and emerging technologies through
              hands-on building.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-12 border-t grid-line py-12 md:grid-cols-[180px_1fr]">
        <div className="eyebrow">Focus</div>
        <div className="flex flex-wrap gap-2">
          {[
            'AI projects',
            'Software',
            'Developer tools',
            'Experimental systems',
            'Emerging technologies',
          ].map((x) => (
            <span key={x} className="border grid-line px-3 py-2 font-mono text-xs">
              {x}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}

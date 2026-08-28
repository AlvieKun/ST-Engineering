import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function About() {
  return (
    <main className="container py-20">
      <div className="grid gap-14 md:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="eyebrow mb-5">About / building from zero</p>
          <h1 className="title">
            The work is
            <br />
            <span className="text-[var(--accent)]">the point.</span>
          </h1>
        </div>
        <div className="prose-tech">
          <p>
            I am a second-year Computer Science & Design student at the Singapore University of
            Technology and Design. I like building things from scratch, experimenting with AI and
            emerging technologies, and figuring out how to turn interesting ideas into working
            products.
          </p>
          <p>
            I enjoy the stretch between an idea and a working artifact: learning the underlying
            technology, making tradeoffs, and shipping something that can be tested in the real
            world.
          </p>

          <h2>Education</h2>
          <p>
            2nd year · Singapore University of Technology and Design (SUTD)
            <br />
            Computer Science & Design
          </p>

          <h2>Current interests</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              'AI',
              'Software',
              'Emerging technologies',
              'Developer tools',
              'Experimental systems',
              'Product building',
            ].map((x) => (
              <span key={x} className="border grid-line px-3 py-2 font-mono text-xs">
                {x}
              </span>
            ))}
          </div>

          <h2>Elsewhere</h2>
          <div className="flex flex-col gap-3 text-base font-bold">
            <a
              href="https://github.com/AlvieKun"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2"
            >
              GitHub <ArrowUpRight size={14} />
            </a>
            <a
              href="https://www.linkedin.com/in/sarthak-tallamraju-33233720a/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2"
            >
              LinkedIn <ArrowUpRight size={14} />
            </a>
            <Link href="/contact" className="flex items-center gap-2">
              Email <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

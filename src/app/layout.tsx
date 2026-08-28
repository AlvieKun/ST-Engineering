import './globals.css';
import Link from 'next/link';
import { GitBranch, BriefcaseBusiness, ArrowUpRight } from 'lucide-react';
import { getSiteSettingsData } from '@/lib/content';

export const metadata = {
  title: 'Sarthak Tallamraju — Builder',
  description:
    'Sarthak Tallamraju builds AI projects, software, developer tools, and experimental systems.',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b grid-line">
          <div className="container flex h-20 items-center justify-between">
            <Link href="/" className="font-mono text-sm font-bold tracking-tight">
              ST<span className="text-[var(--accent)]">/</span>ENGINEERING
            </Link>
            <nav className="hidden gap-8 text-sm md:flex">
              <Link href="/projects">Projects</Link>
              <Link href="/blog">Writing</Link>
              <Link href="/about">About</Link>
            </nav>
            <div className="flex items-center gap-3 text-xs">
              <a
                href="https://github.com/AlvieKun"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <GitBranch size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/sarthak-tallamraju-33233720a/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <BriefcaseBusiness size={16} />
              </a>
              <Link href="/admin" className="border border-[var(--ink)] px-3 py-2 font-mono">
                Admin
              </Link>
            </div>
          </div>
        </header>
        {children}
        <footer className="mt-24 border-t grid-line">
          <div className="container flex flex-col justify-between gap-6 py-10 text-sm text-[var(--muted)] md:flex-row">
            <span>© 2026 Sarthak Tallamraju. Built with curiosity.</span>
            <div className="flex gap-5">
              <Link href="/contact">Get in touch</Link>
              <Link href="/blog">Technical writing</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

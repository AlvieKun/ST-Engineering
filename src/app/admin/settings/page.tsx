'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { updateSiteSettings } from '../actions';

export default function Settings() {
  const [visible, setVisible] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load current settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setVisible(data.settings.resumeVisible);
          setResumeUrl(data.settings.resumeUrl);
        }
      })
      .catch(() => {});
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let newResumeUrl = resumeUrl;

      // Upload file if provided
      if (file) {
        const body = new FormData();
        body.append('file', file);
        body.append('folder', 'resume');
        const res = await fetch('/api/storage/upload', { method: 'POST', body });
        if (!res.ok) {
          setMessage('Resume upload failed.');
          setLoading(false);
          return;
        }
        const data = await res.json();
        newResumeUrl = data.url;
      }

      // If enabling visibility without a file or URL
      if (visible && !newResumeUrl && !file) {
        setMessage('Upload a resume file before enabling public visibility.');
        setLoading(false);
        return;
      }

      // Save settings to database
      await updateSiteSettings({
        resumeVisible: visible,
        resumeUrl: newResumeUrl,
      });

      setResumeUrl(newResumeUrl);
      setMessage(visible ? 'Resume visibility enabled.' : 'Resume visibility disabled.');
    } catch {
      setMessage('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container max-w-3xl py-16">
      <Link href="/admin" className="font-mono text-xs text-[var(--muted)]">
        ← Dashboard
      </Link>
      <div className="mb-10 mt-8">
        <p className="eyebrow mb-4">CMS / Settings</p>
        <h1 className="title">Public profile.</h1>
      </div>

      <form onSubmit={save} className="space-y-8">
        <section className="border-t grid-line pt-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold">Resume visibility</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
                Keep this off until you are ready for visitors to access your resume.
              </p>
            </div>
            <button
              type="button"
              aria-pressed={visible}
              onClick={() => setVisible((v) => !v)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                visible ? 'bg-[var(--accent)]' : 'bg-[var(--line)]'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-[var(--paper)] transition-transform ${
                  visible ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
              <span className="sr-only">{visible ? 'Disable' : 'Enable'} resume visibility</span>
            </button>
          </div>

          {visible && (
            <label className="mt-7 block border-l-2 border-[var(--accent)] pl-5">
              <span className="mb-3 block font-mono text-xs text-[var(--muted)]">
                Upload resume · PDF recommended
              </span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm"
              />
              <span className="mt-2 block text-xs text-[var(--muted)]">
                {resumeUrl
                  ? 'A resume is currently uploaded. Upload a new file to replace it.'
                  : 'A file is required before visibility can be enabled.'}
              </span>
            </label>
          )}
        </section>

        {message && (
          <p role="status" className="border-l-2 border-[var(--accent)] pl-4 text-sm">
            {message}
          </p>
        )}

        <button
          disabled={loading}
          style={{ color: 'var(--paper)', backgroundColor: 'var(--ink)' }}
          className="px-5 py-3 font-mono text-xs disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save settings'}
        </button>
      </form>
    </main>
  );
}

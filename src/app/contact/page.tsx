'use client';

import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { submitContactForm } from './actions';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSending(true);

    const f = new FormData(e.currentTarget);

    try {
      const result = await submitContactForm({
        name: String(f.get('name') || ''),
        email: String(f.get('email') || ''),
        subject: String(f.get('subject') || ''),
        message: String(f.get('message') || ''),
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Something went wrong while sending your message. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="container py-20">
      <p className="eyebrow mb-5">Contact</p>
      <h1 className="title max-w-3xl">
        Let&apos;s work on
        <br />
        <span className="text-[var(--accent)]">the hard part.</span>
      </h1>
      <p className="prose-tech mt-8">
        For senior engineering opportunities, AI platform conversations, or thoughtful technical
        collaboration, send a note.
      </p>

      {submitted ? (
        <div className="mt-10 max-w-xl border grid-line p-8">
          <div className="mb-4 text-2xl">✓</div>
          <h2 className="text-xl font-bold">Message sent successfully.</h2>
          <p className="mt-3 text-[var(--muted)]">
            Thanks for reaching out. I&apos;ll get back to you soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 max-w-xl space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block font-mono text-xs text-[var(--muted)]">Name</span>
              <input
                name="name"
                required
                maxLength={100}
                placeholder="Your name"
                className="w-full border-b grid-line bg-transparent px-0 py-3 text-lg outline-none focus:border-[var(--accent)]"
              />
            </label>
            <label className="block">
              <span className="mb-2 block font-mono text-xs text-[var(--muted)]">Email</span>
              <input
                name="email"
                type="email"
                required
                maxLength={200}
                placeholder="you@example.com"
                className="w-full border-b grid-line bg-transparent px-0 py-3 text-lg outline-none focus:border-[var(--accent)]"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block font-mono text-xs text-[var(--muted)]">Subject</span>
            <input
              name="subject"
              required
              maxLength={200}
              placeholder="What is this about?"
              className="w-full border-b grid-line bg-transparent px-0 py-3 text-lg outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-mono text-xs text-[var(--muted)]">Message</span>
            <textarea
              name="message"
              required
              rows={6}
              maxLength={5000}
              placeholder="Tell me about your project or idea..."
              className="w-full border grid-line bg-transparent p-4 font-mono text-sm leading-6 outline-none focus:border-[var(--accent)]"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="border-l-2 border-[var(--accent)] pl-4 text-sm text-[var(--accent)]"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            style={{ color: 'var(--paper)', backgroundColor: 'var(--ink)' }}
            className="flex items-center gap-3 px-5 py-3 font-mono text-sm disabled:opacity-50"
          >
            <Send size={16} />
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}

      <div className="mt-12 border-t grid-line pt-8">
        <a
          href="mailto:sarthak_tallamraju@mymail.sutd.edu.sg"
          className="flex items-center gap-2 font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)]"
        >
          <Mail size={14} /> sarthak_tallamraju@mymail.sutd.edu.sg
        </a>
      </div>
    </main>
  );
}

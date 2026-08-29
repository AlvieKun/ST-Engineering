'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        setError(
          'Supabase browser configuration is incomplete. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in Vercel.'
        );
        return;
      }

      const client = createSupabaseBrowserClient();
      const { data, error: signInError } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!data.user) {
        setError('Sign-in did not return a user session.');
        return;
      }

      // Client-side admin check (middleware is the real gate)
      const adminId = process.env.NEXT_PUBLIC_ADMIN_USER_ID;
      if (adminId && data.user.id !== adminId) {
        await client.auth.signOut();
        setError(
          `This account (${data.user.email}) is not authorized. Use the admin account instead.`
        );
        return;
      }

      // Navigate to admin dashboard — use replace so back button doesn't loop
      router.replace('/admin');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error';
      setError(`Unable to reach Supabase: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container flex min-h-[70vh] max-w-xl items-center py-20">
      <div className="w-full">
        <p className="eyebrow mb-5">Private workspace / Authentication</p>
        <h1 className="title">Welcome back.</h1>
        <p className="mt-6 text-[var(--muted)]">
          Sign in with the portfolio&apos;s Supabase account.
        </p>

        <form onSubmit={submit} className="mt-10 space-y-6">
          <label className="block">
            <span className="mb-2 block font-mono text-xs text-[var(--muted)]">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b grid-line bg-transparent py-3 outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-mono text-xs text-[var(--muted)]">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b grid-line bg-transparent py-3 outline-none focus:border-[var(--accent)]"
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
            disabled={loading}
            style={{ color: 'var(--paper)', backgroundColor: 'var(--ink)' }}
            className="px-5 py-3 font-mono text-xs disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}

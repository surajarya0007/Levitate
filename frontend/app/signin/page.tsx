'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { supabase } from '../../utils/supabase';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/projects');
      } else {
        setChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push('/projects');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-zinc-50 dark:from-background-dark dark:via-background-dark dark:to-black text-zinc-900 dark:text-zinc-50 relative overflow-hidden">
      {checking ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div>
        </div>
      ) : (
      <>
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-zinc-300/40 to-transparent blur-3xl dark:from-zinc-700/40"></div>
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-400/30 to-transparent blur-3xl"></div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-14">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <Image src="/Levitate.png" alt="Levitate Logo" width={32} height={32} className="w-8 h-8 rounded-lg" />
            <span className="text-lg font-bold tracking-tight">Levitate</span>
          </Link>
          <Link href="/signup" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">
            Create account
          </Link>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div className="rounded-2xl border border-zinc-200 dark:border-border-dark bg-white/80 dark:bg-surface-dark/80 shadow-xl backdrop-blur p-8">
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Sign in to continue building with Levitate.</p>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-medium">
                Email address
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 rounded-lg border border-zinc-200 dark:border-border-dark bg-white dark:bg-black/40 px-3 text-sm outline-none focus:border-zinc-500 dark:focus:border-zinc-400"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Password
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 rounded-lg border border-zinc-200 dark:border-border-dark bg-white dark:bg-black/40 px-3 text-sm outline-none focus:border-zinc-500 dark:focus:border-zinc-400"
                />
              </label>

              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-11 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 border-t border-zinc-200 dark:border-border-dark pt-5 text-sm text-zinc-600 dark:text-zinc-400">
              New to Levitate?
              <Link href="/signup" className="ml-2 font-semibold text-zinc-900 dark:text-white hover:underline cursor-pointer">
                Create an account
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Why Levitate</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight">
              Build, deploy, and iterate faster with an autonomous stack.
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 max-w-xl">
              From idea to production in one flow. Track your builds, monitor deployments, and share progress with your team.
            </p>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

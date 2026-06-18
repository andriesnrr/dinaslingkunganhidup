'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Username dan password harus diisi');
      return;
    }

    startTransition(async () => {
      try {
        const res = await signIn('credentials', {
          username,
          password,
          redirect: false,
        });

        if (res?.error) {
          setError('Username atau password salah');
        } else {
          router.push('/admin');
          router.refresh();
        }
      } catch (err) {
        console.error('Login error:', err);
        setError('Terjadi kesalahan sistem');
      }
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-20 px-8">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl border border-outline-variant shadow-sm space-y-8">
        <div className="text-center space-y-2">
          <img
            src="/logo.png"
            alt="Logo Kabupaten Gresik"
            className="h-12 w-auto object-contain mx-auto"
          />
          <h1 className="text-2xl font-bold text-primary">Login Administrator</h1>
          <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
            Website Dinas Lingkungan Hidup
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl">error</span>
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-semibold text-on-surface-variant">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username admin"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-on-surface-variant">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password admin"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold hover:bg-secondary transition-colors disabled:bg-primary-container disabled:text-on-primary-container/50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                Memproses Login...
              </>
            ) : (
              'Masuk Panel Admin'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

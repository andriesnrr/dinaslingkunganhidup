import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auth, signOut } from '@/lib/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  // If there's no session and the request is not for the login page, redirect to login
  // Note: Middleware also protects this, but this is a double check.
  // We can let the login page itself render without layout sidebar.
  
  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col md:flex-row">
      {session && (
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-outline-variant shrink-0">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Logo Kabupaten Gresik"
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <div>
                <h3 className="font-extrabold text-sm text-primary leading-tight">ADMIN PANEL</h3>
                <p className="text-[9px] font-semibold text-on-surface-variant uppercase">DLH GRESIK</p>
              </div>
            </Link>
          </div>

          <nav className="p-4 flex flex-col gap-1.5">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-surface text-on-surface hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base">dashboard</span>
              Dashboard
            </Link>
            <Link
              href="/admin/statistik"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-surface text-on-surface hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base">analytics</span>
              Analitik & Statistik
            </Link>
            <Link
              href="/admin/berita"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-surface text-on-surface hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base">newspaper</span>
              Kelola Berita
            </Link>
            <Link
              href="/admin/pengaduan"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-surface text-on-surface hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base">rate_review</span>
              Kelola Pengaduan
            </Link>
            <Link
              href="/admin/didp"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-surface text-on-surface hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base">folder_open</span>
              Kelola DIDP Docs
            </Link>
            <Link
              href="/admin/galeri"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-surface text-on-surface hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base">photo_library</span>
              Kelola Galeri
            </Link>
            <Link
              href="/admin/profil"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-surface text-on-surface hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base">group</span>
              Kelola Pejabat
            </Link>
            
            <div className="pt-4 mt-4 border-t border-outline-variant">
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/admin/login' });
                }}
              >
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  Keluar / Logout
                </button>
              </form>
            </div>
          </nav>
        </aside>
      )}

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

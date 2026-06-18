import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const revalidate = 10; // Revalidate every 10 seconds

async function getStatsData() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  return Promise.all([
    prisma.pengaduan.count(),
    prisma.berita.count(),
    prisma.dokumen.count(),
    prisma.fotoGaleri.count(),
    prisma.pageView.count({
      where: {
        timestamp: {
          gte: startOfToday,
        },
      },
    }),
    prisma.pageView.count(),
    prisma.activeSession.count({
      where: {
        lastSeen: {
          gte: fiveMinutesAgo,
        },
      },
    }),
  ]);
}

export default async function AdminDashboardPage() {
  const session = await auth();

  // Fetch count stats
  const [
    complaintCount,
    newsCount,
    docCount,
    photoCount,
    todayVisits,
    totalVisits,
    onlineUsers
  ] = await getStatsData();

  // Fetch 5 latest complaints
  const latestComplaints = await prisma.pengaduan.findMany({
    orderBy: { tanggalMasuk: 'desc' },
    take: 5,
  });

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-primary">Dashboard Utama</h1>
        <p className="text-sm text-on-surface-variant">
          Selamat datang kembali, <span className="font-bold text-on-surface">{session?.user?.name || 'Administrator'}</span>. Berikut adalah ringkasan data situs DLH Gresik.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-2xl">rate_review</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Pengaduan Masuk</p>
            <p className="text-3xl font-extrabold text-on-surface">{complaintCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-2xl">newspaper</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Total Berita</p>
            <p className="text-3xl font-extrabold text-on-surface">{newsCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-2xl">folder_open</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Dokumen DIDP</p>
            <p className="text-3xl font-extrabold text-on-surface">{docCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-2xl">photo_library</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Foto Galeri</p>
            <p className="text-3xl font-extrabold text-on-surface">{photoCount}</p>
          </div>
        </div>
      </div>

      {/* Visitor Stats Row */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-primary">Statistik Pengunjung (Real-time)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <span className="material-symbols-outlined text-2xl">sensors</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Pengunjung Online</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-extrabold text-on-surface">{Math.max(1, onlineUsers)}</p>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">today</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Kunjungan Hari Ini</p>
              <p className="text-3xl font-extrabold text-on-surface">{todayVisits.toLocaleString('id-ID')}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">analytics</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Total Kunjungan</p>
              <p className="text-3xl font-extrabold text-on-surface">{totalVisits.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Complaints Section */}
      <div className="bg-white rounded-3xl border border-outline-variant shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary">Pengaduan Terbaru</h2>
          <Link
            href="/admin/pengaduan"
            className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1"
          >
            Lihat Semua <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="py-4 px-2">Nama Pelapor</th>
                <th className="py-4 px-2">Kategori</th>
                <th className="py-4 px-2">Tanggal</th>
                <th className="py-4 px-2">Status</th>
                <th className="py-4 px-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant text-on-surface">
              {latestComplaints.map((c) => (
                <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-2 font-semibold">{c.namaLengkap}</td>
                  <td className="py-4 px-2 uppercase text-xs font-bold text-primary">{c.kategori}</td>
                  <td className="py-4 px-2 text-on-surface-variant">
                    {new Date(c.tanggalMasuk).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.status === 'diterima'
                          ? 'bg-primary-container text-on-primary-container'
                          : c.status === 'diproses'
                          ? 'bg-tertiary-container text-on-tertiary-container'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <Link
                      href={`/admin/pengaduan#id-${c.id}`}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors"
                    >
                      Detail Laporan
                    </Link>
                  </td>
                </tr>
              ))}
              {latestComplaints.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant">
                    Belum ada pengaduan masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { prisma } from '@/lib/prisma';

export const revalidate = 5; // Revalidate every 5 seconds to keep it live

async function getAnalyticsData() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  // 1. Basic Stats
  const [totalViews, todayViews, activeSessions] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({
      where: {
        timestamp: {
          gte: startOfToday,
        },
      },
    }),
    prisma.activeSession.count({
      where: {
        lastSeen: {
          gte: fiveMinutesAgo,
        },
      },
    }),
  ]);

  // 2. Popular Pages (Group by Path)
  const popularPagesRaw = await prisma.pageView.groupBy({
    by: ['path'],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
    take: 10,
  });

  const popularPages = popularPagesRaw.map((item) => ({
    path: item.path,
    count: item._count.id,
  }));

  // 3. Recent Visit Logs
  const recentLogs = await prisma.pageView.findMany({
    orderBy: {
      timestamp: 'desc',
    },
    take: 25,
  });

  return {
    totalViews,
    todayViews,
    activeSessions,
    popularPages,
    recentLogs,
  };
}

// Map path to user-friendly page names
function getPageName(path: string): string {
  if (path === '/') return 'Beranda (Home)';
  if (path === '/profil') return 'Profil Dinas';
  if (path === '/didp') return 'Dokumen DIDP';
  if (path === '/berita') return 'Daftar Berita';
  if (path.startsWith('/berita/')) return 'Detail Berita';
  if (path === '/galeri') return 'Galeri Kegiatan';
  if (path === '/pengaduan') return 'Form Pengaduan';
  if (path === '/kontak') return 'Kontak Kami';
  return path;
}

export default async function AdminStatistikPage() {
  const data = await getAnalyticsData();

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-primary">Analitik & Statistik</h1>
        <p className="text-sm text-on-surface-variant">
          Pantau performa situs dan aktivitas pengunjung Dinas Lingkungan Hidup secara real-time.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <span className="material-symbols-outlined text-2xl">sensors</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Pengunjung Online (5 Menit Terakhir)</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-extrabold text-on-surface">{Math.max(1, data.activeSessions)}</p>
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
            <p className="text-3xl font-extrabold text-on-surface">{data.todayViews.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-2xl">analytics</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Total Kunjungan</p>
            <p className="text-3xl font-extrabold text-on-surface">{data.totalViews.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Pages */}
        <div className="bg-white rounded-3xl border border-outline-variant shadow-sm p-6 md:p-8 space-y-6 lg:col-span-1">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-base">trending_up</span>
            Halaman Populer
          </h2>
          <div className="space-y-4">
            {data.popularPages.map((page, index) => {
              const percentage = data.totalViews > 0 ? (page.count / data.totalViews) * 100 : 0;
              return (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-on-surface truncate max-w-[70%]" title={page.path}>
                      {getPageName(page.path)}
                    </span>
                    <span className="font-bold text-on-surface-variant">{page.count.toLocaleString('id-ID')} views</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${Math.max(3, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {data.popularPages.length === 0 && (
              <p className="text-sm text-on-surface-variant text-center py-4">Belum ada data halaman populer.</p>
            )}
          </div>
        </div>

        {/* Real-time Visit Logs */}
        <div className="bg-white rounded-3xl border border-outline-variant shadow-sm p-6 md:p-8 space-y-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-base">history</span>
            Log Kunjungan Terbaru
          </h2>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-xs font-bold text-on-surface-variant uppercase tracking-wider sticky top-0 bg-white z-10">
                  <th className="pb-3 px-2">Waktu</th>
                  <th className="pb-3 px-2">Halaman</th>
                  <th className="pb-3 px-2">Path URL</th>
                  <th className="pb-3 px-2 text-right">ID Sesi</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-outline-variant text-on-surface">
                {data.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-2 whitespace-nowrap text-on-surface-variant">
                      {new Date(log.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-2 font-semibold">{getPageName(log.path)}</td>
                    <td className="py-3 px-2 text-primary font-mono select-all truncate max-w-[150px]" title={log.path}>
                      {log.path}
                    </td>
                    <td className="py-3 px-2 text-right text-[10px] text-on-surface-variant font-mono">
                      {log.sessionId.substring(5, 13)}...
                    </td>
                  </tr>
                ))}
                {data.recentLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-on-surface-variant">
                      Belum ada log kunjungan terekam.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

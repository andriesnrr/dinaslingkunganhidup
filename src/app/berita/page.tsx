import React from 'react';
import { prisma } from '@/lib/prisma';
import NewsGrid from '@/components/NewsGrid';

export const revalidate = 60; // Revalidate every minute

export default async function BeritaPage() {
  const [beritaList, kategoriList, totalCount] = await Promise.all([
    prisma.berita.findMany({
      where: { isPublished: true },
      orderBy: { tanggalPublikasi: 'desc' },
      take: 50,
      include: { kategori: true },
    }),
    prisma.kategoriBerita.findMany(),
    prisma.berita.count({ where: { isPublished: true } }),
  ]);

  return (
    <div className="max-w-[1280px] mx-auto px-8 py-20">
      <div className="space-y-4 mb-12">
        <h1 className="text-3xl font-bold text-primary">Berita & Artikel Terkini</h1>
        <p className="text-on-surface-variant text-sm max-w-2xl">
          Temukan berita terbaru, pengumuman resmi, dan artikel edukatif seputar pengelolaan lingkungan hidup di Kabupaten Gresik.
        </p>
        {totalCount > 50 && (
          <p className="text-xs text-on-surface-variant">
            Menampilkan 50 berita terbaru dari {totalCount} total artikel.
          </p>
        )}
      </div>

      <NewsGrid initialNews={beritaList} categories={kategoriList} />
    </div>
  );
}

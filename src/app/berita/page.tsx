import React from 'react';
import { prisma } from '@/lib/prisma';
import NewsGrid from '@/components/NewsGrid';

export const revalidate = 60; // Revalidate every minute

export default async function BeritaPage() {
  const [beritaList, kategoriList] = await Promise.all([
    prisma.berita.findMany({
      where: { isPublished: true },
      orderBy: { tanggalPublikasi: 'desc' },
      include: { kategori: true },
    }),
    prisma.kategoriBerita.findMany(),
  ]);

  return (
    <div className="max-w-[1280px] mx-auto px-8 py-20">
      <div className="space-y-4 mb-12">
        <h1 className="text-3xl font-bold text-primary">Berita & Artikel Terkini</h1>
        <p className="text-on-surface-variant text-sm max-w-2xl">
          Temukan berita terbaru, pengumuman resmi, dan artikel edukatif seputar pengelolaan lingkungan hidup di Kabupaten Gresik.
        </p>
      </div>

      <NewsGrid initialNews={beritaList} categories={kategoriList} />
    </div>
  );
}

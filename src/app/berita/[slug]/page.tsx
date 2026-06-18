import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const revalidate = 60; // Revalidate dynamic routes every minute

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BeritaDetailPage({ params }: DetailPageProps) {
  const { slug } = await params;

  // Fetch current article
  const artikel = await prisma.berita.findUnique({
    where: { slug },
    include: { kategori: true },
  });

  if (!artikel || !artikel.isPublished) {
    notFound();
  }

  // Fetch related articles from same category
  const relatedNews = await prisma.berita.findMany({
    where: {
      kategoriId: artikel.kategoriId,
      isPublished: true,
      NOT: { id: artikel.id },
    },
    take: 3,
    orderBy: { tanggalPublikasi: 'desc' },
  });

  return (
    <div className="max-w-[900px] mx-auto px-8 py-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
        <Link href="/" className="hover:text-primary transition-colors">
          Beranda
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link href="/berita" className="hover:text-primary transition-colors">
          Berita
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface font-medium truncate max-w-xs">{artikel.judul}</span>
      </nav>

      <article className="space-y-6">
        {artikel.kategori && (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
            {artikel.kategori.nama}
          </span>
        )}

        <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface leading-tight tracking-tight">
          {artikel.judul}
        </h1>

        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-base">calendar_today</span>
          <span>
            {new Date(artikel.tanggalPublikasi).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Article Image */}
        {artikel.gambar && (
          <div className="rounded-3xl overflow-hidden shadow-md border border-outline-variant max-h-[500px]">
            <img src={artikel.gambar} alt={artikel.judul} className="w-full object-cover max-h-[500px]" />
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-lg max-w-none text-on-surface leading-relaxed whitespace-pre-line pt-4">
          {artikel.isi}
        </div>
      </article>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <div className="mt-16 pt-12 border-t border-outline-variant">
          <h2 className="text-2xl font-bold text-primary mb-8">Berita Terkait</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedNews.map((related) => (
              <div
                key={related.id}
                className="bg-white rounded-2xl overflow-hidden border border-outline-variant shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-32 bg-surface-container relative">
                  {related.gambar ? (
                    <img src={related.gambar} alt={related.judul} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/40 bg-primary/5">
                      <span className="material-symbols-outlined text-4xl">newspaper</span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-on-surface line-clamp-2 hover:text-primary transition-colors">
                    <Link href={`/berita/${related.slug}`}>{related.judul}</Link>
                  </h3>
                  <span className="text-[10px] text-on-surface-variant block">
                    {new Date(related.tanggalPublikasi).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Category {
  id: number;
  nama: string;
  slug: string;
}

interface Article {
  id: number;
  judul: string;
  slug: string;
  isi: string;
  ringkasan: string | null;
  gambar: string | null;
  tanggalPublikasi: Date | string;
  kategori: Category | null;
}

interface NewsGridProps {
  initialNews: Article[];
  categories: Category[];
}

export default function NewsGrid({ initialNews, categories }: NewsGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter articles based on search query and category
  const filteredNews = initialNews.filter((artikel) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      artikel.judul.toLowerCase().includes(q) ||
      (artikel.ringkasan?.toLowerCase().includes(q) ?? false);

    const matchesCategory = selectedCategory
      ? artikel.kategori?.slug === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-container/30 p-6 rounded-3xl border border-outline-variant">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Cari berita atau artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-2xl border border-outline-variant bg-white text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 items-center flex-wrap w-full md:w-auto justify-start md:justify-end">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider hidden lg:inline mr-2">
            Kategori:
          </span>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              selectedCategory === null
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-white text-on-surface-variant border-outline-variant hover:text-primary hover:border-primary'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-white text-on-surface-variant border-outline-variant hover:text-primary hover:border-primary'
              }`}
            >
              {cat.nama}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {filteredNews.map((artikel) => (
          <article
            key={artikel.id}
            className="bg-white rounded-3xl overflow-hidden border border-outline-variant shadow-sm group hover:shadow-md transition-all duration-300 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            {/* Thumbnail */}
            <div className="h-48 bg-surface-container relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <span className="material-symbols-outlined text-white bg-primary p-3 rounded-full shadow-md text-2xl">
                  visibility
                </span>
              </div>
              {artikel.gambar ? (
                <img
                  src={artikel.gambar}
                  alt={artikel.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/40 bg-primary/5">
                  <span className="material-symbols-outlined text-5xl">newspaper</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1 space-y-4">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]">
                  {artikel.kategori?.nama || 'Lingkungan'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">calendar_today</span>
                  {new Date(artikel.tanggalPublikasi).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <h2 className="font-bold text-lg text-on-surface line-clamp-2 hover:text-primary transition-colors leading-snug">
                <Link href={`/berita/${artikel.slug}`}>{artikel.judul}</Link>
              </h2>

              <p className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed flex-1">
                {artikel.ringkasan || artikel.isi.substring(0, 150) + '...'}
              </p>

              <div className="pt-2 shrink-0">
                <Link
                  href={`/berita/${artikel.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-outline text-primary rounded-xl text-xs font-bold hover:bg-primary/5 transition-colors"
                >
                  Baca Selengkapnya <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </div>
          </article>
        ))}

        {filteredNews.length === 0 && (
          <div className="col-span-3 text-center py-16 bg-white rounded-3xl border border-outline-variant space-y-3 shadow-inner">
            <span className="material-symbols-outlined text-primary/30 text-6xl">search_off</span>
            <p className="text-on-surface-variant font-medium text-sm">
              Tidak ada berita atau artikel yang cocok dengan pencarian Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

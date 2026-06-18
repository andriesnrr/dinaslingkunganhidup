import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import IspuCard from '@/components/IspuCard';

export const revalidate = 60; // Revalidate page every 60 seconds

async function getISPUData() {
  try {
    const res = await fetch(
      'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=-7.1525&longitude=112.6558&current=european_aqi,pm10,pm2_5,sulphur_dioxide&timezone=Asia%2FJakarta',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch ISPU:", error);
    return null;
  }
}

export default async function BerandaPage() {
  // Fetch top 3 latest published news articles and ISPU
  const [latestNews, ispuData] = await Promise.all([
    prisma.berita.findMany({
      where: { isPublished: true },
      orderBy: { tanggalPublikasi: 'desc' },
      take: 3,
      include: { kategori: true },
    }),
    getISPUData(),
  ]);

  const currentIspu = ispuData?.current || {
    european_aqi: 42,
    pm10: 38,
    pm2_5: 22,
    sulphur_dioxide: 12,
  };

  const getIspuCategory = (aqi: number) => {
    if (aqi <= 50) return { label: 'BAIK', color: 'bg-green-100 text-green-800', desc: 'Kualitas udara sangat baik dan tidak berdampak pada manusia atau hewan.' };
    if (aqi <= 100) return { label: 'SEDANG', color: 'bg-blue-100 text-blue-800', desc: 'Kualitas udara dapat diterima.' };
    if (aqi <= 200) return { label: 'TIDAK SEHAT', color: 'bg-yellow-100 text-yellow-800', desc: 'Kualitas udara bersifat merugikan pada kesehatan.' };
    if (aqi <= 300) return { label: 'SANGAT TIDAK SEHAT', color: 'bg-red-100 text-red-800', desc: 'Kualitas udara dapat meningkatkan risiko kesehatan.' };
    return { label: 'BERBAHAYA', color: 'bg-purple-100 text-purple-800', desc: 'Kualitas udara sangat berbahaya bagi kesehatan.' };
  };

  const ispuStatus = getIspuCategory(currentIspu.european_aqi);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[550px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80"
          alt="Lingkungan hijau Gresik"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-[1280px] mx-auto px-8 w-full">
          <div className="max-w-2xl">
            <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold mb-6 inline-block">
              Pelayanan Publik Prima
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Mewujudkan Lingkungan Gresik yang Lestari & Berkelanjutan
            </h1>
            <p className="text-white/90 text-lg mb-8">
              Pusat informasi dan layanan digital Dinas Lingkungan Hidup Kabupaten Gresik untuk masyarakat yang lebih peduli lingkungan.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:112"
                className="px-8 py-4 bg-primary text-on-primary rounded-lg font-bold hover:bg-secondary transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                Call 112 Pemkab Gresik
              </a>
              <Link
                href="/profil"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-lg font-bold hover:bg-white/20 transition-colors"
              >
                Profil Dinas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info & ISPU Section */}
      <section className="max-w-[1280px] mx-auto px-8 py-16 w-full grid md:grid-cols-3 gap-8">
        {/* ISPU Card */}
        <IspuCard currentIspu={currentIspu} ispuStatus={ispuStatus} />

        {/* Quick Contacts */}
        <div className="bg-white rounded-3xl p-8 border border-outline-variant shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-primary">Kontak Darurat</h3>
          <p className="text-on-surface-variant text-sm">
            Hubungi kami segera jika terjadi pencemaran lingkungan atau kebakaran hutan di wilayah Kabupaten Gresik.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">Hubungi Kami</p>
                <p>
                  <a
                    href="tel:0313981242"
                    className="text-sm font-bold text-on-surface hover:text-primary transition-colors hover:underline"
                  >
                    (031) 3981242
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">Kirim Email</p>
                <p>
                  <a
                    href="mailto:info@dlhgresik.go.id"
                    className="text-sm font-bold text-on-surface hover:text-primary transition-colors hover:underline"
                  >
                    info@dlhgresik.go.id
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <span className="material-symbols-outlined">chat</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">WhatsApp Hotline</p>
                <p>
                  <a
                    href="https://wa.me/6282221742244"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-on-surface hover:text-green-600 transition-colors hover:underline font-semibold"
                  >
                    0822-2174-2244
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-white py-20 border-y border-outline-variant">
        <div className="max-w-[1280px] mx-auto px-8 w-full">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-primary">Layanan Dinas Lingkungan Hidup</h2>
            <p className="text-on-surface-variant text-base">
              Akses informasi dan layanan digital kami secara cepat dan transparan untuk memudahkan urusan Anda.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-surface rounded-2xl p-6 border border-outline-variant space-y-4 hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-primary text-4xl">call</span>
              <h3 className="font-bold text-lg text-on-surface">Layanan Pengaduan</h3>
              <p className="text-sm text-on-surface-variant">Hubungi Call Center 112 Pemkab Gresik untuk pengaduan lingkungan.</p>
              <a href="tel:112" className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1">
                Call 112 Sekarang <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </a>
            </div>
            
            <div className="bg-surface rounded-2xl p-6 border border-outline-variant space-y-4 hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-primary text-4xl">folder_open</span>
              <h3 className="font-bold text-lg text-on-surface">Dokumen DIDP</h3>
              <p className="text-sm text-on-surface-variant">Akses dokumen perencanaan kerja, renstra, dan kinerja dinas.</p>
              <Link href="/didp" className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1">
                Unduh Dokumen <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
            
            <div className="bg-surface rounded-2xl p-6 border border-outline-variant space-y-4 hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-primary text-4xl">co2</span>
              <h3 className="font-bold text-lg text-on-surface">Uji Kualitas Udara</h3>
              <p className="text-sm text-on-surface-variant">Uji emisi kendaraan dan kualitas udara ambien perkotaan.</p>
              <Link href="/kontak" className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1">
                Hubungi Lab <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-outline-variant space-y-4 hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-primary text-4xl">delete_sweep</span>
              <h3 className="font-bold text-lg text-on-surface">Pengelolaan Sampah</h3>
              <p className="text-sm text-on-surface-variant">Layanan kebersihan dan pengelolaan sampah di wilayah Gresik.</p>
              <Link href="/profil" className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1">
                Info Selengkapnya <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="max-w-[1280px] mx-auto px-8 py-20 w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-primary">Berita & Artikel Terkini</h2>
            <p className="text-on-surface-variant text-sm">Informasi terbaru seputar kegiatan dan program Dinas Lingkungan Hidup Gresik.</p>
          </div>
          <Link href="/berita" className="px-5 py-2.5 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20 transition-colors self-start md:self-auto shrink-0">
            Lihat Semua Berita
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {latestNews.map((news) => (
            <article key={news.id} className="bg-white rounded-2xl overflow-hidden border border-outline-variant group hover:shadow-md transition-shadow">
              <div className="h-48 bg-surface-container relative">
                {news.gambar ? (
                  <img
                    src={news.gambar}
                    alt={news.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/40 bg-primary/5">
                    <span className="material-symbols-outlined text-5xl">newspaper</span>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold uppercase">
                    {news.kategori?.nama || 'Lingkungan'}
                  </span>
                  <span>{new Date(news.tanggalPublikasi).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <h3 className="font-bold text-lg text-on-surface line-clamp-2 hover:text-primary transition-colors">
                  <Link href={`/berita/${news.slug}`}>{news.judul}</Link>
                </h3>
                <p className="text-sm text-on-surface-variant line-clamp-3">
                  {news.ringkasan || news.isi.substring(0, 150) + '...'}
                </p>
                <Link
                  href={`/berita/${news.slug}`}
                  className="text-xs font-bold text-primary hover:text-secondary inline-block"
                >
                  Baca Selengkapnya
                </Link>
              </div>
            </article>
          ))}
          {latestNews.length === 0 && (
            <p className="col-span-3 text-center text-on-surface-variant py-8">Belum ada berita yang dipublikasikan.</p>
          )}
        </div>
      </section>
    </div>
  );
}

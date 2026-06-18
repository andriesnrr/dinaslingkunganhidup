import React from 'react';
import { prisma } from '@/lib/prisma';

export const revalidate = 60; // Revalidate every minute

export default async function GaleriPage() {
  const fotoList = await prisma.fotoGaleri.findMany({
    where: { isActive: true },
    orderBy: { tanggal: 'desc' },
  });

  return (
    <div className="max-w-[1280px] mx-auto px-8 py-20">
      <div className="space-y-4 mb-12">
        <h1 className="text-3xl font-bold text-primary">Galeri Kegiatan</h1>
        <p className="text-on-surface-variant text-sm max-w-2xl">
          Kumpulan dokumentasi foto kegiatan dan aksi nyata Dinas Lingkungan Hidup Kabupaten Gresik dalam menjaga kelestarian lingkungan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Maklumat Pelayanan Card (Takes 2 cols & 2 rows on medium screen) */}
        <div className="md:col-span-2 md:row-span-2 bg-white p-8 rounded-3xl border-4 border-primary flex flex-col items-center justify-center text-center shadow-md space-y-6">
          <span className="material-symbols-outlined text-primary text-6xl">verified</span>
          <h2 className="text-2xl font-bold text-primary tracking-wide">MAKLUMAT PELAYANAN</h2>
          <p className="italic text-on-surface-variant leading-relaxed text-sm md:text-base">
            &ldquo;Dengan ini, kami menyatakan sanggup menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditetapkan dan apabila tidak menepati janji ini, kami siap menerima sanksi sesuai peraturan perundang-undangan yang berlaku.&rdquo;
          </p>
          <div className="font-extrabold text-sm text-primary uppercase tracking-wider">
            Dinas Lingkungan Hidup Kabupaten Gresik
          </div>
        </div>

        {/* Dynamic Photo List */}
        {fotoList.map((foto) => (
          <div
            key={foto.id}
            className="bg-white rounded-2xl overflow-hidden aspect-square group relative shadow-sm border border-outline-variant"
          >
            <img
              src={foto.gambar}
              alt={foto.judul}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
              <h4 className="font-bold text-sm leading-tight mb-1">{foto.judul}</h4>
              {foto.deskripsi && <p className="text-xs text-white/80 line-clamp-2">{foto.deskripsi}</p>}
              <span className="text-[10px] text-white/60 mt-2 block">
                {new Date(foto.tanggal).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        ))}

        {fotoList.length === 0 && (
          // Placeholder photos if database is empty
          <>
            <div className="bg-surface-container-high rounded-2xl overflow-hidden aspect-square flex items-center justify-center text-on-surface-variant/40 border border-outline-variant">
              <div className="text-center space-y-2">
                <span className="material-symbols-outlined text-4xl">photo</span>
                <p className="text-xs font-semibold">Foto belum tersedia</p>
              </div>
            </div>
            <div className="bg-surface-container-high rounded-2xl overflow-hidden aspect-square flex items-center justify-center text-on-surface-variant/40 border border-outline-variant">
              <div className="text-center space-y-2">
                <span className="material-symbols-outlined text-4xl">photo</span>
                <p className="text-xs font-semibold">Foto belum tersedia</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

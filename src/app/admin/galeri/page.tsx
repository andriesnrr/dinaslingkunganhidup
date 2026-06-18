import React from 'react';
import { prisma } from '@/lib/prisma';
import { createFotoGaleri, deleteFotoGaleri } from '@/actions/admin';
import DeleteButton from '@/components/DeleteButton';

export const revalidate = 0;

export default async function AdminGaleriPage() {
  const photos = await prisma.fotoGaleri.findMany({
    orderBy: { tanggal: 'desc' },
  });

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-primary">Kelola Galeri Foto</h1>
        <p className="text-sm text-on-surface-variant">
          Upload dokumentasi foto kegiatan Dinas Lingkungan Hidup Kabupaten Gresik.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-outline-variant shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-primary">Upload Foto Baru</h2>
          <form action={createFotoGaleri} encType="multipart/form-data" className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Judul Kegiatan</label>
              <input
                type="text"
                name="judul"
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">File Foto / Gambar</label>
              <input
                type="file"
                name="gambar"
                accept="image/*"
                required
                className="w-full text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Deskripsi Ringkas</label>
              <textarea
                name="deskripsi"
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-secondary transition-colors cursor-pointer"
            >
              Upload Foto
            </button>
          </form>
        </div>

        {/* Photo List Grid */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-outline-variant shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-bold text-primary">Koleksi Foto Galeri</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((f) => (
              <div key={f.id} className="border border-outline-variant rounded-xl overflow-hidden group relative bg-surface">
                <div className="aspect-square relative overflow-hidden bg-surface-container">
                  <img src={f.gambar} alt={f.judul} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 space-y-2">
                  <h4 className="font-bold text-xs line-clamp-1 text-on-surface">{f.judul}</h4>
                  <DeleteButton
                    label="Hapus Foto"
                    action={async () => {
                      'use server';
                      await deleteFotoGaleri(f.id);
                    }}
                  />
                </div>
              </div>
            ))}
            {photos.length === 0 && (
              <p className="col-span-3 text-center text-on-surface-variant py-8">Belum ada foto galeri.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

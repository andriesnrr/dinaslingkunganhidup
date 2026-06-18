import React from 'react';
import { prisma } from '@/lib/prisma';
import { createBerita, deleteBerita } from '@/actions/admin';
import DeleteButton from '@/components/DeleteButton';

export const revalidate = 0; // Disable cache for admin pages

export default async function AdminBeritaPage() {
  const [beritaList, kategoriList] = await Promise.all([
    prisma.berita.findMany({
      orderBy: { tanggalPublikasi: 'desc' },
      include: { kategori: true },
    }),
    prisma.kategoriBerita.findMany({
      orderBy: { nama: 'asc' },
    }),
  ]);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-primary">Kelola Berita & Artikel</h1>
        <p className="text-sm text-on-surface-variant">
          Tambah, edit, atau hapus konten berita yang dipublikasikan ke portal publik.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Form Tambah Berita */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-outline-variant shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-primary">Tambah Berita Baru</h2>
          <form action={createBerita} encType="multipart/form-data" className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Judul Berita</label>
              <input
                type="text"
                name="judul"
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Slug (Opsional)</label>
              <input
                type="text"
                name="slug"
                placeholder="auto-generate jika kosong"
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Kategori</label>
              <select
                name="kategoriId"
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              >
                {kategoriList.map((kat) => (
                  <option key={kat.id} value={kat.id}>
                    {kat.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Gambar Utama</label>
              <input
                type="file"
                name="gambar"
                accept="image/*"
                className="w-full text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Ringkasan (Excerpt)</label>
              <textarea
                name="ringkasan"
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Isi Lengkap Berita</label>
              <textarea
                name="isi"
                required
                rows={6}
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Status Publikasi</label>
              <select
                name="isPublished"
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              >
                <option value="true">Langsung Publikasikan</option>
                <option value="false">Simpan Draft</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-secondary transition-colors cursor-pointer"
            >
              Simpan & Posting
            </button>
          </form>
        </div>

        {/* Tabel Berita */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-outline-variant shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-primary">Daftar Berita</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="py-3 px-2">Judul</th>
                  <th className="py-3 px-2">Kategori</th>
                  <th className="py-3 px-2">Tanggal</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant text-on-surface">
                {beritaList.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-4 px-2 font-semibold max-w-xs truncate">{b.judul}</td>
                    <td className="py-4 px-2 text-xs font-bold text-primary uppercase">{b.kategori?.nama || '-'}</td>
                    <td className="py-4 px-2 text-on-surface-variant">
                      {new Date(b.tanggalPublikasi).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.isPublished
                            ? 'bg-primary-container text-on-primary-container'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {b.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <DeleteButton
                        action={async () => {
                          'use server';
                          await deleteBerita(b.id);
                        }}
                      />
                    </td>
                  </tr>
                ))}
                {beritaList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-on-surface-variant">
                      Belum ada berita yang ditambahkan.
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

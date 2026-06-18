import React from 'react';
import { prisma } from '@/lib/prisma';
import { createDokumen, deleteDokumen } from '@/actions/admin';
import DeleteButton from '@/components/DeleteButton';

export const revalidate = 0;

export default async function AdminDidpPage() {
  const documents = await prisma.dokumen.findMany({
    orderBy: { tanggalUpload: 'desc' },
  });

  const kategoriChoices = [
    { val: 'renstra', label: 'Renstra' },
    { val: 'kinerja', label: 'Laporan Kinerja' },
    { val: 'renja', label: 'Renja' },
    { val: 'lingkungan', label: 'Informasi Lingkungan' },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-primary">Kelola Dokumen DIDP</h1>
        <p className="text-sm text-on-surface-variant">
          Upload dokumen perencanaan (Renstra, Renja, Laporan Kinerja) dalam format PDF untuk akses publik.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-outline-variant shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-primary">Upload Dokumen Baru</h2>
          <form action={createDokumen} encType="multipart/form-data" className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Nama Dokumen</label>
              <input
                type="text"
                name="namaDokumen"
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Tahun Dokumen</label>
              <input
                type="number"
                name="tahun"
                defaultValue={new Date().getFullYear()}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Kategori</label>
              <select
                name="kategori"
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              >
                <option value="renstra">Renstra (Rencana Strategis)</option>
                <option value="kinerja">Laporan Kinerja (LKjIP)</option>
                <option value="renja">Renja (Rencana Kerja)</option>
                <option value="lingkungan">Dokumen Kualitas Lingkungan (IKPLHD)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">File PDF</label>
              <input
                type="file"
                name="filePdf"
                accept=".pdf"
                required
                className="w-full text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Deskripsi (Opsional)</label>
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
              Upload Dokumen
            </button>
          </form>
        </div>

        {/* Document List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-outline-variant shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-primary">Daftar Dokumen DIDP</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="py-3 px-2">Nama Dokumen</th>
                  <th className="py-3 px-2">Kategori</th>
                  <th className="py-3 px-2">Tahun</th>
                  <th className="py-3 px-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant text-on-surface">
                {documents.map((dok) => (
                  <tr key={dok.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-4 px-2 font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm">picture_as_pdf</span>
                        <a href={dok.filePdf} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                          {dok.namaDokumen}
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-2 uppercase text-xs font-bold text-primary">
                      {kategoriChoices.find((c) => c.val === dok.kategori)?.label || dok.kategori}
                    </td>
                    <td className="py-4 px-2 text-on-surface-variant">{dok.tahun}</td>
                    <td className="py-4 px-2 text-right">
                      <DeleteButton
                        action={async () => {
                          'use server';
                          await deleteDokumen(dok.id);
                        }}
                      />
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-on-surface-variant">
                      Belum ada dokumen yang diunggah.
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

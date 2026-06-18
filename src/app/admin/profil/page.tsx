import React from 'react';
import { prisma } from '@/lib/prisma';
import { createPejabat, deletePejabat } from '@/actions/admin';
import DeleteButton from '@/components/DeleteButton';

export const revalidate = 0;

export default async function AdminProfilPage() {
  const pejabatList = await prisma.pejabatStruktur.findMany({
    orderBy: { urutan: 'asc' },
  });

  const levelChoices = [
    { val: 'kepala_dinas', label: 'Kepala Dinas' },
    { val: 'sekretaris', label: 'Sekretaris' },
    { val: 'kepala_bidang', label: 'Kepala Bidang' },
    { val: 'kepala_upt', label: 'Kepala UPT' },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-primary">Kelola Pejabat & Struktur</h1>
        <p className="text-sm text-on-surface-variant">
          Kelola pejabat struktural Dinas Lingkungan Hidup Kabupaten Gresik.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-outline-variant shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-primary">Tambah Pejabat Baru</h2>
          <form action={createPejabat} encType="multipart/form-data" className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Nama Lengkap & Gelar</label>
              <input
                type="text"
                name="nama"
                required
                placeholder="misal: Ir. Sri Subaidah, M.T."
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Jabatan</label>
              <input
                type="text"
                name="jabatan"
                required
                placeholder="misal: Kepala Dinas Lingkungan Hidup"
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Level Jabatan</label>
              <select
                name="level"
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              >
                {levelChoices.map((c) => (
                  <option key={c.val} value={c.val}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Urutan Tampilan</label>
              <input
                type="number"
                name="urutan"
                defaultValue={0}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">Foto Pejabat</label>
              <input
                type="file"
                name="foto"
                accept="image/*"
                className="w-full text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-secondary transition-colors cursor-pointer"
            >
              Simpan Pejabat
            </button>
          </form>
        </div>

        {/* Pejabat List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-outline-variant shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-primary">Daftar Pejabat</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="py-3 px-2">Nama</th>
                  <th className="py-3 px-2">Jabatan</th>
                  <th className="py-3 px-2">Level</th>
                  <th className="py-3 px-2">Urutan</th>
                  <th className="py-3 px-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant text-on-surface">
                {pejabatList.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-4 px-2 font-semibold">
                      <div className="flex items-center gap-3">
                        {p.foto ? (
                          <img src={p.foto} alt={p.nama} className="w-8 h-8 rounded-full object-cover border border-outline-variant" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {p.nama[0]}
                          </div>
                        )}
                        <span>{p.nama}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-xs text-on-surface-variant font-medium">{p.jabatan}</td>
                    <td className="py-4 px-2 uppercase text-xs font-bold text-primary">
                      {levelChoices.find((c) => c.val === p.level)?.label || p.level}
                    </td>
                    <td className="py-4 px-2 text-on-surface-variant">{p.urutan}</td>
                    <td className="py-4 px-2 text-right">
                      <DeleteButton
                        action={async () => {
                          'use server';
                          await deletePejabat(p.id);
                        }}
                      />
                    </td>
                  </tr>
                ))}
                {pejabatList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-on-surface-variant">
                      Belum ada pejabat yang terdaftar.
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

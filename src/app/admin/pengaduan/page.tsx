import React from 'react';
import { prisma } from '@/lib/prisma';
import { updatePengaduanStatus } from '@/actions/admin';

export const revalidate = 0;

export default async function AdminPengaduanPage() {
  const pengaduanList = await prisma.pengaduan.findMany({
    orderBy: { tanggalMasuk: 'desc' },
  });

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-primary">Kelola Laporan Pengaduan</h1>
        <p className="text-sm text-on-surface-variant">
          Periksa laporan pencemaran lingkungan warga, proses aduan, dan beri catatan admin.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-outline-variant shadow-sm p-6 md:p-8 space-y-8">
        <div className="space-y-6">
          {pengaduanList.map((p) => (
            <div
              key={p.id}
              id={`id-${p.id}`}
              className="p-6 bg-surface rounded-2xl border border-outline-variant shadow-sm grid md:grid-cols-3 gap-6 items-start scroll-mt-24"
            >
              {/* Pelapor Info */}
              <div className="space-y-3">
                <span
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    p.status === 'diterima'
                      ? 'bg-primary-container text-on-primary-container'
                      : p.status === 'diproses'
                      ? 'bg-tertiary-container text-on-tertiary-container'
                      : 'bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  {p.status}
                </span>
                <h3 className="font-bold text-lg text-primary">{p.namaLengkap}</h3>
                <div className="text-xs text-on-surface-variant space-y-1">
                  <p><strong>NIK:</strong> {p.nik}</p>
                  <p><strong>WA:</strong> {p.noWhatsapp}</p>
                  <p><strong>Email:</strong> {p.email}</p>
                  <p>
                    <strong>Tanggal:</strong>{' '}
                    {new Date(p.tanggalMasuk).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {p.bukti && (
                  <div className="pt-2">
                    <a
                      href={p.bukti}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs">attach_file</span> Lihat Bukti Lampiran
                    </a>
                  </div>
                )}
              </div>

              {/* Laporan Deskripsi */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Aduan Kategori: {p.kategori}</p>
                <p className="text-sm leading-relaxed text-on-surface whitespace-pre-line bg-white p-4 rounded-xl border border-outline-variant">
                  {p.isiPengaduan}
                </p>
              </div>

              {/* Action Form */}
              <div className="bg-white p-4 rounded-xl border border-outline-variant space-y-4">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Tanggapan Admin</p>
                
                <form
                  action={async (formData: FormData) => {
                    'use server';
                    const status = formData.get('status') as string;
                    const catatanAdmin = formData.get('catatanAdmin') as string;
                    await updatePengaduanStatus(p.id, status, catatanAdmin);
                  }}
                  className="space-y-3"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant">Update Status</label>
                    <select
                      name="status"
                      defaultValue={p.status}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-outline-variant bg-surface"
                    >
                      <option value="diterima">Diterima</option>
                      <option value="diproses">Sedang Diproses</option>
                      <option value="selesai">Selesai / Ditutup</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant">Catatan Admin</label>
                    <textarea
                      name="catatanAdmin"
                      rows={3}
                      defaultValue={p.catatanAdmin || ''}
                      placeholder="Tulis tanggapan atau catatan tindak lanjut..."
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-outline-variant bg-surface"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-secondary transition-colors cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </form>
              </div>
            </div>
          ))}

          {pengaduanList.length === 0 && (
            <p className="text-center text-on-surface-variant py-8">Belum ada laporan pengaduan masuk.</p>
          )}
        </div>
      </div>
    </div>
  );
}

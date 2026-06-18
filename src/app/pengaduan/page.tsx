'use client';

import React, { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitPengaduan, PengaduanState } from '@/actions/pengaduan';

const initialState: PengaduanState = {};

export default function PengaduanPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(submitPengaduan, initialState);

  useEffect(() => {
    if (state.success) {
      router.push('/pengaduan/sukses');
    }
  }, [state.success, router]);

  return (
    <div className="max-w-[1280px] mx-auto px-8 py-20">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary">Layanan Pengaduan Lingkungan</h1>
          <p className="text-on-surface-variant text-base">
            Sampaikan aduan Anda terkait pencemaran atau kerusakan lingkungan di wilayah Kabupaten Gresik secara resmi.
          </p>
        </div>

        <form
          action={formAction}
          encType="multipart/form-data"
          className="bg-white p-8 md:p-10 rounded-3xl border border-outline-variant shadow-sm space-y-6"
        >
          {/* General Error Message */}
          {state.error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl">error</span>
              <p className="text-sm font-semibold">{state.error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <label htmlFor="namaLengkap" className="text-sm font-semibold text-on-surface-variant">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="namaLengkap"
                id="namaLengkap"
                placeholder="Masukkan nama lengkap Anda"
                className={`w-full px-4 py-3 rounded-xl border bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  state.errors?.namaLengkap ? 'border-error' : 'border-outline-variant focus:border-primary'
                }`}
              />
              {state.errors?.namaLengkap && (
                <p className="text-xs text-error font-medium">{state.errors.namaLengkap[0]}</p>
              )}
            </div>

            {/* NIK */}
            <div className="space-y-2">
              <label htmlFor="nik" className="text-sm font-semibold text-on-surface-variant">
                NIK (KTP)
              </label>
              <input
                type="text"
                name="nik"
                id="nik"
                maxLength={16}
                placeholder="16 digit NIK Anda"
                className={`w-full px-4 py-3 rounded-xl border bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  state.errors?.nik ? 'border-error' : 'border-outline-variant focus:border-primary'
                }`}
              />
              {state.errors?.nik && (
                <p className="text-xs text-error font-medium">{state.errors.nik[0]}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-on-surface-variant">
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="contoh@email.com"
                className={`w-full px-4 py-3 rounded-xl border bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  state.errors?.email ? 'border-error' : 'border-outline-variant focus:border-primary'
                }`}
              />
              {state.errors?.email && (
                <p className="text-xs text-error font-medium">{state.errors.email[0]}</p>
              )}
            </div>

            {/* Whatsapp */}
            <div className="space-y-2">
              <label htmlFor="noWhatsapp" className="text-sm font-semibold text-on-surface-variant">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                name="noWhatsapp"
                id="noWhatsapp"
                placeholder="0812xxxxxxxx"
                className={`w-full px-4 py-3 rounded-xl border bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  state.errors?.noWhatsapp ? 'border-error' : 'border-outline-variant focus:border-primary'
                }`}
              />
              {state.errors?.noWhatsapp && (
                <p className="text-xs text-error font-medium">{state.errors.noWhatsapp[0]}</p>
              )}
            </div>
          </div>

          {/* Kategori Pengaduan */}
          <div className="space-y-2">
            <label htmlFor="kategori" className="text-sm font-semibold text-on-surface-variant">
              Kategori Laporan
            </label>
            <select
              name="kategori"
              id="kategori"
              className={`w-full px-4 py-3 rounded-xl border bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                state.errors?.kategori ? 'border-error' : 'border-outline-variant focus:border-primary'
              }`}
            >
              <option value="">-- Pilih Kategori --</option>
              <option value="sampah">Penumpukan / Pembuangan Sampah Liar</option>
              <option value="limbah">Pencemaran Limbah Cair Industri</option>
              <option value="polusi">Polusi Udara / Asap Pabrik</option>
              <option value="penebangan">Penebangan Pohon Liar</option>
              <option value="lainnya">Kerusakan Lingkungan Lainnya</option>
            </select>
            {state.errors?.kategori && (
              <p className="text-xs text-error font-medium">{state.errors.kategori[0]}</p>
            )}
          </div>

          {/* Isi Laporan */}
          <div className="space-y-2">
            <label htmlFor="isiPengaduan" className="text-sm font-semibold text-on-surface-variant">
              Deskripsi Pengaduan
            </label>
            <textarea
              name="isiPengaduan"
              id="isiPengaduan"
              rows={5}
              placeholder="Jelaskan detail kejadian, lokasi, serta kronologi kerusakan lingkungan..."
              className={`w-full px-4 py-3 rounded-xl border bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                state.errors?.isiPengaduan ? 'border-error' : 'border-outline-variant focus:border-primary'
              }`}
            ></textarea>
            {state.errors?.isiPengaduan && (
              <p className="text-xs text-error font-medium">{state.errors.isiPengaduan[0]}</p>
            )}
          </div>

          {/* Upload Bukti */}
          <div className="space-y-2">
            <label htmlFor="bukti" className="text-sm font-semibold text-on-surface-variant">
              Dokumen / Foto Bukti (Maksimal 5MB, format JPG/PNG/PDF)
            </label>
            <input
              type="file"
              name="bukti"
              id="bukti"
              accept=".jpg,.jpeg,.png,.pdf"
              className={`w-full px-4 py-3 rounded-xl border bg-surface text-on-surface text-sm focus:outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 ${
                state.errors?.bukti ? 'border-error' : 'border-outline-variant'
              }`}
            />
            {state.errors?.bukti && (
              <p className="text-xs text-error font-medium">{state.errors.bukti[0]}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold hover:bg-secondary transition-colors disabled:bg-primary-container disabled:text-on-primary-container/50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                Mengirim Laporan...
              </>
            ) : (
              'Kirim Pengaduan Resmi'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

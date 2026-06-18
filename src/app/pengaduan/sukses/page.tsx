import React from 'react';
import Link from 'next/link';

export default function PengaduanSuksesPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20 px-8">
      <div className="max-w-xl mx-auto text-center space-y-8">
        <div className="w-24 h-24 bg-secondary-container rounded-full flex items-center justify-center mx-auto shadow-md">
          <span
            className="material-symbols-outlined text-on-secondary-container text-5xl font-bold"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-primary">Pengaduan Berhasil Dikirim!</h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Terima kasih atas partisipasi Anda dalam menjaga kelestarian lingkungan Kabupaten Gresik.
            Pengaduan Anda telah kami terima dan akan segera ditindaklanjuti oleh tim DLH.
          </p>
        </div>

        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant text-left space-y-4">
          <h3 className="font-bold text-on-surface text-base">Langkah Selanjutnya:</h3>
          <ul className="space-y-3 text-on-surface-variant text-sm">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-base mt-0.5">mail</span>
              <span>Anda akan menerima konfirmasi atau tanggapan resmi via email yang didaftarkan.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-base mt-0.5">schedule</span>
              <span>Tim pengawas DLH akan memproses aduan Anda dalam waktu maksimal 3x24 jam kerja.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-base mt-0.5">support_agent</span>
              <span>
                Untuk pertanyaan mendesak, silakan hubungi Hotline DLH:{' '}
                <a href="tel:0313981242" className="text-primary font-bold hover:underline">
                  (031) 3981242
                </a>{' '}
                atau WhatsApp:{' '}
                <a
                  href="https://wa.me/6282221742244"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 font-bold hover:underline"
                >
                  0822-2174-2244
                </a>
                .
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-secondary transition-colors text-sm shadow-sm"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/pengaduan"
            className="px-6 py-3 border border-outline text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors text-sm"
          >
            Kirim Laporan Lain
          </Link>
        </div>
      </div>
    </div>
  );
}

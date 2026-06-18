import React from 'react';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // Cache for 1 hour

export default async function ProfilPage() {
  const pejabat = await prisma.pejabatStruktur.findMany({
    where: { isActive: true },
    orderBy: { urutan: 'asc' },
  });

  const kepalaDinas = pejabat.find((p) => p.level === 'kepala_dinas');

  return (
    <div className="max-w-[1280px] mx-auto px-8 py-20">
      {/* Tentang DLH */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-primary">Tentang DLH Gresik</h1>
          <div className="space-y-4 text-on-surface-variant leading-relaxed">
            <p>
              Dinas Lingkungan Hidup Kabupaten Gresik merupakan unsur pelaksana urusan pemerintahan di bidang lingkungan hidup yang menjadi kewenangan daerah.
            </p>
            <p>
              Berdasarkan Peraturan Bupati No. 74 Tahun 2021, DLH memiliki tugas pokok membantu Bupati melaksanakan urusan pemerintahan yang menjadi kewenangan Daerah dan tugas pembantuan yang diberikan kepada Daerah di bidang lingkungan hidup.
            </p>
            <p>
              Kami berkomitmen untuk terus berinovasi dalam memberikan pelayanan terbaik kepada masyarakat serta menjaga kelestarian alam Kabupaten Gresik demi masa depan generasi mendatang.
            </p>
          </div>
        </div>

        {/* Kepala Dinas Card */}
        {kepalaDinas && (
          <div className="relative max-w-sm mx-auto w-full">
            <div className="absolute -top-4 -right-4 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl"></div>
            <div className="relative bg-white p-6 rounded-3xl shadow-md border border-outline-variant text-center space-y-4">
              {kepalaDinas.foto ? (
                <img
                  src={kepalaDinas.foto}
                  alt={kepalaDinas.nama}
                  className="w-full aspect-[4/5] object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full aspect-[4/5] rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-8xl">person</span>
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg text-primary">{kepalaDinas.nama}</h3>
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{kepalaDinas.jabatan}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visi Misi */}
      <div className="bg-white rounded-3xl p-10 border border-outline-variant shadow-sm mb-24 grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">visibility</span> Visi
          </h2>
          <p className="text-on-surface-variant leading-relaxed italic">
            &ldquo;Mewujudkan Gresik Baru yang Mandiri, Sejahtera, Berdaya Saing, dan Berkemajuan Berlandaskan Akhlakul Karimah melalui peningkatan infrastruktur dan kelestarian lingkungan hidup.&rdquo;
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">task_alt</span> Misi
          </h2>
          <ul className="list-decimal list-inside text-on-surface-variant leading-relaxed space-y-2 text-sm">
            <li>Mewujudkan tata kelola lingkungan hidup yang bersih, sehat, dan lestari.</li>
            <li>Mengoptimalkan sistem pengelolaan persampahan terpadu berbasis masyarakat dan teknologi.</li>
            <li>Meningkatkan pengawasan, pengendalian, dan penegakan hukum lingkungan terhadap pelaku industri.</li>
            <li>Mendorong partisipasi aktif masyarakat dan pemangku kepentingan dalam pelestarian lingkungan.</li>
          </ul>
        </div>
      </div>

      {/* Bagan Organisasi (Org Chart) */}
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold text-primary">Struktur Organisasi</h2>
          <p className="text-on-surface-variant text-sm">
            Bagan struktur kepemimpinan dan pembagian divisi di lingkungan Dinas Lingkungan Hidup Kabupaten Gresik.
          </p>
        </div>

        <div className="space-y-6 flex flex-col items-center">
          <div className="bg-white p-4 rounded-3xl border border-outline-variant shadow-sm max-w-4xl w-full overflow-hidden">
            <img
              src="/struktur.png"
              alt="Struktur Organisasi Dinas Lingkungan Hidup Kabupaten Gresik"
              className="w-full h-auto object-contain rounded-2xl hover:scale-[1.01] transition-transform duration-500"
            />
          </div>

          <div className="text-center">
            <a
              href="/struktur.png"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              Buka Gambar Struktur Organisasi Resolusi Penuh
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

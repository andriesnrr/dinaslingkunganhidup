import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const revalidate = 60; // Revalidate every minute

interface PageProps {
  searchParams: Promise<{ kategori?: string }>;
}

export default async function DidpPage({ searchParams }: PageProps) {
  const { kategori } = await searchParams;

  const kategoriChoices = [
    { val: 'renstra', label: 'Renstra' },
    { val: 'kinerja', label: 'Laporan Kinerja' },
    { val: 'renja', label: 'Renja' },
    { val: 'lingkungan', label: 'Informasi Lingkungan' },
  ];

  // Fetch documents filtered by category if present
  const docFilter = kategori ? { kategori, isActive: true } : { isActive: true };
  const documents = await prisma.dokumen.findMany({
    where: docFilter,
    orderBy: { tanggalUpload: 'desc' },
  });

  return (
    <div className="max-w-[1280px] mx-auto px-8 py-20">
      <div className="flex flex-wrap justify-between items-end mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Data & Informasi Dinas (DIDP)</h1>
          <p className="text-on-surface-variant text-sm">
            Akses dokumen perencanaan, rencana kerja, dan laporan kinerja instansi Dinas Lingkungan Hidup.
          </p>
        </div>

        {/* Filter Kategori */}
        <div className="flex gap-2 p-1.5 bg-surface-container rounded-xl flex-wrap">
          <Link
            href="/didp"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              !kategori
                ? 'bg-white shadow-sm text-primary'
                : 'text-on-surface-variant hover:text-primary hover:bg-white/50'
            }`}
          >
            Semua
          </Link>
          {kategoriChoices.map((choice) => (
            <Link
              key={choice.val}
              href={`/didp?kategori=${choice.val}`}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                kategori === choice.val
                  ? 'bg-white shadow-sm text-primary'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/50'
              }`}
            >
              {choice.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-high border-b border-outline-variant">
              <tr>
                <th className="p-6 font-bold text-primary text-sm">Nama Dokumen</th>
                <th className="p-6 font-bold text-primary text-sm">Tahun</th>
                <th className="p-6 font-bold text-primary text-sm">Kategori</th>
                <th className="p-6 font-bold text-primary text-sm text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-sm text-on-surface">
              {documents.map((dok) => (
                <tr key={dok.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-6 font-semibold max-w-md">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
                      <span>{dok.namaDokumen}</span>
                    </div>
                    {dok.deskripsi && (
                      <p className="text-xs text-on-surface-variant font-normal mt-1 pl-8">
                        {dok.deskripsi}
                      </p>
                    )}
                  </td>
                  <td className="p-6 text-on-surface-variant">{dok.tahun}</td>
                  <td className="p-6">
                    <span className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {kategoriChoices.find((c) => c.val === dok.kategori)?.label || dok.kategori}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <a
                      href={dok.filePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-secondary transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs">download</span> Unduh PDF
                    </a>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-on-surface-variant">
                    Tidak ada dokumen yang ditemukan untuk kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';

interface IspuCardProps {
  currentIspu: {
    european_aqi: number;
    pm10: number;
    pm2_5: number;
    sulphur_dioxide: number;
  } | null;
}

export default function IspuCard({ currentIspu }: IspuCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!currentIspu) {
    return (
      <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-outline-variant shadow-sm flex flex-col items-center justify-center gap-4 text-center min-h-[200px]">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">cloud_off</span>
        <div>
          <p className="font-bold text-on-surface">Data Tidak Tersedia</p>
          <p className="text-xs text-on-surface-variant mt-1">Data kualitas udara tidak dapat dimuat saat ini.</p>
        </div>
      </div>
    );
  }

  const getIspuCategory = (aqi: number) => {
    if (aqi <= 50) return { label: 'BAIK', color: 'bg-green-100 text-green-800', desc: 'Kualitas udara sangat baik dan tidak berdampak pada manusia atau hewan.' };
    if (aqi <= 100) return { label: 'SEDANG', color: 'bg-blue-100 text-blue-800', desc: 'Kualitas udara dapat diterima.' };
    if (aqi <= 200) return { label: 'TIDAK SEHAT', color: 'bg-yellow-100 text-yellow-800', desc: 'Kualitas udara bersifat merugikan pada kesehatan.' };
    if (aqi <= 300) return { label: 'SANGAT TIDAK SEHAT', color: 'bg-red-100 text-red-800', desc: 'Kualitas udara dapat meningkatkan risiko kesehatan.' };
    return { label: 'BERBAHAYA', color: 'bg-purple-100 text-purple-800', desc: 'Kualitas udara sangat berbahaya bagi kesehatan.' };
  };

  const ispuStatus = getIspuCategory(currentIspu.european_aqi);

  const ranges = [
    {
      range: '0 - 50',
      label: 'Baik',
      color: 'bg-green-500',
      textColor: 'text-green-500',
      desc: 'Tingkat kualitas udara yang tidak memberikan efek bagi kesehatan manusia atau hewan.',
      action: 'Sangat baik untuk beraktivitas di luar ruangan secara normal.',
    },
    {
      range: '51 - 100',
      label: 'Sedang',
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      desc: 'Tingkat kualitas udara yang tidak berpengaruh pada kesehatan manusia ataupun hewan tetapi berpengaruh pada tumbuhan yang sensitif.',
      action: 'Bebas beraktivitas di luar ruangan. Kelompok sensitif disarankan mengurangi aktivitas fisik yang berat.',
    },
    {
      range: '101 - 200',
      label: 'Tidak Sehat',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      desc: 'Tingkat kualitas udara yang bersifat merugikan pada kesehatan manusia ataupun kelompok hewan yang sensitif atau dapat menimbulkan kerusakan pada tumbuhan ataupun nilai estetika.',
      action: 'Kurangi aktivitas fisik berat di luar ruangan. Gunakan masker jika memiliki masalah pernapasan.',
    },
    {
      range: '201 - 300',
      label: 'Sangat Tidak Sehat',
      color: 'bg-red-500',
      textColor: 'text-red-500',
      desc: 'Tingkat kualitas udara yang dapat meningkatkan risiko kesehatan pada sejumlah segmen populasi yang terpapar.',
      action: 'Hindari aktivitas luar ruangan yang lama. Gunakan masker standar (seperti N95) di luar ruangan.',
    },
    {
      range: '301+',
      label: 'Berbahaya',
      color: 'bg-purple-600',
      textColor: 'text-purple-600',
      desc: 'Tingkat kualitas udara berbahaya yang secara umum dapat merugikan kesehatan yang serius pada populasi.',
      action: 'Tetap berada di dalam ruangan. Tutup jendela dan nyalakan penjernih udara (air purifier).',
    },
  ];

  return (
    <>
      <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-outline-variant shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="space-y-4 text-center md:text-left flex-1 w-full">
          <div className="flex items-center justify-between md:justify-start gap-3 flex-wrap">
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Kualitas Udara
            </span>
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors cursor-pointer"
              title="Informasi Standar ISPU"
            >
              <span className="material-symbols-outlined text-[16px]">info</span>
              Panduan ISPU
            </button>
          </div>

          <h2 className="text-2xl font-bold text-primary flex items-center gap-2 justify-center md:justify-start">
            Indeks Standar Pencemar Udara (ISPU)
          </h2>
          <p className="text-on-surface-variant text-sm">
            Stasiun Kualitas Udara DLH Gresik. Data diperbarui secara berkala untuk memantau kesehatan udara wilayah perkotaan.
          </p>
          <div className="flex justify-center md:justify-start gap-4 text-xs font-semibold text-on-surface-variant flex-wrap">
            <span className="px-3 py-1 rounded-full bg-surface-container-high">PM10: {currentIspu.pm10} µg/m³</span>
            <span className="px-3 py-1 rounded-full bg-surface-container-high">PM2.5: {currentIspu.pm2_5} µg/m³</span>
            <span className="px-3 py-1 rounded-full bg-surface-container-high">SO2: {currentIspu.sulphur_dioxide} µg/m³</span>
          </div>

          {/* Visual Gauge Bar */}
          <div className="space-y-2 pt-4 w-full">
            <div className="flex justify-between text-[10px] font-bold text-on-surface-variant flex-wrap gap-1">
              <span>0 (BAIK)</span>
              <span>50</span>
              <span>100 (SEDANG)</span>
              <span>200 (TIDAK SEHAT)</span>
              <span>300 (SANGAT TIDAK SEHAT)</span>
              <span>350+ (BERBAHAYA)</span>
            </div>
            <div className="h-3 w-full rounded-full bg-surface-container-highest overflow-hidden relative flex shadow-inner">
              <div className="h-full bg-green-500" style={{ width: '14.3%' }} title="Baik"></div>
              <div className="h-full bg-blue-500" style={{ width: '14.3%' }} title="Sedang"></div>
              <div className="h-full bg-yellow-500" style={{ width: '28.6%' }} title="Tidak Sehat"></div>
              <div className="h-full bg-red-500" style={{ width: '28.6%' }} title="Sangat Tidak Sehat"></div>
              <div className="h-full bg-purple-600" style={{ width: '14.2%' }} title="Berbahaya"></div>
              {/* Pointer Marker */}
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-white border border-black/40 shadow-md transition-all duration-1000 -ml-0.75 animate-pulse"
                style={{ left: `${Math.min(99, (currentIspu.european_aqi / 350) * 100)}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-on-surface-variant italic">
              *Garis vertikal putih menunjukkan tingkat indeks kualitas udara (ISPU) wilayah Gresik saat ini.
            </p>
          </div>
        </div>

        <div className={`flex flex-col items-center p-6 rounded-2xl shrink-0 w-full md:w-48 ${ispuStatus.color}`}>
          <span className="text-[64px] font-extrabold leading-none">{currentIspu.european_aqi}</span>
          <span className="text-sm font-bold uppercase tracking-widest mt-2">{ispuStatus.label}</span>
          <span className="text-[10px] text-center mt-3 leading-snug opacity-80">
            {ispuStatus.desc}
          </span>
        </div>
      </div>

      {/* ISPU Guide Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden border border-outline-variant shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                <h3 className="font-extrabold text-lg text-primary">Panduan Klasifikasi ISPU</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full border border-outline-variant hover:bg-surface flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Indeks Standar Pencemar Udara (ISPU) adalah laporan kualitas udara kepada masyarakat untuk menerangkan seberapa bersih atau tercemarnya kualitas udara kita dan bagaimana dampaknya terhadap kesehatan kita.
              </p>

              <div className="space-y-4">
                {ranges.map((r, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl border border-outline-variant bg-surface-container-lowest hover:shadow-sm transition-shadow"
                  >
                    {/* Color Tag */}
                    <div className="flex md:flex-col items-center justify-between md:justify-center p-3 rounded-xl bg-surface-container shrink-0 md:w-32 text-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${r.color}`}></span>
                      <span className={`text-xs font-bold uppercase tracking-wider ${r.textColor}`}>{r.label}</span>
                      <span className="text-[10px] font-bold text-on-surface-variant bg-white px-2 py-0.5 rounded border border-outline-variant">
                        {r.range}
                      </span>
                    </div>

                    {/* Explanatory Texts */}
                    <div className="space-y-2 flex-1">
                      <p className="text-sm text-on-surface leading-relaxed">
                        <strong className="text-xs text-on-surface-variant block uppercase font-bold tracking-wider mb-0.5">Penjelasan:</strong>
                        {r.desc}
                      </p>
                      <p className="text-xs text-secondary leading-relaxed font-semibold flex items-start gap-1">
                        <span className="material-symbols-outlined text-[14px] mt-0.5 shrink-0">info</span>
                        <span>{r.action}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface-container-low border-t border-outline-variant text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-xs hover:bg-secondary transition-colors cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database DLH Gresik...');

  // Kategori Berita
  const katLingkungan = await prisma.kategoriBerita.upsert({
    where: { slug: 'lingkungan-hidup' },
    update: {},
    create: { nama: 'Lingkungan Hidup', slug: 'lingkungan-hidup' },
  });
  const katSampah = await prisma.kategoriBerita.upsert({
    where: { slug: 'pengelolaan-sampah' },
    update: {},
    create: { nama: 'Pengelolaan Sampah', slug: 'pengelolaan-sampah' },
  });
  const katMonitoring = await prisma.kategoriBerita.upsert({
    where: { slug: 'monitoring-uji' },
    update: {},
    create: { nama: 'Monitoring & Uji', slug: 'monitoring-uji' },
  });

  // Berita
  await prisma.berita.upsert({
    where: { slug: 'aksi-penanaman-1000-pohon-di-pesisir-gresik' },
    update: {},
    create: {
      judul: 'Aksi Penanaman 1000 Pohon di Pesisir Gresik',
      slug: 'aksi-penanaman-1000-pohon-di-pesisir-gresik',
      kategoriId: katLingkungan.id,
      isi: `Pemerintah Kabupaten Gresik melalui Dinas Lingkungan Hidup mengajak seluruh elemen masyarakat untuk turut serta dalam pelestarian hutan bakau di pesisir Gresik.

Kegiatan penanaman 1000 pohon ini merupakan bagian dari program Gresik Hijau yang diinisiasi oleh DLH Gresik bekerja sama dengan komunitas lingkungan lokal dan perusahaan-perusahaan yang beroperasi di Kabupaten Gresik.

Program ini bertujuan untuk menjaga kestabilan ekosistem pesisir, mencegah abrasi, sekaligus meningkatkan kesadaran masyarakat akan pentingnya menjaga kelestarian lingkungan.`,
      ringkasan: 'Pemerintah Kabupaten Gresik melalui DLH mengajak seluruh elemen masyarakat untuk turut serta dalam pelestarian hutan bakau di pesisir Gresik.',
      tanggalPublikasi: new Date('2024-01-12'),
      isPublished: true,
    },
  });

  await prisma.berita.upsert({
    where: { slug: 'sosialisasi-pengolahan-sampah-menjadi-rdf' },
    update: {},
    create: {
      judul: 'Sosialisasi Pengolahan Sampah Menjadi RDF',
      slug: 'sosialisasi-pengolahan-sampah-menjadi-rdf',
      kategoriId: katSampah.id,
      isi: `Inovasi terbaru dalam pengolahan sampah di Gresik, mengubah sampah menjadi bahan bakar alternatif (Refuse Derived Fuel/RDF) untuk industri.

Mesin RDF yang berlokasi di TPA Belahanrejo mampu mengolah hingga 200 ton sampah per hari menjadi bahan bakar padat yang dapat digunakan oleh industri semen dan pabrik lainnya.

Teknologi ini tidak hanya membantu mengurangi volume sampah di TPA, tetapi juga menghasilkan sumber energi terbarukan yang bernilai ekonomis tinggi.`,
      ringkasan: 'Inovasi terbaru dalam pengolahan sampah di Gresik, mengubah sampah menjadi bahan bakar alternatif industri.',
      tanggalPublikasi: new Date('2024-01-10'),
      isPublished: true,
    },
  });

  await prisma.berita.upsert({
    where: { slug: 'monitoring-kualitas-air-sungai-bengawan-solo' },
    update: {},
    create: {
      judul: 'Monitoring Kualitas Air Sungai Bengawan Solo',
      slug: 'monitoring-kualitas-air-sungai-bengawan-solo',
      kategoriId: katMonitoring.id,
      isi: `Laboratorium Lingkungan DLH Gresik secara rutin melakukan uji laboratorium untuk memastikan kualitas air sungai tetap terjaga.

Pengambilan sampel air dilakukan di 12 titik sepanjang aliran Sungai Bengawan Solo yang melewati Kabupaten Gresik. Parameter yang diuji meliputi BOD, COD, pH, kandungan logam berat, dan coliform.

Hasil monitoring terbaru menunjukkan bahwa kualitas air di sebagian besar titik sampling masih memenuhi baku mutu lingkungan yang ditetapkan.`,
      ringkasan: 'Laboratorium Lingkungan DLH Gresik secara rutin melakukan uji laboratorium untuk memastikan kualitas air sungai tetap terjaga.',
      tanggalPublikasi: new Date('2024-01-05'),
      isPublished: true,
    },
  });

  // Pejabat Struktural
  const pejabatData = [
    { nama: 'Ir. Sri Subaidah, M.T.', jabatan: 'Kepala Dinas Lingkungan Hidup', level: 'kepala_dinas', urutan: 1 },
    { nama: 'Drs. Ahmad Fauzan, M.Si.', jabatan: 'Sekretaris', level: 'sekretaris', urutan: 2 },
    { nama: 'Ir. Budi Santoso', jabatan: 'Kepala Bidang Tata Lingkungan', level: 'kepala_bidang', urutan: 3 },
    { nama: 'Dewi Rahayu, S.T., M.T.', jabatan: 'Kepala Bidang Pengendalian Pencemaran', level: 'kepala_bidang', urutan: 4 },
    { nama: 'Hendra Gunawan, S.Sos.', jabatan: 'Kepala Bidang Kebersihan & Pertamanan', level: 'kepala_bidang', urutan: 5 },
    { nama: 'Dr. Rina Kusumawati, M.Si.', jabatan: 'Kepala UPT Laboratorium & TPA', level: 'kepala_upt', urutan: 6 },
  ];
  for (const p of pejabatData) {
    await prisma.pejabatStruktur.upsert({
      where: { id: p.urutan },
      update: {},
      create: p,
    });
  }

  // Dokumen DIDP
  const dokumenData = [
    { namaDokumen: 'Rencana Strategis (Renstra) DLH 2021-2026', tahun: 2021, kategori: 'renstra', filePdf: '/uploads/placeholder.pdf' },
    { namaDokumen: 'LKjIP Dinas Lingkungan Hidup 2023', tahun: 2023, kategori: 'kinerja', filePdf: '/uploads/placeholder.pdf' },
    { namaDokumen: 'Rencana Kerja (Renja) DLH 2024', tahun: 2024, kategori: 'renja', filePdf: '/uploads/placeholder.pdf' },
    { namaDokumen: 'Dokumen IKPLHD Kabupaten Gresik', tahun: 2022, kategori: 'lingkungan', filePdf: '/uploads/placeholder.pdf' },
  ];
  for (const d of dokumenData) {
    await prisma.dokumen.upsert({
      where: { id: dokumenData.indexOf(d) + 1 },
      update: {},
      create: d,
    });
  }

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hashedPassword, email: 'admin@dlhgresik.go.id' },
  });

  console.log('✅ Seeding selesai!');
  console.log('   📰 Berita: 3');
  console.log('   👤 Pejabat: 6');
  console.log('   📄 Dokumen: 4');
  console.log('   🔑 Admin: admin / admin123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

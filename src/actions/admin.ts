'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

// Helper to save file to public/uploads/
async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
}

// --- BERITA ACTIONS ---

export async function createBerita(formData: FormData) {
  const judul = formData.get('judul') as string;
  const slug = formData.get('slug') as string;
  const isi = formData.get('isi') as string;
  const ringkasan = formData.get('ringkasan') as string;
  const kategoriId = parseInt(formData.get('kategoriId') as string);
  const isPublished = formData.get('isPublished') === 'true';
  const gambarFile = formData.get('gambar') as File | null;

  let gambarPath = '';
  if (gambarFile && gambarFile.size > 0) {
    gambarPath = await uploadFile(gambarFile);
  }

  await prisma.berita.create({
    data: {
      judul,
      slug: slug || judul.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      isi,
      ringkasan,
      kategoriId: isNaN(kategoriId) ? null : kategoriId,
      isPublished,
      gambar: gambarPath || null,
      tanggalPublikasi: new Date(),
    },
  });

  revalidatePath('/berita');
  revalidatePath('/admin/berita');
}

export async function deleteBerita(id: number) {
  await prisma.berita.delete({ where: { id } });
  revalidatePath('/berita');
  revalidatePath('/admin/berita');
}

// --- PENGADUAN ACTIONS ---

export async function updatePengaduanStatus(id: number, status: string, catatanAdmin: string) {
  await prisma.pengaduan.update({
    where: { id },
    data: { status, catatanAdmin },
  });

  revalidatePath('/admin/pengaduan');
}

// --- DIDP DOKUMEN ACTIONS ---

export async function createDokumen(formData: FormData) {
  const namaDokumen = formData.get('namaDokumen') as string;
  const tahun = parseInt(formData.get('tahun') as string);
  const kategori = formData.get('kategori') as string;
  const pdfFile = formData.get('filePdf') as File;

  let pdfPath = '';
  if (pdfFile && pdfFile.size > 0) {
    pdfPath = await uploadFile(pdfFile);
  }

  await prisma.dokumen.create({
    data: {
      namaDokumen,
      tahun: isNaN(tahun) ? new Date().getFullYear() : tahun,
      kategori,
      filePdf: pdfPath,
      deskripsi: formData.get('deskripsi') as string,
    },
  });

  revalidatePath('/didp');
  revalidatePath('/admin/didp');
}

export async function deleteDokumen(id: number) {
  await prisma.dokumen.delete({ where: { id } });
  revalidatePath('/didp');
  revalidatePath('/admin/didp');
}

// --- GALERI ACTIONS ---

export async function createFotoGaleri(formData: FormData) {
  const judul = formData.get('judul') as string;
  const deskripsi = formData.get('deskripsi') as string;
  const gambarFile = formData.get('gambar') as File;

  let gambarPath = '';
  if (gambarFile && gambarFile.size > 0) {
    gambarPath = await uploadFile(gambarFile);
  }

  await prisma.fotoGaleri.create({
    data: {
      judul,
      deskripsi,
      gambar: gambarPath,
      tanggal: new Date(),
    },
  });

  revalidatePath('/galeri');
  revalidatePath('/admin/galeri');
}

export async function deleteFotoGaleri(id: number) {
  await prisma.fotoGaleri.delete({ where: { id } });
  revalidatePath('/galeri');
  revalidatePath('/admin/galeri');
}

// --- PEJABAT ACTIONS ---

export async function createPejabat(formData: FormData) {
  const nama = formData.get('nama') as string;
  const jabatan = formData.get('jabatan') as string;
  const level = formData.get('level') as string;
  const urutan = parseInt(formData.get('urutan') as string) || 0;
  const fotoFile = formData.get('foto') as File | null;

  let fotoPath = '';
  if (fotoFile && fotoFile.size > 0) {
    fotoPath = await uploadFile(fotoFile);
  }

  await prisma.pejabatStruktur.create({
    data: {
      nama,
      jabatan,
      level,
      urutan,
      foto: fotoPath || null,
    },
  });

  revalidatePath('/profil');
  revalidatePath('/admin/profil');
}

export async function deletePejabat(id: number) {
  await prisma.pejabatStruktur.delete({ where: { id } });
  revalidatePath('/profil');
  revalidatePath('/admin/profil');
}

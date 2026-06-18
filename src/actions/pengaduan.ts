'use server';

import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export type PengaduanState = {
  success?: boolean;
  error?: string;
  errors?: {
    namaLengkap?: string[];
    nik?: string[];
    email?: string[];
    noWhatsapp?: string[];
    kategori?: string[];
    isiPengaduan?: string[];
    bukti?: string[];
  };
};

export async function submitPengaduan(
  prevState: PengaduanState,
  formData: FormData
): Promise<PengaduanState> {
  const namaLengkap = formData.get('namaLengkap') as string;
  const nik = formData.get('nik') as string;
  const email = formData.get('email') as string;
  const noWhatsapp = formData.get('noWhatsapp') as string;
  const kategori = formData.get('kategori') as string;
  const isiPengaduan = formData.get('isiPengaduan') as string;
  const buktiFile = formData.get('bukti') as File | null;

  // Simple validation
  const errors: Record<string, string[]> = {};
  if (!namaLengkap || namaLengkap.trim().length < 3) {
    errors.namaLengkap = ['Nama lengkap minimal 3 karakter'];
  }
  if (!nik || nik.trim().length !== 16 || !/^\d+$/.test(nik)) {
    errors.nik = ['NIK harus berupa 16 digit angka'];
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.email = ['Alamat email tidak valid'];
  }
  if (!noWhatsapp || noWhatsapp.trim().length < 10) {
    errors.noWhatsapp = ['Nomor WhatsApp minimal 10 digit'];
  }
  if (!kategori) {
    errors.kategori = ['Kategori pengaduan harus dipilih'];
  }
  if (!isiPengaduan || isiPengaduan.trim().length < 20) {
    errors.isiPengaduan = ['Isi pengaduan minimal 20 karakter'];
  }

  // File validation and upload
  let buktiPath: string | null = null;
  if (buktiFile && buktiFile.size > 0) {
    if (buktiFile.size > 5 * 1024 * 1024) {
      errors.bukti = ['Ukuran file maksimal 5MB'];
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(buktiFile.type)) {
      errors.bukti = ['Format file harus berupa JPG, JPEG, PNG, atau PDF'];
    }

    if (Object.keys(errors).length === 0) {
      try {
        const bytes = await buktiFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filename = `${Date.now()}-${buktiFile.name.replace(/\s+/g, '_')}`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);
        buktiPath = `/uploads/${filename}`;
      } catch (err) {
        console.error('File upload error:', err);
        return { error: 'Gagal mengunggah file bukti pengaduan.' };
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    await prisma.pengaduan.create({
      data: {
        namaLengkap,
        nik,
        email,
        noWhatsapp,
        kategori,
        isiPengaduan,
        bukti: buktiPath,
        status: 'diterima',
      },
    });
    return { success: true };
  } catch (err) {
    console.error('Database save error:', err);
    return { error: 'Gagal mengirim pengaduan. Silakan coba lagi.' };
  }
}

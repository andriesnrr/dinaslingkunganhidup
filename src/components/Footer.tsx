'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import VisitorStats from '@/components/VisitorStats';

export default function Footer() {
  const pathname = usePathname();

  // Don't show public footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="w-full bg-white border-t border-outline-variant py-12 mt-auto">
      <div className="mx-auto max-w-[1280px] px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* About DLH */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo Kabupaten Gresik"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <div>
              <h3 className="text-lg font-extrabold text-primary">DLH</h3>
              <p className="text-[10px] font-semibold text-on-surface-variant uppercase">Kabupaten Gresik</p>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Dinas Lingkungan Hidup Kabupaten Gresik bertugas merumuskan dan melaksanakan kebijakan di bidang pengelolaan sampah, pengendalian pencemaran, dan kelestarian lingkungan hidup.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Navigasi Cepat</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm text-on-surface-variant">
            <li><Link href="/" className="hover:text-primary transition-colors">Beranda</Link></li>
            <li><Link href="/profil" className="hover:text-primary transition-colors">Profil</Link></li>
            <li><Link href="/didp" className="hover:text-primary transition-colors">DIDP</Link></li>
            <li><Link href="/berita" className="hover:text-primary transition-colors">Berita</Link></li>
            <li><Link href="/galeri" className="hover:text-primary transition-colors">Galeri</Link></li>
            <li><Link href="/pengaduan" className="hover:text-primary transition-colors">Pengaduan</Link></li>
            <li><Link href="/kontak" className="hover:text-primary transition-colors">Kontak</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Kontak Kami</h4>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-base mt-0.5">corporate_fare</span>
              <span>Jl. KH. Wachid Hasyim No.17, Pekelingan, Kec. Gresik, Kabupaten Gresik, Jawa Timur 61114</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">call</span>
              <a href="tel:0313981242" className="hover:text-primary transition-colors hover:underline">
                (031) 3981242
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">mail</span>
              <a href="mailto:info@dlhgresik.go.id" className="hover:text-primary transition-colors hover:underline">
                info@dlhgresik.go.id
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600 text-base">chat</span>
              <a
                href="https://wa.me/6282221742244"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-600 transition-colors hover:underline font-semibold"
              >
                0822-2174-2244 (WhatsApp)
              </a>
            </li>
          </ul>
        </div>

        {/* Visitor Stats */}
        <VisitorStats />
      </div>
      
      <div className="mx-auto max-w-[1280px] px-8 pt-8 mt-8 border-t border-outline-variant flex flex-col md:flex-row items-center justify-between text-xs text-on-surface-variant gap-4">
        <p>&copy; {new Date().getFullYear()} Dinas Lingkungan Hidup Kabupaten Gresik. Hak Cipta Dilindungi.</p>
        <p>Created for Dinas Lingkungan Hidup Gresik</p>
      </div>
    </footer>
  );
}

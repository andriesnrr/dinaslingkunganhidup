'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show public navbar on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/profil', label: 'Profil' },
    { href: '/didp', label: 'DIDP' },
    { href: '/berita', label: 'Berita' },
    { href: '/galeri', label: 'Galeri' },
    { href: '/pengaduan', label: 'Pengaduan' },
    { href: '/kontak', label: 'Kontak' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] h-20 items-center justify-between px-8">
        {/* Brand/Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo Kabupaten Gresik"
            width={40}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-primary leading-tight">
              DLH
            </h1>
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Kabupaten Gresik
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center h-full">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors py-2 border-b-2 ${
                isActive(link.href)
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-primary hover:border-outline-variant'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:112"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            Call 112 Pemkab Gresik
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface md:hidden"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="border-b border-outline-variant bg-white px-8 py-6 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-sm font-semibold py-2 ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:112"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              Call 112 Pemkab Gresik
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/ToastProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Dinas Lingkungan Hidup Kabupaten Gresik',
  description: 'Portal resmi Dinas Lingkungan Hidup Kabupaten Gresik. Akses data ISPU, pengaduan lingkungan, dokumen penting, galeri kegiatan, dan berita terkini.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=block"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-surface text-on-surface">
        <ToastProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}

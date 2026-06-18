'use client';

import React, { useTransition } from 'react';
import { useToast } from './ToastProvider';

interface DeleteButtonProps {
  action: () => Promise<void>;
  label?: string;
}

export default function DeleteButton({ action, label = 'Hapus' }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleClick = async () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.');
    if (confirmed) {
      startTransition(async () => {
        try {
          await action();
          showToast('Data berhasil dihapus!', 'success');
        } catch (error) {
          console.error('Failed to delete:', error);
          showToast('Gagal menghapus data. Silakan coba lagi.', 'error');
        }
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="px-3 py-1 bg-error/10 hover:bg-error/20 text-error rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center min-w-[60px]"
    >
      {isPending ? (
        <span className="animate-spin rounded-full h-3 w-3 border border-error border-t-transparent mr-1"></span>
      ) : null}
      {isPending ? 'Proses...' : label}
    </button>
  );
}

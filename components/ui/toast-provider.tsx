// components/ui/toast-provider.tsx
'use client';

import React, { useEffect } from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { SquishyButton } from '@/components/ui/squishy-button';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // ms, default 3500
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const toast = {
  success: (message: string, duration?: number) =>
    useToastStore.getState().addToast({ message, type: 'success', duration }),
  error: (message: string, duration?: number) =>
    useToastStore.getState().addToast({ message, type: 'error', duration }),
  info: (message: string, duration?: number) =>
    useToastStore.getState().addToast({ message, type: 'info', duration }),
  warning: (message: string, duration?: number) =>
    useToastStore.getState().addToast({ message, type: 'warning', duration }),
};

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration ?? 3500);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, removeToast]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-ps-success/20 text-ps-success',
    error: 'bg-ps-error/20 text-ps-error',
    warning: 'bg-ps-warning/20 text-ps-warning',
    info: 'bg-ps-primary/20 text-ps-primary',
  };

  const borderColors = {
    success: 'border-ps-success/20',
    error: 'border-ps-error/20',
    warning: 'border-ps-warning/20',
    info: 'border-ps-primary/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border min-w-[280px] max-w-[380px] shadow-xl bg-ps-bg-elevated/95 backdrop-blur-sm ${borderColors[toast.type]}`}
    >
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colors[toast.type]}`}>
        {icons[toast.type]}
      </div>
      <div className="text-sm text-white flex-1">{toast.message}</div>
      <SquishyButton
        variant="ghost"
        size="sm"
        onClick={() => removeToast(toast.id)}
        className="w-6 h-6 p-0 rounded-full shrink-0"
      >
        <X className="w-4 h-4" />
      </SquishyButton>
    </motion.div>
  );
}

export function ToastProvider() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 items-end pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

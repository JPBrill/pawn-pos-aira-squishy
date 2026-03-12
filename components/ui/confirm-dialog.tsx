// components/ui/confirm-dialog.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SquishyButton } from '@/components/ui/squishy-button';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  confirmLabel?: string;    // default "Confirm"
  cancelLabel?: string;     // default "Cancel"
  variant?: 'danger' | 'warning';  // default 'danger'
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Map 'warning' to 'outline' for SquishyButton since it doesn't have a 'warning' variant
  const buttonVariant = variant === 'warning' ? 'outline' : variant;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute z-50 mt-2 bg-ps-bg-elevated border border-white/10 rounded-2xl p-4 shadow-2xl w-64"
        >
          <p className="text-sm text-white mb-4">{message}</p>
          <div className="flex items-center gap-2">
            <SquishyButton variant="ghost" size="sm" className="flex-1" onClick={onCancel}>
              {cancelLabel}
            </SquishyButton>
            <SquishyButton variant={buttonVariant} size="sm" className="flex-1" onClick={onConfirm}>
              {confirmLabel}
            </SquishyButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

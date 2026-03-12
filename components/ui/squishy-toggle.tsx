import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface SquishyToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function SquishyToggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: SquishyToggleProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        whileTap={!disabled ? { scale: 0.92 } : undefined}
        className={cn(
          'relative w-11 h-6 rounded-full border transition-all duration-200 flex-shrink-0',
          checked
            ? 'bg-ps-primary/20 border-ps-primary/50'
            : 'bg-white/10 border-white/20',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-sm transition-transform duration-200',
            checked
              ? 'bg-ps-primary translate-x-6 shadow-[0_0_8px_var(--color-ps-primary)]'
              : 'bg-ps-text-muted translate-x-1'
          )}
        />
      </motion.button>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className={cn('text-sm font-medium', disabled ? 'text-ps-text-muted/50' : 'text-white')}>
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-ps-text-muted">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface SquishyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const SquishyInput = React.forwardRef<HTMLInputElement, SquishyInputProps>(
  ({ className, label, error, leftIcon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium uppercase tracking-wider text-ps-text-muted">
            {label}
          </label>
        )}
        <motion.div
          whileFocus={{ scale: 1.01 }}
          className="relative"
        >
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ps-text-muted pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-ps-bg-base border border-white/10 rounded-xl py-3 px-4 text-sm text-white transition-all",
              "focus:outline-none focus:ring-2 focus:ring-ps-primary focus:border-ps-primary/50",
              leftIcon && "pl-10",
              error && "border-ps-error/50 focus:ring-ps-error focus:border-ps-error/50",
              className
            )}
            {...props}
          />
        </motion.div>
        {error && <span className="text-xs text-ps-error mt-1">{error}</span>}
      </div>
    );
  }
);

SquishyInput.displayName = 'SquishyInput';

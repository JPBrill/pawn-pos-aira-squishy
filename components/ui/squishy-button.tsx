'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SquishyButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const SquishyButton = React.forwardRef<HTMLButtonElement, SquishyButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ps-primary disabled:pointer-events-none disabled:opacity-50 overflow-hidden rounded-xl";
    
    const variants = {
      primary: "bg-ps-primary text-ps-bg-base hover:bg-ps-primary-hover shadow-[0_0_15px_rgba(53,189,248,0.3)]",
      secondary: "bg-ps-secondary text-white hover:bg-ps-secondary/80",
      outline: "border-2 border-ps-primary/50 text-ps-primary hover:bg-ps-primary/10",
      ghost: "text-ps-text-muted hover:text-ps-text hover:bg-white/5",
      danger: "bg-ps-error/10 text-ps-error hover:bg-ps-error/20 border border-ps-error/50",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-sm",
      lg: "h-14 px-8 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </motion.button>
    );
  }
);
SquishyButton.displayName = "SquishyButton";

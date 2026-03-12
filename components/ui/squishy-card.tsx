'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SquishyCardProps extends Omit<HTMLMotionProps<"div">, "ref" | "children"> {
  interactive?: boolean;
  children?: React.ReactNode;
}

export const SquishyCard = React.forwardRef<HTMLDivElement, SquishyCardProps>(
  ({ className, interactive = false, children, ...props }, ref) => {
    
    const baseStyles = "bg-ps-bg-surface rounded-2xl border border-white/5 p-6 shadow-lg relative overflow-hidden";
    
    return (
      <motion.div
        ref={ref}
        whileHover={interactive ? { scale: 1.01, y: -2 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        transition={interactive ? { type: "spring", stiffness: 300, damping: 20 } : undefined}
        className={cn(
          baseStyles, 
          interactive && "cursor-pointer hover:border-ps-primary/30 hover:shadow-[0_0_20px_rgba(53,189,248,0.1)]", 
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
SquishyCard.displayName = "SquishyCard";

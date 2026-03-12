import React from 'react';
import { ItemStatus } from '@/types';
import { cn } from '@/lib/utils';

interface SquishyBadgeProps {
  status: ItemStatus;
  className?: string;
}

const statusConfig: Record<ItemStatus, { label: string; classes: string; dotClass: string }> = {
  DRAFT: {
    label: 'Draft',
    classes: 'bg-white/10 text-ps-text-muted border-white/20',
    dotClass: 'bg-ps-text-muted',
  },
  ON_LOAN: {
    label: 'On Loan',
    classes: 'bg-ps-warning/10 text-ps-warning border-ps-warning/30',
    dotClass: 'bg-ps-warning',
  },
  FOR_SALE: {
    label: 'For Sale',
    classes: 'bg-ps-primary/10 text-ps-primary border-ps-primary/30',
    dotClass: 'bg-ps-primary',
  },
  RESERVED: {
    label: 'Reserved',
    classes: 'bg-ps-secondary/10 text-ps-secondary border-ps-secondary/30',
    dotClass: 'bg-ps-secondary',
  },
  SOLD: {
    label: 'Sold',
    classes: 'bg-ps-success/10 text-ps-success border-ps-success/30',
    dotClass: 'bg-ps-success',
  },
  ARCHIVED: {
    label: 'Archived',
    classes: 'bg-white/5 text-ps-text-muted/50 border-white/10',
    dotClass: 'bg-ps-text-muted/50',
  },
};

export function SquishyBadge({ status, className }: SquishyBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.classes,
        className
      )}
    >
      <span className={cn('w-1 h-1 rounded-full', config.dotClass)} />
      {config.label}
    </span>
  );
}

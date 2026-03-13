// components/inventory/item-detail-panel.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { SquishyButton } from '@/components/ui/squishy-button';
import { SquishyBadge } from '@/components/ui/squishy-badge';
import { SquishyCard } from '@/components/ui/squishy-card';
import { SquishyToggle } from '@/components/ui/squishy-toggle';
import { SquishyInput } from '@/components/ui/squishy-input';
import { useInventoryStore, useUiStore } from '@/store';
import { InventoryItem } from '@/types';
import { toast } from '@/components/ui/toast-provider';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export function ItemDetailPanel({ item, onClose }: { item: InventoryItem | null; onClose: () => void }) {
  const { currency } = useUiStore();
  const setStatus = useInventoryStore((state) => state.setStatus);
  const updateItem = useInventoryStore((state) => state.updateItem);
  const [confirmAction, setConfirmAction] = useState<{ type: 'sold' | 'archive' } | null>(null);

  const handleTogglePublish = (checked: boolean) => {
    if (!item) return;
    updateItem(item.id, {
      ecommerce: { ...item.ecommerce, publishOnline: checked },
    });
    if (checked) {
      toast.success('Item published to online store.');
    } else {
      toast.info('Item removed from online store.');
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!item) return;
    updateItem(item.id, {
      ecommerce: { ...item.ecommerce, slug: e.target.value },
    });
  };

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-ps-bg-elevated border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-start justify-between p-6 border-b border-white/5 shrink-0">
              <div className="space-y-2 pr-4">
                <h2 className="text-2xl font-bold text-white leading-tight">{item.title}</h2>
                <SquishyBadge status={item.status} />
              </div>
              <SquishyButton variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0 rounded-full shrink-0">
                <X className="w-5 h-5" />
              </SquishyButton>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Details */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-ps-text-muted mb-1">Category</div>
                    <div className="text-sm text-white font-medium">{item.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-ps-text-muted mb-1">Condition</div>
                    <div className="text-sm text-white font-medium">{item.condition}</div>
                  </div>
                  <div>
                    <div className="text-xs text-ps-text-muted mb-1">Type</div>
                    <div className="text-sm text-white font-medium capitalize">{item.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-ps-text-muted mb-1">Date Received</div>
                    <div className="text-sm text-white font-medium">
                      {new Date(item.metadata.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {item.description && (
                  <div className="pt-2">
                    <div className="text-xs text-ps-text-muted mb-1">Description</div>
                    <p className="text-sm text-white/80 whitespace-pre-wrap">{item.description}</p>
                  </div>
                )}
              </section>

              {/* Pricing */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Pricing</h3>
                <div className="grid grid-cols-3 gap-3">
                  <SquishyCard className="p-3 bg-white/[0.02]">
                    <div className="text-[10px] uppercase tracking-wider text-ps-text-muted mb-1">Cost / Loan</div>
                    <div className="text-lg font-bold text-white font-mono">{currency}{item.costOrLoanAmount.toFixed(2)}</div>
                  </SquishyCard>
                  <SquishyCard className="p-3 bg-white/[0.02]">
                    <div className="text-[10px] uppercase tracking-wider text-ps-text-muted mb-1">Appraised</div>
                    <div className="text-lg font-bold text-white font-mono">{item.appraisedValue ? `${currency}${item.appraisedValue.toFixed(2)}` : '-'}</div>
                  </SquishyCard>
                  <SquishyCard className="p-3 bg-white/[0.02]">
                    <div className="text-[10px] uppercase tracking-wider text-ps-text-muted mb-1">Asking</div>
                    <div className="text-lg font-bold text-white font-mono">{item.askingPrice ? `${currency}${item.askingPrice.toFixed(2)}` : '-'}</div>
                  </SquishyCard>
                </div>
              </section>

              {/* Lifecycle Timeline */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Lifecycle Timeline</h3>
                <div className="relative pl-4 border-l-2 border-white/10 pb-2">
                  <div className="absolute w-2.5 h-2.5 bg-ps-primary rounded-full -left-[5.5px] top-1.5 shadow-[0_0_8px_var(--color-ps-primary)]" />
                  <div className="text-sm text-white font-medium">Item received</div>
                  <div className="text-xs text-ps-text-muted mt-0.5">
                    {new Date(item.metadata.createdAt).toLocaleString()}
                  </div>
                </div>
              </section>

              {/* Actions */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Actions</h3>
                <div className="flex flex-wrap gap-3 relative">
                  {(item.status === 'ON_LOAN' || item.status === 'DRAFT') && (
                    <SquishyButton onClick={() => {if (
                      window.confirm('Mark this item as For Sale?')) {
                      updateItem(item.id, { status: 'FOR_SALE' });
                      toast.success('Item marked as For Sale.'); }}}>
                      Mark For Sale
                    </SquishyButton>
                  )}
                  {item.status === 'FOR_SALE' && (
                    <SquishyButton onClick={() => { setStatus(item.id, 'ON_LOAN'); toast.success('Item marked as On Loan.'); }}>
                      Mark On Loan
                    </SquishyButton>
                  )}
                  <SquishyButton className="bg-ps-error text-white hover:bg-ps-error/80" onClick={() => setConfirmAction({ type: 'sold' })}>
                    Mark Sold
                  </SquishyButton>
                  <SquishyButton variant="ghost" onClick={() => setConfirmAction({ type: 'archive' })}>
                    Archive
                  </SquishyButton>

                  <ConfirmDialog
                    isOpen={!!confirmAction}
                    message={confirmAction?.type === 'sold' 
                      ? 'Mark this item as sold? This cannot be undone.' 
                      : 'Archive this item? It will be hidden from active inventory.'}
                    confirmLabel={confirmAction?.type === 'sold' ? 'Mark Sold' : 'Archive'}
                    onConfirm={() => {
                      if (confirmAction?.type === 'sold') {
                        setStatus(item.id, 'SOLD');
                        toast.success('Item marked as Sold.');
                      } else {
                        setStatus(item.id, 'ARCHIVED');
                        toast.info('Item archived.');
                      }
                      setConfirmAction(null);
                    }}
                    onCancel={() => setConfirmAction(null)}
                  />
                </div>
              </section>

              {/* Ecommerce */}
              <section className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Ecommerce</h3>
                <SquishyToggle
                  checked={item.ecommerce.publishOnline}
                  onChange={handleTogglePublish}
                  label="Publish Online"
                  description="Make this item available in your online storefront."
                />
                {item.ecommerce.publishOnline && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-3 space-y-3"
                  >
                    <SquishyInput
                      label="URL Slug"
                      value={item.ecommerce.slug || ''}
                      onChange={handleSlugChange}
                      placeholder="e.g. vintage-fender-stratocaster"
                    />
                    <p className="text-xs text-ps-primary/80 bg-ps-primary/10 p-3 rounded-xl border border-ps-primary/20">
                      This item will appear in the online store.
                    </p>
                  </motion.div>
                )}
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

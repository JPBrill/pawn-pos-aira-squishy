// components/inventory/item-form-modal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { SquishyButton } from '@/components/ui/squishy-button';
import { SquishyInput } from '@/components/ui/squishy-input';
import { useInventoryStore, useUiStore } from '@/store';
import { ItemType, InventoryItem, ItemStatus } from '@/types';
import { toast } from '@/components/ui/toast-provider';

export function ItemFormModal({ isOpen, onClose, item }: { isOpen: boolean; onClose: () => void; item?: InventoryItem }) {
  const { currency } = useUiStore();
  const addItem = useInventoryStore((state) => state.addItem);
  const updateItem = useInventoryStore((state) => state.updateItem);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('Good');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ItemType>('purchase');
  const [cost, setCost] = useState('');
  const [appraised, setAppraised] = useState('');
  const [asking, setAsking] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ItemStatus>('FOR_SALE');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => {
        if (item) {
          setTitle(item.title);
          setCategory(item.category);
          setCondition(item.condition);
          setDescription(item.description || '');
          setType(item.type);
          setCost(item.costOrLoanAmount.toString());
          setAppraised(item.appraisedValue?.toString() || '');
          setAsking(item.askingPrice?.toString() || '');
          setNotes(item.metadata.notes || '');
          setStatus(item.status);
        } else {
          setTitle('');
          setCategory('');
          setCondition('Good');
          setDescription('');
          setType('purchase');
          setCost('');
          setAppraised('');
          setAsking('');
          setNotes('');
          setStatus('FOR_SALE');
        }
        setErrors({});
      }, 0);
    }
    return () => clearTimeout(timer);
  }, [isOpen, item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!category.trim()) newErrors.category = 'Category is required';
    if (cost === '' || cost === undefined || cost === null) {
      newErrors.cost = 'Cost or loan amount is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields.');
      return;
    }

    const now = new Date().toISOString();
    
    if (item) {
      updateItem(item.id, {
        title: title.trim(),
        category: category.trim(),
        condition,
        description: description.trim() || undefined,
        type,
        costOrLoanAmount: parseFloat(cost),
        appraisedValue: appraised ? parseFloat(appraised) : undefined,
        askingPrice: asking ? parseFloat(asking) : undefined,
        status,
        metadata: {
          ...item.metadata,
          updatedAt: now,
          notes: notes.trim() || undefined,
        },
      });
      toast.success('Item updated successfully.');
    } else {
      const newItem: InventoryItem = {
        id: crypto.randomUUID(),
        title: title.trim(),
        category: category.trim(),
        condition,
        description: description.trim() || undefined,
        type,
        costOrLoanAmount: parseFloat(cost),
        appraisedValue: appraised ? parseFloat(appraised) : undefined,
        askingPrice: asking ? parseFloat(asking) : undefined,
        status: type === 'purchase' ? 'FOR_SALE' : 'ON_LOAN',
        ecommerce: {
          publishOnline: false,
          imageUrls: [],
        },
        metadata: {
          createdAt: now,
          updatedAt: now,
          notes: notes.trim() || undefined,
        },
      };

      addItem(newItem);
      toast.success('Item added to inventory.');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl h-full md:h-auto max-h-full bg-ps-bg-elevated border border-white/10 rounded-2xl flex flex-col pointer-events-auto overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
                <h2 className="text-xl font-bold text-white">{item ? 'Edit Item' : 'Receive Item'}</h2>
                <SquishyButton variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0 rounded-full">
                  <X className="w-5 h-5" />
                </SquishyButton>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form id="item-form" onSubmit={handleSubmit} className="space-y-8">
                  {/* Item Details */}
                  <section className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Item Details</h3>
                    <SquishyInput
                      label="Title *"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      error={errors.title}
                      placeholder="e.g. Vintage Fender Stratocaster"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-ps-text-muted">Category *</label>
                        <input
                          list="categories"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className={`w-full bg-ps-bg-base border ${errors.category ? 'border-ps-error/50 focus:ring-ps-error' : 'border-white/10 focus:border-ps-primary/50 focus:ring-ps-primary'} rounded-xl py-3 px-4 text-sm text-white transition-all focus:outline-none focus:ring-2`}
                          placeholder="Select or type..."
                        />
                        <datalist id="categories">
                          {["Electronics", "Jewellery", "Tools", "Musical Instruments", "Clothing", "Collectibles", "Sports", "Other"].map(c => <option key={c} value={c} />)}
                        </datalist>
                        {errors.category && <span className="text-xs text-ps-error mt-1">{errors.category}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-ps-text-muted">Condition *</label>
                        <select
                          value={condition}
                          onChange={(e) => setCondition(e.target.value)}
                          className="w-full bg-ps-bg-base border border-white/10 rounded-xl py-3 px-4 text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-ps-primary focus:border-ps-primary/50 appearance-none"
                        >
                          {["Mint", "Excellent", "Good", "Fair", "Poor"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium uppercase tracking-wider text-ps-text-muted">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full bg-ps-bg-base border border-white/10 rounded-xl py-3 px-4 text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-ps-primary focus:border-ps-primary/50 resize-none"
                        placeholder="Detailed description of the item..."
                      />
                    </div>
                  </section>

                  {/* Pricing */}
                  <section className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Pricing</h3>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium uppercase tracking-wider text-ps-text-muted">Item Type *</label>
                      <div className="flex items-center gap-2 bg-ps-bg-base p-1 rounded-xl border border-white/10">
                        <SquishyButton
                          type="button"
                          variant={type === 'purchase' ? 'primary' : 'ghost'}
                          className="flex-1"
                          onClick={() => setType('purchase')}
                        >
                          Purchase
                        </SquishyButton>
                        <SquishyButton
                          type="button"
                          variant={type === 'pawn' ? 'primary' : 'ghost'}
                          className="flex-1"
                          onClick={() => setType('pawn')}
                        >
                          Pawn
                        </SquishyButton>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SquishyInput
                        label="Cost / Loan *"
                        type="number"
                        step="0.01"
                        min="0"
                        leftIcon={<span className="text-sm">{currency}</span>}
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        error={errors.cost}
                      />
                      <SquishyInput
                        label="Appraised Value"
                        type="number"
                        step="0.01"
                        min="0"
                        leftIcon={<span className="text-sm">{currency}</span>}
                        value={appraised}
                        onChange={(e) => setAppraised(e.target.value)}
                      />
                      <SquishyInput
                        label="Asking Price"
                        type="number"
                        step="0.01"
                        min="0"
                        leftIcon={<span className="text-sm">{currency}</span>}
                        value={asking}
                        onChange={(e) => setAsking(e.target.value)}
                      />
                    </div>
                  </section>

                  {/* Status (Edit Mode Only) */}
                  {item && (
                    <section className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Status</h3>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-ps-text-muted">Current Status</label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as ItemStatus)}
                          className="w-full bg-ps-bg-base border border-white/10 rounded-xl py-3 px-4 text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-ps-primary focus:border-ps-primary/50 appearance-none"
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="ON_LOAN">On Loan</option>
                          <option value="FOR_SALE">For Sale</option>
                          <option value="RESERVED">Reserved</option>
                          <option value="SOLD">Sold</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </div>
                    </section>
                  )}

                  {/* Notes */}
                  <section className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Notes</h3>
                    <div className="flex flex-col gap-1.5">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        className="w-full bg-ps-bg-base border border-white/10 rounded-xl py-3 px-4 text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-ps-primary focus:border-ps-primary/50 resize-none"
                        placeholder="Internal notes (not visible to customers)..."
                      />
                    </div>
                  </section>
                </form>
              </div>

              <div className="p-6 border-t border-white/5 flex items-center justify-end gap-3 shrink-0">
                <SquishyButton variant="ghost" onClick={onClose}>Cancel</SquishyButton>
                <SquishyButton type="submit" form="item-form">Save Item</SquishyButton>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

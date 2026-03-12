import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Plus } from 'lucide-react';
import { SquishyButton } from '@/components/ui/squishy-button';
import { SquishyInput } from '@/components/ui/squishy-input';
import { useInventoryStore, useCustomerStore, useQuoteStore, useUiStore } from '@/store';
import { LineItem, QuoteStatus } from '@/types';

export function QuoteBuilderModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { currency, taxRate } = useUiStore();
  const customers = useCustomerStore((state) => state.customers);
  const inventoryItems = useInventoryStore((state) => state.items);
  const addQuote = useQuoteStore((state) => state.addQuote);

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const availableItems = useMemo(() => {
    return inventoryItems.filter(item => 
      item.status !== 'SOLD' && 
      item.status !== 'ARCHIVED' &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [inventoryItems, searchQuery]);

  React.useEffect(() => {
    if (isOpen) {
      setLineItems([]);
      setCustomerId('');
      setValidUntil('');
      setNotes('');
      setDiscount(0);
      setIsSearching(false);
      setSearchQuery('');
    }
  }, [isOpen]);

  const subtotal = lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const afterDiscount = Math.max(0, subtotal - discount);
  const taxAmount = afterDiscount * (taxRate / 100);
  const total = afterDiscount + taxAmount;

  const handleSave = (status: QuoteStatus) => {
    addQuote({
      id: crypto.randomUUID(),
      quoteNumber: `QUO-${Date.now()}`,
      customerId: customerId || undefined,
      lineItems: [...lineItems],
      taxRate,
      discount,
      total,
      status,
      createdAt: new Date().toISOString(),
      validUntil: validUntil || undefined,
    });
    onClose();
  };

  const addManualLine = () => {
    setLineItems([...lineItems, { description: '', price: 0, quantity: 1 }]);
  };

  const addInventoryItem = (item: any) => {
    setLineItems([...lineItems, { 
      itemId: item.id, 
      description: item.title, 
      price: item.askingPrice || item.costOrLoanAmount || 0, 
      quantity: 1 
    }]);
    setIsSearching(false);
    setSearchQuery('');
  };

  const updateLineItem = (index: number, updates: Partial<LineItem>) => {
    const newItems = [...lineItems];
    newItems[index] = { ...newItems[index], ...updates };
    setLineItems(newItems);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
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
              className="w-full h-full bg-ps-bg-elevated border border-white/10 rounded-2xl flex flex-col pointer-events-auto overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
                <h2 className="text-xl font-bold text-white">New Quote</h2>
                <SquishyButton variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0 rounded-full">
                  <X className="w-5 h-5" />
                </SquishyButton>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                {/* Left Column: Line Items */}
                <div className="flex-1 flex flex-col border-r border-white/5 overflow-hidden">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-ps-text-muted">Quote Items</h3>
                    <div className="flex items-center gap-2">
                      <SquishyButton variant="outline" size="sm" onClick={() => setIsSearching(true)}>
                        <Search className="w-4 h-4 mr-2" /> Add Item
                      </SquishyButton>
                      <SquishyButton variant="outline" size="sm" onClick={addManualLine}>
                        <Plus className="w-4 h-4 mr-2" /> Add Manual Line
                      </SquishyButton>
                    </div>
                  </div>

                  {isSearching && (
                    <div className="p-4 bg-white/[0.02] border-b border-white/5 shrink-0">
                      <div className="flex items-center gap-2 mb-4">
                        <SquishyInput
                          placeholder="Search inventory..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1"
                          autoFocus
                        />
                        <SquishyButton variant="ghost" size="sm" onClick={() => setIsSearching(false)}>
                          <X className="w-4 h-4" />
                        </SquishyButton>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {availableItems.map(item => (
                          <div 
                            key={item.id} 
                            className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer"
                            onClick={() => addInventoryItem(item)}
                          >
                            <div>
                              <div className="text-sm text-white font-medium">{item.title}</div>
                              <div className="text-xs text-ps-text-muted">{item.category}</div>
                            </div>
                            <div className="text-sm text-cyan-400 font-mono">
                              {currency}{(item.askingPrice || item.costOrLoanAmount || 0).toFixed(2)}
                            </div>
                          </div>
                        ))}
                        {availableItems.length === 0 && (
                          <div className="text-center text-sm text-ps-text-muted py-4">No items found</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-6">
                    {lineItems.length === 0 ? (
                      <div className="h-full flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
                        <span className="text-ps-text-muted">Add items to this quote</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {lineItems.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                            <div className="flex-1">
                              <SquishyInput
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => updateLineItem(index, { description: e.target.value })}
                              />
                            </div>
                            <div className="w-20">
                              <SquishyInput
                                type="number"
                                min="1"
                                placeholder="Qty"
                                value={item.quantity}
                                onChange={(e) => updateLineItem(index, { quantity: parseInt(e.target.value) || 1 })}
                              />
                            </div>
                            <div className="w-28">
                              <SquishyInput
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Price"
                                value={item.price}
                                onChange={(e) => updateLineItem(index, { price: parseFloat(e.target.value) || 0 })}
                                className="font-mono"
                              />
                            </div>
                            <div className="w-24 flex items-center justify-end h-[42px] text-cyan-400 font-mono font-medium">
                              {currency}{(item.price * item.quantity).toFixed(2)}
                            </div>
                            <SquishyButton 
                              variant="ghost" 
                              className="w-10 h-[42px] p-0 text-ps-error hover:bg-ps-error/10 hover:text-ps-error shrink-0"
                              onClick={() => removeLineItem(index)}
                            >
                              <X className="w-4 h-4" />
                            </SquishyButton>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Summary */}
                <div className="w-full lg:w-80 shrink-0 flex flex-col bg-ps-bg-base">
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Details</h3>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-ps-text-muted">Customer</label>
                        <select
                          value={customerId}
                          onChange={(e) => setCustomerId(e.target.value)}
                          className="w-full bg-ps-bg-elevated border border-white/10 rounded-xl py-3 px-4 text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-ps-primary focus:border-ps-primary/50 appearance-none"
                        >
                          <option value="">Walk-in / No customer</option>
                          {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <SquishyInput
                        label="Valid Until"
                        type="date"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                      />
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-ps-text-muted">Notes</label>
                        <textarea
                          rows={2}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full bg-ps-bg-elevated border border-white/10 rounded-xl py-3 px-4 text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-ps-primary focus:border-ps-primary/50 resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-ps-text-muted">Subtotal</span>
                          <span className="text-white font-mono">{currency}{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-ps-text-muted">Discount</span>
                          <div className="w-24">
                            <SquishyInput
                              type="number"
                              min="0"
                              step="0.01"
                              value={discount || ''}
                              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                              className="h-8 text-right font-mono"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-ps-text-muted">Tax ({taxRate}%)</span>
                          <span className="text-white font-mono">{currency}{taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-white/10 my-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-base font-bold text-white">Total</span>
                          <span className="text-xl font-bold text-white font-mono">{currency}{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-white/5 space-y-3 shrink-0">
                    <SquishyButton 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleSave('DRAFT')}
                    >
                      Save Draft
                    </SquishyButton>
                    <SquishyButton 
                      className="w-full"
                      onClick={() => handleSave('SENT')}
                    >
                      Create Quote
                    </SquishyButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

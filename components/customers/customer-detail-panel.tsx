import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Edit2, Copy, FileText, Receipt } from 'lucide-react';
import Link from 'next/link';
import { SquishyButton } from '@/components/ui/squishy-button';
import { SquishyCard } from '@/components/ui/squishy-card';
import { useQuoteStore, useInvoiceStore, useUiStore } from '@/store';
import { Customer } from '@/types';

export function CustomerDetailPanel({ customer, onClose, onEdit }: { customer: Customer | null; onClose: () => void; onEdit: (customer: Customer) => void }) {
  const { currency } = useUiStore();
  const quotes = useQuoteStore((state) => state.quotes);
  const invoices = useInvoiceStore((state) => state.invoices);

  if (!customer) return null;

  const customerQuotes = quotes.filter(q => q.customerId === customer.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const customerInvoices = invoices.filter(i => i.customerId === customer.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalSpent = customerInvoices.reduce((sum, inv) => sum + inv.total, 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <AnimatePresence>
      {customer && (
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
            className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-ps-bg-elevated border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-start justify-between p-6 border-b border-white/5 shrink-0">
              <div className="space-y-1 pr-4">
                <h2 className="text-2xl font-bold text-white leading-tight">{customer.name}</h2>
                <div className="text-sm text-ps-text-muted">
                  Member since {formatMemberSince(customer.createdAt)}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <SquishyButton variant="outline" size="sm" onClick={() => onEdit(customer)} className="w-8 h-8 p-0 rounded-full">
                  <Edit2 className="w-4 h-4" />
                </SquishyButton>
                <SquishyButton variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0 rounded-full">
                  <X className="w-5 h-5" />
                </SquishyButton>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Contact Details */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Contact Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-ps-text-muted">Phone</div>
                    <div className="flex items-center gap-2 group">
                      <span className="text-sm text-white font-medium">{customer.phone || '—'}</span>
                      {customer.phone && (
                        <button onClick={() => copyToClipboard(customer.phone!)} className="text-ps-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-ps-text-muted">Email</div>
                    <div className="flex items-center gap-2 group">
                      <span className="text-sm text-white font-medium truncate">{customer.email || '—'}</span>
                      {customer.email && (
                        <button onClick={() => copyToClipboard(customer.email!)} className="text-ps-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-ps-text-muted">ID Number</div>
                    <div className="flex items-center gap-2 group">
                      <span className="text-sm text-white font-medium font-mono">{customer.idNumber || '—'}</span>
                      {customer.idNumber && (
                        <button onClick={() => copyToClipboard(customer.idNumber!)} className="text-ps-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {customer.notes && (
                  <div className="pt-2">
                    <div className="text-xs text-ps-text-muted mb-1">Notes</div>
                    <p className="text-sm text-white/80 whitespace-pre-wrap">{customer.notes}</p>
                  </div>
                )}
              </section>

              {/* Activity Summary */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Activity Summary</h3>
                <div className="grid grid-cols-3 gap-3">
                  <SquishyCard className="p-3 bg-white/[0.02]">
                    <div className="text-[10px] uppercase tracking-wider text-ps-text-muted mb-1">Total Quotes</div>
                    <div className="text-xl font-bold text-white">{customerQuotes.length}</div>
                  </SquishyCard>
                  <SquishyCard className="p-3 bg-white/[0.02]">
                    <div className="text-[10px] uppercase tracking-wider text-ps-text-muted mb-1">Total Invoices</div>
                    <div className="text-xl font-bold text-white">{customerInvoices.length}</div>
                  </SquishyCard>
                  <SquishyCard className="p-3 bg-white/[0.02]">
                    <div className="text-[10px] uppercase tracking-wider text-ps-text-muted mb-1">Total Spent</div>
                    <div className="text-xl font-bold text-white font-mono">{currency}{totalSpent.toFixed(2)}</div>
                  </SquishyCard>
                </div>
              </section>

              {/* Recent Quotes */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Recent Quotes</h3>
                  {customerQuotes.length > 0 && (
                    <Link href="/documents" className="text-xs text-ps-primary hover:underline">View All</Link>
                  )}
                </div>
                {customerQuotes.length > 0 ? (
                  <div className="space-y-2">
                    {customerQuotes.slice(0, 3).map(quote => (
                      <div key={quote.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-ps-text-muted" />
                          <div>
                            <div className="text-sm font-mono text-white">{quote.quoteNumber}</div>
                            <div className="text-xs text-ps-text-muted">{new Date(quote.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-sm font-mono text-cyan-400">{currency}{quote.total.toFixed(2)}</div>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                            quote.status === 'DRAFT' ? 'bg-gray-500/10 text-gray-400' :
                            quote.status === 'SENT' ? 'bg-cyan-500/10 text-cyan-400' :
                            quote.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-400' :
                            quote.status === 'CONVERTED' ? 'bg-violet-500/10 text-violet-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {quote.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-ps-text-muted italic">No quotes yet</div>
                )}
              </section>

              {/* Recent Invoices */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Recent Invoices</h3>
                  {customerInvoices.length > 0 && (
                    <Link href="/documents" className="text-xs text-ps-primary hover:underline">View All</Link>
                  )}
                </div>
                {customerInvoices.length > 0 ? (
                  <div className="space-y-2">
                    {customerInvoices.slice(0, 3).map(invoice => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-3">
                          <Receipt className="w-4 h-4 text-ps-text-muted" />
                          <div>
                            <div className="text-sm font-mono text-white">{invoice.invoiceNumber}</div>
                            <div className="text-xs text-ps-text-muted">{new Date(invoice.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-sm font-mono text-cyan-400">{currency}{invoice.total.toFixed(2)}</div>
                          {invoice.paymentMethod && (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                              invoice.paymentMethod === 'CASH' ? 'bg-green-500/10 text-green-400' :
                              invoice.paymentMethod === 'CARD' ? 'bg-cyan-500/10 text-cyan-400' :
                              'bg-gray-500/10 text-gray-400'
                            }`}>
                              {invoice.paymentMethod}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-ps-text-muted italic">No invoices yet</div>
                )}
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

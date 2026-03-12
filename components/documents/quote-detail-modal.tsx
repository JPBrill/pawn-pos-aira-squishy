import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { SquishyButton } from '@/components/ui/squishy-button';
import { useCustomerStore, useUiStore, useQuoteStore, useInvoiceStore } from '@/store';
import { Quote, Invoice } from '@/types';

export function QuoteDetailModal({ quote, onClose }: { quote: Quote | null; onClose: () => void }) {
  const { currency, shopName } = useUiStore();
  const customers = useCustomerStore((state) => state.customers);

  const getCustomerName = (id?: string) => {
    if (!id) return 'Walk-in';
    const customer = customers.find(c => c.id === id);
    return customer ? customer.name : 'Unknown';
  };

  const convertToInvoice = () => {
    if (!quote) return;
    const invoice: Invoice = {
      id: crypto.randomUUID(),
      invoiceNumber: `INV-${Date.now()}`,
      quoteId: quote.id,
      customerId: quote.customerId,
      lineItems: quote.lineItems,
      taxRate: quote.taxRate,
      discount: quote.discount,
      total: quote.total,
      paymentMethod: undefined,
      createdAt: new Date().toISOString(),
    };
    useInvoiceStore.getState().addInvoice(invoice);
    useQuoteStore.getState().updateQuote(quote.id, { status: 'CONVERTED' });
    onClose();
  };

  const subtotal = quote?.lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const taxAmount = quote ? (subtotal - (quote.discount || 0)) * (quote.taxRate / 100) : 0;

  return (
    <AnimatePresence>
      {quote && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm print:hidden"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none print:p-0 print:static print:block">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl max-h-full bg-ps-bg-elevated border border-white/10 rounded-2xl flex flex-col pointer-events-auto overflow-hidden print-document print:border-none print:rounded-none print:shadow-none print:bg-white print:text-black print:h-auto print:overflow-visible"
            >
              <div className="flex items-start justify-between p-8 border-b border-white/5 shrink-0 print:border-gray-200">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-ps-text-muted mb-2 print:text-gray-500">Quote</div>
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-white font-mono print:text-black">{quote.quoteNumber}</h2>
                    <span className={`print:hidden inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
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
                <SquishyButton variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0 rounded-full print:hidden">
                  <X className="w-5 h-5" />
                </SquishyButton>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 print:overflow-visible">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <div className="text-sm text-ps-text-muted print:text-gray-500">Prepared for</div>
                    <div className="text-base font-medium text-white print:text-black">{getCustomerName(quote.customerId)}</div>
                    <div className="text-sm text-ps-text-muted mt-4 print:text-gray-500">Date</div>
                    <div className="text-sm text-white print:text-black">{new Date(quote.createdAt).toLocaleDateString()}</div>
                    {quote.validUntil && (
                      <>
                        <div className="text-sm text-ps-text-muted mt-2 print:text-gray-500">Valid Until</div>
                        <div className="text-sm text-white print:text-black">{new Date(quote.validUntil).toLocaleDateString()}</div>
                      </>
                    )}
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm text-ps-text-muted print:text-gray-500">From</div>
                    <div className="text-base font-medium text-white print:text-black">{shopName}</div>
                  </div>
                </div>

                <div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 print:border-gray-300">
                        <th className="py-3 text-xs font-bold uppercase tracking-wider text-ps-text-muted print:text-gray-500">Description</th>
                        <th className="py-3 text-xs font-bold uppercase tracking-wider text-ps-text-muted text-right print:text-gray-500">Qty</th>
                        <th className="py-3 text-xs font-bold uppercase tracking-wider text-ps-text-muted text-right print:text-gray-500">Unit Price</th>
                        <th className="py-3 text-xs font-bold uppercase tracking-wider text-ps-text-muted text-right print:text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print:divide-gray-200">
                      {quote.lineItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-4 text-sm text-white print:text-black">{item.description}</td>
                          <td className="py-4 text-sm text-white text-right print:text-black">{item.quantity}</td>
                          <td className="py-4 text-sm text-white font-mono text-right print:text-black">{currency}{item.price.toFixed(2)}</td>
                          <td className="py-4 text-sm text-white font-mono text-right print:text-black">{currency}{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end totals-section">
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-ps-text-muted print:text-gray-500">Subtotal</span>
                      <span className="text-white font-mono print:text-black">{currency}{subtotal.toFixed(2)}</span>
                    </div>
                    {quote.discount ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-ps-text-muted print:text-gray-500">Discount</span>
                        <span className="text-white font-mono print:text-black">-{currency}{quote.discount.toFixed(2)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-sm">
                      <span className="text-ps-text-muted print:text-gray-500">Tax ({quote.taxRate}%)</span>
                      <span className="text-white font-mono print:text-black">{currency}{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-white/10 my-2 print:bg-gray-300" />
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-white print:text-black">Total</span>
                      <span className="text-xl font-bold text-white font-mono print:text-black">{currency}{quote.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 flex items-center justify-end gap-3 shrink-0 print:hidden">
                <SquishyButton variant="outline" onClick={() => window.print()}>Print / Save PDF</SquishyButton>
                <SquishyButton onClick={convertToInvoice}>Convert to Invoice</SquishyButton>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

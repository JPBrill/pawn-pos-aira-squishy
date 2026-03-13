import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { SquishyButton } from '@/components/ui/squishy-button';
import { useCustomerStore, useUiStore } from '@/store';
import { Invoice } from '@/types';

export function InvoiceDetailModal({ invoice, onClose }: { invoice: Invoice | null; onClose: () => void }) {
  const { currency, shopName } = useUiStore();
  const customers = useCustomerStore((state) => state.customers);

  const getCustomerName = (id?: string) => {
    if (!id) return 'Walk-in';
    const customer = customers.find(c => c.id === id);
    return customer ? customer.name : 'Unknown';
  };

  const subtotal = invoice?.lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const taxAmount = invoice ? (subtotal - (invoice.discount || 0)) * (invoice.taxRate / 100) : 0;

  return (
    <AnimatePresence>
      {invoice && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm print:hidden"
            onClick={onClose}
          />
         <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl max-h-full bg-ps-bg-elevated border border-white/10 rounded-2xl flex flex-col pointer-events-auto overflow-hidden print-document print:border-none print:rounded-none print:shadow-none print:bg-white print:text-black print:h-auto print:overflow-visible"
            >
              <div className="flex items-start justify-between p-8 border-b border-white/5 shrink-0 print:border-gray-200">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-ps-text-muted mb-2 print:text-gray-500">Invoice</div>
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-white font-mono print:text-black">{invoice.invoiceNumber}</h2>
                    {invoice.paymentMethod && (
                      <span className={`print:hidden inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        invoice.paymentMethod === 'CASH' ? 'bg-green-500/10 text-green-400' :
                        invoice.paymentMethod === 'CARD' ? 'bg-cyan-500/10 text-cyan-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {invoice.paymentMethod}
                      </span>
                    )}
                  </div>
                </div>
                <SquishyButton variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0 rounded-full print:hidden">
                  <X className="w-5 h-5" />
                </SquishyButton>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 print:overflow-visible">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <div className="text-sm text-ps-text-muted print:text-gray-500">Billed to</div>
                    <div className="text-base font-medium text-white print:text-black">{getCustomerName(invoice.customerId)}</div>
                    <div className="text-sm text-ps-text-muted mt-4 print:text-gray-500">Date</div>
                    <div className="text-sm text-white print:text-black">{new Date(invoice.createdAt).toLocaleDateString()}</div>
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
                      {invoice.lineItems.map((item, idx) => (
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
                    {invoice.discount ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-ps-text-muted print:text-gray-500">Discount</span>
                        <span className="text-white font-mono print:text-black">-{currency}{invoice.discount.toFixed(2)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-sm">
                      <span className="text-ps-text-muted print:text-gray-500">Tax ({invoice.taxRate}%)</span>
                      <span className="text-white font-mono print:text-black">{currency}{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-white/10 my-2 print:bg-gray-300" />
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-white print:text-black">Total</span>
                      <span className="text-xl font-bold text-white font-mono print:text-black">{currency}{invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 flex items-center justify-end gap-3 shrink-0 print:hidden">
                <SquishyButton variant="outline" onClick={() => window.print()}>Print / Save PDF</SquishyButton>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

'use client';

import React, { useState } from 'react';
import { FileText, Receipt, ArrowRight, Eye, Search } from 'lucide-react';
import { SquishyCard } from '@/components/ui/squishy-card';
import { SquishyButton } from '@/components/ui/squishy-button';
import { SquishyInput } from '@/components/ui/squishy-input';
import { useQuoteStore, useInvoiceStore, useCustomerStore, useUiStore } from '@/store';
import { Quote, Invoice } from '@/types';
import { QuoteBuilderModal } from '@/components/documents/quote-builder-modal';
import { QuoteDetailModal } from '@/components/documents/quote-detail-modal';
import { InvoiceDetailModal } from '@/components/documents/invoice-detail-modal';
import { toast } from '@/components/ui/toast-provider';

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<'quotes' | 'invoices'>('quotes');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isQuoteBuilderOpen, setIsQuoteBuilderOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [convertingQuote, setConvertingQuote] = useState<Quote | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'CASH' | 'CARD' | 'OTHER'>('CASH');


  const quotes = useQuoteStore((state) => state.quotes);
  const invoices = useInvoiceStore((state) => state.invoices);
  const customers = useCustomerStore((state) => state.customers);
  const { currency } = useUiStore();

  const getCustomerName = (id?: string) => {
    if (!id) return 'Walk-in';
    const customer = customers.find(c => c.id === id);
    return customer ? customer.name : 'Unknown';
  };

  const handleConvertClick = (quote: Quote) => {
  setConvertingQuote(quote);
  setSelectedPaymentMethod('CASH');
};

  const confirmConvertToInvoice = React.useCallback(() => {
    if (!convertingQuote) return;
    const invoice: Invoice = {
      id: crypto.randomUUID(),
      invoiceNumber: `INV-${Date.now()}`,
      quoteId: convertingQuote.id,
      customerId: convertingQuote.customerId,
      lineItems: convertingQuote.lineItems,
      taxRate: convertingQuote.taxRate,
      discount: convertingQuote.discount,
      total: convertingQuote.total,
      paymentMethod: selectedPaymentMethod,
      createdAt: new Date().toISOString(),
    };
    useInvoiceStore.getState().addInvoice(invoice);
    useQuoteStore.getState().updateQuote(convertingQuote.id, { status: 'CONVERTED' });
    toast.success('Quote converted to invoice');
    setConvertingQuote(null);
    }, [convertingQuote, selectedPaymentMethod]);


  const filteredQuotes = quotes.filter(q => 
    q.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getCustomerName(q.customerId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvoices = invoices.filter(i => 
    i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getCustomerName(i.customerId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Documents</h1>
          <p className="text-ps-text-muted">Manage quotes, invoices, and loan agreements.</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <SquishyButton variant="outline" onClick={() => setIsQuoteBuilderOpen(true)}>
            New Quote
          </SquishyButton>
          <div className="relative group">
            <SquishyButton disabled>
              New Invoice
            </SquishyButton>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Create a quote first
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center gap-6 border-b border-white/10 shrink-0">
        <button
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'quotes' ? 'text-white' : 'text-ps-text-muted hover:text-white/80'}`}
          onClick={() => setActiveTab('quotes')}
        >
          Quotes
          {activeTab === 'quotes' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ps-primary" />
          )}
        </button>
        <button
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'invoices' ? 'text-white' : 'text-ps-text-muted hover:text-white/80'}`}
          onClick={() => setActiveTab('invoices')}
        >
          Invoices
          {activeTab === 'invoices' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ps-primary" />
          )}
        </button>
      </div>

      <SquishyCard className="flex-1 flex flex-col min-h-0 p-0">
        <div className="p-4 pb-0 shrink-0">
          <div className="w-full md:w-72">
            <SquishyInput
              placeholder={`Search ${activeTab}...`}
              leftIcon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0 mt-4">
          {activeTab === 'quotes' ? (
            filteredQuotes.length > 0 ? (
              <div className="overflow-x-auto max-w-full h-full">
                <div className="min-w-[800px] h-full flex flex-col">
                  <div className="bg-ps-bg-base border-y border-white/5 grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_1fr_100px] gap-4 px-6 py-3 text-xs font-mono text-ps-text-muted uppercase tracking-wider sticky top-0 z-10">
                    <div>Quote #</div>
                    <div>Customer</div>
                    <div>Items</div>
                    <div>Total</div>
                    <div>Status</div>
                    <div>Created</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="divide-y divide-white/5 overflow-y-auto flex-1">
                    {filteredQuotes.map((quote) => (
                      <div key={quote.id} className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_1fr_100px] gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors">
                        <div className="font-mono text-white text-sm">{quote.quoteNumber}</div>
                        <div className="text-sm text-white truncate">{getCustomerName(quote.customerId)}</div>
                        <div className="text-sm text-ps-text-muted">{quote.lineItems.length} items</div>
                        <div className="text-sm text-cyan-400 font-mono">{currency}{quote.total.toFixed(2)}</div>
                        <div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            quote.status === 'DRAFT' ? 'bg-gray-500/10 text-gray-400' :
                            quote.status === 'SENT' ? 'bg-cyan-500/10 text-cyan-400' :
                            quote.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-400' :
                            quote.status === 'CONVERTED' ? 'bg-violet-500/10 text-violet-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {quote.status}
                          </span>
                        </div>
                        <div className="text-sm text-ps-text-muted">{new Date(quote.createdAt).toLocaleDateString()}</div>
                        <div className="flex items-center justify-end gap-2">
                          <SquishyButton variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full" onClick={() => setSelectedQuote(quote)}>
                            <Eye className="w-4 h-4" />
                          </SquishyButton>
                          {(quote.status === 'SENT' || quote.status === 'ACCEPTED') && (
                            <SquishyButton variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full text-ps-primary hover:text-ps-primary hover:bg-ps-primary/10" onClick={() => handleConvertClick(quote)}>
                              <ArrowRight className="w-4 h-4" />
                            </SquishyButton>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-ps-text-muted" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No quotes yet</h3>
                  <p className="text-sm text-ps-text-muted mb-4">Create your first quote to get started.</p>
                  <SquishyButton variant="outline" size="sm" onClick={() => setIsQuoteBuilderOpen(true)}>Create your first quote</SquishyButton>
                </div>
              </div>
            )
          ) : (
            filteredInvoices.length > 0 ? (
              <div className="overflow-x-auto max-w-full h-full">
                <div className="min-w-[800px] h-full flex flex-col">
                  <div className="bg-ps-bg-base border-y border-white/5 grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_1fr_100px] gap-4 px-6 py-3 text-xs font-mono text-ps-text-muted uppercase tracking-wider sticky top-0 z-10">
                    <div>Invoice #</div>
                    <div>Customer</div>
                    <div>Items</div>
                    <div>Total</div>
                    <div>Payment</div>
                    <div>Created</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="divide-y divide-white/5 overflow-y-auto flex-1">
                    {filteredInvoices.map((invoice) => (
                      <div key={invoice.id} className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_1fr_100px] gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors">
                        <div className="font-mono text-white text-sm">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-white truncate">{getCustomerName(invoice.customerId)}</div>
                        <div className="text-sm text-ps-text-muted">{invoice.lineItems.length} items</div>
                        <div className="text-sm text-cyan-400 font-mono">{currency}{invoice.total.toFixed(2)}</div>
                        <div>
                          {invoice.paymentMethod ? (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              invoice.paymentMethod === 'CASH' ? 'bg-green-500/10 text-green-400' :
                              invoice.paymentMethod === 'CARD' ? 'bg-cyan-500/10 text-cyan-400' :
                              'bg-gray-500/10 text-gray-400'
                            }`}>
                              {invoice.paymentMethod}
                            </span>
                          ) : (
                            <span className="text-ps-text-muted text-sm">-</span>
                          )}
                        </div>
                        <div className="text-sm text-ps-text-muted">{new Date(invoice.createdAt).toLocaleDateString()}</div>
                        <div className="flex items-center justify-end gap-2">
                          <SquishyButton variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full" onClick={() => setSelectedInvoice(invoice)}>
                            <Eye className="w-4 h-4" />
                          </SquishyButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-ps-text-muted" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No invoices yet</h3>
                  <p className="text-sm text-ps-text-muted mb-4">Invoices are created from quotes or sales</p>
                </div>
              </div>
            )
          )}
        </div>
      </SquishyCard>

      {convertingQuote && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConvertingQuote(null)} />
        <div className="relative bg-ps-bg-elevated border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-1">Convert to Invoice</h3>
        <p className="text-sm text-ps-text-muted mb-5">
        {convertingQuote.quoteNumber} · {currency}{convertingQuote.total.toFixed(2)}
        </p>
        <p className="text-xs uppercase tracking-wider text-ps-text-muted mb-3">Payment Method</p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {(['CASH', 'CARD', 'OTHER'] as const).map((method) => (
              <button
                key={method}
               onClick={() => setSelectedPaymentMethod(method)}
               className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                 selectedPaymentMethod === method
                   ? 'bg-ps-primary/20 border-ps-primary text-ps-primary'
                   : 'bg-white/5 border-white/10 text-ps-text-muted hover:bg-white/10 hover:text-white'
                  }`
                 }>
               {method}
            </button>
          ))}
         </div>
           <div className="flex gap-3">
            <SquishyButton variant="ghost" className="flex-1" onClick={() => setConvertingQuote(null)}>
               Cancel
             </SquishyButton>
             <SquishyButton className="flex-1" onClick={confirmConvertToInvoice}>
               Create Invoice
             </SquishyButton>
           </div>
         </div>
       </div>
      )}


      <QuoteBuilderModal isOpen={isQuoteBuilderOpen} onClose={() => setIsQuoteBuilderOpen(false)} />
      <QuoteDetailModal quote={selectedQuote} onClose={() => setSelectedQuote(null)} />
      <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
    </div>
  );
}

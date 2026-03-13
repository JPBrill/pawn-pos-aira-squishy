'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PackageSearch, ShoppingCart, Users, FileText, ArrowRight } from 'lucide-react';
import { SquishyCard } from '@/components/ui/squishy-card';
import { SquishyButton } from '@/components/ui/squishy-button';
import { useInventoryStore, useCustomerStore, useQuoteStore, useInvoiceStore, useUiStore } from '@/store';

export default function DashboardPage() {
  const router = useRouter();
  const allItems = useInventoryStore((state) => state.items);
  const allInvoices = useInvoiceStore((state) => state.invoices);
  const allQuotes = useQuoteStore((state) => state.quotes);
  const allCustomers = useCustomerStore((state) => state.customers);
  const { currency, shopName } = useUiStore();

  // Today's date boundaries
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);

  const todaysInvoices = allInvoices.filter(i => {
    const d = new Date(i.createdAt);
    return d >= todayStart && d <= todayEnd;
  });

  const todaysSales = todaysInvoices.reduce((sum, i) => sum + i.total, 0);
  const activeLoans = allItems.filter(i => i.status === 'ON_LOAN').length;
  const forSaleCount = allItems.filter(i => i.status === 'FOR_SALE').length;
  const newCustomersToday = allCustomers.filter(c => new Date(c.createdAt) >= todayStart).length;
  const pendingQuotes = allQuotes.filter(q => q.status === 'SENT' || q.status === 'DRAFT').length;

  const recentInvoices = [...allInvoices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const soldTodayCount = allItems.filter(i => i.status === 'SOLD').length;

  const getCustomerName = (id?: string) => {
    if (!id) return 'Walk-in';
    const customer = allCustomers.find(c => c.id === id);
    return customer ? customer.name : 'Unknown';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
         <h1 className="text-3xl font-bold tracking-tight text-white mb-1">{shopName || 'My Shop'} Dashboard</h1>
          <p className="text-ps-text-muted">Welcome back. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <SquishyButton variant="outline" onClick={() => router.push('/documents')}>New Quote</SquishyButton>
          <SquishyButton onClick={() => router.push('/pos')}>Start Sale</SquishyButton>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <SquishyCard className="p-5 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-ps-primary/20 flex items-center justify-center">
                <PackageSearch className="w-5 h-5 text-ps-primary" />
              </div>
              <span className="font-medium text-ps-text-muted">Active Loans</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{activeLoans}</div>
            <div className="text-xs text-ps-text-muted mt-auto">{forSaleCount} items for sale</div>
          </SquishyCard>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <SquishyCard className="p-5 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-ps-success/20 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-ps-success" />
              </div>
              <span className="font-medium text-ps-text-muted">Today&apos;s Sales</span>
            </div>
            <div className="text-3xl font-bold text-white font-mono mb-1">{currency}{todaysSales.toFixed(2)}</div>
            <div className="text-xs text-ps-text-muted mt-auto">{todaysInvoices.length} transactions today</div>
          </SquishyCard>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <SquishyCard className="p-5 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-ps-secondary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-ps-secondary" />
              </div>
              <span className="font-medium text-ps-text-muted">New Customers</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{newCustomersToday}</div>
            <div className="text-xs text-ps-text-muted mt-auto">{allCustomers.length} total customers</div>
          </SquishyCard>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <SquishyCard className="p-5 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-ps-warning/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-ps-warning" />
              </div>
              <span className="font-medium text-ps-text-muted">Pending Quotes</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{pendingQuotes}</div>
            <div className="text-xs text-ps-text-muted mt-auto">{allQuotes.length} total quotes</div>
          </SquishyCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
            <SquishyButton variant="ghost" size="sm" className="text-ps-text-muted" onClick={() => router.push('/inventory')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </SquishyButton>
          </div>
          <SquishyCard className="p-0 overflow-hidden">
            {recentInvoices.length > 0 ? (
              <div className="divide-y divide-white/5">
                {recentInvoices.map(invoice => (
                  <button key={invoice.id} onClick={() => router.push('/documents')}
                      className="w-full p-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors text-left cursor-pointer group"> <div>
                      <div className="font-mono text-white text-sm group-hover:text-ps-primary transition-colors">{invoice.invoiceNumber} </div>
                      <div className="text-xs text-ps-text-muted mt-0.5">{getCustomerName(invoice.  customerId)}</div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                      <div>
                       <div className="font-mono text-cyan-400 text-sm">{currency}{invoice.total.toFixed(2)}</div>
                       <div className="text-xs text-ps-text-muted mt-0.5">{new Date(invoice.createdAt).toLocaleDateString()}</div>
                       </div>
                       <ArrowRight className="w-3 h-3 text-ps-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                    </button>

                ))}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-2xl m-4">
                <p className="text-ps-text-muted text-sm">No transactions yet today</p>
              </div>
            )}
          </SquishyCard>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Quick Actions</h2>
          <SquishyCard className="p-4 space-y-3">
            <SquishyButton variant="secondary" className="w-full justify-start" onClick={() => router.push('/inventory')}>
              <PackageSearch className="w-4 h-4 mr-3" /> Receive Item
            </SquishyButton>
            <SquishyButton variant="outline" className="w-full justify-start" onClick={() => router.push('/customers')}>
              <Users className="w-4 h-4 mr-3" /> Add Customer
            </SquishyButton>
            <SquishyButton variant="outline" className="w-full justify-start" onClick={() => router.push('/documents')}>
              <FileText className="w-4 h-4 mr-3" /> New Quote
            </SquishyButton>
            <SquishyButton variant="outline" className="w-full justify-start" onClick={() => router.push('/pos')}>
              <ShoppingCart className="w-4 h-4 mr-3" /> Open POS
            </SquishyButton>

            <div className="pt-4 mt-4 border-t border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-ps-text-muted mb-3">Inventory Overview</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ps-text-muted">For Sale:</span>
                  <span className="text-white font-medium">{forSaleCount} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ps-text-muted">On Loan:</span>
                  <span className="text-white font-medium">{activeLoans} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ps-text-muted">Sold Today:</span>
                  <span className="text-white font-medium">{soldTodayCount} items</span>
                </div>
              </div>
            </div>
          </SquishyCard>
        </div>
      </div>
    </div>
  );
}

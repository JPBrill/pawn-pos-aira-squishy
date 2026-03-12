'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Users, Eye, Edit2 } from 'lucide-react';
import { SquishyCard } from '@/components/ui/squishy-card';
import { SquishyButton } from '@/components/ui/squishy-button';
import { SquishyInput } from '@/components/ui/squishy-input';
import { useCustomerStore, useInvoiceStore, useUiStore } from '@/store';
import { Customer } from '@/types';
import { CustomerFormModal } from '@/components/customers/customer-form-modal';
import { CustomerDetailPanel } from '@/components/customers/customer-detail-panel';

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const customers = useCustomerStore((state) => state.customers);
  const invoices = useInvoiceStore((state) => state.invoices);
  const { currency } = useUiStore();

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  }, [customers, searchQuery]);

  const getCustomerStats = (customerId: string) => {
    const customerInvoices = invoices.filter(i => i.customerId === customerId);
    const totalValue = customerInvoices.reduce((sum, inv) => sum + inv.total, 0);
    return {
      activeLoans: customerInvoices.length, // Proxy for now as requested
      totalValue
    };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Customers</h1>
          <p className="text-ps-text-muted">Manage your pawn shop clientele.</p>
        </div>
        <SquishyButton className="gap-2 self-start sm:self-auto" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> Add Customer
        </SquishyButton>
      </header>

      <div className="w-full md:w-96 shrink-0">
        <SquishyInput
          placeholder="Search by name, phone, or email..."
          leftIcon={<Search className="w-4 h-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <SquishyCard className="flex-1 flex flex-col min-h-0 p-0">
        {filteredCustomers.length > 0 ? (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="overflow-x-auto max-w-full h-full">
              <div className="min-w-[900px] h-full flex flex-col">
                <div className="bg-ps-bg-base border-b border-white/5 grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr_100px] gap-4 px-6 py-3 text-xs font-mono text-ps-text-muted uppercase tracking-wider sticky top-0 z-10">
                  <div>Name</div>
                  <div>Phone</div>
                  <div>Email</div>
                  <div>Active Loans</div>
                  <div>Total Value</div>
                  <div>Member Since</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y divide-white/5 overflow-y-auto flex-1">
                  {filteredCustomers.map((customer) => {
                    const stats = getCustomerStats(customer.id);
                    return (
                      <div key={customer.id} className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr_100px] gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors">
                        <div className="font-semibold text-white truncate">{customer.name}</div>
                        <div className="text-sm text-ps-text-muted truncate">{customer.phone || '—'}</div>
                        <div className="text-sm text-ps-text-muted truncate">{customer.email || '—'}</div>
                        <div className="text-sm text-white">{stats.activeLoans}</div>
                        <div className="text-sm text-cyan-400 font-mono">
                          {stats.totalValue > 0 ? `${currency}${stats.totalValue.toFixed(2)}` : '—'}
                        </div>
                        <div className="text-sm text-ps-text-muted">{formatRelativeTime(customer.createdAt)}</div>
                        <div className="flex items-center justify-end gap-2">
                          <SquishyButton variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full" onClick={() => setSelectedCustomer(customer)}>
                            <Eye className="w-4 h-4" />
                          </SquishyButton>
                          <SquishyButton variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full" onClick={() => setEditingCustomer(customer)}>
                            <Edit2 className="w-4 h-4" />
                          </SquishyButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-ps-text-muted" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">No customers found</h3>
              {searchQuery ? (
                <>
                  <p className="text-sm text-ps-text-muted mb-4">No customers match your search.</p>
                  <SquishyButton variant="outline" size="sm" onClick={() => setSearchQuery('')}>Clear Search</SquishyButton>
                </>
              ) : (
                <>
                  <p className="text-sm text-ps-text-muted mb-4">Add your first customer to get started.</p>
                  <SquishyButton variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>Add Customer</SquishyButton>
                </>
              )}
            </div>
          </div>
        )}
      </SquishyCard>

      <CustomerFormModal
        isOpen={isModalOpen || !!editingCustomer}
        onClose={() => { setIsModalOpen(false); setEditingCustomer(null); }}
        customer={editingCustomer ?? undefined}
      />
      <CustomerDetailPanel
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onEdit={(c) => { setSelectedCustomer(null); setEditingCustomer(c); }}
      />
    </div>
  );
}

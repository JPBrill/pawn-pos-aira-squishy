'use client';

import React, { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { SquishyCard } from '@/components/ui/squishy-card';
import { SquishyButton } from '@/components/ui/squishy-button';
import { SquishyInput } from '@/components/ui/squishy-input';
import { useUiStore, useInventoryStore, useCustomerStore, useQuoteStore, useInvoiceStore } from '@/store';

export default function SettingsPage() {
  const { shopName, currency, taxRate, updateSettings } = useUiStore();
  const inventory = useInventoryStore(state => state.items);
  const customers = useCustomerStore(state => state.customers);
  const quotes = useQuoteStore(state => state.quotes);
  const invoices = useInvoiceStore(state => state.invoices);

  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const handleExport = () => {
    const data = { inventory, customers, quotes, invoices, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pawn-shop-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    localStorage.removeItem('pawn-inventory');
    localStorage.removeItem('pawn-customers');
    localStorage.removeItem('pawn-quotes');
    localStorage.removeItem('pawn-invoices');
    localStorage.removeItem('pawn-pos');
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Settings</h1>
        <p className="text-ps-text-muted">Configure your shop preferences.</p>
      </header>

      <div className="space-y-6">
        <section>
          <div className="text-[10px] uppercase tracking-wider text-ps-text-muted mb-4">Shop Identity</div>
          <SquishyCard className="p-6 space-y-4">
            <SquishyInput
              label="Shop Name"
              value={shopName}
              onChange={(e) => updateSettings({ shopName: e.target.value })}
            />
            <div className="w-24">
              <SquishyInput
                label="Currency Symbol"
                value={currency}
                onChange={(e) => updateSettings({ currency: e.target.value })}
              />
            </div>
            <p className="text-xs text-ps-text-muted mt-1">e.g. $, R, £, €</p>
          </SquishyCard>
        </section>

        <section>
          <div className="text-[10px] uppercase tracking-wider text-ps-text-muted mb-4">Tax & Pricing</div>
          <SquishyCard className="p-6 space-y-4">
            <div className="w-32">
              <SquishyInput
                label="Default Tax Rate (%)"
                type="number"
                step="0.01"
                value={taxRate}
                onChange={(e) => updateSettings({ taxRate: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <p className="text-xs text-ps-text-muted">Applied to all quotes and invoices unless overridden.</p>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-ps-text-muted">
              Live preview: At {taxRate}%, a {currency}100 item costs {currency}{(100 * (1 + taxRate/100)).toFixed(2)} after tax.
            </div>
          </SquishyCard>
        </section>

        <section>
          <div className="text-[10px] uppercase tracking-wider text-ps-text-muted mb-4">Data Management</div>
          <SquishyCard className="p-6 space-y-6">
            <div>
              <p className="text-sm text-ps-text-muted mb-4">All data is stored locally in your browser. Export regularly to avoid data loss.</p>
              <SquishyButton variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" /> Export Data
              </SquishyButton>
            </div>

            <div className="pt-6 border-t border-white/5">
              {isConfirmingReset ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-ps-error font-medium">Are you sure? This cannot be undone.</span>
                  <SquishyButton variant="danger" onClick={handleReset}>
                    Yes, Reset
                  </SquishyButton>
                  <SquishyButton variant="ghost" onClick={() => setIsConfirmingReset(false)}>
                    Cancel
                  </SquishyButton>
                </div>
              ) : (
                <SquishyButton variant="danger" onClick={() => setIsConfirmingReset(true)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Reset All Data
                </SquishyButton>
              )}
            </div>
          </SquishyCard>
        </section>

        <section>
          <SquishyCard className="p-6 text-center space-y-1">
            <div className="text-sm font-medium text-ps-text-muted">Pawn Shop Command Console</div>
            <div className="text-xs text-ps-text-muted/70">v0.1.0 — MVP</div>
            <div className="text-xs text-ps-text-muted/50 pt-2">Built with: Next.js 15 · Zustand · Tailwind CSS · Framer Motion</div>
          </SquishyCard>
        </section>
      </div>
    </div>
  );
}

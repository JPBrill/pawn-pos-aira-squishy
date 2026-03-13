// app/inventory/page.tsx
'use client';

import React, { useState } from 'react';
import { SquishyCard } from '@/components/ui/squishy-card';
import { SquishyButton } from '@/components/ui/squishy-button';
import { SquishyInput } from '@/components/ui/squishy-input';
import { SquishyBadge } from '@/components/ui/squishy-badge';
import { Search, Plus, PackageSearch, Eye, Edit2 } from 'lucide-react';
import { useInventoryStore, useFilteredItems, useUiStore } from '@/store';
import { ItemStatus, InventoryItem } from '@/types';
import { ItemFormModal } from '@/components/inventory/item-form-modal';
import { ItemDetailPanel } from '@/components/inventory/item-detail-panel';

const STATUSES: ItemStatus[] = ['DRAFT', 'ON_LOAN', 'FOR_SALE', 'RESERVED', 'SOLD', 'ARCHIVED'];

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const items = useFilteredItems();
  const filters = useInventoryStore((state) => state.filters);
  const setFilters = useInventoryStore((state) => state.setFilters);
  const clearFilters = useInventoryStore((state) => state.clearFilters);
  const { currency } = useUiStore();

  const hasFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Inventory</h1>
          <p className="text-ps-text-muted">Track every item on the floor.</p>
        </div>
        <SquishyButton className="gap-2 self-start sm:self-auto" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> Receive Item
        </SquishyButton>
      </header>

      <div className="flex flex-col md:flex-row gap-4 shrink-0">
        <div className="w-full md:w-64 shrink-0">
          <SquishyInput
            placeholder="Search items..."
            leftIcon={<Search className="w-4 h-4" />}
            value={filters.search || ''}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>
        
        <div className="flex-1 overflow-x-auto pb-2 md:pb-0 hide-scrollbar flex items-center gap-2">
          <button
            onClick={clearFilters}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
              !filters.status
                ? 'bg-ps-primary/20 text-ps-primary border-ps-primary/50'
                : 'bg-transparent text-ps-text-muted border-white/10 hover:bg-white/5 hover:text-white'
            }`}
          >
            All
          </button>
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setFilters({ status })}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                filters.status === status
                  ? 'bg-ps-primary/20 text-ps-primary border-ps-primary/50'
                  : 'bg-transparent text-ps-text-muted border-white/10 hover:bg-white/5 hover:text-white'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="w-full md:w-48 shrink-0">
          <select
            value={filters.category || ''}
            onChange={(e) => setFilters({ category: e.target.value || undefined })}
            className="w-full bg-ps-bg-base border border-white/10 rounded-xl py-3 px-4 text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-ps-primary focus:border-ps-primary/50 appearance-none"
          >
            <option value="">All Categories</option>
            {["Electronics", "Jewellery", "Tools", "Musical Instruments", "Clothing", "Collectibles", "Sports", "Other"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <SquishyCard className="flex-1 flex flex-col min-h-0 p-0">
        {items.length > 0 ? (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="overflow-x-auto max-w-full h-full">
              <div className="min-w-[800px] h-full flex flex-col">
                <div className="bg-ps-bg-base border-b border-white/5 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_100px] gap-4 px-6 py-3 text-xs font-mono text-ps-text-muted uppercase tracking-wider sticky top-0 z-10">
                  <div>Title</div>
                  <div>Category</div>
                  <div>Condition</div>
                  <div>Type</div>
                  <div>Asking Price</div>
                  <div>Status</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y divide-white/5 overflow-y-auto flex-1">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_100px] gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors">
                      <div className="font-semibold text-white truncate">{item.title}</div>
                      <div className="text-sm text-ps-text-muted truncate">{item.category}</div>
                      <div className="text-sm text-ps-text-muted truncate">{item.condition}</div>
                      <div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.type === 'purchase' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-violet-500/10 text-violet-400'}`}>
                          {item.type === 'purchase' ? 'Purchase' : 'Pawn'}
                        </span>
                      </div>
                      <div className="text-sm text-white font-mono">
                        {item.askingPrice !== undefined && item.askingPrice !== null
                          ? `${currency}${item.askingPrice.toFixed(2)}`
                            : <span className="text-ps-text-muted text-xs">No price</span>
                            }
                      </div>
                      <div>
                        <SquishyBadge status={item.status} />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <SquishyButton variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full" onClick={() => setSelectedItem(item)}>
                          <Eye className="w-4 h-4" />
                        </SquishyButton>
                        <SquishyButton variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full" onClick={() => setEditingItem(item)}>
                          <Edit2 className="w-4 h-4" />
                        </SquishyButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <PackageSearch className="w-8 h-8 text-ps-text-muted" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">No items found</h3>
              <p className="text-sm text-ps-text-muted mb-4">
                {hasFilters ? "No items match your current filters." : "Receive your first item to get started."}
              </p>
              {hasFilters ? (
                <SquishyButton variant="outline" size="sm" onClick={clearFilters}>Clear Filters</SquishyButton>
              ) : (
                <SquishyButton variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>Receive Item</SquishyButton>
              )}
            </div>
          </div>
        )}
      </SquishyCard>

      <ItemFormModal
        isOpen={isModalOpen || !!editingItem}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        item={editingItem ?? undefined}
      />
      <ItemDetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}

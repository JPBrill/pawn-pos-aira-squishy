import React, { useState, useMemo } from 'react';
import { Search, PackageSearch, Check } from 'lucide-react';
import { SquishyCard } from '@/components/ui/squishy-card';
import { SquishyInput } from '@/components/ui/squishy-input';
import { SquishyButton } from '@/components/ui/squishy-button';
import { useInventoryStore, usePosStore, useUiStore } from '@/store';

export function ItemSearchPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const items = useInventoryStore((state) => state.items);
  const cartItems = usePosStore((state) => state.cartItems);
  const addToCart = usePosStore((state) => state.addToCart);
  const { currency } = useUiStore();

  const forSaleItems = useMemo(() => {
    return items.filter((item) => {
      if (item.status !== 'FOR_SALE') return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, searchQuery]);

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ps-text-muted">Items</h2>
        <span className="bg-white/10 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          {forSaleItems.length}
        </span>
      </div>

      <div className="mb-4 shrink-0">
        <SquishyInput
          placeholder="Search inventory..."
          leftIcon={<Search className="w-4 h-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-4">
        {forSaleItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {forSaleItems.map((item) => {
              const inCart = cartItems.some((ci) => ci.itemId === item.id);
              return (
                <SquishyCard key={item.id} className="p-4 flex flex-col cursor-pointer hover:bg-white/[0.02]">
                  <div className="flex-1 mb-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-white font-semibold line-clamp-2 text-sm leading-tight">{item.title}</h3>
                      <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${item.type === 'purchase' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-violet-500/10 text-violet-400'}`}>
                        {item.type}
                      </span>
                    </div>
                    <div className="text-xs text-ps-text-muted">{item.category}</div>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <div className="text-lg text-cyan-400 font-mono font-bold">
                      {currency}{(item.askingPrice ?? 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-4">
                    {inCart ? (
                      <SquishyButton disabled className="w-full bg-white/5 text-ps-text-muted border-white/10" size="sm">
                        <Check className="w-4 h-4 mr-2 text-ps-success" /> In Cart
                      </SquishyButton>
                    ) : (
                      <SquishyButton
                        className="w-full"
                        size="sm"
                        onClick={() => addToCart({ itemId: item.id, title: item.title, price: item.askingPrice ?? 0, quantity: 1 })}
                      >
                        Add to Cart
                      </SquishyButton>
                    )}
                  </div>
                </SquishyCard>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <PackageSearch className="w-8 h-8 text-ps-text-muted" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No items for sale</h3>
            <p className="text-sm text-ps-text-muted">
              {searchQuery ? "No items match your search." : "There are no items currently marked for sale."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

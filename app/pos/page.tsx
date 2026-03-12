'use client';

import React from 'react';
import { ItemSearchPanel } from '@/components/pos/item-search-panel';
import { CartPanel } from '@/components/pos/cart-panel';

export default function PosPage() {
  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 overflow-hidden max-w-[1600px] mx-auto w-full">
      <div className="flex-1 min-w-0 h-full overflow-hidden">
        <ItemSearchPanel />
      </div>
      <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 h-full overflow-hidden">
        <CartPanel />
      </div>
    </div>
  );
}

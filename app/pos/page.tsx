'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { ItemSearchPanel } from '@/components/pos/item-search-panel';
import { CartPanel } from '@/components/pos/cart-panel';
import { useInvoiceStore } from '@/store';

export default function PosPage() {
  const invoices = useInvoiceStore((state) => state.invoices);
  const [showToast, setShowToast] = useState(false);
  const prevInvoicesLength = useRef(invoices.length);

  useEffect(() => {
    if (invoices.length > prevInvoicesLength.current) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      prevInvoicesLength.current = invoices.length;
      return () => clearTimeout(timer);
    }
    prevInvoicesLength.current = invoices.length;
  }, [invoices.length]);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 overflow-hidden max-w-[1600px] mx-auto w-full">
      <div className="flex-1 min-w-0 h-full overflow-hidden">
        <ItemSearchPanel />
      </div>
      <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 h-full overflow-hidden">
        <CartPanel />
      </div>

      {/* Sale Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-ps-success/20 border border-ps-success/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 text-ps-success" />
            <span className="font-medium text-sm">Sale Complete! Invoice created.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

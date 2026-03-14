import React, { useState } from 'react';
import { Trash2, ShoppingCart, X, Minus, Plus } from 'lucide-react';
import { SquishyCard } from '@/components/ui/squishy-card';
import { SquishyButton } from '@/components/ui/squishy-button';
import { usePosStore, selectCartSubtotal, selectCartTotal, useCustomerStore, useUiStore } from '@/store';
import { PaymentMethod } from '@/types';
import { toast } from '@/components/ui/toast-provider';



export function CartPanel() {
  const { cartItems, activeCustomerId, paymentMethod, removeFromCart, updateQuantity, setActiveCustomer, setPaymentMethod, clearCart, completeSale } = usePosStore();
  const customers = useCustomerStore((state) => state.customers);
  const { taxRate, currency } = useUiStore();
  
  const [isCompleting, setIsCompleting] = useState(false);

  const subtotal = usePosStore((state) => selectCartSubtotal(state));
  const total = usePosStore((state) => selectCartTotal(state, taxRate));
  const taxAmount = total - subtotal;

  const handleCompleteSale = () => {
  if (cartItems.length === 0) {toast('Cannot complete a sale with no items in the cart.', { type: 'error' });
    return;
  }
  if (!paymentMethod) return;

    setIsCompleting(true);
    setTimeout(() => {
      completeSale();
      setIsCompleting(false);
    }, 800);
  };

  return (
    <SquishyCard className="h-full flex flex-col p-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-ps-bg-base">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white">Cart</h2>
          <span className="bg-white/10 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        </div>
        {cartItems.length > 0 && (
          <SquishyButton variant="ghost" size="sm" onClick={clearCart} className="text-ps-error hover:bg-ps-error/10 hover:text-ps-error px-2">
            <Trash2 className="w-4 h-4 mr-1.5" /> Clear
          </SquishyButton>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {cartItems.length > 0 ? (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.itemId} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate mb-2">{item.title}</div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-ps-bg-base rounded-lg border border-white/10">
                      <button 
                        className="w-7 h-7 flex items-center justify-center text-ps-text-muted hover:text-white disabled:opacity-50"
                        onClick={() => updateQuantity(item.itemId, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-medium text-white">{item.quantity}</span>
                      <button 
                        className="w-7 h-7 flex items-center justify-center text-ps-text-muted hover:text-white"
                        onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm font-mono text-cyan-400 font-medium">
                      {currency}{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
                <button 
                  className="w-6 h-6 flex items-center justify-center rounded-full text-ps-text-muted hover:text-ps-error hover:bg-ps-error/10 shrink-0 transition-colors"
                  onClick={() => removeFromCart(item.itemId)}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-ps-text-muted" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">Cart is empty</h3>
            <p className="text-sm text-ps-text-muted">Add items from the left</p>
          </div>
        )}
      </div>

      {/* Checkout Section */}
      <div className="p-4 border-t border-white/5 bg-ps-bg-base shrink-0 space-y-4">
        {/* Customer */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-ps-text-muted">Customer (optional)</label>
          <select
            value={activeCustomerId || ''}
            onChange={(e) => setActiveCustomer(e.target.value || null)}
            className="w-full bg-ps-bg-elevated border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-ps-primary focus:border-ps-primary/50 appearance-none"
          >
            <option value="">Walk-in Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Totals */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ps-text-muted">Subtotal</span>
            <span className="text-white font-mono">{currency}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ps-text-muted">Tax ({taxRate}%)</span>
            <span className="text-white font-mono">{currency}{taxAmount.toFixed(2)}</span>
          </div>
          <div className="h-px bg-white/10 my-2" />
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-white">Total</span>
            <span className="text-xl font-bold text-white font-mono">{currency}{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-medium uppercase tracking-wider text-ps-text-muted">Payment Method</label>
          <div className="flex items-center gap-2">
            {(['CASH', 'CARD', 'OTHER'] as PaymentMethod[]).map((method) => (
              <SquishyButton
                key={method}
                type="button"
                variant={paymentMethod === method ? 'primary' : 'outline'}
                className="flex-1 text-xs py-2"
                onClick={() => setPaymentMethod(method)}
              >
                {method}
              </SquishyButton>
            ))}
          </div>
        </div>

        {/* Complete Sale */}
        <div className="pt-2">
          <SquishyButton
            className={`w-full py-4 text-base font-bold transition-opacity ${
              cartItems.length === 0 || !paymentMethod ? 'opacity-40 cursor-not-allowed' : ''
            }`}
            disabled={cartItems.length === 0 || !paymentMethod || isCompleting}
            onClick={handleCompleteSale}
          >

            {isCompleting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Complete Sale
              </span>
            )}
          </SquishyButton>
          {cartItems.length === 0 && (
            <p className="text-center text-xs text-ps-text-muted mt-2">Add items to begin a sale</p>
          )}
        </div>
      </div>
    </SquishyCard>
  );
}

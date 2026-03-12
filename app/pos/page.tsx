import { SquishyCard } from '@/components/ui/squishy-card';
import { SquishyButton } from '@/components/ui/squishy-button';
import { ShoppingCart, Search, CreditCard, Banknote, UserPlus } from 'lucide-react';

export default function POSPage() {
  return (
    <div className="h-full flex gap-6 max-w-7xl mx-auto">
      <div className="flex-1 flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Point of Sale</h1>
          <p className="text-ps-text-muted">Process retail sales and redemptions.</p>
        </header>

        <SquishyCard className="flex-1 flex flex-col min-h-0">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ps-text-muted" />
            <input 
              type="text" 
              placeholder="Scan barcode or search items..." 
              className="w-full bg-ps-bg-base border border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-ps-primary text-white placeholder:text-ps-text-muted transition-all"
            />
          </div>

          <div className="flex-1 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-ps-text-muted" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Scan an item</h3>
              <p className="text-sm text-ps-text-muted">Or use the search bar above to add items to the cart.</p>
            </div>
          </div>
        </SquishyCard>
      </div>

      <div className="w-96 flex flex-col gap-6">
        <SquishyCard className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-ps-bg-elevated flex items-center justify-between">
            <h2 className="font-bold text-white">Current Cart</h2>
            <SquishyButton variant="ghost" size="sm" className="h-8 px-2 text-xs">Clear</SquishyButton>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-ps-text-muted text-sm">
            Cart is empty
          </div>

          <div className="p-4 border-t border-white/5 bg-ps-bg-elevated space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ps-text-muted">Subtotal</span>
              <span className="text-white font-mono">$0.00</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ps-text-muted">Tax (8.25%)</span>
              <span className="text-white font-mono">$0.00</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold border-t border-white/10 pt-4">
              <span className="text-white">Total</span>
              <span className="text-ps-primary font-mono">$0.00</span>
            </div>
          </div>
        </SquishyCard>

        <SquishyCard className="p-4 space-y-3">
          <SquishyButton variant="outline" className="w-full justify-start gap-3">
            <UserPlus className="w-5 h-5" /> Attach Customer
          </SquishyButton>
          <div className="grid grid-cols-2 gap-3">
            <SquishyButton variant="secondary" className="gap-2">
              <CreditCard className="w-4 h-4" /> Card
            </SquishyButton>
            <SquishyButton className="gap-2 bg-ps-success text-white hover:bg-ps-success/80">
              <Banknote className="w-4 h-4" /> Cash
            </SquishyButton>
          </div>
        </SquishyCard>
      </div>
    </div>
  );
}

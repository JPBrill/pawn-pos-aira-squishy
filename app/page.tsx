import { SquishyCard } from '@/components/ui/squishy-card';
import { SquishyButton } from '@/components/ui/squishy-button';
import { PackageSearch, ShoppingCart, Users, TrendingUp, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Command Center</h1>
          <p className="text-ps-text-muted">Welcome back. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-4">
          <SquishyButton variant="outline">New Quote</SquishyButton>
          <SquishyButton>Start Sale</SquishyButton>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SquishyCard className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-ps-text-muted font-medium">Active Loans</span>
            <div className="w-8 h-8 rounded-full bg-ps-primary/10 flex items-center justify-center text-ps-primary">
              <PackageSearch className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">142</span>
            <span className="text-xs text-ps-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +4%
            </span>
          </div>
        </SquishyCard>

        <SquishyCard className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-ps-text-muted font-medium">Today&apos;s Sales</span>
            <div className="w-8 h-8 rounded-full bg-ps-success/10 flex items-center justify-center text-ps-success">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">$4,250</span>
            <span className="text-xs text-ps-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
        </SquishyCard>

        <SquishyCard className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-ps-text-muted font-medium">New Customers</span>
            <div className="w-8 h-8 rounded-full bg-ps-secondary/10 flex items-center justify-center text-ps-secondary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">8</span>
            <span className="text-xs text-ps-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +2
            </span>
          </div>
        </SquishyCard>

        <SquishyCard className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-ps-text-muted font-medium">Forfeitures</span>
            <div className="w-8 h-8 rounded-full bg-ps-warning/10 flex items-center justify-center text-ps-warning">
              <PackageSearch className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">3</span>
            <span className="text-xs text-ps-text-muted flex items-center">
              Pending review
            </span>
          </div>
        </SquishyCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SquishyCard className="lg:col-span-2 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <SquishyButton variant="ghost" size="sm" className="gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </SquishyButton>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl">
            <p className="text-ps-text-muted font-mono text-sm">No recent activity to display.</p>
          </div>
        </SquishyCard>

        <SquishyCard className="flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <SquishyButton variant="secondary" className="w-full justify-start gap-3">
              <PackageSearch className="w-5 h-5" /> Receive Item
            </SquishyButton>
            <SquishyButton variant="outline" className="w-full justify-start gap-3">
              <Users className="w-5 h-5" /> Add Customer
            </SquishyButton>
            <SquishyButton variant="outline" className="w-full justify-start gap-3">
              <ShoppingCart className="w-5 h-5" /> Process Return
            </SquishyButton>
          </div>
        </SquishyCard>
      </div>
    </div>
  );
}

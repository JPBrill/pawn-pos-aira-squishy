import { SquishyCard } from '@/components/ui/squishy-card';
import { SquishyButton } from '@/components/ui/squishy-button';
import { Search, Plus, Filter, FileText } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">

      {/* ── Page header ── */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Documents</h1>
          <p className="text-ps-text-muted">Manage quotes, invoices, and loan agreements.</p>
        </div>
        <SquishyButton className="gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Create Document
        </SquishyButton>
      </header>

      {/* ── Main card ── */}
      <SquishyCard className="flex-1 flex flex-col min-h-0 p-4 md:p-6">

        {/* Search + filter bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ps-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID, customer, or type..."
              className="w-full bg-ps-bg-base border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm
                         focus:outline-none focus:ring-2 focus:ring-ps-primary
                         text-white placeholder:text-ps-text-muted transition-all"
            />
          </div>
          <SquishyButton variant="outline" className="gap-2 flex-shrink-0">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </SquishyButton>
        </div>

        {/* Table — horizontally scrollable so columns never clip */}
        <div className="flex-1 border border-white/5 rounded-xl overflow-hidden flex flex-col min-h-0">
          <div className="overflow-x-auto max-w-full">
            <div className="min-w-[600px]">
              {/* Table header */}
              <div className="bg-ps-bg-base border-b border-white/5 grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-4 py-3 text-xs font-mono text-ps-text-muted uppercase tracking-wider">
                <div>Document ID</div>
                <div>Type</div>
                <div>Customer</div>
                <div>Date</div>
                <div className="text-right">Actions</div>
              </div>
            </div>
          </div>

          {/* Empty state */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-ps-text-muted" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">No documents found</h3>
              <p className="text-sm text-ps-text-muted mb-4">Your document history is currently empty.</p>
              <SquishyButton variant="outline" size="sm">Create your first document</SquishyButton>
            </div>
          </div>
        </div>

      </SquishyCard>
    </div>
  );
}

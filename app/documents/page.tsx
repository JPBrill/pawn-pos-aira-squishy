import { SquishyCard } from '@/components/ui/squishy-card';
import { SquishyButton } from '@/components/ui/squishy-button';
import { Search, Plus, Filter, FileText } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto h-full flex flex-col">
      <header className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Documents</h1>
          <p className="text-ps-text-muted">Manage quotes, invoices, and loan agreements.</p>
        </div>
        <SquishyButton className="gap-2">
          <Plus className="w-4 h-4" /> Create Document
        </SquishyButton>
      </header>

      <SquishyCard className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ps-text-muted" />
            <input 
              type="text" 
              placeholder="Search by ID, customer, or type..." 
              className="w-full bg-ps-bg-base border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ps-primary text-white placeholder:text-ps-text-muted"
            />
          </div>
          <SquishyButton variant="outline" className="gap-2">
            <Filter className="w-4 h-4" /> Filters
          </SquishyButton>
        </div>

        <div className="flex-1 border border-white/5 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-ps-bg-base border-b border-white/5 grid grid-cols-6 gap-4 p-4 text-xs font-mono text-ps-text-muted uppercase tracking-wider">
            <div className="col-span-2">Document ID</div>
            <div>Type</div>
            <div>Customer</div>
            <div>Date</div>
            <div className="text-right">Actions</div>
          </div>
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

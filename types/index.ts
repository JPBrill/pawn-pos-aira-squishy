export type ItemStatus =
  | 'DRAFT'
  | 'ON_LOAN'
  | 'FOR_SALE'
  | 'RESERVED'
  | 'SOLD'
  | 'ARCHIVED';

export type ItemType = 'purchase' | 'pawn';

export type PaymentMethod = 'CASH' | 'CARD' | 'OTHER';

export type QuoteStatus =
  | 'DRAFT'
  | 'SENT'
  | 'ACCEPTED'
  | 'CONVERTED'
  | 'EXPIRED';

export interface InventoryItem {
  id: string;
  title: string;
  category: string;
  condition: string;
  description?: string;
  type: ItemType;
  costOrLoanAmount: number;
  appraisedValue?: number;
  askingPrice?: number;
  status: ItemStatus;
  ecommerce: {
    publishOnline: boolean;
    slug?: string;
    onlineTitle?: string;
    onlineDescription?: string;
    imageUrls: string[];
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    notes?: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  idNumber?: string;
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LineItem {
  itemId?: string;
  description: string;
  price: number;
  quantity: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId?: string;
  lineItems: LineItem[];
  taxRate: number;
  discount?: number;
  total: number;
  status: QuoteStatus;
  createdAt: string;
  validUntil?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  quoteId?: string;
  customerId?: string;
  lineItems: LineItem[];
  taxRate: number;
  discount?: number;
  total: number;
  paymentMethod?: PaymentMethod;
  createdAt: string;
}

export interface CartItem {
  itemId: string;
  title: string;
  price: number;
  quantity: number;
}

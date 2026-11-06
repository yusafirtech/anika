export interface Buyer {
  id: string;
  name: string;
  company?: string;
  email: string;
  country?: string;
  phone?: string;
  emailVerified?: boolean;
}

export interface BuyerLead {
  id: string;
  requestType?: string;
  productSlug?: string;
  subject?: string;
  sector?: string;
  quantity?: string;
  quantityUnit?: string;
  incoterm?: string;
  destinationPort?: string;
  paymentTerms?: string;
  status: string;
  message: string;
  createdAt: string;
}

export interface BuyerQuotationLineItem {
  description: string;
  hsCode?: string;
  quantity: string;
  unit: string;
  unitPrice: number;
}

export interface BuyerQuotation {
  id: string;
  quoteNumber: string;
  status: "draft" | "sent" | "accepted" | "expired";
  lineItems: BuyerQuotationLineItem[];
  currency: string;
  incoterm?: string;
  destinationPort?: string;
  paymentTerms?: string;
  validUntil?: string;
  notes?: string;
  createdAt: string;
}

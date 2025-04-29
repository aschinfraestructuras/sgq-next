export type SupplierStatus = 'active' | 'inactive' | 'pending' | 'blocked';
export type SupplierCategory = 'manufacturer' | 'distributor' | 'service' | 'other';
export type SupplierRating = 1 | 2 | 3 | 4 | 5;

export interface SupplierContact {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface SupplierAddress {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface SupplierEvaluation {
  id: string;
  date: string;
  rating: SupplierRating;
  criteria: {
    quality: number;
    delivery: number;
    price: number;
    service: number;
    documentation: number;
  };
  comments: string;
  evaluatedBy: string;
  attachments: string[];
}

export interface Supplier {
  id: string;
  name: string;
  tradingName?: string;
  documentNumber: string;
  email: string;
  phone: string;
  status: SupplierStatus;
  address: SupplierAddress;
  contacts: SupplierContact[];
  categories: string[];
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierFilter {
  search?: string;
  category?: SupplierCategory;
  status?: SupplierStatus;
  rating?: SupplierRating;
}

export interface SupplierStats {
  total: number;
  byCategory: Record<SupplierCategory, number>;
  byStatus: Record<SupplierStatus, number>;
  byRating: Record<SupplierRating, number>;
  withPendingEvaluations: number;
  withExpiringCertifications: number;
} 
export type SupplierStatus = 'active' | 'inactive' | 'pending' | 'blocked';
export type SupplierCategory = 'manufacturer' | 'distributor' | 'service' | 'other';
export type SupplierRating = 1 | 2 | 3 | 4 | 5;

export interface SupplierContact {
  name: string;
  role: string;
  email: string;
  phone: string;
  isMain: boolean;
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
  code: string;
  name: string;
  tradingName: string;
  taxId: string;
  category: SupplierCategory;
  status: SupplierStatus;
  address: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  contacts: SupplierContact[];
  materials: string[]; // IDs dos materiais
  evaluations: SupplierEvaluation[];
  documents: string[]; // IDs dos documentos
  certifications: string[]; // IDs das certificações
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  metadata: Record<string, any>;
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
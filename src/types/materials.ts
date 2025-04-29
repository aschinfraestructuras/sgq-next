export type MaterialStatus = 'active' | 'inactive' | 'pending' | 'discontinued';
export type MaterialCategory = 'raw' | 'processed' | 'packaging' | 'equipment' | 'other';
export type MaterialUnit = 'kg' | 'unit' | 'm' | 'm2' | 'm3' | 'l' | 'ml' | 'g';
export type CertificationType = 'quality' | 'safety' | 'environmental' | 'technical' | 'other';
export type TestStatus = 'pending' | 'in_progress' | 'passed' | 'failed';
export type BatchStatus = 'in_stock' | 'in_use' | 'consumed' | 'expired' | 'quarantine';

export interface MaterialCertification {
  id: string;
  type: CertificationType;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  documentUrl?: string;
  status: 'valid' | 'expired' | 'revoked';
  notes?: string;
}

export interface MaterialTest {
  id: string;
  type: string;
  date: string;
  status: TestStatus;
  results: Record<string, any>;
  technician: string;
  notes?: string;
  attachments?: string[];
}

export interface MaterialBatch {
  id: string;
  number: string;
  quantity: number;
  manufacturingDate: string;
  expiryDate?: string;
  supplier?: string;
  cost: number;
  location: string;
  status: BatchStatus;
  qualityChecks: {
    date: string;
    inspector: string;
    status: 'approved' | 'rejected';
    notes?: string;
  }[];
}

export interface MaterialInventoryMovement {
  id: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  batch?: string;
  document: string;
  reason: string;
  requestedBy: string;
  approvedBy: string;
  location: string;
}

export interface Material {
  id: string;
  code: string;
  name: string;
  description: string;
  category: MaterialCategory;
  status: MaterialStatus;
  unit: MaterialUnit;
  minStock: number;
  maxStock: number;
  currentStock: number;
  reorderPoint: number;
  leadTime: number;
  specifications: {
    technical: Record<string, string>;
    quality: Record<string, string>;
    storage: Record<string, string>;
  };
  suppliers: {
    id: string;
    name: string;
    isPreferred: boolean;
    lastPurchaseDate?: string;
    averageLeadTime?: number;
    qualityRating?: number;
  }[];
  batches: MaterialBatch[];
  inventory: {
    locations: {
      id: string;
      name: string;
      quantity: number;
    }[];
    movements: MaterialInventoryMovement[];
  };
  documents: {
    id: string;
    type: string;
    name: string;
    url: string;
    version: string;
    date: string;
  }[];
  tests: MaterialTest[];
  certifications: MaterialCertification[];
  images?: string[];
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  metadata: Record<string, any>;
}

export interface MaterialFilter {
  search?: string;
  category?: MaterialCategory;
  status?: MaterialStatus;
  supplier?: string;
  certification?: CertificationType;
  hasLowStock?: boolean;
  location?: string;
  expiringCertification?: boolean;
  pendingTests?: boolean;
}

export interface MaterialStats {
  total: number;
  byCategory: Record<MaterialCategory, number>;
  byStatus: Record<MaterialStatus, number>;
  lowStock: number;
  withPendingTests: number;
  withExpiringCertifications: number;
  totalValue: number;
  stockTurnover: number;
  averageLeadTime: number;
  topSuppliers: {
    id: string;
    name: string;
    totalSupplied: number;
    reliability: number;
  }[];
  inventoryHealth: {
    optimal: number;
    low: number;
    excess: number;
    expired: number;
  };
  qualityMetrics: {
    testsPassed: number;
    testsFailed: number;
    pendingTests: number;
    rejectionRate: number;
  };
} 
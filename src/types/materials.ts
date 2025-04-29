export type MaterialStatus = 'active' | 'inactive' | 'discontinued';
export type MaterialCategoryType = 'raw' | 'component' | 'finished';
export type MaterialUnit = 'unit' | 'kg' | 'g' | 'l' | 'ml' | 'm' | 'm2' | 'm3';
export type CertificationType = 'quality' | 'safety' | 'environmental' | 'technical' | 'other';
export type TestStatus = 'pending' | 'passed' | 'failed';
export type BatchStatus = 'in_stock' | 'in_use' | 'consumed' | 'expired' | 'quarantine';

export interface TestResults {
  parameter: string;
  value: number | string;
  min?: number;
  max?: number;
  unit?: string;
  status: TestStatus;
}

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
  name: string;
  description?: string;
  status: TestStatus;
  results: TestResults[];
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface MaterialTestFormData extends Omit<MaterialTest, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'> {
  id?: string;
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

export interface MaterialCategory {
  id: string;
  name: string;
  type: MaterialCategoryType;
  parentId?: string;
  description?: string;
}

export interface MaterialHistory {
  id: string;
  type: 'created' | 'updated' | 'deleted' | 'stock_changed';
  description: string;
  changes?: Record<string, unknown>;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface Material {
  id: string;
  name: string;
  description?: string;
  type: MaterialCategoryType;
  categoryId: string;
  category?: MaterialCategory;
  cost: number;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  leadTime: number;
  suppliers: MaterialSupplier[];
  location: string;
  status: MaterialStatus;
  specifications?: Record<string, string>;
  certifications?: MaterialCertification[];
  tests?: MaterialTest[];
  historico?: MaterialMovement[];
  createdAt: string;
  updatedAt: string;
}

export interface MaterialFilter {
  search?: string;
  category?: string;
  status?: MaterialStatus;
  supplier?: string;
  hasLowStock?: boolean;
  location?: string;
}

export interface MaterialWithCategory extends Material {
  category: MaterialCategory;
}

export interface MaterialStats {
  total: number;
  byCategory: Record<MaterialCategoryType, number>;
  byStatus: Record<MaterialStatus, number>;
  lowStock: number;
  withPendingTests: number;
  withExpiringCertifications: number;
  totalValue: number;
  stockTurnover: number;
  averageLeadTime: number;
  inStock: number;
  turnoverRate: number;
  porCategoria: Record<string, number>;
  porStatus: Record<string, number>;
  quantidadeTotal: number;
  ultimasMovimentacoes: {
    data: string;
    tipo: string;
    quantidade: number;
  }[];
  topSuppliers: {
    name: string;
    total: number;
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
  categoryBreakdown: {
    category: string;
    count: number;
    value: number;
    stockHealth: {
      optimal: number;
      low: number;
      excess: number;
    };
  }[];
}

export interface MaterialMovement {
  tipo: 'entrada' | 'saida' | 'ajuste' | 'teste';
  quantidade: number;
  data: string;
  responsavel: string;
  observacao?: string;
}

export interface MaterialSupplier {
  id: string;
  name: string;
  code: string;
  rating: number;
  lastDelivery?: string;
  averageLeadTime: number;
  contact?: string;
  email?: string;
  phone?: string;
} 
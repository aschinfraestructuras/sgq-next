export type MaterialStatus = 'active' | 'inactive' | 'pending' | 'discontinued';
export type MaterialCategoryType = 'raw' | 'processed' | 'packaging' | 'equipment' | 'other';
export type MaterialUnit = 'kg' | 'unit' | 'm' | 'm2' | 'm3' | 'l' | 'ml' | 'g';
export type CertificationType = 'quality' | 'safety' | 'environmental' | 'technical' | 'other';
export type TestStatus = 'pending' | 'in_progress' | 'passed' | 'failed';
export type BatchStatus = 'in_stock' | 'in_use' | 'consumed' | 'expired' | 'quarantine';

export interface TestResults {
  parameter: string;
  value: number | string;
  unit?: string;
  min?: number;
  max?: number;
  expected?: string | number;
  tolerance?: number;
  isWithinSpec: boolean;
  notes?: string;
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
  materialId: string;
  batchId?: string;
  type: string;
  description: string;
  status: TestStatus;
  dueDate: Date;
  completedDate?: Date;
  results: TestResults[];
  technician?: string;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
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
  code: string;
  name: string;
  description?: string;
  type: MaterialCategoryType;
  parentId?: string;
  path: string[];
  level: number;
  attributes: {
    requiresTest?: boolean;
    requiresCertification?: boolean;
    isHazardous?: boolean;
    storageConditions?: string[];
    customFields?: Record<string, {
      type: 'text' | 'number' | 'boolean' | 'date' | 'select';
      required: boolean;
      options?: string[];
      unit?: string;
      validation?: {
        min?: number;
        max?: number;
        pattern?: string;
      };
    }>;
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  code: string;
  name: string;
  description: string;
  categoryId: string;
  category: MaterialCategory;
  categoryPath?: MaterialCategory[];
  status: MaterialStatus;
  unit: MaterialUnit;
  cost: number;
  price?: number;
  minStock: number;
  maxStock: number;
  currentStock: number;
  reorderPoint: number;
  leadTime: number;
  quantidade?: number;
  historico?: Array<{
    id: string;
    tipo: 'entrada' | 'saida' | 'ajuste' | 'teste';
    quantidade: number;
    data: string;
    responsavel: string;
    observacao?: string;
  }>;
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
  category?: MaterialCategoryType;
  status?: MaterialStatus;
  supplier?: string;
  certification?: CertificationType;
  hasLowStock?: boolean;
  location?: string;
  expiringCertification?: boolean;
  pendingTests?: boolean;
}

export interface MaterialWithCategory extends Material {
  category: MaterialCategory;
  categoryPath: MaterialCategory[];
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
  ultimasMovimentacoes: Array<{
    data: string;
    tipo: string;
    quantidade: number;
  }>;
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
  categoryBreakdown: {
    category: MaterialCategoryType;
    count: number;
    value: number;
    stockHealth: {
      optimal: number;
      low: number;
      excess: number;
    };
  }[];
} 
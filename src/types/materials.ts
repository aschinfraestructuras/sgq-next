export type MaterialStatus = 'active' | 'inactive' | 'pending' | 'discontinued';
export type MaterialCategory = 'raw' | 'processed' | 'packaging' | 'equipment' | 'other';
export type MaterialUnit = 'kg' | 'unit' | 'm' | 'm2' | 'm3' | 'l' | 'ml' | 'g';

export interface Material {
  id: string;
  code: string;
  name: string;
  description: string;
  category: MaterialCategory;
  status: MaterialStatus;
  unit: MaterialUnit;
  minStock: number;
  currentStock: number;
  specifications: string[];
  suppliers: string[]; // IDs dos fornecedores
  documents: string[]; // IDs dos documentos
  tests: string[]; // IDs dos testes
  certifications: string[]; // IDs das certificações
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
}

export interface MaterialStats {
  total: number;
  byCategory: Record<MaterialCategory, number>;
  byStatus: Record<MaterialStatus, number>;
  lowStock: number;
  withPendingTests: number;
  withExpiringCertifications: number;
} 
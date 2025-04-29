export interface Material {
  id: string;
  name: string;
  description?: string;
  category: MaterialCategory;
  status: MaterialStatus;
  currentStock: number;
  minStock: number;
  unitPrice: number;
  unit: string;
  location?: string;
  supplierId?: string;
  suppliers?: string[];
  certificationExpiryDate?: string;
  pendingTests: number;
  consumptionRate: number;
  leadTime?: number;
  movements?: MaterialMovement[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface MaterialFilter {
  category?: MaterialCategory;
  status?: MaterialStatus;
  search?: string;
}

export interface MaterialMovement {
  type: 'entrada' | 'saida';
  quantity: number;
  date: Date;
  description?: string;
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
  recentMovements: {
    materialId: string;
    type: string;
    date: Date;
  }[];
  criticalItems: string[];
}

export type MaterialCategory = 
  | 'materia-prima'
  | 'insumo'
  | 'equipamento'
  | 'ferramenta'
  | 'outro';

export type MaterialStatus = 
  | 'ativo'
  | 'inativo'
  | 'em_analise'
  | 'aguardando_teste'
  | 'reprovado';

export type MaterialUnit = 'unit' | 'kg' | 'g' | 'l' | 'ml' | 'box'; 
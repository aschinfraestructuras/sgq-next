export type MaterialCategory = 'raw' | 'packaging' | 'finished' | 'other';
export type MaterialUnit = 'unit' | 'kg' | 'g' | 'l' | 'ml' | 'box';
export type MaterialStatus = 'active' | 'inactive' | 'discontinued';

export interface Material {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: MaterialCategory;
  unit: MaterialUnit;
  currentStock: number;
  minStock: number;
  status: MaterialStatus;
  unitPrice: number;
  createdAt: Date;
  updatedAt: Date;
} 
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  DocumentData,
  CollectionReference,
  Query,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  Material, 
  MaterialFilter, 
  MaterialCategory,
  MaterialCategoryType,
  MaterialStatus
} from '@/types/materials';
import { getCategory, getCategoryHierarchy } from './materialCategories';

const COLLECTION = 'materials';

export const getMaterials = async (filter?: MaterialFilter): Promise<Material[]> => {
  try {
    const materialsRef = collection(db, COLLECTION);
    let q = query(materialsRef);

    if (filter) {
      if (filter.search) {
        q = query(q, where('name', '>=', filter.search), where('name', '<=', filter.search + '\uf8ff'));
      }
      if (filter.category) {
        q = query(q, where('categoryId', '==', filter.category));
      }
      if (filter.status) {
        q = query(q, where('status', '==', filter.status));
      }
      if (filter.supplier) {
        q = query(q, where('suppliers', 'array-contains', filter.supplier));
      }
      if (filter.hasLowStock) {
        q = query(q, where('currentStock', '<=', 'reorderPoint'));
      }
      if (filter.location) {
        q = query(q, where('location', '==', filter.location));
      }
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Material[];
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

export const getMaterial = async (id: string): Promise<Material | null> => {
  try {
    const materialRef = doc(db, COLLECTION, id);
    const materialDoc = await getDoc(materialRef);
    
    if (!materialDoc.exists()) {
      return null;
    }

    return {
      id: materialDoc.id,
      ...materialDoc.data()
    } as Material;
  } catch (error) {
    console.error('Error fetching material:', error);
    throw error;
  }
};

export const createMaterial = async (material: Omit<Material, 'id'>): Promise<Material> => {
  try {
    const materialsRef = collection(db, COLLECTION);
    const docRef = await addDoc(materialsRef, {
      ...material,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return {
      id: docRef.id,
      ...material
    } as Material;
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
};

export const updateMaterial = async (id: string, material: Partial<Material>): Promise<void> => {
  try {
    const materialRef = doc(db, COLLECTION, id);
    await updateDoc(materialRef, {
      ...material,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};

export const deleteMaterial = async (id: string): Promise<void> => {
  try {
    const materialRef = doc(db, COLLECTION, id);
    await deleteDoc(materialRef);
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
};

interface CategoryBreakdown {
  category: string;
  count: number;
  value: number;
  percentage: number;
}

interface MaterialStats {
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
  ultimasMovimentacoes: any[];
  topSuppliers: any[];
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
  categoryBreakdown: CategoryBreakdown[];
}

export const getMaterialStats = async (): Promise<MaterialStats> => {
  try {
    const materials = await getMaterials();
    
    // Initialize stats object
    const stats: MaterialStats = {
      total: 0,
      byCategory: {} as Record<MaterialCategoryType, number>,
      byStatus: {} as Record<MaterialStatus, number>,
      lowStock: 0,
      withPendingTests: 0,
      withExpiringCertifications: 0,
      totalValue: 0,
      stockTurnover: 0,
      averageLeadTime: 0,
      inStock: 0,
      turnoverRate: 0,
      porCategoria: {},
      porStatus: {},
      quantidadeTotal: 0,
      ultimasMovimentacoes: [],
      topSuppliers: [],
      inventoryHealth: {
        optimal: 0,
        low: 0,
        excess: 0,
        expired: 0
      },
      qualityMetrics: {
        testsPassed: 0,
        testsFailed: 0,
        pendingTests: 0,
        rejectionRate: 0
      },
      categoryBreakdown: []
    };

    // Calculate stats from materials
    stats.total = materials.length;
    
    materials.forEach(material => {
      if (!material) return;

      // Calculate total value and stock metrics
      const cost = material.cost || 0;
      const currentStock = material.currentStock || 0;
      const minStock = material.minStock || 0;
      const maxStock = material.maxStock || 0;
      
      stats.totalValue += cost * currentStock;
      stats.quantidadeTotal += currentStock;
      
      if (currentStock > 0) {
        stats.inStock++;
      }
      
      if (currentStock <= minStock) {
        stats.lowStock++;
        stats.inventoryHealth.low++;
      } else if (currentStock >= maxStock) {
        stats.inventoryHealth.excess++;
      } else {
        stats.inventoryHealth.optimal++;
      }

      // Category stats
      if (material.type) {
        stats.byCategory[material.type] = (stats.byCategory[material.type] || 0) + 1;
        stats.porCategoria[material.type] = (stats.porCategoria[material.type] || 0) + 1;
      }

      // Status stats
      if (material.status) {
        stats.byStatus[material.status] = (stats.byStatus[material.status] || 0) + 1;
        stats.porStatus[material.status] = (stats.porStatus[material.status] || 0) + 1;
      }

      // Test metrics
      if (material.tests?.length) {
        material.tests.forEach(test => {
          if (test.status === 'passed') {
            stats.qualityMetrics.testsPassed++;
          } else if (test.status === 'failed') {
            stats.qualityMetrics.testsFailed++;
          } else {
            stats.qualityMetrics.pendingTests++;
            stats.withPendingTests++;
          }
        });
      }

      // Certification metrics
      if (material.certifications?.some(cert => {
        const expiryDate = new Date(cert.expiryDate);
        const now = new Date();
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30;
      })) {
        stats.withExpiringCertifications++;
      }

      // Lead time and turnover
      if (material.leadTime) {
        stats.averageLeadTime += material.leadTime;
      }
    });

    // Calculate averages and rates
    if (stats.total > 0) {
      stats.averageLeadTime /= stats.total;
      stats.turnoverRate = stats.quantidadeTotal / stats.total;
    }

    // Calculate rejection rate
    const totalTests = stats.qualityMetrics.testsPassed + stats.qualityMetrics.testsFailed;
    stats.qualityMetrics.rejectionRate = totalTests > 0 ? stats.qualityMetrics.testsFailed / totalTests : 0;

    // Process category breakdown
    Object.entries(stats.porCategoria).forEach(([category, count]) => {
      const materialsInCategory = materials.filter(m => m?.type === category);
      const value = materialsInCategory.reduce((sum, m) => sum + ((m?.cost || 0) * (m?.currentStock || 0)), 0);
      
      stats.categoryBreakdown.push({
        category,
        count,
        value,
        percentage: (count / stats.total) * 100
      });
    });

    // Sort category breakdown by value
    stats.categoryBreakdown.sort((a, b) => b.value - a.value);

    return stats;
  } catch (error) {
    console.error('Error calculating material stats:', error);
    throw error;
  }
};

export const addMaterialMovement = async (
  materialId: string,
  movimento: {
    tipo: 'entrada' | 'saida' | 'ajuste' | 'teste';
    quantidade: number;
    responsavel: string;
    observacao?: string;
  }
): Promise<void> => {
  try {
    const materialRef = doc(db, COLLECTION, materialId);
    const materialDoc = await getDoc(materialRef);
    
    if (!materialDoc.exists()) {
      throw new Error('Material não encontrado');
    }

    const material = materialDoc.data() as Material;
    const currentStock = material.currentStock || 0;
    let newStock = currentStock;

    switch (movimento.tipo) {
      case 'entrada':
        newStock += movimento.quantidade;
        break;
      case 'saida':
        newStock -= movimento.quantidade;
        break;
      case 'ajuste':
        newStock = movimento.quantidade;
        break;
      case 'teste':
        // Não altera o estoque
        break;
    }

    if (newStock < 0) {
      throw new Error('Estoque não pode ser negativo');
    }

    const batch = writeBatch(db);
    const timestamp = Timestamp.now();

    // Update material stock
    batch.update(materialRef, {
      currentStock: newStock,
      updatedAt: timestamp,
    });

    // Add movement to history
    const historyRef = collection(db, COLLECTION, materialId, 'history');
    batch.set(doc(historyRef), {
      ...movimento,
      timestamp,
      previousStock: currentStock,
      newStock,
    });

    await batch.commit();
  } catch (error) {
    console.error('Error adding material movement:', error);
    throw error;
  }
}; 
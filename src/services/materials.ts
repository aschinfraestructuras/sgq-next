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
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { 
  Material, 
  MaterialFilter, 
  MaterialStats, 
  MaterialCategory,
  MaterialCategoryType,
  MaterialStatus
} from '@/types/materials';
import { getCategory, getCategoryHierarchy } from './materialCategories';

const COLLECTION = 'materials';

export async function getMaterials(filter?: MaterialFilter): Promise<Material[]> {
  try {
    let materialsQuery: Query<DocumentData> = collection(db, COLLECTION);

    if (filter) {
      if (filter.search) {
        materialsQuery = query(materialsQuery, 
          where('name', '>=', filter.search), 
          where('name', '<=', filter.search + '\uf8ff')
        );
      }
      if (filter.category) {
        materialsQuery = query(materialsQuery, where('type', '==', filter.category));
      }
      if (filter.status) {
        materialsQuery = query(materialsQuery, where('status', '==', filter.status));
      }
      if (filter.supplier) {
        materialsQuery = query(materialsQuery, where('suppliers', 'array-contains', { name: filter.supplier }));
      }
      if (filter.hasLowStock) {
        materialsQuery = query(materialsQuery, where('currentStock', '<=', 'reorderPoint'));
      }
      if (filter.location) {
        materialsQuery = query(materialsQuery, where('inventory.locations', 'array-contains', { name: filter.location }));
      }
    }

    const querySnapshot = await getDocs(materialsQuery);
    const materials = await Promise.all(querySnapshot.docs.map(async doc => {
      const data = doc.data();
      const categoryHierarchy = await getCategoryHierarchy(data.categoryId);
      
      return {
        id: doc.id,
        ...data,
        category: categoryHierarchy[categoryHierarchy.length - 1],
        categoryPath: categoryHierarchy
      } as Material;
    }));

    return materials;
  } catch (error) {
    console.error('Error getting materials:', error);
    throw error;
  }
}

export async function getMaterial(id: string): Promise<Material> {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Material not found');
  }

  return {
    id: docSnap.id,
    ...docSnap.data()
  } as Material;
}

export async function createMaterial(data: Omit<Material, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function updateMaterial(id: string, data: Partial<Material>): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteMaterial(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}

export async function getMaterialStats(): Promise<MaterialStats> {
  try {
    const materials = await getMaterials();
    
    const stats: MaterialStats = {
      total: materials.length,
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

    materials.forEach(material => {
      // Category breakdown
      const categoryStats = stats.categoryBreakdown.find(c => c.category === material.category.type) || {
        category: material.category.type,
        count: 0,
        value: 0,
        stockHealth: {
          optimal: 0,
          low: 0,
          excess: 0
        }
      };
      
      categoryStats.count++;
      categoryStats.value += material.currentStock * material.cost;
      
      if (material.currentStock <= material.reorderPoint) {
        categoryStats.stockHealth.low++;
        stats.lowStock++;
      } else if (material.currentStock >= material.maxStock) {
        categoryStats.stockHealth.excess++;
      } else {
        categoryStats.stockHealth.optimal++;
      }
      
      if (!stats.categoryBreakdown.find(c => c.category === material.category.type)) {
        stats.categoryBreakdown.push(categoryStats);
      }

      // Status count
      stats.byStatus[material.status] = (stats.byStatus[material.status] || 0) + 1;
      stats.porStatus[material.status] = (stats.porStatus[material.status] || 0) + 1;

      // Category count
      stats.byCategory[material.category.type] = (stats.byCategory[material.category.type] || 0) + 1;
      stats.porCategoria[material.category.type] = (stats.porCategoria[material.category.type] || 0) + 1;

      // Total value and quantity
      stats.totalValue += material.currentStock * material.cost;
      stats.quantidadeTotal += material.currentStock;
      
      if (material.currentStock > 0) {
        stats.inStock++;
      }

      // Movement history
      if (material.historico && material.historico.length > 0) {
        stats.ultimasMovimentacoes.push(...material.historico
          .slice(0, 5)
          .map(h => ({
            data: h.data,
            tipo: h.tipo,
            quantidade: h.quantidade
          })));
      }

      // Tests metrics
      const pendingTests = material.tests.filter(t => t.status === 'pending').length;
      if (pendingTests > 0) {
        stats.withPendingTests++;
      }
      stats.qualityMetrics.pendingTests += pendingTests;
      stats.qualityMetrics.testsPassed += material.tests.filter(t => t.status === 'passed').length;
      stats.qualityMetrics.testsFailed += material.tests.filter(t => t.status === 'failed').length;
    });

    // Calculate averages and rates
    stats.turnoverRate = materials.reduce((acc, m) => acc + (m.currentStock > 0 ? 1 : 0), 0) / materials.length;
    stats.averageLeadTime = materials.reduce((acc, m) => acc + m.leadTime, 0) / materials.length;
    stats.qualityMetrics.rejectionRate = stats.qualityMetrics.testsFailed / 
      (stats.qualityMetrics.testsPassed + stats.qualityMetrics.testsFailed);

    // Sort and limit movements
    stats.ultimasMovimentacoes.sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
    stats.ultimasMovimentacoes = stats.ultimasMovimentacoes.slice(0, 5);

    return stats;
  } catch (error) {
    console.error('Error getting material stats:', error);
    throw error;
  }
}

export async function addMaterialMovement(
  materialId: string,
  movimento: {
    tipo: 'entrada' | 'saida' | 'ajuste' | 'teste';
    quantidade: number;
    responsavel: string;
    observacao?: string;
  }
) {
  try {
    const material = await getMaterial(materialId);
    const novaQuantidade = (material.quantidade || material.currentStock) + (
      movimento.tipo === 'entrada' ? movimento.quantidade : 
      movimento.tipo === 'saida' ? -movimento.quantidade :
      movimento.quantidade
    );

    const novoHistorico = {
      id: Math.random().toString(36).substr(2, 9),
      data: new Date().toISOString(),
      ...movimento
    };

    await updateMaterial(materialId, {
      currentStock: novaQuantidade,
      quantidade: novaQuantidade,
      historico: [...(material.historico || []), novoHistorico]
    });

    return novoHistorico;
  } catch (error) {
    console.error('Error adding material movement:', error);
    throw error;
  }
} 
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
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  CollectionReference,
  Firestore,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Material, MaterialFilter, MaterialStats, MaterialMovement } from '@/types/material';
import { addHistoryEntry } from './materialHistory';
import { getCurrentUser } from './auth';

const COLLECTION = 'materials';

// Helper function to get collection reference
const getCollectionRef = () => {
  if (!db) throw new Error('Firestore is not initialized');
  return collection(db, COLLECTION);
};

export const getMaterials = async (filter?: MaterialFilter): Promise<Material[]> => {
  try {
    const materialsRef = getCollectionRef();
    let q = query(materialsRef);

    if (filter) {
      if (filter.category) {
        q = query(q, where('category', '==', filter.category));
      }
      if (filter.status) {
        q = query(q, where('status', '==', filter.status));
      }
      if (filter.search) {
        q = query(q, 
          where('name', '>=', filter.search),
          where('name', '<=', filter.search + '\uf8ff')
        );
      }
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    })) as Material[];
  } catch (error) {
    console.error('Error getting materials:', error);
    throw error;
  }
};

export const getMaterial = async (id: string): Promise<Material | null> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
      } as Material;
    }

    return null;
  } catch (error) {
    console.error('Error getting material:', error);
    throw error;
  }
};

export const createMaterial = async (data: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>): Promise<Material> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const materialsRef = getCollectionRef();
    const now = Timestamp.now();
    const materialData = {
      ...data,
      createdAt: now,
      updatedAt: now,
      createdBy: user.id,
      updatedBy: user.id,
    };

    const docRef = await addDoc(materialsRef, materialData);
    const newMaterial = {
      id: docRef.id,
      ...materialData,
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString(),
    } as Material;

    // Add history entry
    await addHistoryEntry({
      materialId: docRef.id,
      type: 'created',
      newValue: newMaterial,
      userId: user.id,
    });

    return newMaterial;
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
};

export const updateMaterial = async (id: string, data: Partial<Material>): Promise<void> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, COLLECTION, id);
    
    // Get current state for history
    const currentDoc = await getDoc(docRef);
    const currentData = currentDoc.data();

    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
      updatedBy: user.id,
    };

    await updateDoc(docRef, updateData);

    // Add history entry
    await addHistoryEntry({
      materialId: id,
      type: 'updated',
      previousValue: currentData as Partial<Material>,
      newValue: data,
      userId: user.id,
    });
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};

export const deleteMaterial = async (id: string): Promise<void> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, COLLECTION, id);
    
    // Get current state for history
    const currentDoc = await getDoc(docRef);
    const currentData = currentDoc.data();

    await deleteDoc(docRef);

    // Add history entry
    await addHistoryEntry({
      materialId: id,
      type: 'deleted',
      previousValue: currentData as Partial<Material>,
      userId: user.id,
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
};

export const updateStock = async (
  id: string, 
  quantity: number, 
  type: 'stock_in' | 'stock_out',
  reason?: string
): Promise<void> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, COLLECTION, id);
    
    // Get current state for validation and history
    const currentDoc = await getDoc(docRef);
    const currentData = currentDoc.data() as Material;

    // Validate stock out
    if (type === 'stock_out' && currentData.currentStock < quantity) {
      throw new Error('Insufficient stock');
    }

    const stockChange = type === 'stock_in' ? quantity : -quantity;
    
    await updateDoc(docRef, {
      currentStock: increment(stockChange),
      updatedAt: Timestamp.now(),
      updatedBy: user.id,
    });

    // Add history entry
    await addHistoryEntry({
      materialId: id,
      type,
      quantity,
      previousValue: { currentStock: currentData.currentStock },
      newValue: { currentStock: currentData.currentStock + stockChange },
      reason,
      userId: user.id,
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

export async function getMaterialStats(): Promise<MaterialStats> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    const materials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Material);

    const stats: MaterialStats = {
      total: materials.length,
      byCategory: {} as Record<Material['category'], number>,
      byStatus: {} as Record<Material['status'], number>,
      lowStock: materials.filter(m => m.currentStock <= m.minStock).length,
      withPendingTests: materials.filter(m => m.pendingTests > 0).length,
      withExpiringCertifications: materials.filter(m => m.certificationExpiryDate && new Date(m.certificationExpiryDate) <= new Date()).length,
      totalValue: materials.reduce((acc, m) => acc + (m.currentStock * m.unitPrice), 0),
      stockTurnover: calculateStockTurnover(materials),
      averageLeadTime: calculateAverageLeadTime(materials),
      topSuppliers: getTopSuppliers(materials),
      recentMovements: getRecentMovements(materials),
      criticalItems: getCriticalItems(materials)
    };

    // Calculate category counts
    materials.forEach(material => {
      stats.byCategory[material.category] = (stats.byCategory[material.category] || 0) + 1;
    });

    // Calculate status counts
    materials.forEach(material => {
      stats.byStatus[material.status] = (stats.byStatus[material.status] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error getting material stats:', error);
    throw error;
  }
}

function calculateStockTurnover(materials: Material[]): number {
  return materials.reduce((acc, m) => acc + m.consumptionRate, 0) / materials.length;
}

function calculateAverageLeadTime(materials: Material[]): number {
  return materials.reduce((acc, m) => acc + (m.leadTime || 0), 0) / materials.length;
}

function getTopSuppliers(materials: Material[]): { id: string; name: string; totalSupplied: number; reliability: number }[] {
  const supplierCounts = materials.reduce((acc, m) => {
    if (m.supplierId) {
      acc[m.supplierId] = (acc[m.supplierId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(supplierCounts)
    .map(([id, count]) => ({
      id,
      name: id, // TODO: Get supplier name from suppliers collection
      totalSupplied: count,
      reliability: 100 // TODO: Calculate based on delivery performance
    }))
    .sort((a, b) => b.totalSupplied - a.totalSupplied)
    .slice(0, 5);
}

function getRecentMovements(materials: Material[]): { materialId: string; type: string; date: Date }[] {
  return materials
    .flatMap(m => (m.movements || []).map(mov => ({
      materialId: m.id,
      type: mov.type,
      date: new Date(mov.date)
    })))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);
}

function getCriticalItems(materials: Material[]): string[] {
  return materials
    .filter(m => m.currentStock <= m.minStock || (m.certificationExpiryDate && new Date(m.certificationExpiryDate) <= new Date()))
    .map(m => m.id)
    .slice(0, 5);
} 
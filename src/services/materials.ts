import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, arrayUnion } from 'firebase/firestore';
import type { Material, MaterialFilter, MaterialStats } from '@/types/materials';

export async function getMaterials(filter?: MaterialFilter): Promise<Material[]> {
  try {
    let baseQuery = collection(db, 'materials');
    let constraints = [];

    if (filter?.search) {
      constraints.push(
        where('name', '>=', filter.search),
        where('name', '<=', filter.search + '\uf8ff')
      );
    }

    if (filter?.category) {
      constraints.push(where('category', '==', filter.category));
    }

    if (filter?.status) {
      constraints.push(where('status', '==', filter.status));
    }

    if (filter?.supplier) {
      constraints.push(where('suppliers', 'array-contains', filter.supplier));
    }

    const q = query(baseQuery, ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Material));
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
}

export async function getMaterial(id: string): Promise<Material | null> {
  try {
    const docRef = doc(db, 'materials', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Material;
  } catch (error) {
    console.error('Error fetching material:', error);
    throw error;
  }
}

export async function createMaterial(material: Omit<Material, 'id'>): Promise<Material> {
  try {
    const now = new Date().toISOString();
    const newMaterial = {
      ...material,
      createdAt: now,
      updatedAt: now
    };

    const materialsRef = collection(db, 'materials');
    const docRef = await addDoc(materialsRef, newMaterial);
    return { id: docRef.id, ...newMaterial };
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
}

export async function updateMaterial(id: string, updates: Partial<Material>): Promise<Material> {
  try {
    const now = new Date().toISOString();
    const updatedMaterial = {
      ...updates,
      updatedAt: now
    };

    const docRef = doc(db, 'materials', id);
    await updateDoc(docRef, updatedMaterial);
    return { id, ...updatedMaterial } as Material;
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
}

export async function deleteMaterial(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'materials', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
}

export async function getMaterialStats(): Promise<MaterialStats> {
  try {
    const materialsRef = collection(db, 'materials');
    const snapshot = await getDocs(materialsRef);
    const materials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Material);

    const stats: MaterialStats = {
      total: materials.length,
      byCategory: {} as Record<Material['category'], number>,
      byStatus: {} as Record<Material['status'], number>,
      lowStock: 0,
      withPendingTests: 0,
      withExpiringCertifications: 0
    };

    materials.forEach(material => {
      // Count by category
      stats.byCategory[material.category] = (stats.byCategory[material.category] || 0) + 1;
      
      // Count by status
      stats.byStatus[material.status] = (stats.byStatus[material.status] || 0) + 1;
      
      // Count low stock
      if (material.currentStock < material.minStock) {
        stats.lowStock++;
      }

      // Aqui você pode adicionar mais lógica para testes pendentes e certificações
      // baseado na sua estrutura de dados específica
    });

    return stats;
  } catch (error) {
    console.error('Error fetching material stats:', error);
    throw error;
  }
} 
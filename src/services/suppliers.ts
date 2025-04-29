import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, DocumentData, QueryDocumentSnapshot, arrayUnion } from 'firebase/firestore';
import type { Supplier, SupplierFilter, SupplierStats, SupplierEvaluation, SupplierRating } from '@/types/suppliers';

export async function getSuppliers(filter?: SupplierFilter): Promise<Supplier[]> {
  try {
    let baseQuery = collection(db, 'suppliers');
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

    if (filter?.rating) {
      constraints.push(where('averageRating', '>=', filter.rating));
    }

    const q = query(baseQuery, ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier));
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
}

export async function getSupplier(id: string): Promise<Supplier | null> {
  try {
    const docRef = doc(db, 'suppliers', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Supplier;
  } catch (error) {
    console.error('Error fetching supplier:', error);
    throw error;
  }
}

export async function createSupplier(supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
  try {
    const now = new Date().toISOString();
    const newSupplier = {
      ...supplier,
      createdAt: now,
      updatedAt: now,
      evaluations: []
    };

    const suppliersRef = collection(db, 'suppliers');
    const docRef = await addDoc(suppliersRef, newSupplier);
    return { id: docRef.id, ...newSupplier };
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
}

export async function updateSupplier(id: string, updates: Partial<Supplier>): Promise<Supplier> {
  try {
    const now = new Date().toISOString();
    const updatedSupplier = {
      ...updates,
      updatedAt: now
    };

    const docRef = doc(db, 'suppliers', id);
    await updateDoc(docRef, updatedSupplier);
    return { id, ...updatedSupplier } as Supplier;
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
}

export async function deleteSupplier(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'suppliers', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
}

export async function addSupplierEvaluation(
  supplierId: string, 
  evaluation: Omit<SupplierEvaluation, 'id'>
): Promise<SupplierEvaluation> {
  try {
    const now = new Date().toISOString();
    const newEvaluation = {
      ...evaluation,
      id: `eval_${now}`,
      date: now
    };

    const docRef = doc(db, 'suppliers', supplierId);
    await updateDoc(docRef, {
      evaluations: arrayUnion(newEvaluation)
    });

    return newEvaluation as SupplierEvaluation;
  } catch (error) {
    console.error('Error adding supplier evaluation:', error);
    throw error;
  }
}

export async function getSupplierStats(): Promise<SupplierStats> {
  try {
    const suppliersRef = collection(db, 'suppliers');
    const snapshot = await getDocs(suppliersRef);
    const suppliers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Supplier);

    const stats: SupplierStats = {
      total: suppliers.length,
      byCategory: {} as Record<Supplier['category'], number>,
      byStatus: {} as Record<Supplier['status'], number>,
      byRating: {} as Record<number, number>,
      withPendingEvaluations: 0,
      withExpiringCertifications: 0
    };

    suppliers.forEach(supplier => {
      // Count by category
      stats.byCategory[supplier.category] = (stats.byCategory[supplier.category] || 0) + 1;
      
      // Count by status
      stats.byStatus[supplier.status] = (stats.byStatus[supplier.status] || 0) + 1;
      
      // Count by average rating
      if (supplier.evaluations.length > 0) {
        const avgRating = Math.round(
          supplier.evaluations.reduce((acc, evaluation) => acc + evaluation.rating, 0) / 
          supplier.evaluations.length
        ) as SupplierRating;
        stats.byRating[avgRating] = (stats.byRating[avgRating] || 0) + 1;
      }

      // Verificar avaliações pendentes (última avaliação > 6 meses)
      const lastEval = supplier.evaluations[supplier.evaluations.length - 1];
      if (!lastEval || new Date(lastEval.date).getTime() < Date.now() - 180 * 24 * 60 * 60 * 1000) {
        stats.withPendingEvaluations++;
      }

      // Aqui você pode adicionar mais lógica para certificações expirando
      // baseado na sua estrutura de dados específica
    });

    return stats;
  } catch (error) {
    console.error('Error fetching supplier stats:', error);
    throw error;
  }
} 
import { db } from '@/lib/firebase/config';
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
  limit,
  arrayUnion
} from 'firebase/firestore';
import type { 
  Supplier, 
  SupplierFilter, 
  SupplierStats, 
  SupplierEvaluation, 
  SupplierRating,
  SupplierCategory,
  SupplierStatus
} from '@/types/suppliers';

const COLLECTION = 'suppliers';

export async function getSuppliers(options?: {
  status?: SupplierStatus;
  limit?: number;
}): Promise<Supplier[]> {
  const suppliersRef = collection(db, COLLECTION);
  let q = query(suppliersRef);

  if (options?.status) {
    q = query(q, where('status', '==', options.status));
  }

  q = query(q, orderBy('createdAt', 'desc'));

  if (options?.limit) {
    q = query(q, limit(options.limit));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Supplier[];
}

export async function getSupplier(id: string): Promise<Supplier> {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Supplier not found');
  }

  return {
    id: docSnap.id,
    ...docSnap.data()
  } as Supplier;
}

export async function createSupplier(data: Omit<Supplier, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function updateSupplier(id: string, data: Partial<Supplier>): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteSupplier(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
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

    const docRef = doc(db, COLLECTION, supplierId);
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
    const suppliersRef = collection(db, COLLECTION);
    const snapshot = await getDocs(suppliersRef);
    const suppliers = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      evaluations: doc.data().evaluations || []
    })) as (Supplier & { evaluations: SupplierEvaluation[] })[];

    const stats: SupplierStats = {
      total: suppliers.length,
      byCategory: {} as Record<SupplierCategory, number>,
      byStatus: {} as Record<SupplierStatus, number>,
      byRating: {} as Record<number, number>,
      withPendingEvaluations: 0,
      withExpiringCertifications: 0
    };

    suppliers.forEach(supplier => {
      // Count by category
      supplier.categories.forEach(category => {
        const cat = category as SupplierCategory;
        stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
      });
      
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
    });

    return stats;
  } catch (error) {
    console.error('Error fetching supplier stats:', error);
    throw error;
  }
} 
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
  arrayUnion,
  Timestamp
} from 'firebase/firestore';
import type { 
  Supplier, 
  SupplierFilter, 
  SupplierStats, 
  SupplierRating,
  SupplierCategory,
  SupplierStatus
} from '@/types/suppliers';

interface SupplierEvaluation {
  id: string;
  date: Timestamp;
  rating: SupplierRating;
  criteria: {
    quality: number;
    delivery: number;
    price: number;
    service: number;
    documentation: number;
  };
  comments: string;
  evaluatedBy: string;
  attachments: string[];
}

interface SupplierWithEvaluations extends Supplier {
  evaluations: SupplierEvaluation[];
  certifications?: Array<{
    id: string;
    type: string;
    number: string;
    expiryDate: Timestamp;
    issuer: string;
  }>;
}

const COLLECTION = 'suppliers';
const EVALUATION_PERIOD_DAYS = 180; // 6 months

export async function getSuppliers(options?: {
  status?: SupplierStatus;
  limit?: number;
}): Promise<Supplier[]> {
  try {
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
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
}

export async function getSupplier(id: string): Promise<Supplier> {
  try {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Supplier not found');
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Supplier;
  } catch (error) {
    console.error('Error fetching supplier:', error);
    throw error;
  }
}

export async function createSupplier(data: Omit<Supplier, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
}

export async function updateSupplier(id: string, data: Partial<Supplier>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
}

export async function deleteSupplier(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
}

export async function addSupplierEvaluation(
  supplierId: string, 
  evaluation: Omit<SupplierEvaluation, 'id' | 'date'>
): Promise<SupplierEvaluation> {
  try {
    const timestamp = Timestamp.now();
    const newEvaluation = {
      ...evaluation,
      id: `eval_${timestamp.toMillis()}`,
      date: timestamp
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
      evaluations: doc.data().evaluations || [],
      certifications: doc.data().certifications || []
    })) as SupplierWithEvaluations[];

    const stats: SupplierStats = {
      total: suppliers.length,
      byCategory: {} as Record<SupplierCategory, number>,
      byStatus: {} as Record<SupplierStatus, number>,
      byRating: {} as Record<number, number>,
      withPendingEvaluations: 0,
      withExpiringCertifications: 0
    };

    const now = Timestamp.now();
    const evaluationPeriod = EVALUATION_PERIOD_DAYS * 24 * 60 * 60 * 1000; // Convert to milliseconds

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

        // Check for pending evaluations
        const lastEval = supplier.evaluations[supplier.evaluations.length - 1];
        if (!lastEval || (now.toMillis() - lastEval.date.toMillis()) > evaluationPeriod) {
          stats.withPendingEvaluations++;
        }
      } else {
        stats.withPendingEvaluations++;
      }

      // Check for expiring certifications
      if (supplier.certifications?.some(cert => {
        const expiryDate = cert.expiryDate.toMillis();
        const daysUntilExpiry = Math.floor((expiryDate - now.toMillis()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30;
      })) {
        stats.withExpiringCertifications++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error fetching supplier stats:', error);
    throw error;
  }
} 
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Material } from '@/types/materials';

export interface MaterialHistoryEntry {
  id: string;
  materialId: string;
  type: 'created' | 'updated' | 'deleted' | 'stock_in' | 'stock_out';
  quantity?: number;
  previousValue?: Partial<Material>;
  newValue?: Partial<Material>;
  reason?: string;
  userId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

const COLLECTION = 'material_history';

export const addHistoryEntry = async (entry: Omit<MaterialHistoryEntry, 'id' | 'timestamp'>): Promise<MaterialHistoryEntry> => {
  try {
    const historyRef = collection(db, COLLECTION);
    const now = Timestamp.now();
    
    const docRef = await addDoc(historyRef, {
      ...entry,
      timestamp: now
    });

    return {
      id: docRef.id,
      ...entry,
      timestamp: now.toDate().toISOString()
    };
  } catch (error) {
    console.error('Error adding history entry:', error);
    throw error;
  }
};

export const getMaterialHistory = async (materialId: string, limit?: number): Promise<MaterialHistoryEntry[]> => {
  try {
    const historyRef = collection(db, COLLECTION);
    let q = query(
      historyRef,
      where('materialId', '==', materialId),
      orderBy('timestamp', 'desc')
    );

    if (limit) {
      q = query(q, limit(limit));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate().toISOString()
    })) as MaterialHistoryEntry[];
  } catch (error) {
    console.error('Error getting material history:', error);
    throw error;
  }
};

export const getRecentMaterialActivities = async (limit = 10): Promise<MaterialHistoryEntry[]> => {
  try {
    const historyRef = collection(db, COLLECTION);
    const q = query(
      historyRef,
      orderBy('timestamp', 'desc'),
      limit(limit)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate().toISOString()
    })) as MaterialHistoryEntry[];
  } catch (error) {
    console.error('Error getting recent activities:', error);
    throw error;
  }
}; 
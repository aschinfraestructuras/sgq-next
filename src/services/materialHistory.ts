import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit as limitQuery,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Material } from '@/types/material';
import type { MaterialHistory } from '@/types/materials';

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

export const addHistoryEntry = async (materialId: string, entry: Omit<MaterialHistory, 'id' | 'createdAt'>): Promise<void> => {
  const historyCollection = collection(db, 'materials', materialId, 'history');
  await addDoc(historyCollection, {
    ...entry,
    createdAt: new Date().toISOString()
  });
};

export const getHistoryEntries = async (materialId: string, limitCount = 10): Promise<MaterialHistory[]> => {
  const historyCollection = collection(db, 'materials', materialId, 'history');
  const q = query(
    historyCollection,
    orderBy('createdAt', 'desc'),
    limitQuery(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as MaterialHistory[];
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
      q = query(q, limitQuery(limit));
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
      limitQuery(limit)
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
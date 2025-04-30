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
import { db } from '@/lib/firebase';
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
  timestamp: Timestamp;
  metadata?: Record<string, any>;
}

const COLLECTION = 'material_history';

export const addHistoryEntry = async (materialId: string, entry: Omit<MaterialHistory, 'id' | 'createdAt'>): Promise<void> => {
  try {
    const historyCollection = collection(db, 'materials', materialId, 'history');
    await addDoc(historyCollection, {
      ...entry,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error adding history entry:', error);
    throw error;
  }
};

export const getHistoryEntries = async (materialId: string, limitCount = 10): Promise<MaterialHistory[]> => {
  try {
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
  } catch (error) {
    console.error('Error getting history entries:', error);
    throw error;
  }
};

export const getMaterialHistory = async (materialId: string): Promise<MaterialHistory[]> => {
  try {
    const historyRef = collection(db, 'materials', materialId, 'history');
    const q = query(historyRef, where('deleted', '==', false));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MaterialHistory[];
  } catch (error) {
    console.error('Error fetching material history:', error);
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
      timestamp: doc.data().timestamp
    })) as MaterialHistoryEntry[];
  } catch (error) {
    console.error('Error getting recent activities:', error);
    throw error;
  }
}; 
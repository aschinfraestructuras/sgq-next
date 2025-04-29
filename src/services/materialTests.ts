import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import type { MaterialTest } from '@/types/materials';

const COLLECTION_NAME = 'material_tests';

export async function createMaterialTest(materialId: string, testData: Omit<MaterialTest, 'id'>) {
  try {
    const testsRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(testsRef, {
      ...testData,
      materialId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...testData
    };
  } catch (error) {
    console.error('Error creating material test:', error);
    throw new Error('Falha ao criar teste de material');
  }
}

export async function updateMaterialTest(testId: string, testData: Partial<MaterialTest>) {
  try {
    const testRef = doc(db, COLLECTION_NAME, testId);
    await updateDoc(testRef, {
      ...testData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating material test:', error);
    throw new Error('Falha ao atualizar teste de material');
  }
}

export async function deleteMaterialTest(testId: string) {
  try {
    const testRef = doc(db, COLLECTION_NAME, testId);
    await deleteDoc(testRef);
  } catch (error) {
    console.error('Error deleting material test:', error);
    throw new Error('Falha ao excluir teste de material');
  }
}

export async function getMaterialTests(materialId: string) {
  try {
    const testsRef = collection(db, COLLECTION_NAME);
    const q = query(
      testsRef,
      where('materialId', '==', materialId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MaterialTest[];
  } catch (error) {
    console.error('Error getting material tests:', error);
    throw new Error('Falha ao buscar testes do material');
  }
}

export async function getMaterialTestsByStatus(materialId: string, status: MaterialTest['status']) {
  try {
    const testsRef = collection(db, COLLECTION_NAME);
    const q = query(
      testsRef,
      where('materialId', '==', materialId),
      where('status', '==', status),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MaterialTest[];
  } catch (error) {
    console.error('Error getting material tests by status:', error);
    throw new Error('Falha ao buscar testes por status');
  }
}

export async function getMaterialTestsStats(materialId: string) {
  try {
    const tests = await getMaterialTests(materialId);
    
    return {
      total: tests.length,
      byStatus: {
        passed: tests.filter(t => t.status === 'passed').length,
        failed: tests.filter(t => t.status === 'failed').length,
        in_progress: tests.filter(t => t.status === 'in_progress').length,
        pending: tests.filter(t => t.status === 'pending').length
      },
      latestTest: tests[0] || null,
      failureRate: tests.length > 0 
        ? (tests.filter(t => t.status === 'failed').length / tests.length) * 100 
        : 0
    };
  } catch (error) {
    console.error('Error getting material tests stats:', error);
    throw new Error('Falha ao buscar estatísticas dos testes');
  }
} 
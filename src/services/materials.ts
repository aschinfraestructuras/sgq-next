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
  Timestamp,
  DocumentData,
  CollectionReference,
  Query,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Material, MaterialFilter, MaterialStats } from '@/types/material';

const COLLECTION = 'materials';

export async function getMaterials(filter?: MaterialFilter) {
  try {
    let materialsQuery: Query<DocumentData> = collection(db, COLLECTION);

    if (filter) {
      if (filter.search) {
        materialsQuery = query(materialsQuery, 
          where('nome', '>=', filter.search), 
          where('nome', '<=', filter.search + '\uf8ff')
        );
      }
      if (filter.categoria) {
        materialsQuery = query(materialsQuery, where('categoria', '==', filter.categoria));
      }
      if (filter.status) {
        materialsQuery = query(materialsQuery, where('status', '==', filter.status));
      }
      if (filter.fornecedor) {
        materialsQuery = query(materialsQuery, where('fornecedor', '==', filter.fornecedor));
      }
    }

    const querySnapshot = await getDocs(materialsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Material[];
  } catch (error) {
    console.error('Error getting materials:', error);
    throw error;
  }
}

export async function getMaterial(id: string) {
  try {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Material;
    }
    
    throw new Error('Material not found');
  } catch (error) {
    console.error('Error getting material:', error);
    throw error;
  }
}

export async function createMaterial(data: Omit<Material, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
}

export async function updateMaterial(id: string, data: Partial<Material>) {
  try {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
}

export async function deleteMaterial(id: string) {
  try {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
}

export async function getMaterialStats(): Promise<MaterialStats> {
  try {
    const materials = await getMaterials();
    
    const stats: MaterialStats = {
      total: materials.length,
      porCategoria: {},
      porStatus: {
        ativo: 0,
        inativo: 0,
        em_analise: 0
      },
      valorTotal: 0,
      quantidadeTotal: 0,
      mediaConsumoMensal: 0,
      ultimasMovimentacoes: []
    };

    materials.forEach(material => {
      // Contagem por categoria
      if (material.categoria) {
        stats.porCategoria[material.categoria] = (stats.porCategoria[material.categoria] || 0) + 1;
      }

      // Contagem por status
      if (material.status) {
        stats.porStatus[material.status]++;
      }

      // Quantidade total
      stats.quantidadeTotal += material.quantidade || 0;

      // Últimas movimentações
      if (material.historico && material.historico.length > 0) {
        stats.ultimasMovimentacoes.push(...material.historico
          .slice(0, 5)
          .map(h => ({
            data: h.data,
            tipo: h.tipo,
            quantidade: h.quantidade
          })));
      }
    });

    // Ordenar movimentações por data
    stats.ultimasMovimentacoes.sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );

    // Limitar a 5 movimentações
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
    const novaQuantidade = material.quantidade + (
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
      quantidade: novaQuantidade,
      historico: [...(material.historico || []), novoHistorico]
    });

    return novoHistorico;
  } catch (error) {
    console.error('Error adding material movement:', error);
    throw error;
  }
} 
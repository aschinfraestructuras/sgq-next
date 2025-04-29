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
  Timestamp,
  DocumentData,
  WriteBatch,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MaterialCategory } from '@/types/materials';

const COLLECTION = 'material_categories';

export async function getCategories(): Promise<MaterialCategory[]> {
  try {
    const categoriesRef = collection(db, COLLECTION);
    const q = query(categoriesRef, orderBy('path'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MaterialCategory[];
  } catch (error) {
    console.error('Error getting categories:', error);
    throw new Error('Falha ao buscar categorias');
  }
}

export async function getCategory(id: string): Promise<MaterialCategory> {
  try {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as MaterialCategory;
    }
    
    throw new Error('Categoria não encontrada');
  } catch (error) {
    console.error('Error getting category:', error);
    throw error;
  }
}

export async function createCategory(data: Omit<MaterialCategory, 'id' | 'path' | 'level'>): Promise<string> {
  try {
    const batch = writeBatch(db);
    const categoriesRef = collection(db, COLLECTION);
    
    // Calculate path and level
    let path: string[] = [];
    let level = 0;
    
    if (data.parentId) {
      const parentDoc = await getDoc(doc(db, COLLECTION, data.parentId));
      if (!parentDoc.exists()) {
        throw new Error('Categoria pai não encontrada');
      }
      const parent = parentDoc.data() as MaterialCategory;
      path = [...parent.path, data.parentId];
      level = parent.level + 1;
    }
    
    const newCategoryRef = doc(categoriesRef);
    const timestamp = Timestamp.now();
    
    const categoryData = {
      ...data,
      path,
      level,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    batch.set(newCategoryRef, categoryData);
    
    // Update child categories if this is a parent category being moved
    const childrenQuery = query(categoriesRef, where('path', 'array-contains', data.parentId));
    const childrenSnapshot = await getDocs(childrenQuery);
    
    childrenSnapshot.docs.forEach(childDoc => {
      const childData = childDoc.data() as MaterialCategory;
      const newPath = [...path, newCategoryRef.id, ...childData.path.slice(childData.path.indexOf(data.parentId!) + 1)];
      const newLevel = level + (childData.level - (childData.path.length - 1));
      
      batch.update(childDoc.ref, {
        path: newPath,
        level: newLevel,
        updatedAt: timestamp
      });
    });
    
    await batch.commit();
    return newCategoryRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<MaterialCategory, 'id' | 'path' | 'level'>>
): Promise<void> {
  try {
    const batch = writeBatch(db);
    const categoryRef = doc(db, COLLECTION, id);
    const timestamp = Timestamp.now();
    
    // If parent is being updated, recalculate paths
    if ('parentId' in data) {
      const currentDoc = await getDoc(categoryRef);
      if (!currentDoc.exists()) {
        throw new Error('Categoria não encontrada');
      }
      
      const currentCategory = currentDoc.data() as MaterialCategory;
      let newPath: string[] = [];
      let newLevel = 0;
      
      if (data.parentId) {
        const parentDoc = await getDoc(doc(db, COLLECTION, data.parentId));
        if (!parentDoc.exists()) {
          throw new Error('Nova categoria pai não encontrada');
        }
        const parent = parentDoc.data() as MaterialCategory;
        newPath = [...parent.path, data.parentId];
        newLevel = parent.level + 1;
      }
      
      // Update all children
      const childrenQuery = query(collection(db, COLLECTION), where('path', 'array-contains', id));
      const childrenSnapshot = await getDocs(childrenQuery);
      
      childrenSnapshot.docs.forEach(childDoc => {
        const childData = childDoc.data() as MaterialCategory;
        const levelDiff = childData.level - currentCategory.level;
        const newChildPath = [...newPath, id, ...childData.path.slice(childData.path.indexOf(id) + 1)];
        
        batch.update(childDoc.ref, {
          path: newChildPath,
          level: newLevel + levelDiff,
          updatedAt: timestamp
        });
      });
      
      batch.update(categoryRef, {
        ...data,
        path: newPath,
        level: newLevel,
        updatedAt: timestamp
      });
    } else {
      batch.update(categoryRef, {
        ...data,
        updatedAt: timestamp
      });
    }
    
    await batch.commit();
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const batch = writeBatch(db);
    const categoryRef = doc(db, COLLECTION, id);
    
    // Check for child categories
    const childrenQuery = query(collection(db, COLLECTION), where('path', 'array-contains', id));
    const childrenSnapshot = await getDocs(childrenQuery);
    
    if (!childrenSnapshot.empty) {
      throw new Error('Não é possível excluir uma categoria que possui subcategorias');
    }
    
    // Check for materials using this category
    const materialsQuery = query(collection(db, 'materials'), where('categoryId', '==', id));
    const materialsSnapshot = await getDocs(materialsQuery);
    
    if (!materialsSnapshot.empty) {
      throw new Error('Não é possível excluir uma categoria que possui materiais');
    }
    
    batch.delete(categoryRef);
    await batch.commit();
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

export async function getCategoryHierarchy(categoryId: string): Promise<MaterialCategory[]> {
  try {
    const category = await getCategory(categoryId);
    const hierarchyIds = [...category.path, categoryId];
    
    const categories = await Promise.all(
      hierarchyIds.map(id => getCategory(id))
    );
    
    return categories;
  } catch (error) {
    console.error('Error getting category hierarchy:', error);
    throw error;
  }
}

export async function getChildCategories(parentId: string): Promise<MaterialCategory[]> {
  try {
    const categoriesRef = collection(db, COLLECTION);
    const q = query(
      categoriesRef,
      where('parentId', '==', parentId),
      orderBy('name')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MaterialCategory[];
  } catch (error) {
    console.error('Error getting child categories:', error);
    throw error;
  }
} 
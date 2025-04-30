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
  writeBatch,
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Document, DocumentTemplate, DocumentVersion } from '@/types/documentation';
import { handleFirebaseError } from '@/lib/firebase/utils';
import { useAuth } from '@/hooks/useAuth';

const COLLECTION = 'documents';
const TEMPLATES_COLLECTION = 'document_templates';

const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  if (error instanceof Error || error instanceof FirebaseError) {
    throw handleFirebaseError(error);
  }
  throw new Error(`Erro desconhecido: ${message}`);
};

export async function createDocument(data: Partial<Document>): Promise<string> {
  try {
    const { user } = useAuth();
    if (!user?.id) throw new Error('Usuário não autenticado');

    const batch = writeBatch(db);
    const docRef = doc(collection(db, COLLECTION));
    const timestamp = Timestamp.now();

    const documentData = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: user.id,
      updatedBy: user.id,
      status: 'draft',
      version: 1,
    };

    batch.set(docRef, documentData);

    // Create audit trail
    const auditRef = doc(collection(db, 'audit_trail'));
    batch.set(auditRef, {
      entityId: docRef.id,
      entityType: 'document',
      action: 'create',
      changes: { new: documentData },
      timestamp,
      performedBy: user.id,
    });

    await batch.commit();
    return docRef.id;
  } catch (error) {
    handleError(error, 'Error creating document');
    return '';
  }
}

export async function updateDocument(id: string, data: Partial<Document>): Promise<void> {
  try {
    const { user } = useAuth();
    if (!user?.id) throw new Error('Usuário não autenticado');

    const batch = writeBatch(db);
    const docRef = doc(db, COLLECTION, id);
    const timestamp = Timestamp.now();

    const currentDoc = await getDoc(docRef);
    if (!currentDoc.exists()) {
      throw new Error('Documento não encontrado');
    }

    const updateData = {
      ...data,
      updatedAt: timestamp,
      updatedBy: user.id,
    };

    batch.update(docRef, updateData);

    // Create audit trail
    const auditRef = doc(collection(db, 'audit_trail'));
    batch.set(auditRef, {
      entityId: id,
      entityType: 'document',
      action: 'update',
      changes: {
        old: currentDoc.data(),
        new: updateData,
      },
      timestamp,
      performedBy: user.id,
    });

    await batch.commit();
  } catch (error) {
    handleError(error, 'Error updating document');
  }
}

export async function addDocumentVersion(
  documentId: string,
  version: Omit<DocumentVersion, 'createdAt' | 'createdBy'>
): Promise<void> {
  try {
    const { user } = useAuth();
    if (!user?.id) throw new Error('Usuário não autenticado');

    const batch = writeBatch(db);
    const docRef = doc(db, COLLECTION, documentId);
    const timestamp = Timestamp.now();

    const currentDoc = await getDoc(docRef);
    if (!currentDoc.exists()) {
      throw new Error('Documento não encontrado');
    }

    const document = currentDoc.data() as Document;
    const newVersion: DocumentVersion = {
      ...version,
      createdAt: timestamp,
      createdBy: user.id,
    };

    batch.update(docRef, {
      versions: [...document.versions, newVersion],
      currentVersion: version.version,
      updatedAt: timestamp,
      updatedBy: user.id,
    });

    // Create audit trail
    const auditRef = doc(collection(db, 'audit_trail'));
    batch.set(auditRef, {
      entityId: documentId,
      entityType: 'document_version',
      action: 'create',
      changes: { new: newVersion },
      timestamp,
      performedBy: user.id,
    });

    await batch.commit();
  } catch (error) {
    handleError(error, 'Error adding document version');
  }
}

export async function uploadDocumentFile(file: File): Promise<string> {
  try {
    const { user } = useAuth();
    if (!user?.id) throw new Error('Usuário não autenticado');

    const timestamp = Date.now();
    const filename = `documents/${user.id}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    return url;
  } catch (error) {
    handleError(error, 'Error uploading document file');
    return '';
  }
}

export async function getDocuments(filters?: {
  type?: string[];
  status?: string[];
  category?: string;
  responsible?: string;
  dateRange?: { start: Date; end: Date };
}): Promise<Document[]> {
  try {
    const documentsRef = collection(db, COLLECTION);
    let q = query(documentsRef, orderBy('updatedAt', 'desc'));

    if (filters) {
      if (filters.type?.length) {
        q = query(q, where('type', 'in', filters.type));
      }
      if (filters.status?.length) {
        q = query(q, where('status', 'in', filters.status));
      }
      if (filters.category) {
        q = query(q, where('category.id', '==', filters.category));
      }
      if (filters.responsible) {
        q = query(q, where('responsible', 'array-contains', filters.responsible));
      }
      if (filters.dateRange) {
        q = query(
          q,
          where('updatedAt', '>=', Timestamp.fromDate(filters.dateRange.start)),
          where('updatedAt', '<=', Timestamp.fromDate(filters.dateRange.end))
        );
      }
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Document[];
  } catch (error) {
    handleError(error, 'Error getting documents');
    return [];
  }
}

export async function getDocumentTemplates(): Promise<DocumentTemplate[]> {
  try {
    const templatesRef = collection(db, TEMPLATES_COLLECTION);
    const querySnapshot = await getDocs(templatesRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DocumentTemplate[];
  } catch (error) {
    handleError(error, 'Error getting document templates');
    return [];
  }
}

export async function createDocumentFromTemplate(
  templateId: string,
  data: Partial<Document>
): Promise<string> {
  try {
    const templateDoc = await getDoc(doc(db, TEMPLATES_COLLECTION, templateId));
    if (!templateDoc.exists()) {
      throw new Error('Template não encontrado');
    }

    const template = templateDoc.data() as DocumentTemplate;
    const documentData = {
      ...data,
      type: template.type,
      content: template.content,
      sections: template.sections.map(section => ({
        ...section,
        content: section.defaultContent || '',
      })),
    };

    return await createDocument(documentData);
  } catch (error) {
    handleError(error, 'Error creating document from template');
    return '';
  }
} 
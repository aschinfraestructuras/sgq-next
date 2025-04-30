import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { ChecklistTemplate, ChecklistExecution } from '@/types/checklists';
import { handleFirebaseError } from '@/lib/firebase/utils';
import { useAuth } from '@/hooks/useAuth';

const TEMPLATES_COLLECTION = 'checklist_templates';
const EXECUTIONS_COLLECTION = 'checklist_executions';

export async function createTemplate(data: Partial<ChecklistTemplate>): Promise<string> {
  try {
    const { user } = useAuth();
    if (!user?.id) throw new Error('Usuário não autenticado');

    const batch = writeBatch(db);
    const docRef = doc(collection(db, TEMPLATES_COLLECTION));
    const timestamp = Timestamp.now();

    const templateData = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: user.id,
      updatedBy: user.id,
      status: 'draft',
    };

    batch.set(docRef, templateData);

    // Create audit trail
    const auditRef = doc(collection(db, 'audit_trail'));
    batch.set(auditRef, {
      entityId: docRef.id,
      entityType: 'checklist_template',
      action: 'create',
      changes: { new: templateData },
      timestamp,
      performedBy: user.id,
    });

    await batch.commit();
    return docRef.id;
  } catch (error) {
    console.error('Error creating checklist template:', error);
    throw handleFirebaseError(error as FirebaseError | Error);
  }
}

export async function startChecklistExecution(
  templateId: string,
  data: Partial<ChecklistExecution>
): Promise<string> {
  try {
    const { user } = useAuth();
    if (!user?.id) throw new Error('Usuário não autenticado');

    const batch = writeBatch(db);
    
    // Get template
    const templateDoc = await getDoc(doc(db, TEMPLATES_COLLECTION, templateId));
    if (!templateDoc.exists()) {
      throw new Error('Template não encontrado');
    }
    
    const template = templateDoc.data() as ChecklistTemplate;
    const timestamp = Timestamp.now();
    
    // Create execution document
    const executionRef = doc(collection(db, EXECUTIONS_COLLECTION));
    const executionData = {
      ...data,
      templateId,
      status: 'in_progress',
      sections: template.sections.map(section => ({
        id: section.id,
        title: section.title,
        items: section.items.map(item => ({
          id: item.id,
          status: 'pending',
        })),
      })),
      progress: {
        total: template.sections.reduce((acc, section) => acc + section.items.length, 0),
        completed: 0,
        compliant: 0,
        nonCompliant: 0,
        notApplicable: 0,
      },
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: user.id,
      updatedBy: user.id,
    };

    batch.set(executionRef, executionData);

    // Create audit trail
    const auditRef = doc(collection(db, 'audit_trail'));
    batch.set(auditRef, {
      entityId: executionRef.id,
      entityType: 'checklist_execution',
      action: 'create',
      changes: { new: executionData },
      timestamp,
      performedBy: user.id,
    });

    await batch.commit();
    return executionRef.id;
  } catch (error) {
    console.error('Error starting checklist execution:', error);
    throw handleFirebaseError(error as FirebaseError | Error);
  }
}

export async function updateChecklistItem(
  executionId: string,
  sectionId: string,
  itemId: string,
  data: {
    status: 'compliant' | 'non_compliant' | 'not_applicable';
    value?: string | number | boolean;
    observations?: string;
    photos?: File[];
    measurements?: {
      value: number;
      unit: string;
    };
  }
): Promise<void> {
  try {
    const { user } = useAuth();
    const batch = writeBatch(db);
    const timestamp = Timestamp.now();

    // Upload photos if any
    const uploadedPhotos = [];
    if (data.photos?.length) {
      for (const photo of data.photos) {
        const filename = `checklists/${executionId}/${itemId}/${Date.now()}_${photo.name}`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, photo);
        const url = await getDownloadURL(storageRef);
        uploadedPhotos.push({
          id: Date.now().toString(),
          name: photo.name,
          url,
          type: photo.type,
          size: photo.size,
          uploadedAt: timestamp,
          uploadedBy: user?.id,
        });
      }
    }

    // Get current execution
    const executionRef = doc(db, EXECUTIONS_COLLECTION, executionId);
    const executionDoc = await getDoc(executionRef);
    if (!executionDoc.exists()) {
      throw new Error('Checklist não encontrado');
    }

    const execution = executionDoc.data() as ChecklistExecution;
    const section = execution.sections.find(s => s.id === sectionId);
    if (!section) {
      throw new Error('Seção não encontrada');
    }

    const item = section.items.find(i => i.id === itemId);
    if (!item) {
      throw new Error('Item não encontrado');
    }

    // Update item
    const updatedItem = {
      ...item,
      status: data.status,
      value: data.value,
      observations: data.observations,
      photos: uploadedPhotos,
      measurements: data.measurements ? {
        ...data.measurements,
        isCompliant: true, // This should be calculated based on template criteria
      } : undefined,
    };

    // Update progress
    const progress = {
      ...execution.progress,
      completed: execution.progress.completed + (item.status === 'pending' ? 1 : 0),
      compliant: execution.progress.compliant + (data.status === 'compliant' ? 1 : 0),
      nonCompliant: execution.progress.nonCompliant + (data.status === 'non_compliant' ? 1 : 0),
      notApplicable: execution.progress.notApplicable + (data.status === 'not_applicable' ? 1 : 0),
    };

    // Update execution
    batch.update(executionRef, {
      [`sections.${section.id}.items.${itemId}`]: updatedItem,
      progress,
      updatedAt: timestamp,
      updatedBy: user?.id,
    });

    // Create audit trail
    const auditRef = doc(collection(db, 'audit_trail'));
    batch.set(auditRef, {
      entityId: executionId,
      entityType: 'checklist_item',
      action: 'update',
      changes: {
        old: item,
        new: updatedItem,
      },
      timestamp,
      performedBy: user?.id,
    });

    await batch.commit();
  } catch (error) {
    console.error('Error updating checklist item:', error);
    throw handleFirebaseError(error as FirebaseError | Error);
  }
}

export async function completeChecklist(
  executionId: string,
  data: {
    observations?: string;
    attachments?: File[];
  }
): Promise<void> {
  try {
    const { user } = useAuth();
    if (!user?.id) throw new Error('Usuário não autenticado');

    const batch = writeBatch(db);
    const timestamp = Timestamp.now();

    // Upload attachments if any
    const uploadedAttachments = [];
    if (data.attachments?.length) {
      for (const file of data.attachments) {
        const filename = `checklists/${executionId}/attachments/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedAttachments.push({
          id: Date.now().toString(),
          name: file.name,
          url,
          type: file.type,
          size: file.size,
          uploadedAt: timestamp,
          uploadedBy: user.id,
        });
      }
    }

    // Get current execution
    const executionRef = doc(db, EXECUTIONS_COLLECTION, executionId);
    const executionDoc = await getDoc(executionRef);
    if (!executionDoc.exists()) {
      throw new Error('Checklist não encontrado');
    }

    const execution = executionDoc.data() as ChecklistExecution;
    
    // Update execution
    batch.update(executionRef, {
      status: 'completed',
      observations: data.observations,
      attachments: uploadedAttachments,
      completedAt: timestamp,
      completedBy: user.id,
      updatedAt: timestamp,
      updatedBy: user.id,
    });

    // Create audit trail
    const auditRef = doc(collection(db, 'audit_trail'));
    batch.set(auditRef, {
      entityId: executionId,
      entityType: 'checklist_execution',
      action: 'complete',
      changes: {
        old: { status: execution.status },
        new: { 
          status: 'completed',
          observations: data.observations,
          attachments: uploadedAttachments,
          completedAt: timestamp,
          completedBy: user.id,
        },
      },
      timestamp,
      performedBy: user.id,
    });

    await batch.commit();
  } catch (error) {
    console.error('Error completing checklist:', error);
    throw handleFirebaseError(error as FirebaseError | Error);
  }
}

export async function getChecklistExecutions(filters?: {
  templateId?: string;
  status?: string[];
  projectId?: string;
  dateRange?: { start: Date; end: Date };
}): Promise<ChecklistExecution[]> {
  try {
    const executionsRef = collection(db, EXECUTIONS_COLLECTION);
    let q = query(executionsRef, orderBy('createdAt', 'desc'));

    if (filters) {
      if (filters.templateId) {
        q = query(q, where('templateId', '==', filters.templateId));
      }
      if (filters.status?.length) {
        q = query(q, where('status', 'in', filters.status));
      }
      if (filters.projectId) {
        q = query(q, where('project.id', '==', filters.projectId));
      }
      if (filters.dateRange) {
        q = query(
          q,
          where('createdAt', '>=', Timestamp.fromDate(filters.dateRange.start)),
          where('createdAt', '<=', Timestamp.fromDate(filters.dateRange.end))
        );
      }
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChecklistExecution[];
  } catch (error) {
    console.error('Error getting checklist executions:', error);
    throw handleFirebaseError(error as FirebaseError | Error);
  }
} 
import { BaseEntity, Attachment, Comment } from './quality-system';
import { Timestamp } from 'firebase/firestore';

export type ChecklistType =
  | 'quality_inspection'
  | 'safety_inspection'
  | 'process_verification'
  | 'equipment_inspection'
  | 'material_receiving'
  | 'work_release'
  | 'maintenance'
  | 'environmental'
  | 'custom';

export type ChecklistStatus =
  | 'draft'
  | 'active'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type ItemStatus =
  | 'pending'
  | 'compliant'
  | 'non_compliant'
  | 'not_applicable'
  | 'blocked';

export interface ChecklistTemplate extends BaseEntity {
  code: string;
  title: string;
  description: string;
  type: ChecklistType;
  category: string;
  version: string;
  sections: {
    id: string;
    title: string;
    description?: string;
    order: number;
    items: {
      id: string;
      description: string;
      requirement: string;
      acceptanceCriteria: string;
      reference?: string; // Norma técnica ou documento
      type: 'boolean' | 'numeric' | 'text' | 'multiple_choice';
      options?: string[];
      required: boolean;
      order: number;
      photos: {
        required: boolean;
        minimum?: number;
        maximum?: number;
      };
      measurements?: {
        unit: string;
        min?: number;
        max?: number;
      };
    }[];
  }[];
  applicability: {
    projectTypes: string[];
    stages: string[];
    services: string[];
  };
  frequency: string;
  responsible: string[];
  approvers: string[];
  reviewSchedule: {
    frequency: number;
    unit: 'days' | 'months' | 'years';
    lastReview?: Timestamp;
    nextReview?: Timestamp;
  };
}

export interface ChecklistExecution extends BaseEntity {
  templateId: string;
  code: string;
  title: string;
  type: ChecklistType;
  status: ChecklistStatus;
  project: {
    id: string;
    name: string;
    location: string;
  };
  location: {
    building?: string;
    floor?: string;
    apartment?: string;
    reference: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  schedule: {
    plannedStart: Timestamp;
    plannedEnd: Timestamp;
    actualStart?: Timestamp;
    actualEnd?: Timestamp;
  };
  team: {
    executor: {
      id: string;
      name: string;
      role: string;
    };
    supervisor?: {
      id: string;
      name: string;
      role: string;
    };
  };
  sections: {
    id: string;
    title: string;
    completedAt?: Timestamp;
    items: {
      id: string;
      status: ItemStatus;
      value?: string | number | boolean;
      observations?: string;
      photos?: Attachment[];
      measurements?: {
        value: number;
        unit: string;
        isCompliant: boolean;
      };
      nonConformity?: {
        id: string;
        description: string;
        action: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        status: 'open' | 'in_progress' | 'resolved';
        createdAt: Timestamp;
        resolvedAt?: Timestamp;
      };
    }[];
  }[];
  progress: {
    total: number;
    completed: number;
    compliant: number;
    nonCompliant: number;
    notApplicable: number;
  };
  attachments: Attachment[];
  comments: Comment[];
  approvals: {
    role: string;
    userId: string;
    status: 'pending' | 'approved' | 'rejected';
    date: Timestamp;
    comments?: string;
  }[];
  notifications: {
    type: 'assigned' | 'started' | 'completed' | 'nonconformity' | 'overdue';
    recipients: string[];
    sent: boolean;
    sentDate?: Timestamp;
  }[];
  linkedDocuments: {
    id: string;
    type: string;
    title: string;
    url: string;
  }[];
  metrics?: {
    timeToComplete?: number; // minutos
    itemsPerHour?: number;
    nonConformityRate?: number;
  };
} 
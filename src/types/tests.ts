import { BaseEntity, Attachment, Comment } from './quality-system';
import { Timestamp } from 'firebase/firestore';

export type TestType =
  | 'mechanical'
  | 'chemical'
  | 'physical'
  | 'microbiological'
  | 'sensory'
  | 'custom';

export type TestStatus = 'pending' | 'passed' | 'failed';

export type TestResult = {
  parameter: string;
  value: number | string;
  unit?: string;
  method?: string;
  specification?: string;
  result: 'pass' | 'fail' | 'pending';
  notes?: string;
};

export interface TestParameter {
  name: string;
  unit: string;
  expectedValue: number;
  tolerance: {
    min: number;
    max: number;
  };
  actualValue?: number;
  isCompliant?: boolean;
  observations?: string;
}

export interface TestLocation {
  projectId: string;
  building?: string;
  floor?: string;
  apartment?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  reference: string;
}

export interface TestRequirement {
  code: string;
  description: string;
  standard: string; // Norma técnica
  frequency: string;
  sampleSize: number;
  acceptanceCriteria: string;
}

export interface Laboratory {
  id: string;
  name: string;
  certifications: string[];
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  address: string;
}

export interface Test extends BaseEntity {
  type: TestType;
  name: string;
  description?: string;
  testStatus: TestStatus;
  results: TestResult[];
  attachments: Attachment[];
  comments: Comment[];
  relatedTests?: string[];
  method?: string;
  equipment?: string;
  standard?: string;
  acceptanceCriteria?: string;
  duration?: number;
  cost?: number;
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  observations?: string;
  recommendations?: string;
  nextTestDate?: Date;
  frequency?: number;
  unit?: string;
  requirement: TestRequirement;
  parameters: TestParameter[];
  laboratory?: Laboratory;
  technician?: {
    id: string;
    name: string;
    registration: string;
  };
  scheduledDateTimestamp?: Timestamp;
  executionDateTimestamp?: Timestamp;
  completionDateTimestamp?: Timestamp;
  nonConformityId?: string;
  approvals: {
    role: string;
    userId: string;
    status: 'pending' | 'approved' | 'rejected';
    date: Timestamp;
    comments?: string;
  }[];
  notifications: {
    type: 'scheduled' | 'in_progress' | 'results' | 'nonconformity';
    recipients: string[];
    sent: boolean;
    sentDate?: Timestamp;
  }[];
  costTimestamp?: {
    predicted: number;
    actual: number;
    currency: string;
  };
} 
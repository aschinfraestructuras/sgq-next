import { BaseEntity, Attachment, Comment } from './quality-system';
import { Timestamp } from 'firebase/firestore';

export type TestType = 
  | 'concrete_compression'
  | 'concrete_slump'
  | 'soil_compaction'
  | 'steel_tension'
  | 'waterproofing'
  | 'mortar_compression'
  | 'block_compression'
  | 'granulometry'
  | 'density'
  | 'custom';

export type TestStatus =
  | 'scheduled'
  | 'in_progress'
  | 'waiting_results'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type TestResult = 
  | 'pass'
  | 'fail'
  | 'partial'
  | 'inconclusive';

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
  code: string;
  type: TestType;
  description: string;
  status: TestStatus;
  result?: TestResult;
  location: TestLocation;
  scheduledDate: Timestamp;
  executionDate?: Timestamp;
  completionDate?: Timestamp;
  requirement: TestRequirement;
  parameters: TestParameter[];
  laboratory?: Laboratory;
  technician?: {
    id: string;
    name: string;
    registration: string;
  };
  equipment?: {
    id: string;
    name: string;
    calibrationDate: Timestamp;
    nextCalibrationDate: Timestamp;
  };
  samples: {
    id: string;
    code: string;
    collectionDate: Timestamp;
    conditions: string;
  }[];
  attachments: Attachment[];
  comments: Comment[];
  relatedTests?: string[];
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
  cost?: {
    predicted: number;
    actual: number;
    currency: string;
  };
} 
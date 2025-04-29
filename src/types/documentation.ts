import { BaseEntity, Attachment, Comment } from './quality-system';
import { Timestamp } from 'firebase/firestore';

export type DocumentType = 
  | 'procedure'
  | 'instruction'
  | 'manual'
  | 'form'
  | 'record'
  | 'report'
  | 'certificate'
  | 'checklist'
  | 'plan'
  | 'specification';

export type DocumentStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'published'
  | 'obsolete'
  | 'archived';

export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  path: string[];
  level: number;
}

export interface DocumentVersion {
  version: string;
  changes: string;
  createdAt: Timestamp;
  createdBy: string;
  status: DocumentStatus;
  file: Attachment;
  approvals: {
    userId: string;
    role: string;
    status: 'pending' | 'approved' | 'rejected';
    comment?: string;
    timestamp: Timestamp;
  }[];
}

export interface Document extends BaseEntity {
  code: string;
  title: string;
  description: string;
  type: DocumentType;
  category: DocumentCategory;
  tags: string[];
  currentVersion: string;
  versions: DocumentVersion[];
  relatedDocuments: string[];
  responsible: string[];
  reviewers: string[];
  approvers: string[];
  nextReviewDate: Timestamp;
  effectiveDate: Timestamp;
  expirationDate?: Timestamp;
  distributionList: {
    userId: string;
    role: string;
    notified: boolean;
    acknowledged: boolean;
    acknowledgedAt?: Timestamp;
  }[];
  metadata: {
    department: string;
    process: string;
    scope: string;
    keywords: string[];
    references: string[];
  };
  comments: Comment[];
  accessLevel: 'public' | 'restricted' | 'confidential';
  permissions: {
    roles: string[];
    users: string[];
  };
}

export interface DocumentTemplate extends BaseEntity {
  name: string;
  description: string;
  type: DocumentType;
  content: string;
  sections: {
    title: string;
    required: boolean;
    description: string;
    defaultContent?: string;
  }[];
  fields: {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
    required: boolean;
    options?: string[];
    defaultValue?: any;
  }[];
  footer: {
    showPageNumber: boolean;
    showRevisionInfo: boolean;
    customText?: string;
  };
  header: {
    showLogo: boolean;
    showDocumentInfo: boolean;
    customText?: string;
  };
} 
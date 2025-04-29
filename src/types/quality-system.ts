import { Timestamp } from 'firebase/firestore';

export interface BaseEntity {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy: string;
  status: 'active' | 'inactive' | 'archived';
  version: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Timestamp;
  uploadedBy: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Timestamp;
  createdBy: string;
  attachments: Attachment[];
}

export interface AuditTrail {
  id: string;
  entityId: string;
  entityType: string;
  action: 'create' | 'update' | 'delete' | 'status_change';
  changes: Record<string, { old: any; new: any }>;
  timestamp: Timestamp;
  performedBy: string;
}

export interface Metric {
  id: string;
  name: string;
  description: string;
  type: 'number' | 'percentage' | 'currency' | 'time';
  value: number;
  target: number;
  unit: string;
  period: {
    start: Timestamp;
    end: Timestamp;
  };
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  createdAt: Timestamp;
  read: boolean;
  recipientId: string;
  link?: string;
  action?: {
    type: string;
    payload: any;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string[];
  dueDate: Timestamp;
  completedAt?: Timestamp;
  attachments: Attachment[];
  comments: Comment[];
  parentId?: string;
  dependencies: string[];
  progress: number;
  tags: string[];
}

export interface Report {
  id: string;
  type: string;
  title: string;
  description: string;
  period: {
    start: Timestamp;
    end: Timestamp;
  };
  metrics: Metric[];
  charts: {
    type: 'line' | 'bar' | 'pie' | 'radar';
    data: any;
    options: any;
  }[];
  conclusions: string;
  recommendations: string;
  attachments: Attachment[];
  status: 'draft' | 'review' | 'approved' | 'archived';
  approvals: {
    userId: string;
    status: 'pending' | 'approved' | 'rejected';
    comment?: string;
    timestamp: Timestamp;
  }[];
} 
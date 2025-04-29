export interface DashboardStats {
  documents: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  tests: {
    total: number;
    passed: number;
    failed: number;
    inProgress: number;
  };
  nonConformities: {
    total: number;
    open: number;
    inProgress: number;
    closed: number;
  };
  audits: {
    total: number;
    scheduled: number;
    completed: number;
    findings: number;
  };
}

export type ModuleType = 'document' | 'test' | 'nonConformity' | 'audit';
export type ModuleStatus = 'pending' | 'completed' | 'failed' | 'inProgress';
export type ModuleColor = 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'indigo';

export interface TimelineItem {
  id: string;
  type: ModuleType;
  title: string;
  description: string;
  status: ModuleStatus;
  date: string;
  user: {
    name: string;
    avatar: string;
  };
}

export interface TrendData {
  labels: string[];
  datasets: {
    name: string;
    data: number[];
  }[];
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: TimelineItem[];
  trends: {
    documents: TrendData;
    tests: TrendData;
    nonConformities: TrendData;
    audits: TrendData;
  };
}

export interface ModuleData {
  name: string;
  href: string;
  icon: React.ElementType;
  value: number;
  change: number;
  color: ModuleColor;
} 
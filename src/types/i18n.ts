export type Language = 'pt' | 'en';

export type TranslationKeys = {
  // Menu items
  dashboard: string;
  documents: string;
  projects: string;
  nonConformities: string;
  suppliers: string;
  materials: string;
  settings: string;

  // Common actions
  add: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  search: string;
  filter: string;
  
  // Form labels
  name: string;
  description: string;
  status: string;
  category: string;
  type: string;
  date: string;
  
  // Status
  active: string;
  inactive: string;
  pending: string;
  completed: string;

  // Messages
  confirmDelete: string;
  saveSuccess: string;
  deleteSuccess: string;
  errorOccurred: string;

  // Forms
  required: string;
  invalidEmail: string;

  // Auth
  login: string;
  logout: string;
  email: string;
  password: string;
}; 
import { Language } from '../hooks/useLanguage';

type TranslationKeys = {
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

type Translations = {
  [key in Language]: TranslationKeys;
};

export const translations: Translations = {
  pt: {
    // Menu items
    dashboard: 'Dashboard',
    documents: 'Documentos',
    projects: 'Projetos',
    nonConformities: 'Não Conformidades',
    suppliers: 'Fornecedores',
    materials: 'Materiais',
    settings: 'Configurações',

    // Common actions
    add: 'Adicionar',
    edit: 'Editar',
    delete: 'Excluir',
    save: 'Salvar',
    cancel: 'Cancelar',
    search: 'Pesquisar',
    filter: 'Filtrar',

    // Form labels
    name: 'Nome',
    description: 'Descrição',
    status: 'Status',
    category: 'Categoria',
    type: 'Tipo',
    date: 'Data',

    // Status
    active: 'Ativo',
    inactive: 'Inativo',
    pending: 'Pendente',
    completed: 'Concluído',

    // Messages
    confirmDelete: 'Tem certeza que deseja excluir?',
    saveSuccess: 'Salvo com sucesso!',
    deleteSuccess: 'Excluído com sucesso!',
    errorOccurred: 'Ocorreu um erro',

    // Forms
    required: 'Campo obrigatório',
    invalidEmail: 'Email inválido',

    // Auth
    login: 'Entrar',
    logout: 'Sair',
    email: 'Email',
    password: 'Senha',
  },
  en: {
    // Menu items
    dashboard: 'Dashboard',
    documents: 'Documents',
    projects: 'Projects', 
    nonConformities: 'Non-Conformities',
    suppliers: 'Suppliers',
    materials: 'Materials',
    settings: 'Settings',

    // Common actions
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    filter: 'Filter',

    // Form labels
    name: 'Name',
    description: 'Description',
    status: 'Status',
    category: 'Category',
    type: 'Type',
    date: 'Date',

    // Status
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',

    // Messages
    confirmDelete: 'Are you sure you want to delete?',
    saveSuccess: 'Saved successfully!',
    deleteSuccess: 'Deleted successfully!',
    errorOccurred: 'An error occurred',

    // Forms
    required: 'Required field',
    invalidEmail: 'Invalid email',

    // Auth
    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
  },
}; 
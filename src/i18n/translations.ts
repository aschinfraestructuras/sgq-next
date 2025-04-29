import { Language, TranslationKeys } from '../types/i18n';

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

    general: {
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      view: 'Visualizar',
      loading: 'Carregando...',
      noData: 'Nenhum dado encontrado',
      search: 'Buscar',
      filter: 'Filtrar',
      actions: 'Ações'
    },
    materials: {
      title: 'Materiais',
      add: 'Adicionar Material',
      edit: 'Editar Material',
      delete: 'Excluir Material',
      code: 'Código',
      name: 'Nome',
      description: 'Descrição',
      category: 'Categoria',
      supplier: 'Fornecedor',
      quantity: 'Quantidade',
      unit: 'Unidade',
      price: 'Preço',
      totalValue: 'Valor Total',
      minQuantity: 'Quantidade Mínima',
      maxQuantity: 'Quantidade Máxima',
      location: 'Localização',
      status: 'Status',
      createdAt: 'Criado em',
      updatedAt: 'Atualizado em',
      inStock: 'Em Estoque',
      lowStock: 'Estoque Baixo',
      outOfStock: 'Sem Estoque',
      turnoverRate: 'Taxa de Giro'
    }
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

    general: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      loading: 'Loading...',
      noData: 'No data found',
      search: 'Search',
      filter: 'Filter',
      actions: 'Actions'
    },
    materials: {
      title: 'Materials',
      add: 'Add Material',
      edit: 'Edit Material',
      delete: 'Delete Material',
      code: 'Code',
      name: 'Name',
      description: 'Description',
      category: 'Category',
      supplier: 'Supplier',
      quantity: 'Quantity',
      unit: 'Unit',
      price: 'Price',
      totalValue: 'Total Value',
      minQuantity: 'Minimum Quantity',
      maxQuantity: 'Maximum Quantity',
      location: 'Location',
      status: 'Status',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      inStock: 'In Stock',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      turnoverRate: 'Turnover Rate'
    }
  },
}; 
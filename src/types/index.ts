// Tipos para o Sistema de Gestão de Qualidade (SGQ)

// Usuários do sistema
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  password_hash?: string;
  tipo_utilizador: 'admin' | 'gestor' | 'tecnico' | 'cliente';
  ativo: boolean;
  data_criacao: Date;
}

// Projetos
export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  localizacao: string;
  estado: 'em_preparacao' | 'em_andamento' | 'concluido' | 'cancelado';
  data_inicio: Date;
  data_fim?: Date;
  id_utilizador_responsavel: string;
}

// Ensaios
export interface Ensaio {
  id: string;
  tipo: string;
  descricao: string;
  resultado: string;
  unidade: string;
  valor: number;
  data_ensaio: Date;
  id_projeto: string;
  id_realizado_por: string;
}

// RFIs (Solicitações de Informação)
export interface RFI {
  id: string;
  assunto: string;
  descricao: string;
  estado: 'aberto' | 'respondido' | 'fechado';
  id_projeto: string;
  id_autor: string;
  id_destinatario: string;
  data_envio: Date;
  data_resposta?: Date;
}

// Não conformidades
export interface NaoConformidade {
  id: string;
  descricao: string;
  origem: string;
  tipo: string;
  id_projeto: string;
  id_responsavel: string;
  estado: 'aberto' | 'em_analise' | 'concluido';
  data_registo: Date;
  data_fecho?: Date;
  acao_corretiva: string;
}

// Documentos
export interface Documento {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  url: string;
  id_projeto: string;
  id_utilizador_upload: string;
  data_upload: Date;
  data_validade?: Date;
  aprovado: boolean;
}

// Fornecedores
export interface Fornecedor {
  id: string;
  nome: string;
  nif: string;
  contacto: string;
  email: string;
  tipo_fornecedor: string;
  aprovado: boolean;
}

// Avaliações de fornecedores
export interface AvaliacaoFornecedor {
  id: string;
  id_fornecedor: string;
  data_avaliacao: Date;
  pontuacao: number;
  comentarios: string;
  id_avaliador: string;
}

// Checklists
export interface Checklist {
  id: string;
  titulo: string;
  tipo: string;
  id_projeto: string;
  data_criacao: Date;
  criada_por: string;
}

// Itens de checklist
export interface ItemChecklist {
  id: string;
  id_checklist: string;
  descricao: string;
  estado: 'pendente' | 'concluido' | 'nao_aplicavel';
  observacoes?: string;
}

// Tipos de Usuário
export type UserRole = 'admin' | 'manager' | 'auditor' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  active: boolean;
  createdAt: Date;
  lastLogin?: Date;
  avatar?: string;
}

// Tipos de Documento
export type DocumentStatus = 'draft' | 'review' | 'approved' | 'archived' | 'obsolete';
export type DocumentType = 'procedure' | 'instruction' | 'form' | 'manual' | 'policy' | 'record';

export interface Document {
  id: string;
  title: string;
  code: string;
  type: DocumentType;
  status: DocumentStatus;
  version: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  expiresAt?: Date;
  content: string;
  metadata: {
    department: string;
    tags: string[];
    relatedDocs?: string[];
  };
}

// Tipos de Não Conformidade
export type NCStatus = 'open' | 'analysis' | 'action' | 'verification' | 'closed';
export type NCSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface NonConformity {
  id: string;
  code: string;
  title: string;
  description: string;
  status: NCStatus;
  severity: NCSeverity;
  reportedBy: string;
  reportedAt: Date;
  department: string;
  process: string;
  rootCause?: string;
  actions: NCAction[];
  verifications: NCVerification[];
  closedBy?: string;
  closedAt?: Date;
  attachments: Attachment[];
}

export interface NCAction {
  id: string;
  type: 'corrective' | 'preventive';
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: Date;
  effectiveness?: string;
}

export interface NCVerification {
  id: string;
  verifiedBy: string;
  verifiedAt: Date;
  result: 'effective' | 'ineffective';
  comments: string;
}

// Tipos de Ensaio/Teste
export interface Test {
  id: string;
  code: string;
  name: string;
  type: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: Date;
  completedDate?: Date;
  responsiblePerson: string;
  location: string;
  equipment: string[];
  parameters: TestParameter[];
  results: TestResult[];
  attachments: Attachment[];
}

export interface TestParameter {
  name: string;
  unit: string;
  expectedValue: number;
  tolerance: number;
}

export interface TestResult {
  parameterId: string;
  value: number;
  timestamp: Date;
  conformity: 'conform' | 'nonconform';
  observations?: string;
}

// Tipos de Auditoria
export interface Audit {
  id: string;
  code: string;
  type: 'internal' | 'external' | 'supplier';
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  scope: string;
  startDate: Date;
  endDate: Date;
  auditors: string[];
  auditees: string[];
  checklist: AuditCheckItem[];
  findings: AuditFinding[];
  attachments: Attachment[];
}

export interface AuditCheckItem {
  id: string;
  requirement: string;
  evidence: string;
  result: 'compliant' | 'noncompliant' | 'partial' | 'na';
  observations?: string;
}

export interface AuditFinding {
  id: string;
  type: 'nonconformity' | 'observation' | 'opportunity';
  description: string;
  requirement: string;
  responsiblePerson: string;
  dueDate: Date;
  status: 'open' | 'in_progress' | 'closed';
}

// Tipos Comuns
export interface Attachment {
  id: string;
  filename: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  manager: string;
  parent?: string;
  active: boolean;
}

export interface Process {
  id: string;
  name: string;
  code: string;
  owner: string;
  department: string;
  description: string;
  inputs: string[];
  outputs: string[];
  indicators: ProcessIndicator[];
  documents: string[];
  risks: Risk[];
}

export interface ProcessIndicator {
  id: string;
  name: string;
  description: string;
  formula: string;
  target: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  responsible: string;
}

export interface Risk {
  id: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigationPlan: string;
  responsible: string;
  status: 'identified' | 'analyzed' | 'treated' | 'monitored';
} 
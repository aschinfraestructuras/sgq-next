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
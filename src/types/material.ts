export interface Material {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  fornecedor: string;
  quantidade: number;
  unidade: string;
  localizacao: string;
  status: 'ativo' | 'inativo' | 'em_analise';
  ultimaAtualizacao: string;
  createdAt?: string;
  updatedAt?: string;
  descricao?: string;
  especificacoes?: {
    [key: string]: string | number;
  };
  documentos?: {
    id: string;
    nome: string;
    url: string;
    tipo: string;
  }[];
  historico?: {
    id: string;
    data: string;
    tipo: 'entrada' | 'saida' | 'ajuste' | 'teste';
    quantidade: number;
    responsavel: string;
    observacao?: string;
  }[];
  testes?: {
    id: string;
    data: string;
    tipo: string;
    resultado: 'aprovado' | 'reprovado' | 'pendente';
    responsavel: string;
    observacoes?: string;
    anexos?: {
      id: string;
      nome: string;
      url: string;
    }[];
  }[];
  fornecedorRef?: {
    id: string;
    nome: string;
    cnpj: string;
  };
}

export interface MaterialFilter {
  search?: string;
  categoria?: string;
  status?: 'ativo' | 'inativo' | 'em_analise';
  fornecedor?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface MaterialMovement {
  type: 'entrada' | 'saida';
  quantity: number;
  date: Date;
  description?: string;
}

export interface MaterialStats {
  total: number;
  porCategoria: {
    [categoria: string]: number;
  };
  porStatus: {
    ativo: number;
    inativo: number;
    em_analise: number;
  };
  valorTotal: number;
  quantidadeTotal: number;
  mediaConsumoMensal: number;
  ultimasMovimentacoes: {
    data: string;
    tipo: string;
    quantidade: number;
  }[];
}

export type MaterialCategory = 
  | 'materia-prima'
  | 'insumo'
  | 'equipamento'
  | 'ferramenta'
  | 'outro';

export type MaterialStatus = 
  | 'ativo'
  | 'inativo'
  | 'em_analise'
  | 'aguardando_teste'
  | 'reprovado';

export type MaterialUnit = 'unit' | 'kg' | 'g' | 'l' | 'ml' | 'box'; 
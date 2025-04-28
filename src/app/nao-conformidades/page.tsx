import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NaoConformidadesPage() {
  // Dados de exemplo para não conformidades
  const naoConformidades = [
    { 
      id: '1', 
      descricao: 'Fissuras na estrutura de concreto', 
      origem: 'Inspeção Visual',
      tipo: 'Estrutural',
      projeto: 'Construção Edifício A',
      responsavel: 'João Silva',
      estado: 'aberto',
      data_registo: '2023-03-15',
      data_fecho: null,
      acao_corretiva: 'Avaliação por engenheiro estrutural e reparo com injeção de epóxi'
    },
    { 
      id: '2', 
      descricao: 'Materiais fora da especificação', 
      origem: 'Ensaio Laboratorial',
      tipo: 'Material',
      projeto: 'Reabilitação Ponte B',
      responsavel: 'Ana Santos',
      estado: 'em_analise',
      data_registo: '2023-03-01',
      data_fecho: null,
      acao_corretiva: 'Substituição do lote de material e revisão do processo de compra'
    },
    { 
      id: '3', 
      descricao: 'Instalação elétrica em desacordo com projeto', 
      origem: 'Inspeção',
      tipo: 'Execução',
      projeto: 'Expansão Rede Elétrica C',
      responsavel: 'Carlos Oliveira',
      estado: 'concluido',
      data_registo: '2023-02-10',
      data_fecho: '2023-02-28',
      acao_corretiva: 'Reinstalação conforme projeto e treinamento da equipe'
    },
    { 
      id: '4', 
      descricao: 'Falha no sistema de drenagem', 
      origem: 'Operação',
      tipo: 'Projeto',
      projeto: 'Construção Estádio D',
      responsavel: 'Maria Costa',
      estado: 'concluido',
      data_registo: '2023-01-25',
      data_fecho: '2023-02-15',
      acao_corretiva: 'Revisão do projeto de drenagem e implementação de solução corretiva'
    },
    { 
      id: '5', 
      descricao: 'Acabamento superficial inadequado', 
      origem: 'Inspeção Visual',
      tipo: 'Execução',
      projeto: 'Ampliação Hospital E',
      responsavel: 'Pedro Fernandes',
      estado: 'aberto',
      data_registo: '2023-03-18',
      data_fecho: null,
      acao_corretiva: 'Rerealização do acabamento conforme especificações'
    },
  ];

  const getStatusBadgeClasses = (status: string) => {
    switch(status) {
      case 'aberto':
        return 'bg-red-100 text-red-800';
      case 'em_analise':
        return 'bg-yellow-100 text-yellow-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'aberto':
        return 'Aberto';
      case 'em_analise':
        return 'Em Análise';
      case 'concluido':
        return 'Concluído';
      default:
        return status;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Não Conformidades</h1>
          <Link 
            href="/nao-conformidades/nova"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nova Não Conformidade
          </Link>
        </div>
        
        {/* Barra de pesquisa e filtros */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md"
              placeholder="Pesquisar não conformidades..."
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <select className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option value="">Todos os Estados</option>
              <option>Aberto</option>
              <option>Em Análise</option>
              <option>Concluído</option>
            </select>
            
            <select className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option value="">Todos os Projetos</option>
              <option>Construção Edifício A</option>
              <option>Reabilitação Ponte B</option>
              <option>Expansão Rede Elétrica C</option>
              <option>Construção Estádio D</option>
              <option>Ampliação Hospital E</option>
            </select>
          </div>
        </div>
        
        {/* Listagem de não conformidades */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Registro</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {naoConformidades.map((nc) => (
                <tr key={nc.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{nc.descricao}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{nc.projeto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{nc.tipo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{nc.origem}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(nc.estado)}`}>
                      {getStatusText(nc.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{nc.data_registo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/nao-conformidades/${nc.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                      Detalhes
                    </Link>
                    <Link href={`/nao-conformidades/${nc.id}/editar`} className="text-indigo-600 hover:text-indigo-900">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
} 
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ProjetosPage() {
  // Dados de exemplo para projetos
  const projetos = [
    { 
      id: '1', 
      nome: 'Construção Edifício A', 
      descricao: 'Construção de edifício residencial com 10 andares',
      localizacao: 'Lisboa', 
      estado: 'em_andamento', 
      data_inicio: '2023-01-15',
      data_fim: '2023-12-31',
      responsavel: 'João Silva'
    },
    { 
      id: '2', 
      nome: 'Reabilitação Ponte B', 
      descricao: 'Trabalhos de manutenção e reforço da estrutura',
      localizacao: 'Porto', 
      estado: 'em_preparacao', 
      data_inicio: '2023-03-01',
      data_fim: '2023-08-30',
      responsavel: 'Ana Santos'
    },
    { 
      id: '3', 
      nome: 'Expansão Rede Elétrica C', 
      descricao: 'Ampliação da rede de distribuição elétrica',
      localizacao: 'Faro', 
      estado: 'em_andamento', 
      data_inicio: '2022-11-10',
      data_fim: '2023-07-15',
      responsavel: 'Carlos Oliveira'
    },
    { 
      id: '4', 
      nome: 'Construção Estádio D', 
      descricao: 'Construção de estádio multiuso',
      localizacao: 'Braga', 
      estado: 'concluido', 
      data_inicio: '2022-05-20',
      data_fim: '2023-02-28',
      responsavel: 'Maria Costa'
    },
    { 
      id: '5', 
      nome: 'Ampliação Hospital E', 
      descricao: 'Construção de nova ala para centro cirúrgico',
      localizacao: 'Coimbra', 
      estado: 'em_andamento', 
      data_inicio: '2023-02-01',
      data_fim: '2024-01-31',
      responsavel: 'Pedro Fernandes'
    },
  ];

  const getStatusBadgeClasses = (status: string) => {
    switch(status) {
      case 'em_andamento':
        return 'bg-green-100 text-green-800';
      case 'em_preparacao':
        return 'bg-yellow-100 text-yellow-800';
      case 'concluido':
        return 'bg-blue-100 text-blue-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'em_andamento':
        return 'Em Andamento';
      case 'em_preparacao':
        return 'Em Preparação';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Projetos</h1>
          <Link 
            href="/projetos/novo"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Projeto
          </Link>
        </div>
        
        {/* Barra de pesquisa */}
        <div className="flex items-center max-w-md">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md"
              placeholder="Pesquisar projetos..."
            />
          </div>
        </div>
        
        {/* Listagem de projetos */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Início</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fim Previsto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projetos.map((projeto) => (
                <tr key={projeto.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{projeto.nome}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{projeto.descricao}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{projeto.localizacao}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(projeto.estado)}`}>
                      {getStatusText(projeto.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{projeto.data_inicio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{projeto.data_fim}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{projeto.responsavel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/projetos/${projeto.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                      Detalhes
                    </Link>
                    <Link href={`/projetos/${projeto.id}/editar`} className="text-indigo-600 hover:text-indigo-900">
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
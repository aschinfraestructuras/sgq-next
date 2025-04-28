import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function EnsaiosPage() {
  // Dados de exemplo para ensaios
  const ensaios = [
    { 
      id: '1', 
      tipo: 'Resistência à Compressão', 
      descricao: 'Ensaio de compressão em corpo de prova de concreto',
      resultado: '32.5', 
      unidade: 'MPa', 
      data_ensaio: '2023-03-12',
      projeto: 'Construção Edifício A',
      realizado_por: 'António Ribeiro'
    },
    { 
      id: '2', 
      tipo: 'Análise Granulométrica', 
      descricao: 'Determinação da distribuição granulométrica do agregado',
      resultado: 'Conforme', 
      unidade: 'N/A', 
      data_ensaio: '2023-03-05',
      projeto: 'Reabilitação Ponte B',
      realizado_por: 'Sofia Costa'
    },
    { 
      id: '3', 
      tipo: 'Resistência à Tração', 
      descricao: 'Ensaio de tração em barra de aço',
      resultado: '520', 
      unidade: 'MPa', 
      data_ensaio: '2023-02-28',
      projeto: 'Construção Edifício A',
      realizado_por: 'António Ribeiro'
    },
    { 
      id: '4', 
      tipo: 'Slump Test', 
      descricao: 'Ensaio de abatimento do tronco de cone',
      resultado: '8.5', 
      unidade: 'cm', 
      data_ensaio: '2023-03-10',
      projeto: 'Expansão Rede Elétrica C',
      realizado_por: 'Miguel Santos'
    },
    { 
      id: '5', 
      tipo: 'Densidade', 
      descricao: 'Determinação da densidade aparente do solo',
      resultado: '1.85', 
      unidade: 'g/cm³', 
      data_ensaio: '2023-02-15',
      projeto: 'Ampliação Hospital E',
      realizado_por: 'Luísa Ferreira'
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Ensaios</h1>
          <Link 
            href="/ensaios/novo"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Ensaio
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
              placeholder="Pesquisar ensaios..."
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <select className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option value="">Todos os Projetos</option>
              <option>Construção Edifício A</option>
              <option>Reabilitação Ponte B</option>
              <option>Expansão Rede Elétrica C</option>
              <option>Ampliação Hospital E</option>
            </select>
            
            <select className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option value="">Todos os Tipos</option>
              <option>Resistência à Compressão</option>
              <option>Análise Granulométrica</option>
              <option>Resistência à Tração</option>
              <option>Slump Test</option>
              <option>Densidade</option>
            </select>
          </div>
        </div>
        
        {/* Listagem de ensaios */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Realizado por</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ensaios.map((ensaio) => (
                <tr key={ensaio.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ensaio.tipo}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{ensaio.descricao}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ensaio.resultado} {ensaio.unidade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ensaio.data_ensaio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ensaio.projeto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ensaio.realizado_por}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/ensaios/${ensaio.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                      Detalhes
                    </Link>
                    <Link href={`/ensaios/${ensaio.id}/editar`} className="text-indigo-600 hover:text-indigo-900">
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
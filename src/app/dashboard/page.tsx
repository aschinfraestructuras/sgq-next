import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { DocumentTextIcon, ExclamationTriangleIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

// Atualização para forçar novo deploy


export default function DashboardPage() {
  // Dados de exemplo para o dashboard
  const stats = [
    { name: 'Projetos Ativos', value: '12', icon: DocumentTextIcon, color: 'bg-blue-500' },
    { name: 'Ensaios Realizados', value: '48', icon: DocumentTextIcon, color: 'bg-green-500' },
    { name: 'Não Conformidades', value: '3', icon: ExclamationTriangleIcon, color: 'bg-red-500' },
    { name: 'Checklists Completos', value: '23', icon: ClipboardDocumentCheckIcon, color: 'bg-purple-500' },
  ];

  const recentProjects = [
    { id: '1', name: 'Construção Edifício A', status: 'em_andamento', lastUpdate: '2023-04-25' },
    { id: '2', name: 'Reabilitação Ponte B', status: 'em_preparacao', lastUpdate: '2023-04-24' },
    { id: '3', name: 'Expansão Rede Elétrica C', status: 'em_andamento', lastUpdate: '2023-04-23' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Projetos Recentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Projetos Recentes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Atualização</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.status === 'em_andamento' ? 'bg-green-100 text-green-800' : 
                        project.status === 'em_preparacao' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status === 'em_andamento' ? 'Em Andamento' : 
                         project.status === 'em_preparacao' ? 'Em Preparação' : 
                         project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.lastUpdate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Gráficos e mais widgets podem ser adicionados aqui */}
      </div>
    </AppLayout>
  );
} 
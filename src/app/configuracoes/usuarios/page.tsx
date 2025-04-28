'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ConfigTabs from '@/components/layout/ConfigTabs';

// Dados de exemplo para usuários
const users = [
  { 
    id: 1, 
    name: 'João Silva', 
    email: 'joao.silva@empresa.com', 
    role: 'Admin',
    lastAccess: '21/06/2023 14:30'
  },
  { 
    id: 2, 
    name: 'Maria Santos', 
    email: 'maria.santos@empresa.com', 
    role: 'Editor',
    lastAccess: '18/06/2023 09:15'
  },
  { 
    id: 3, 
    name: 'Carlos Ferreira', 
    email: 'carlos.ferreira@empresa.com', 
    role: 'Visualizador',
    lastAccess: '20/06/2023 16:45'
  },
  { 
    id: 4, 
    name: 'Ana Oliveira', 
    email: 'ana.oliveira@empresa.com', 
    role: 'Editor',
    lastAccess: '19/06/2023 11:20'
  },
  { 
    id: 5, 
    name: 'Paulo Mendes', 
    email: 'paulo.mendes@empresa.com', 
    role: 'Admin',
    lastAccess: '21/06/2023 10:30'
  },
];

export default function UsuariosPage() {
  return (
    <AppLayout>
      <ConfigTabs />

      {/* Usuários e Permissões Content */}
      <div>
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Usuários do sistema</h3>
          <div className="mt-3 flex sm:mt-0 sm:ml-4">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Adicionar usuário
            </button>
          </div>
        </div>

        <div className="relative mt-2 rounded-md shadow-sm max-w-lg mb-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Buscar usuários..."
          />
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Nome
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Função
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Último acesso
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      user.role === 'Admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : user.role === 'Editor' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.lastAccess}</td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Editar
                    </a>
                    <a href="#" className="text-red-600 hover:text-red-900">
                      Remover
                    </a>
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
import React from 'react';

export default function DashboardPage() {
  return (
    <div className="py-8 px-4 mx-auto max-w-7xl">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Visão geral do sistema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Cards do dashboard serão adicionados aqui */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Documentos Pendentes
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Não Conformidades
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Auditorias Planejadas
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">5</p>
        </div>
      </div>
    </div>
  );
} 
import React from 'react';
import Link from 'next/link';
import { DocumentTextIcon, BeakerIcon, ExclamationTriangleIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

// Atualização para forçar novo deploy

const modules = [
  { name: 'Documentos', href: '/documentos', icon: DocumentTextIcon, count: 12 },
  { name: 'Ensaios', href: '/ensaios', icon: BeakerIcon, count: 7 },
  { name: 'Não Conformidades', href: '/nao-conformidades', icon: ExclamationTriangleIcon, count: 3 },
  { name: 'Check List', href: '/checklist', icon: ClipboardDocumentCheckIcon, count: 5 }
];

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {modules.map((module) => (
        <Link
          key={module.name}
          href={module.href}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <module.icon className="h-8 w-8 text-indigo-500" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{module.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {module.count} {module.count === 1 ? 'item' : 'itens'}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 
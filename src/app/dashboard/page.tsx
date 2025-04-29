'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { 
  DocumentTextIcon, 
  BeakerIcon, 
  ExclamationTriangleIcon, 
  ClipboardDocumentCheckIcon,
  DocumentChartBarIcon,
  ClipboardIcon
} from '@heroicons/react/24/outline';

// Atualização para forçar novo deploy

const modules = [
  { name: 'Documentos', href: '/documentos', icon: DocumentTextIcon, count: 12 },
  { name: 'Ensaios', href: '/ensaios', icon: BeakerIcon, count: 7 },
  { name: 'Não Conformidades', href: '/nao-conformidades', icon: ExclamationTriangleIcon, count: 3 },
  { name: 'Check List', href: '/checklist', icon: ClipboardIcon, count: 5 },
  { name: 'Auditorias', href: '/auditorias', icon: ClipboardDocumentCheckIcon, count: 2 },
  { name: 'Relatórios', href: '/relatorios', icon: DocumentChartBarIcon, count: 4 }
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Dashboard Global</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <Link 
              key={mod.name} 
              href={mod.href} 
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
            >
              <mod.icon className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-2" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{mod.name}</span>
              <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mt-2">{mod.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
} 
import React from 'react';
import Link from 'next/link';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon,
  BeakerIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Projetos', href: '/projetos', icon: ClipboardDocumentListIcon },
    { name: 'Ensaios', href: '/ensaios', icon: BeakerIcon },
    { name: 'RFIs', href: '/rfis', icon: QuestionMarkCircleIcon },
    { name: 'Não Conformidades', href: '/nao-conformidades', icon: ExclamationTriangleIcon },
    { name: 'Documentos', href: '/documentos', icon: DocumentTextIcon },
    { name: 'Checklists', href: '/checklists', icon: DocumentCheckIcon },
    { name: 'Fornecedores', href: '/fornecedores', icon: BuildingLibraryIcon },
    { name: 'Utilizadores', href: '/utilizadores', icon: UserGroupIcon },
  ];

  return (
    <div className={`h-screen bg-gray-800 text-white w-64 flex-shrink-0 ${className}`}>
      <div className="p-4">
        <h1 className="text-2xl font-bold">SGQ</h1>
        <p className="text-sm text-gray-400">Sistema de Gestão de Qualidade</p>
      </div>
      <nav className="mt-8">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-md group transition-colors"
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 
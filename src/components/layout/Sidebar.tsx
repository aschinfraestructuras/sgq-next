'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  DocumentMagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useAppState } from '@/hooks/useAppState';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Documentos',
    href: '/documentos',
    icon: DocumentTextIcon,
    badge: '12',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    name: 'Não Conformidades',
    href: '/nao-conformidades',
    icon: ExclamationTriangleIcon,
    badge: '3',
    badgeColor: 'bg-red-100 text-red-800',
  },
  { name: 'Ensaios', href: '/ensaios', icon: BeakerIcon },
  { name: 'Auditorias', href: '/auditorias', icon: ClipboardDocumentCheckIcon },
  { name: 'Equipe', href: '/equipe', icon: UserGroupIcon },
  { name: 'Departamentos', href: '/departamentos', icon: BuildingOfficeIcon },
  { name: 'Relatórios', href: '/relatorios', icon: ChartBarIcon },
  { name: 'Pesquisa', href: '/pesquisa', icon: DocumentMagnifyingGlassIcon },
  { name: 'Configurações', href: '/configuracoes', icon: Cog6ToothIcon },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { sidebarOpen } = useAppState();
  const { user } = useAuth();

  // Filtrar itens do menu baseado nas permissões do usuário
  const filteredNavigation = navigation.filter((item) => {
    if (item.href === '/configuracoes' && user?.role !== 'admin') {
      return false;
    }
    return true;
  });

  return (
    <div
      className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-30 w-64 bg-indigo-700 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-indigo-800">
          <span className="text-xl font-bold text-white">SGQ NEXT</span>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  isActive
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-600'
                }`}
              >
                <div className="flex items-center">
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 ${
                      isActive ? 'text-white' : 'text-indigo-300'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </div>
                {item.badge && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Informações do Usuário */}
        <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              {user?.avatar ? (
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-indigo-300">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 
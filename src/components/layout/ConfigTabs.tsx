import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'Geral', href: '/configuracoes' },
  { name: 'Cloud Messaging', href: '/configuracoes/cloud-messaging' },
  { name: 'Integrações', href: '/configuracoes/integracoes' },
  { name: 'Contas de serviço', href: '/configuracoes/contas-servico' },
  { name: 'Privacidade dos dados', href: '/configuracoes/privacidade' },
  { name: 'Usuários e permissões', href: '/configuracoes/usuarios' },
];

export default function ConfigTabs() {
  const pathname = usePathname();

  return (
    <>
      <div className="pb-5 border-b border-gray-200 mb-6">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Configurações do projeto
        </h2>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const isActive = 
              (tab.href === '/configuracoes' && pathname === '/configuracoes') || 
              (tab.href !== '/configuracoes' && pathname?.startsWith(tab.href));
            
            return (
              <Link 
                key={tab.name}
                href={tab.href} 
                className={`${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
} 
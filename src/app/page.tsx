import React from 'react';
import Link from 'next/link';
import { RocketLaunchIcon } from '@heroicons/react/24/solid';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <RocketLaunchIcon className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">SGQ NEXT</span>
          </div>
          <div>
            <Link href="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Sistema Global de Gestão da Qualidade
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Plataforma completa para gestão de qualidade, ensaios, documentação e conformidade.
            </p>
            <div className="mt-10 flex justify-center">
              <Link href="/login" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Começar agora
              </Link>
              <Link href="#features" className="ml-4 inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Saiba mais
              </Link>
            </div>
          </div>
        </div>

        <div id="features" className="bg-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Recursos Principais
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                Tudo o que você precisa para gerenciar a qualidade do seu projeto.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-medium text-gray-900">Gestão de Projetos</h3>
                <p className="mt-2 text-gray-500">Cadastro, acompanhamento e relatórios de projetos em um só lugar.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-medium text-gray-900">Controle de Ensaios</h3>
                <p className="mt-2 text-gray-500">Rastrear ensaios, resultados e conformidade com as normas.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-medium text-gray-900">Não Conformidades</h3>
                <p className="mt-2 text-gray-500">Registro, análise e acompanhamento de não conformidades.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-medium text-gray-900">Gestão Documental</h3>
                <p className="mt-2 text-gray-500">Armazenamento, versões e aprovação de documentos.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-medium text-gray-900">Checklists</h3>
                <p className="mt-2 text-gray-500">Validação de todas as fases de execução com rastreabilidade.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-medium text-gray-900">Dashboards Analíticos</h3>
                <p className="mt-2 text-gray-500">Visualização de KPIs, tendências e alertas em tempo real.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SGQ NEXT</h3>
              <p className="text-gray-400">Sistema moderno, responsivo e multilingue para gestão de qualidade.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-gray-400 hover:text-white">Login</Link></li>
                <li><Link href="#features" className="text-gray-400 hover:text-white">Recursos</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <p className="text-gray-400">contato@sgqnext.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SGQ NEXT. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
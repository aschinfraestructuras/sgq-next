'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PencilIcon } from '@heroicons/react/24/outline';
import ConfigTabs from '@/components/layout/ConfigTabs';

export default function ConfiguracoesPage() {
  return (
    <AppLayout>
      <ConfigTabs />

      {/* Seu projeto section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Seu projeto</h3>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200">
            <dl>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nome do projeto</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                  <span>SGQ NEXT</span>
                  <button className="text-gray-400 hover:text-gray-500">
                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ID do projeto</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  <span>sgq-next</span>
                  <button className="ml-2 bg-gray-100 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hidden">
                    <span className="sr-only">Copiar</span>
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <div className="flex-grow"></div>
                  <div className="flex items-center">
                    <span className="h-4 w-4 text-gray-400 mr-1">ⓘ</span>
                  </div>
                </dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Número do projeto</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  <span>68599267755</span>
                  <div className="flex-grow"></div>
                  <div className="flex items-center">
                    <span className="h-4 w-4 text-gray-400 mr-1">ⓘ</span>
                  </div>
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Chave de API da Web</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  <span>AIzaSyAfHIk-s6oFyPW2bQJMkXV_Lsn6O-VYMcc</span>
                  <div className="flex-grow"></div>
                  <div className="flex items-center">
                    <span className="h-4 w-4 text-gray-400 mr-1">ⓘ</span>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Ambiente section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ambiente</h3>
        <p className="text-sm text-gray-500 mb-4">
          Esta configuração personaliza o projeto para diferentes fases do ciclo de vida do app
        </p>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200">
            <dl>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Tipo de ambiente</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                  <span>Não especificado</span>
                  <button className="text-gray-400 hover:text-gray-500">
                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Configurações públicas section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações públicas</h3>
        <p className="text-sm text-gray-500 mb-4">
          Essas configurações controlam instâncias do seu projeto que são mostradas ao público
        </p>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200">
            <dl>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nome exibido ao público</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                  <span>sgq.next</span>
                  <button className="text-gray-400 hover:text-gray-500">
                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">E-mail para suporte</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  <span>sitecore.quality@gmail.com</span>
                  <div className="flex-grow"></div>
                  <div className="flex items-center">
                    <span className="h-4 w-4 text-gray-400 mr-1">ⓘ</span>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Seus aplicativos section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Seus aplicativos</h3>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 flex flex-col items-center justify-center">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Adicionar aplicativo
          </button>
        </div>
      </div>
    </AppLayout>
  );
} 
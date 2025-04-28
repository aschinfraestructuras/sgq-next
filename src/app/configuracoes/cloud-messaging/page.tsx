'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ConfigTabs from '@/components/layout/ConfigTabs';

export default function CloudMessagingPage() {
  return (
    <AppLayout>
      <ConfigTabs />

      {/* Cloud Messaging Content */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Firebase Cloud Messaging</h3>
        <p className="text-sm text-gray-500 mb-6">
          Configure as opções de Cloud Messaging para enviar notificações para os usuários do aplicativo.
        </p>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500 mb-4">
            A funcionalidade Cloud Messaging ainda não está configurada para este projeto.
          </p>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Configurar Cloud Messaging
          </button>
        </div>
      </div>
    </AppLayout>
  );
} 
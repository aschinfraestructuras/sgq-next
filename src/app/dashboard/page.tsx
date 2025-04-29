'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardChart from '@/components/charts/DashboardChart';
import StatsCard from '@/components/dashboard/StatsCard';
import Timeline from '@/components/dashboard/Timeline';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/LanguageContext';
import type { ModuleData, TimelineItem, ModuleType, ModuleStatus } from '@/types/dashboard';
import { 
  DocumentTextIcon, 
  BeakerIcon, 
  ExclamationTriangleIcon, 
  ClipboardDocumentCheckIcon,
  DocumentChartBarIcon,
  ClipboardIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

// Dados de exemplo - Em produção, virão da API
const mockData = {
  stats: {
    documents: { total: 120, pending: 45, approved: 65, rejected: 10 },
    tests: { total: 89, passed: 72, failed: 8, inProgress: 9 },
    nonConformities: { total: 34, open: 12, inProgress: 15, closed: 7 },
    audits: { total: 23, scheduled: 8, completed: 12, findings: 15 }
  },
  trends: {
    documents: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          name: 'Aprovados',
          data: [30, 40, 45, 50, 49, 60]
        },
        {
          name: 'Pendentes',
          data: [20, 25, 30, 35, 25, 20]
        }
      ]
    }
  },
  recentActivity: [
    {
      id: '1',
      type: 'document' as ModuleType,
      title: 'Documento Atualizado',
      description: 'Procedimento de Qualidade v2.1 foi aprovado',
      status: 'completed' as ModuleStatus,
      date: new Date().toISOString(),
      user: {
        name: 'João Silva',
        avatar: 'https://ui-avatars.com/api/?name=João+Silva'
      }
    },
    {
      id: '2',
      type: 'test' as ModuleType,
      title: 'Novo Teste',
      description: 'Teste de resistência iniciado',
      status: 'inProgress' as ModuleStatus,
      date: new Date().toISOString(),
      user: {
        name: 'Maria Santos',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Santos'
      }
    }
  ] as TimelineItem[]
};

const modules: ModuleData[] = [
  { 
    name: 'dashboard.modules.documents', 
    href: '/documentos', 
    icon: DocumentTextIcon,
    value: mockData.stats.documents.total,
    change: 5,
    color: 'blue'
  },
  { 
    name: 'dashboard.modules.tests', 
    href: '/ensaios', 
    icon: BeakerIcon,
    value: mockData.stats.tests.total,
    change: 2,
    color: 'green'
  },
  { 
    name: 'dashboard.modules.nonConformities', 
    href: '/nao-conformidades', 
    icon: ExclamationTriangleIcon,
    value: mockData.stats.nonConformities.total,
    change: -10,
    color: 'red'
  },
  { 
    name: 'dashboard.modules.checklist', 
    href: '/checklist', 
    icon: ClipboardIcon,
    value: 45,
    change: 8,
    color: 'purple'
  },
  { 
    name: 'dashboard.modules.audits', 
    href: '/auditorias', 
    icon: ClipboardDocumentCheckIcon,
    value: mockData.stats.audits.total,
    change: 0,
    color: 'orange'
  },
  { 
    name: 'dashboard.modules.reports', 
    href: '/relatorios', 
    icon: DocumentChartBarIcon,
    value: 56,
    change: 15,
    color: 'indigo'
  }
];

export default function DashboardPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="py-8 px-4 mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('dashboard.title')}
                </h1>
                <p className="text-gray-500">
                  {t('dashboard.subtitle')}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="btn btn-primary flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>{t('dashboard.actions.viewCalendar')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-slide-in">
            {modules.map((mod, index) => (
              <div key={mod.name} style={{ animationDelay: `${index * 0.1}s` }}>
                <StatsCard
                  title={t(mod.name)}
                  value={mod.value}
                  change={mod.change}
                  changeLabel={t('dashboard.stats.total')}
                  icon={mod.icon}
                  color={mod.color}
                  href={mod.href}
                />
              </div>
            ))}
          </div>

          {/* Seção de Análise */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ArrowTrendingUpIcon className="w-6 h-6 mr-2 text-primary" />
                {t('dashboard.sections.analysis')}
              </h2>
            </div>
            
            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="card p-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <DashboardChart
                  data={mockData.trends.documents}
                  title={t('dashboard.charts.documentsEvolution')}
                  type="area"
                />
              </div>
              <div className="card p-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
                <DashboardChart
                  data={{
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [
                      {
                        name: t('dashboard.modules.nonConformities'),
                        data: [8, 12, 15, 10, 8, 12]
                      }
                    ]
                  }}
                  title={t('dashboard.charts.nonConformities')}
                  type="bar"
                />
              </div>
            </div>
          </div>

          {/* Atividade Recente */}
          <div className="card p-6 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {t('dashboard.sections.recentActivity')}
              </h2>
              <button className="text-primary hover:text-primary-dark font-medium">
                {t('dashboard.actions.viewAll')}
              </button>
            </div>
            <Timeline items={mockData.recentActivity} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  CubeIcon, 
  ChartBarIcon, 
  ClipboardDocumentListIcon, 
  BeakerIcon, 
  DocumentCheckIcon, 
  ArrowPathIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  PrinterIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface NavigationItem {
  id: string;
  title: string;
  icon: React.ElementType;
  path: string;
  description: string;
  color: string;
  subItems?: NavigationItem[];
}

export default function MaterialNavigation() {
  const { t } = useTranslation();
  const router = useRouter();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      title: t('materials.tabs.dashboard'),
      icon: ChartBarIcon,
      path: '/materials/dashboard',
      description: t('materials.dashboard.description'),
      color: 'bg-blue-500',
    },
    {
      id: 'inventory',
      title: t('materials.inventory.title'),
      icon: CubeIcon,
      path: '/materials/inventory',
      description: t('materials.inventory.description'),
      color: 'bg-green-500',
      subItems: [
        {
          id: 'stock',
          title: t('materials.inventory.tabs.stock'),
          icon: ClipboardDocumentListIcon,
          path: '/materials/inventory/stock',
          description: t('materials.inventory.tabs.stockDescription'),
          color: 'bg-green-400',
        },
        {
          id: 'movements',
          title: t('materials.inventory.tabs.movements'),
          icon: ArrowPathIcon,
          path: '/materials/inventory/movements',
          description: t('materials.inventory.tabs.movementsDescription'),
          color: 'bg-green-400',
        },
        {
          id: 'batches',
          title: t('materials.inventory.tabs.batches'),
          icon: DocumentTextIcon,
          path: '/materials/inventory/batches',
          description: t('materials.inventory.tabs.batchesDescription'),
          color: 'bg-green-400',
        },
      ],
    },
    {
      id: 'tests',
      title: t('materials.tests.title'),
      icon: BeakerIcon,
      path: '/materials/tests',
      description: t('materials.tests.description'),
      color: 'bg-purple-500',
      subItems: [
        {
          id: 'testList',
          title: t('materials.tests.tabs.list'),
          icon: ClipboardDocumentListIcon,
          path: '/materials/tests/list',
          description: t('materials.tests.tabs.listDescription'),
          color: 'bg-purple-400',
        },
        {
          id: 'testResults',
          title: t('materials.tests.tabs.results'),
          icon: DocumentCheckIcon,
          path: '/materials/tests/results',
          description: t('materials.tests.tabs.resultsDescription'),
          color: 'bg-purple-400',
        },
        {
          id: 'testAnalytics',
          title: t('materials.tests.tabs.analytics'),
          icon: ChartBarIcon,
          path: '/materials/tests/analytics',
          description: t('materials.tests.tabs.analyticsDescription'),
          color: 'bg-purple-400',
        },
      ],
    },
    {
      id: 'certifications',
      title: t('materials.certifications.title'),
      icon: DocumentCheckIcon,
      path: '/materials/certifications',
      description: t('materials.certifications.description'),
      color: 'bg-amber-500',
    },
    {
      id: 'traceability',
      title: t('materials.traceability.title'),
      icon: ArrowPathIcon,
      path: '/materials/traceability',
      description: t('materials.traceability.description'),
      color: 'bg-indigo-500',
    },
    {
      id: 'categories',
      title: t('materials.categories.title'),
      icon: Cog6ToothIcon,
      path: '/materials/categories',
      description: t('materials.categories.description'),
      color: 'bg-red-500',
    },
    {
      id: 'reports',
      title: t('materials.reports.title'),
      icon: DocumentChartBarIcon,
      path: '/materials/reports',
      description: t('materials.reports.description'),
      color: 'bg-cyan-500',
      subItems: [
        {
          id: 'stockReport',
          title: t('materials.reports.types.stock'),
          icon: ClipboardDocumentListIcon,
          path: '/materials/reports/stock',
          description: t('materials.reports.types.stockDescription'),
          color: 'bg-cyan-400',
        },
        {
          id: 'movementsReport',
          title: t('materials.reports.types.movements'),
          icon: ArrowPathIcon,
          path: '/materials/reports/movements',
          description: t('materials.reports.types.movementsDescription'),
          color: 'bg-cyan-400',
        },
        {
          id: 'testsReport',
          title: t('materials.reports.types.tests'),
          icon: BeakerIcon,
          path: '/materials/reports/tests',
          description: t('materials.reports.types.testsDescription'),
          color: 'bg-cyan-400',
        },
        {
          id: 'certificationsReport',
          title: t('materials.reports.types.certifications'),
          icon: DocumentCheckIcon,
          path: '/materials/reports/certifications',
          description: t('materials.reports.types.certificationsDescription'),
          color: 'bg-cyan-400',
        },
        {
          id: 'costReport',
          title: t('materials.reports.types.cost'),
          icon: ChartBarIcon,
          path: '/materials/reports/cost',
          description: t('materials.reports.types.costDescription'),
          color: 'bg-cyan-400',
        },
      ],
    },
  ];

  const handleItemClick = (item: NavigationItem) => {
    if (item.subItems) {
      setExpandedItem(expandedItem === item.id ? null : item.id);
    } else {
      router.push(item.path);
    }
  };

  const filteredItems = navigationItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subItems?.some(subItem => 
      subItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subItem.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('materials.title')}</h1>
        <p className="text-gray-600">{t('materials.description')}</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={t('materials.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {t('materials.tabs.new')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div 
              className={`${item.color} p-4 flex items-center justify-between cursor-pointer`}
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center">
                <item.icon className="h-6 w-6 text-white mr-3" />
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              </div>
              {item.subItems && (
                expandedItem === item.id ? 
                <ChevronDownIcon className="h-5 w-5 text-white" /> : 
                <ChevronRightIcon className="h-5 w-5 text-white" />
              )}
            </div>
            
            <div className="p-4">
              <p className="text-gray-600 mb-4">{item.description}</p>
              
              {!item.subItems && (
                <button
                  onClick={() => router.push(item.path)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('materials.view')}
                </button>
              )}
            </div>
            
            <AnimatePresence>
              {item.subItems && expandedItem === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 gap-3">
                      {item.subItems.map((subItem) => (
                        <motion.div
                          key={subItem.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center p-2 rounded-md hover:bg-white cursor-pointer"
                          onClick={() => router.push(subItem.path)}
                        >
                          <div className={`${subItem.color} p-2 rounded-md mr-3`}>
                            <subItem.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-800">{subItem.title}</h4>
                            <p className="text-xs text-gray-500">{subItem.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 
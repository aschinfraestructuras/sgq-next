'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import type { Material, MaterialStatus } from '@/types/materials';
import { MaterialList } from './MaterialList';

interface MaterialTabsProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (material: Material) => void;
  onAdd: () => void;
  loading?: boolean;
}

export function MaterialTabs({ materials, onEdit, onDelete, onAdd, loading }: MaterialTabsProps) {
  const { t } = useTranslation();

  const filterMaterialsByStatus = (status?: MaterialStatus) => {
    if (!status) return materials;
    return materials.filter(material => material.status === status);
  };

  const tabs = [
    { value: 'all', label: t('materials.tabs.all'), status: undefined },
    { value: 'active', label: t('materials.tabs.active'), status: 'active' as MaterialStatus },
    { value: 'inactive', label: t('materials.tabs.inactive'), status: 'inactive' as MaterialStatus }
  ];

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              {t(`materials.tabs.${tab.value}Title`)}
            </h2>
            <MaterialList
              materials={filterMaterialsByStatus(tab.status)}
              onEdit={onEdit}
              onDelete={onDelete}
              onAdd={onAdd}
              loading={loading}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
} 
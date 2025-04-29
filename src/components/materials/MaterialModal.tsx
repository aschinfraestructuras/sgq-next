import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Material } from '@/types/materials';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MaterialModalProps {
  material: Material;
  onClose: () => void;
}

export function MaterialModal({ material, onClose }: MaterialModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{material.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList>
            <TabsTrigger value="info">{t('materials.tabs.info')}</TabsTrigger>
            <TabsTrigger value="stock">{t('materials.tabs.stock')}</TabsTrigger>
            <TabsTrigger value="history">{t('materials.tabs.history')}</TabsTrigger>
            <TabsTrigger value="tests">{t('materials.tabs.tests')}</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('materials.category')}</h3>
                <p className="mt-1">{material.category?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('materials.type')}</h3>
                <p className="mt-1">{t(`materials.types.${material.type}`)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('materials.status')}</h3>
                <Badge variant={
                  material.status === 'active' ? 'default' :
                  material.status === 'inactive' ? 'secondary' :
                  'destructive'
                }>
                  {t(`materials.status.${material.status}`)}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('materials.location')}</h3>
                <p className="mt-1">{material.location}</p>
              </div>
            </div>

            {material.specifications && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('materials.specifications')}</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {Object.entries(material.specifications).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-sm font-medium text-gray-500">{key}:</span>
                      <span className="ml-2">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stock" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('materials.currentStock')}</h3>
                <p className="mt-1 text-2xl font-semibold">
                  {material.currentStock} {material.unit}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('materials.reorderPoint')}</h3>
                <p className="mt-1">{material.reorderPoint} {material.unit}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('materials.minStock')}</h3>
                <p className="mt-1">{material.minStock} {material.unit}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('materials.maxStock')}</h3>
                <p className="mt-1">{material.maxStock} {material.unit}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              {material.historico?.map((movimento, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{t(`materials.movements.${movimento.tipo}`)}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(movimento.data), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{movimento.quantidade} {material.unit}</p>
                    <p className="text-sm text-gray-500">{movimento.responsavel}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <div className="space-y-4">
              {material.tests?.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{test.name}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(test.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <Badge variant={
                    test.status === 'passed' ? 'default' :
                    test.status === 'failed' ? 'destructive' :
                    'secondary'
                  }>
                    {t(`materials.tests.status.${test.status}`)}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 
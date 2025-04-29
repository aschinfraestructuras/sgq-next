import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentDuplicateIcon,
  QrCodeIcon,
  MapPinIcon,
  TruckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import type { Material, MaterialBatch, MaterialInventoryMovement } from '@/types/materials';
import { useTranslation } from '@/hooks/useTranslation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MaterialInventoryProps {
  material: Material;
  onStockIn: (quantity: number, batch?: Partial<MaterialBatch>) => void;
  onStockOut: (quantity: number, reason: string) => void;
  onMoveBatch: (batchId: string, newLocation: string) => void;
  onGenerateQR: () => void;
}

export default function MaterialInventory({
  material,
  onStockIn,
  onStockOut,
  onMoveBatch,
  onGenerateQR,
}: MaterialInventoryProps) {
  const { t } = useTranslation();
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  const stockStatus = material.currentStock <= material.minStock
    ? 'text-red-600 bg-red-50'
    : material.currentStock >= material.maxStock
    ? 'text-yellow-600 bg-yellow-50'
    : 'text-green-600 bg-green-50';

  const renderStockLevel = () => (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">{t('materials.inventory.current')}</div>
          <div className={`text-2xl font-bold ${stockStatus} rounded-full px-4 py-2`}>
            {material.currentStock} {material.unit}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">{t('materials.inventory.minimum')}</div>
          <div className="text-2xl font-bold">{material.minStock} {material.unit}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">{t('materials.inventory.maximum')}</div>
          <div className="text-2xl font-bold">{material.maxStock} {material.unit}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">{t('materials.inventory.reorder')}</div>
          <div className="text-2xl font-bold">{material.reorderPoint} {material.unit}</div>
        </div>
      </div>
    </div>
  );

  const renderBatches = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t('materials.inventory.batches')}</h3>
        <div className="space-x-2">
          <Button
            variant="outlined"
            startIcon={<QrCodeIcon className="h-5 w-5" />}
            onClick={onGenerateQR}
          >
            {t('materials.inventory.generateQR')}
          </Button>
        </div>
      </div>
      
      <TableContainer component={Paper} className="shadow-sm">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell>{t('materials.inventory.batchNumber')}</TableCell>
              <TableCell>{t('materials.inventory.quantity')}</TableCell>
              <TableCell>{t('materials.inventory.location')}</TableCell>
              <TableCell>{t('materials.inventory.manufacturingDate')}</TableCell>
              <TableCell>{t('materials.inventory.expiryDate')}</TableCell>
              <TableCell>{t('materials.inventory.status')}</TableCell>
              <TableCell align="right">{t('materials.inventory.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {material.batches.map((batch) => (
              <TableRow
                key={batch.id}
                className={`
                  hover:bg-gray-50
                  ${selectedBatch === batch.id ? 'bg-blue-50' : ''}
                `}
              >
                <TableCell>{batch.number}</TableCell>
                <TableCell>{batch.quantity} {material.unit}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span>{batch.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(batch.manufacturingDate), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  {batch.expiryDate && (
                    format(new Date(batch.expiryDate), 'dd/MM/yyyy', { locale: ptBR })
                  )}
                </TableCell>
                <TableCell>
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${batch.status === 'in_stock' ? 'bg-green-100 text-green-800' :
                      batch.status === 'quarantine' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {t(`materials.inventory.status.${batch.status}`)}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <div className="flex justify-end space-x-2">
                    <Tooltip title={t('materials.inventory.move')}>
                      <IconButton
                        size="small"
                        onClick={() => onMoveBatch(batch.id, batch.location)}
                      >
                        <TruckIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('materials.inventory.stockOut')}>
                      <IconButton
                        size="small"
                        onClick={() => onStockOut(batch.quantity, 'Saída de estoque')}
                      >
                        <ArrowDownIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  const renderMovements = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t('materials.inventory.movements')}</h3>
      </div>
      
      <TableContainer component={Paper} className="shadow-sm">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell>{t('materials.inventory.date')}</TableCell>
              <TableCell>{t('materials.inventory.type')}</TableCell>
              <TableCell>{t('materials.inventory.quantity')}</TableCell>
              <TableCell>{t('materials.inventory.batch')}</TableCell>
              <TableCell>{t('materials.inventory.location')}</TableCell>
              <TableCell>{t('materials.inventory.reason')}</TableCell>
              <TableCell>{t('materials.inventory.requestedBy')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {material.inventory.movements.map((movement) => (
              <TableRow
                key={movement.id}
                className="hover:bg-gray-50"
              >
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span>
                      {format(new Date(movement.date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${movement.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  `}>
                    {movement.type === 'in' ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {t(`materials.inventory.type.${movement.type}`)}
                  </span>
                </TableCell>
                <TableCell>{movement.quantity} {material.unit}</TableCell>
                <TableCell>{movement.batch || '-'}</TableCell>
                <TableCell>{movement.location}</TableCell>
                <TableCell>{movement.reason}</TableCell>
                <TableCell>{movement.requestedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderStockLevel()}
      {renderBatches()}
      {renderMovements()}
    </div>
  );
} 
import React, { useState } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  ArrowPathIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import type { Material } from '@/types/materials';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from '@/utils/format';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Tooltip
} from '@mui/material';

interface MaterialListProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (material: Material) => void;
}

export const MaterialList = ({ materials, onEdit, onDelete }: MaterialListProps) => {
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Material;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedMaterials = [...materials].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    // Handle undefined values
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Material) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Material) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 ml-1" />
    );
  };

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) {
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: <ExclamationCircleIcon className="h-4 w-4 text-red-500" />,
        tooltip: t('materials.status.lowStock')
      };
    }
    if (current <= min * 1.2) {
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: <ExclamationCircleIcon className="h-4 w-4 text-yellow-500" />,
        tooltip: t('materials.status.warningStock')
      };
    }
    return {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: null,
      tooltip: t('materials.status.goodStock')
    };
  };

  return (
    <TableContainer 
      component={Paper} 
      className="shadow-lg rounded-lg border border-gray-200 overflow-hidden animate-fade-in"
    >
      <Table>
        <TableHead>
          <TableRow className="bg-gray-50">
            {[
              { key: 'code', label: 'materials.table.code' },
              { key: 'name', label: 'materials.table.name' },
              { key: 'category', label: 'materials.table.category' },
              { key: 'unit', label: 'materials.table.unit' },
              { key: 'currentStock', label: 'materials.table.currentStock' },
              { key: 'minStock', label: 'materials.table.minStock' },
              { key: 'status', label: 'materials.table.status' }
            ].map(({ key, label }) => (
              <TableCell 
                key={key}
                onClick={() => requestSort(key as keyof Material)}
                className="cursor-pointer group transition-colors duration-150 hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-700">{t(label)}</span>
                  {getSortIcon(key as keyof Material)}
                </div>
              </TableCell>
            ))}
            <TableCell align="right" className="font-semibold text-gray-700">
              {t('materials.table.actions')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedMaterials.map((material, index) => {
            const stockStatus = getStockStatus(material.currentStock, material.minStock);
            
            return (
              <TableRow 
                key={material.id}
                className={`
                  transition-all duration-150 animate-slide-in
                  hover:bg-gray-50 hover:shadow-sm
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TableCell className="font-medium text-gray-900">{material.code}</TableCell>
                <TableCell>{material.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {t(`materials.categories.${material.category}`)}
                  </span>
                </TableCell>
                <TableCell>{material.unit.toUpperCase()}</TableCell>
                <TableCell>
                  <Tooltip title={stockStatus.tooltip} arrow>
                    <div className={`
                      inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full
                      ${stockStatus.bgColor} ${stockStatus.color}
                    `}>
                      {stockStatus.icon}
                      <span>{material.currentStock}</span>
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell>{material.minStock}</TableCell>
                <TableCell>
                  <span className={`
                    px-2.5 py-1 inline-flex items-center rounded-full text-sm font-medium
                    ${material.status === 'active' ? 'bg-green-100 text-green-800' : 
                      material.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}
                    transition-colors duration-150
                  `}>
                    {t(`materials.status.${material.status}`)}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <div className="flex items-center justify-end space-x-2">
                    <Tooltip title={t('materials.actions.edit')} arrow>
                      <button
                        onClick={() => onEdit(material)}
                        className="p-1 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-150"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </Tooltip>
                    <Tooltip title={t('materials.actions.delete')} arrow>
                      <button
                        onClick={() => onDelete(material)}
                        className="p-1 rounded-full text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-150"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 
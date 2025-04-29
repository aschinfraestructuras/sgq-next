import React, { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
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
  Paper
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

  return (
    <TableContainer component={Paper} className="shadow-md">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => requestSort('code')} className="cursor-pointer">
              {t('materials.table.code')}
            </TableCell>
            <TableCell onClick={() => requestSort('name')} className="cursor-pointer">
              {t('materials.table.name')}
            </TableCell>
            <TableCell onClick={() => requestSort('category')} className="cursor-pointer">
              {t('materials.table.category')}
            </TableCell>
            <TableCell onClick={() => requestSort('unit')} className="cursor-pointer">
              {t('materials.table.unit')}
            </TableCell>
            <TableCell onClick={() => requestSort('currentStock')} className="cursor-pointer">
              {t('materials.table.currentStock')}
            </TableCell>
            <TableCell onClick={() => requestSort('minStock')} className="cursor-pointer">
              {t('materials.table.minStock')}
            </TableCell>
            <TableCell onClick={() => requestSort('status')} className="cursor-pointer">
              {t('materials.table.status')}
            </TableCell>
            <TableCell align="right">
              {t('materials.table.actions')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedMaterials.map((material) => (
            <TableRow 
              key={material.id}
              hover
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <TableCell>{material.code}</TableCell>
              <TableCell>{material.name}</TableCell>
              <TableCell>{t(`materials.categories.${material.category}`)}</TableCell>
              <TableCell>{material.unit.toUpperCase()}</TableCell>
              <TableCell>{material.currentStock}</TableCell>
              <TableCell>{material.minStock}</TableCell>
              <TableCell>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${material.status === 'active' ? 'bg-green-100 text-green-800' : 
                    material.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {t(`materials.status.${material.status}`)}
                </span>
              </TableCell>
              <TableCell align="right">
                <button
                  onClick={() => onEdit(material)}
                  className="text-primary hover:text-primary-dark mr-4"
                >
                  <PencilIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">{t('materials.actions.edit')}</span>
                </button>
                <button
                  onClick={() => onDelete(material)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">{t('materials.actions.delete')}</span>
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 
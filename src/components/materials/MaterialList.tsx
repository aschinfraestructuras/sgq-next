import React, { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Material } from '@/types/material';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from '@/utils/format';
import { Table } from '@mui/material';

interface MaterialListProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (material: Material) => void;
}

export const MaterialList = ({ materials, onEdit, onDelete }: MaterialListProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
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
    <Table>
      <thead>
        <tr>
          <th onClick={() => requestSort('code')}>{t('material.code')}</th>
          <th onClick={() => requestSort('name')}>{t('material.name')}</th>
          <th onClick={() => requestSort('category')}>{t('material.category')}</th>
          <th onClick={() => requestSort('unit')}>{t('material.unit')}</th>
          <th onClick={() => requestSort('currentStock')}>{t('material.currentStock')}</th>
          <th onClick={() => requestSort('minStock')}>{t('material.minStock')}</th>
          <th onClick={() => requestSort('status')}>{t('material.status')}</th>
          <th onClick={() => requestSort('unitPrice')}>{t('material.price')}</th>
        </tr>
      </thead>
      <tbody>
        {sortedMaterials.map((material) => (
          <tr key={material.id}>
            <td>{material.code}</td>
            <td>{material.name}</td>
            <td>{t(`material.categories.${material.category}`)}</td>
            <td>{t(`material.units.${material.unit}`)}</td>
            <td>{material.currentStock}</td>
            <td>{material.minStock}</td>
            <td>{t(`material.status.${material.status}`)}</td>
            <td>{formatCurrency(material.unitPrice)}</td>
            <td>
              <button
                onClick={() => onEdit(material)}
                className="text-primary hover:text-primary-dark mr-4"
              >
                <PencilIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">{t('common.edit')}</span>
              </button>
              <button
                onClick={() => onDelete(material)}
                className="text-red-600 hover:text-red-900"
              >
                <TrashIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">{t('common.delete')}</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}; 
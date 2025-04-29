'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import AppLayout from '@/components/layout/AppLayout';
import MaterialModal from '@/components/materials/MaterialModal';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '@/services/materials';
import type { Material, MaterialFilter } from '@/types/materials';

export default function MaterialsPage() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Partial<Material> | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const data = await getMaterials();
      setMaterials(data);
    } catch (err) {
      setError(t('materials.messages.errorLoading'));
      console.error('Error loading materials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleCreate = () => {
    setSelectedMaterial(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  const handleDelete = async (material: Material) => {
    if (window.confirm(t('materials.messages.confirmDelete'))) {
      try {
        setIsDeleting(true);
        await deleteMaterial(material.id);
        await loadMaterials();
      } catch (err) {
        console.error('Error deleting material:', err);
        alert(t('materials.messages.errorDeleting'));
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmit = async (data: Partial<Material>) => {
    try {
      if (selectedMaterial?.id) {
        await updateMaterial(selectedMaterial.id, data);
      } else {
        await createMaterial(data as Omit<Material, 'id'>);
      }
      setIsModalOpen(false);
      await loadMaterials();
    } catch (err) {
      console.error('Error saving material:', err);
      alert(t('materials.messages.errorSaving'));
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-red-500 text-xl">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            {t('materials.messages.tryAgain')}
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="py-8 px-4 mx-auto max-w-7xl">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('materials.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {t('materials.subtitle')}
            </p>
          </div>
          <button 
            onClick={handleCreate}
            className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            {t('materials.new')}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('materials.table.code')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('materials.table.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('materials.table.category')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('materials.table.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('materials.table.stock')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('materials.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {materials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {material.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {material.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {t(`materials.categories.${material.category}`)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${material.status === 'active' ? 'bg-green-100 text-green-800' : 
                          material.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {t(`materials.status.${material.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {material.currentStock} / {material.minStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(material)}
                        className="text-primary hover:text-primary-dark mr-4"
                      >
                        {t('materials.actions.edit')}
                      </button>
                      <button 
                        onClick={() => handleDelete(material)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {isDeleting ? t('materials.actions.deleting') : t('materials.actions.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        material={selectedMaterial}
        onSubmit={handleSubmit}
        title={selectedMaterial ? t('materials.edit') : t('materials.new')}
      />
    </AppLayout>
  );
} 
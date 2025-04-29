import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import type { Material, MaterialCategory, MaterialStatus, MaterialUnit } from '@/types/materials';

interface MaterialFormProps {
  material?: Partial<Material>;
  onSubmit: (data: Partial<Material>) => Promise<void>;
  onCancel: () => void;
}

const categories: MaterialCategory[] = ['raw', 'processed', 'packaging', 'equipment', 'other'];
const statuses: MaterialStatus[] = ['active', 'inactive', 'pending', 'discontinued'];
const units: MaterialUnit[] = ['kg', 'unit', 'm', 'm2', 'm3', 'l', 'ml', 'g'];

export default function MaterialForm({ material, onSubmit, onCancel }: MaterialFormProps) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Partial<Material>>({
    defaultValues: material || {
      status: 'pending',
      category: 'raw',
      unit: 'unit',
      minStock: 0,
      currentStock: 0,
      specifications: [],
      suppliers: [],
      documents: [],
      tests: [],
      certifications: [],
      metadata: {}
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Código */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('materials.form.code')}
          </label>
          <input
            type="text"
            {...register('code', { required: 'Código é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('materials.form.name')}
          </label>
          <input
            type="text"
            {...register('name', { required: 'Nome é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('materials.form.description')}
          </label>
          <textarea
            {...register('description', { required: 'Descrição é obrigatória' })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('materials.form.category')}
          </label>
          <select
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {t(`materials.categories.${category}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('materials.form.status')}
          </label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {t(`materials.status.${status}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Unidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('materials.form.unit')}
          </label>
          <select
            {...register('unit')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Estoque Mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('materials.form.minStock')}
          </label>
          <input
            type="number"
            {...register('minStock', { 
              required: 'Estoque mínimo é obrigatório',
              min: { value: 0, message: 'Deve ser maior ou igual a 0' }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          {errors.minStock && (
            <p className="mt-1 text-sm text-red-600">{errors.minStock.message}</p>
          )}
        </div>

        {/* Estoque Atual */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('materials.form.currentStock')}
          </label>
          <input
            type="number"
            {...register('currentStock', { 
              required: 'Estoque atual é obrigatório',
              min: { value: 0, message: 'Deve ser maior ou igual a 0' }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          {errors.currentStock && (
            <p className="mt-1 text-sm text-red-600">{errors.currentStock.message}</p>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {t('materials.form.cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {isSubmitting ? t('materials.form.saving') : t('materials.form.save')}
        </button>
      </div>
    </form>
  );
} 
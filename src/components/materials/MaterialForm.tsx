import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import type { Material, MaterialCategory, MaterialStatus } from '@/types/material';
import {
  TagIcon,
  DocumentTextIcon,
  CubeIcon,
  CheckCircleIcon,
  ScaleIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

interface MaterialFormProps {
  material?: Partial<Material>;
  onSubmit: (data: Partial<Material>) => Promise<void>;
  onCancel: () => void;
}

const categories: MaterialCategory[] = ['materia-prima', 'insumo', 'equipamento', 'ferramenta', 'outro'];
const statuses: MaterialStatus[] = ['ativo', 'inativo', 'em_analise', 'aguardando_teste', 'reprovado'];
const units = ['kg', 'unit', 'm', 'm2', 'm3', 'l', 'ml', 'g'];

const FormField = ({ 
  label, 
  error, 
  icon: Icon,
  children 
}: { 
  label: string; 
  error?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="animate-slide-in">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="h-5 w-5 text-gray-400" />}
        <span>{label}</span>
      </div>
    </label>
    {children}
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center">
        <span className="mr-1">•</span>
        {error}
      </p>
    )}
  </div>
);

export default function MaterialForm({ material, onSubmit, onCancel }: MaterialFormProps) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<Partial<Material>>({
    defaultValues: material || {
      status: 'em_analise',
      category: 'materia-prima',
      unit: 'unit',
      minStock: 0,
      currentStock: 0,
      pendingTests: 0,
      consumptionRate: 0,
      suppliers: [],
      movements: []
    }
  });

  const currentStock = watch('currentStock');
  const minStock = watch('minStock');
  const stockStatus = currentStock && minStock ? (
    currentStock <= minStock ? 'text-red-600' :
    currentStock <= minStock * 1.2 ? 'text-yellow-600' :
    'text-green-600'
  ) : '';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ID */}
          <FormField 
            label={t('materials.form.id')} 
            error={errors.id?.message}
            icon={TagIcon}
          >
            <input
              type="text"
              {...register('id')}
              className="input"
              placeholder="Ex: MAT-001"
              disabled={!!material}
            />
          </FormField>

          {/* Nome */}
          <FormField 
            label={t('materials.form.name')} 
            error={errors.name?.message}
            icon={DocumentTextIcon}
          >
            <input
              type="text"
              {...register('name', { required: 'Nome é obrigatório' })}
              className="input"
              placeholder="Ex: Aço Inoxidável 304"
            />
          </FormField>

          {/* Descrição */}
          <div className="md:col-span-2">
            <FormField 
              label={t('materials.form.description')} 
              error={errors.description?.message}
              icon={DocumentTextIcon}
            >
              <textarea
                {...register('description')}
                rows={3}
                className="input resize-none"
                placeholder="Descreva o material..."
              />
            </FormField>
          </div>

          {/* Categoria */}
          <FormField 
            label={t('materials.form.category')} 
            error={errors.category?.message}
            icon={CubeIcon}
          >
            <select
              {...register('category')}
              className="input"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {t(`materials.categories.${category}`)}
                </option>
              ))}
            </select>
          </FormField>

          {/* Status */}
          <FormField 
            label={t('materials.form.status')} 
            error={errors.status?.message}
            icon={CheckCircleIcon}
          >
            <select
              {...register('status')}
              className="input"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {t(`materials.status.${status}`)}
                </option>
              ))}
            </select>
          </FormField>

          {/* Unidade */}
          <FormField 
            label={t('materials.form.unit')} 
            error={errors.unit?.message}
            icon={ScaleIcon}
          >
            <select
              {...register('unit')}
              className="input"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit.toUpperCase()}
                </option>
              ))}
            </select>
          </FormField>

          {/* Estoque Mínimo */}
          <FormField 
            label={t('materials.form.minStock')} 
            error={errors.minStock?.message}
            icon={ArrowsPointingInIcon}
          >
            <input
              type="number"
              {...register('minStock', { 
                required: 'Estoque mínimo é obrigatório',
                min: { value: 0, message: 'Deve ser maior ou igual a 0' }
              })}
              className="input"
              placeholder="0"
            />
          </FormField>

          {/* Estoque Atual */}
          <FormField 
            label={t('materials.form.currentStock')} 
            error={errors.currentStock?.message}
            icon={ArrowsPointingOutIcon}
          >
            <input
              type="number"
              {...register('currentStock', { 
                required: 'Estoque atual é obrigatório',
                min: { value: 0, message: 'Deve ser maior ou igual a 0' }
              })}
              className={`input ${stockStatus}`}
              placeholder="0"
            />
          </FormField>

          {/* Preço Unitário */}
          <FormField 
            label={t('materials.form.unitPrice')} 
            error={errors.unitPrice?.message}
            icon={ScaleIcon}
          >
            <input
              type="number"
              step="0.01"
              {...register('unitPrice', { 
                required: 'Preço unitário é obrigatório',
                min: { value: 0, message: 'Deve ser maior ou igual a 0' }
              })}
              className="input"
              placeholder="0.00"
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {isSubmitting ? t('common.saving') : t('common.save')}
        </button>
      </div>
    </form>
  );
} 
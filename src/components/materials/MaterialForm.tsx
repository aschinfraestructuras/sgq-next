import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import type { Material, MaterialCategory, MaterialStatus, MaterialUnit } from '@/types/materials';
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

const categories: MaterialCategory[] = ['raw', 'processed', 'packaging', 'equipment', 'other'];
const statuses: MaterialStatus[] = ['active', 'inactive', 'pending', 'discontinued'];
const units: MaterialUnit[] = ['kg', 'unit', 'm', 'm2', 'm3', 'l', 'ml', 'g'];

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
      status: 'pending',
      category: 'raw',
      unit: 'unit',
      minStock: 0,
      currentStock: 0,
      specifications: {
        technical: {},
        quality: {},
        storage: {}
      },
      suppliers: [],
      documents: [],
      tests: [],
      certifications: [],
      metadata: {}
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
          {/* Código */}
          <FormField 
            label={t('materials.form.code')} 
            error={errors.code?.message}
            icon={TagIcon}
          >
            <input
              type="text"
              {...register('code', { required: 'Código é obrigatório' })}
              className="input"
              placeholder="Ex: MAT-001"
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
                {...register('description', { required: 'Descrição é obrigatória' })}
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
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          {t('materials.form.cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            btn btn-primary
            ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
          `}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t('materials.form.saving')}
            </div>
          ) : t('materials.form.save')}
        </button>
      </div>
    </form>
  );
} 
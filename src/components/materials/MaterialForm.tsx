import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import type { Material, MaterialCategory, MaterialStatus, MaterialUnit } from '@/types/material';
import {
  TagIcon,
  DocumentTextIcon,
  CubeIcon,
  CheckCircleIcon,
  ScaleIcon,
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface MaterialFormProps {
  material?: Partial<Material>;
  onSubmit: (data: Partial<Material>) => Promise<void>;
  onCancel: () => void;
}

const categories: MaterialCategory[] = ['materia-prima', 'insumo', 'equipamento', 'ferramenta', 'outro'];
const statuses: MaterialStatus[] = ['ativo', 'inativo', 'em_analise'];
const units: MaterialUnit[] = ['unit', 'kg', 'g', 'l', 'ml', 'box'];

interface FormFieldProps {
  label: string;
  error?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  error, 
  icon: Icon,
  children 
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
      categoria: 'materia-prima',
      unidade: 'unit',
      quantidade: 0,
      localizacao: '',
      fornecedor: '',
      ultimaAtualizacao: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  });

  const quantidade = watch('quantidade') || 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Código */}
          <FormField 
            label={t('materials.form.code')} 
            error={errors.codigo?.message}
            icon={TagIcon}
          >
            <input
              type="text"
              {...register('codigo', { required: 'Código é obrigatório' })}
              className="input"
              placeholder="Ex: MAT-001"
              disabled={!!material}
            />
          </FormField>

          {/* Nome */}
          <FormField 
            label={t('materials.form.name')} 
            error={errors.nome?.message}
            icon={DocumentTextIcon}
          >
            <input
              type="text"
              {...register('nome', { required: 'Nome é obrigatório' })}
              className="input"
              placeholder="Ex: Aço Inoxidável 304"
            />
          </FormField>

          {/* Descrição */}
          <div className="md:col-span-2">
            <FormField 
              label={t('materials.form.description')} 
              error={errors.descricao?.message}
              icon={DocumentTextIcon}
            >
              <textarea
                {...register('descricao')}
                rows={3}
                className="input resize-none"
                placeholder="Descreva o material..."
              />
            </FormField>
          </div>

          {/* Categoria */}
          <FormField 
            label={t('materials.form.category')} 
            error={errors.categoria?.message}
            icon={CubeIcon}
          >
            <select
              {...register('categoria', { required: 'Categoria é obrigatória' })}
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
              {...register('status', { required: 'Status é obrigatório' })}
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
            error={errors.unidade?.message}
            icon={ScaleIcon}
          >
            <select
              {...register('unidade', { required: 'Unidade é obrigatória' })}
              className="input"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit.toUpperCase()}
                </option>
              ))}
            </select>
          </FormField>

          {/* Quantidade */}
          <FormField 
            label={t('materials.form.quantity')} 
            error={errors.quantidade?.message}
            icon={ScaleIcon}
          >
            <input
              type="number"
              {...register('quantidade', { 
                required: 'Quantidade é obrigatória',
                min: { value: 0, message: 'Deve ser maior ou igual a 0' }
              })}
              className="input"
              placeholder="0"
            />
          </FormField>

          {/* Localização */}
          <FormField 
            label={t('materials.form.location')} 
            error={errors.localizacao?.message}
            icon={MapPinIcon}
          >
            <input
              type="text"
              {...register('localizacao', { required: 'Localização é obrigatória' })}
              className="input"
              placeholder="Ex: Almoxarifado A"
            />
          </FormField>

          {/* Fornecedor */}
          <FormField 
            label={t('materials.form.supplier')} 
            error={errors.fornecedor?.message}
            icon={BuildingOfficeIcon}
          >
            <input
              type="text"
              {...register('fornecedor', { required: 'Fornecedor é obrigatório' })}
              className="input"
              placeholder="Ex: Fornecedor A"
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
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import type { Material, MaterialCategory, MaterialStatus, MaterialUnit } from '@/types/materials';
import { getCategories } from '@/services/materialCategories';
import {
  TagIcon,
  DocumentTextIcon,
  CubeIcon,
  CheckCircleIcon,
  ScaleIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Autocomplete, TextField, Tooltip } from '@mui/material';
import { toast } from 'react-hot-toast';

interface MaterialFormProps {
  material?: Partial<Material>;
  onSubmit: (data: Partial<Material>) => Promise<void>;
  onCancel: () => void;
}

const statuses: MaterialStatus[] = ['active', 'inactive', 'pending', 'discontinued'];
const units: MaterialUnit[] = ['unit', 'kg', 'g', 'l', 'ml', 'm', 'm2', 'm3'];

interface FormFieldProps {
  label: string;
  error?: string;
  icon?: React.ElementType;
  required?: boolean;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  error, 
  icon: Icon,
  required,
  children 
}) => (
  <div className="animate-slide-in">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="h-5 w-5 text-gray-400" />}
        <span>{label}{required && ' *'}</span>
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
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const defaultValues: Partial<Material> = {
    status: 'pending',
    unit: 'unit',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    reorderPoint: 0,
    leadTime: 0,
    suppliers: [],
    tests: [],
    history: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<Partial<Material>>({
    defaultValues: material || defaultValues,
    mode: 'onChange'
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error(t('materials.messages.errorLoadingCategories'));
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: Partial<Material>) => {
    try {
      setSubmitError(null);
      await onSubmit(data);
      toast.success(t('materials.messages.saveSuccess'));
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(t('materials.messages.errorSaving'));
      toast.error(t('materials.messages.errorSaving'));
    }
  };

  const selectedCategory = watch('category');
  const currentStock = watch('currentStock') || 0;
  const minStock = watch('minStock') || 0;
  const maxStock = watch('maxStock') || 0;

  // Validation rules
  const stockValidation = {
    min: { value: 0, message: t('materials.validation.stockMin') },
    validate: (value: number | undefined) => {
      if (value === undefined) return true;
      if (maxStock && value > maxStock) return t('materials.validation.stockMaxExceeded');
      if (minStock && value < minStock) return t('materials.validation.stockBelowMin');
      return true;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{submitError}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Código */}
          <FormField 
            label={t('materials.form.code')} 
            error={errors.code?.message}
            icon={TagIcon}
            required
          >
            <input
              type="text"
              {...register('code', { 
                required: t('materials.validation.codeRequired'),
                pattern: {
                  value: /^[A-Z0-9-]+$/,
                  message: t('materials.validation.codeFormat')
                }
              })}
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
            required
          >
            <input
              type="text"
              {...register('name', { 
                required: t('materials.validation.nameRequired'),
                minLength: {
                  value: 3,
                  message: t('materials.validation.nameMinLength')
                }
              })}
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
                {...register('description', {
                  maxLength: {
                    value: 500,
                    message: t('materials.validation.descriptionMaxLength')
                  }
                })}
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
            required
          >
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              value={selectedCategory || null}
              onChange={(_, newValue) => {
                setValue('category', newValue || undefined);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Selecione uma categoria"
                  error={!!errors.category}
                  required
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <div className="flex items-center space-x-2">
                    <span>{option.name}</span>
                    {option.attributes.isHazardous && (
                      <Tooltip title="Material Perigoso">
                        <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
                      </Tooltip>
                    )}
                  </div>
                </li>
              )}
            />
          </FormField>

          {/* Status */}
          <FormField 
            label={t('materials.form.status')} 
            error={errors.status?.message}
            icon={CheckCircleIcon}
            required
          >
            <select
              {...register('status', { required: t('materials.validation.statusRequired') })}
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
            required
          >
            <select
              {...register('unit', { required: t('materials.validation.unitRequired') })}
              className="input"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit.toUpperCase()}
                </option>
              ))}
            </select>
          </FormField>

          {/* Estoque Atual */}
          <FormField 
            label={t('materials.form.currentStock')} 
            error={errors.currentStock?.message}
            icon={CubeIcon}
            required
          >
            <input
              type="number"
              {...register('currentStock', stockValidation)}
              className="input"
              min={0}
              step="0.01"
            />
          </FormField>

          {/* Estoque Mínimo */}
          <FormField 
            label={t('materials.form.minStock')} 
            error={errors.minStock?.message}
            icon={CubeIcon}
            required
          >
            <input
              type="number"
              {...register('minStock', {
                min: { value: 0, message: t('materials.validation.minStockMin') }
              })}
              className="input"
              min={0}
              step="0.01"
            />
          </FormField>

          {/* Estoque Máximo */}
          <FormField 
            label={t('materials.form.maxStock')} 
            error={errors.maxStock?.message}
            icon={CubeIcon}
            required
          >
            <input
              type="number"
              {...register('maxStock', {
                min: { value: 0, message: t('materials.validation.maxStockMin') }
              })}
              className="input"
              min={0}
              step="0.01"
            />
          </FormField>

          {/* Ponto de Reposição */}
          <FormField 
            label={t('materials.form.reorderPoint')} 
            error={errors.reorderPoint?.message}
            icon={ScaleIcon}
            required
          >
            <input
              type="number"
              {...register('reorderPoint', { 
                required: t('materials.validation.reorderPointRequired'),
                min: { value: 0, message: t('materials.validation.reorderPointMin') }
              })}
              className="input"
              min={0}
              step="0.01"
            />
          </FormField>

          {/* Lead Time */}
          <FormField 
            label={t('materials.form.leadTime')} 
            error={errors.leadTime?.message}
            icon={ScaleIcon}
            required
          >
            <input
              type="number"
              {...register('leadTime', { 
                required: t('materials.validation.leadTimeRequired'),
                min: { value: 0, message: t('materials.validation.leadTimeMin') }
              })}
              className="input"
              min={0}
              step="0.01"
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('common.saving') : t('common.save')}
        </button>
      </div>
    </form>
  );
} 
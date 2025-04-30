import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@/hooks/useTranslation';
import type { Material, MaterialCategory, MaterialCategoryType, MaterialStatus, MaterialUnit, MaterialTestFormData, TestStatus } from '@/types/materials';
import { getCategories } from '@/services/materialCategories';
import {
  TagIcon,
  DocumentTextIcon,
  CubeIcon,
  CheckCircleIcon,
  ScaleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Autocomplete, TextField, Tooltip } from '@mui/material';
import { toast } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMaterials } from '@/hooks/useMaterials';

interface MaterialFormProps {
  material?: Partial<Material>;
  onSubmit: (data: Partial<Material>) => Promise<void>;
  onCancel: () => void;
}

const statuses: MaterialStatus[] = ['active', 'inactive', 'pending', 'discontinued'];
const units: MaterialUnit[] = ['unit', 'kg', 'g', 'l', 'ml', 'm', 'm2', 'm3'];
const testStatuses: TestStatus[] = ['pending', 'passed', 'failed'];

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

type FormData = z.infer<typeof materialSchema>;

const materialSchema = z.object({
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(['raw', 'component', 'finished'] as const),
  categoryId: z.string(),
  cost: z.number(),
  unit: z.enum(['unit', 'kg', 'g', 'l', 'ml', 'm', 'm2', 'm3'] as const),
  currentStock: z.number(),
  minStock: z.number(),
  maxStock: z.number(),
  reorderPoint: z.number(),
  leadTime: z.number(),
  suppliers: z.array(z.object({
    name: z.string(),
    contact: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional()
  })),
  location: z.string(),
  status: z.enum(['active', 'inactive', 'discontinued', 'pending'] as const),
  specifications: z.record(z.string()).optional(),
  tests: z.array(z.object({
    type: z.string(),
    name: z.string(),
    description: z.string().optional(),
    testStatus: z.enum(['pending', 'passed', 'failed'] as const),
    results: z.array(z.object({
      parameter: z.string(),
      value: z.union([z.number(), z.string()]),
      unit: z.string().optional(),
      method: z.string().optional(),
      specification: z.string().optional(),
      result: z.enum(['pass', 'fail', 'pending'] as const),
      notes: z.string().optional()
    })),
    notes: z.string().optional(),
    attachments: z.array(z.string()).optional()
  })).optional()
});

export function MaterialForm({ material, onSubmit, onCancel }: MaterialFormProps) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { addMaterial } = useMaterials();
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    defaultValues: material ? {
      ...material,
      code: material.id,
      type: material.type as MaterialCategoryType,
      unit: material.unit as MaterialUnit,
      status: material.status as MaterialStatus,
      tests: material.tests?.map(test => ({
        ...test,
        testStatus: test.testStatus as TestStatus
      }))
    } : {
      status: 'active' as MaterialStatus,
      type: 'raw' as MaterialCategoryType,
      unit: 'unit' as MaterialUnit
    },
    resolver: zodResolver(materialSchema)
  });

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error instanceof Error ? error.message : 'Unknown error');
      toast.error(t('materials.messages.errorLoadingCategories'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleFormSubmit = async (data: FormData) => {
    try {
      const materialData: Omit<Material, 'id'> = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        historico: [],
        suppliers: data.suppliers.map(s => ({
          ...s,
          id: Math.random().toString(36).substr(2, 9),
          code: Math.random().toString(36).substr(2, 9),
          rating: 0,
          averageLeadTime: 0
        })),
        tests: data.tests?.map(t => ({
          ...t,
          id: Math.random().toString(36).substr(2, 9),
          results: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'system',
          updatedBy: 'system',
          attachments: []
        }))
      };
      await addMaterial(materialData);
      toast.success(t('materials.form.success'));
      reset();
    } catch (error) {
      console.error('Error submitting form:', error instanceof Error ? error.message : 'Unknown error');
      toast.error(t('materials.form.error'));
    }
  };

  const selectedCategory = watch('categoryId');
  const category = categories.find(c => c.id === selectedCategory);
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
            error={errors.categoryId?.message}
            icon={CubeIcon}
            required
          >
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              value={category}
              onChange={(_, newValue) => {
                setValue('categoryId', newValue?.id || '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Selecione uma categoria"
                  error={!!errors.categoryId}
                  required
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <div className="flex items-center space-x-2">
                    <span>{option.name}</span>
                    {option.type === 'raw' && (
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
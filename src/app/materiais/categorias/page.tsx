'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Paper, Alert } from '@mui/material';
import MaterialCategoryTree from '@/components/materials/categories/MaterialCategoryTree';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/materialCategories';
import type { MaterialCategory } from '@/types/materials';
import { useTranslation } from '@/hooks/useTranslation';

export default function MaterialCategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar categorias');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (category: Omit<MaterialCategory, 'id' | 'path' | 'level'>) => {
    try {
      await createCategory(category);
      await loadCategories();
    } catch (err) {
      setError('Erro ao criar categoria');
      console.error('Error creating category:', err);
    }
  };

  const handleUpdate = async (id: string, category: Partial<Omit<MaterialCategory, 'id' | 'path' | 'level'>>) => {
    try {
      await updateCategory(id, category);
      await loadCategories();
    } catch (err) {
      setError('Erro ao atualizar categoria');
      console.error('Error updating category:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      setError('Erro ao excluir categoria');
      console.error('Error deleting category:', err);
    }
  };

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-6">
        {t('materials.categories.title')}
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Paper elevation={0} className="border">
        {loading ? (
          <div className="p-8 text-center">
            <Typography>Carregando categorias...</Typography>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <Typography>Nenhuma categoria cadastrada</Typography>
          </div>
        ) : (
          <MaterialCategoryTree
            categories={categories}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </Paper>
    </div>
  );
} 
import { useState, useEffect, useCallback } from 'react';
import type { Material, MaterialFilter, MaterialStats } from '@/types/materials';
import {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterialStats
} from '@/services/materials';

interface UseMaterialsOptions {
  initialFilter?: MaterialFilter;
  autoLoad?: boolean;
}

interface UseMaterialsState {
  materials: Material[];
  stats: MaterialStats | null;
  loading: boolean;
  error: string | null;
  filter: MaterialFilter;
}

export function useMaterials(options: UseMaterialsOptions = {}) {
  const [state, setState] = useState<UseMaterialsState>({
    materials: [],
    stats: null,
    loading: false,
    error: null,
    filter: options.initialFilter || {}
  });

  const loadMaterials = useCallback(async (filter?: MaterialFilter) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const [materials, stats] = await Promise.all([
        getMaterials(filter),
        getMaterialStats()
      ]);
      
      setState(prev => ({
        ...prev,
        materials,
        stats,
        loading: false,
        filter: filter || prev.filter
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar materiais'
      }));
    }
  }, []);

  const getMaterialById = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const material = await getMaterial(id);
      return material;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao carregar material'
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const addMaterial = useCallback(async (data: Omit<Material, 'id'>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const id = await createMaterial(data);
      await loadMaterials(state.filter);
      return id;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao criar material'
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [loadMaterials, state.filter]);

  const editMaterial = useCallback(async (id: string, data: Partial<Material>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await updateMaterial(id, data);
      await loadMaterials(state.filter);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao atualizar material'
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [loadMaterials, state.filter]);

  const removeMaterial = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await deleteMaterial(id);
      await loadMaterials(state.filter);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao excluir material'
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [loadMaterials, state.filter]);

  const setFilter = useCallback((newFilter: MaterialFilter) => {
    loadMaterials(newFilter);
  }, [loadMaterials]);

  useEffect(() => {
    if (options.autoLoad !== false) {
      loadMaterials(options.initialFilter);
    }
  }, [loadMaterials, options.autoLoad, options.initialFilter]);

  return {
    materials: state.materials,
    stats: state.stats,
    loading: state.loading,
    error: state.error,
    filter: state.filter,
    loadMaterials,
    getMaterialById,
    addMaterial,
    editMaterial,
    removeMaterial,
    setFilter
  };
} 
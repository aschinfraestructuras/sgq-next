import { useState, useCallback } from 'react';
import {
  createMaterialTest,
  updateMaterialTest,
  deleteMaterialTest,
  getMaterialTests,
  getMaterialTestsStats,
} from '@/services/materialTests';
import type { MaterialTest } from '@/types/materials';

export function useMaterialTests(materialId: string) {
  const [tests, setTests] = useState<MaterialTest[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    byStatus: Record<MaterialTest['status'], number>;
    latestTest: MaterialTest | null;
    failureRate: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTests = await getMaterialTests(materialId);
      setTests(fetchedTests);
      
      const testStats = await getMaterialTestsStats(materialId);
      setStats(testStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar testes');
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  }, [materialId]);

  const addTest = useCallback(async (testData: Omit<MaterialTest, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newTest = await createMaterialTest(materialId, testData);
      setTests(prev => [newTest, ...prev]);
      await fetchTests(); // Refresh stats
      return newTest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar teste');
      console.error('Error adding test:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [materialId, fetchTests]);

  const updateTest = useCallback(async (testId: string, testData: Partial<MaterialTest>) => {
    setLoading(true);
    setError(null);
    try {
      await updateMaterialTest(testId, testData);
      setTests(prev =>
        prev.map(test =>
          test.id === testId ? { ...test, ...testData } : test
        )
      );
      await fetchTests(); // Refresh stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar teste');
      console.error('Error updating test:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTests]);

  const removeTest = useCallback(async (testId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMaterialTest(testId);
      setTests(prev => prev.filter(test => test.id !== testId));
      await fetchTests(); // Refresh stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir teste');
      console.error('Error removing test:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTests]);

  return {
    tests,
    stats,
    loading,
    error,
    fetchTests,
    addTest,
    updateTest,
    removeTest,
  };
} 
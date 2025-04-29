import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
} from '@mui/material';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { MaterialTest, TestStatus } from '@/types/materials';
import { getCurrentUser } from '@/services/auth';

interface MaterialTestFormProps {
  materialId: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (testData: Omit<MaterialTest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: MaterialTest;
}

export default function MaterialTestForm({
  materialId,
  open,
  onClose,
  onSubmit,
  initialData
}: MaterialTestFormProps) {
  const [formData, setFormData] = useState<Partial<MaterialTest>>(() => {
    if (initialData) return initialData;

    const now = new Date().toISOString();
    return {
      materialId,
      type: '',
      date: now.split('T')[0],
      status: 'pending' as TestStatus,
      results: {},
      technician: '',
      notes: '',
      attachments: [],
      createdBy: '',
      updatedBy: ''
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof MaterialTest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const testData = {
        ...formData,
        createdBy: initialData?.createdBy || user.uid,
        updatedBy: user.uid,
      } as Omit<MaterialTest, 'id' | 'createdAt' | 'updatedAt'>;

      await onSubmit(testData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar teste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        {initialData ? 'Editar Teste' : 'Novo Teste'}
        <IconButton onClick={onClose} size="small">
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tipo de Teste"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Data"
                value={formData.date?.split('T')[0]}
                onChange={(e) => handleChange('date', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Técnico Responsável"
                value={formData.technician}
                onChange={(e) => handleChange('technician', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleChange('status', e.target.value as TestStatus)}
                >
                  <MenuItem value="pending">Pendente</MenuItem>
                  <MenuItem value="in_progress">Em Progresso</MenuItem>
                  <MenuItem value="passed">Aprovado</MenuItem>
                  <MenuItem value="failed">Reprovado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resultados"
                multiline
                rows={4}
                value={JSON.stringify(formData.results, null, 2)}
                onChange={(e) => {
                  try {
                    const results = JSON.parse(e.target.value);
                    handleChange('results', results);
                  } catch {
                    // Ignore invalid JSON
                  }
                }}
                helperText="Insira os resultados em formato JSON"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </Grid>
          </Grid>

          {error && (
            <div className="mt-3 text-red-600 text-sm">
              {error}
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 
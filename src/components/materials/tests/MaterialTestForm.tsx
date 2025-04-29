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
  Box,
  IconButton,
} from '@mui/material';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { MaterialTest, TestStatus, TestResults } from '@/types/materials';
import { getCurrentUser } from '@/services/auth';
import { User } from 'firebase/auth';

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
  const [formData, setFormData] = useState<Omit<MaterialTest, 'id' | 'createdAt' | 'updatedAt'>>(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, ...rest } = initialData;
      return rest;
    }

    return {
      materialId,
      batchId: '',
      type: '',
      description: '',
      status: 'pending' as TestStatus,
      dueDate: new Date(),
      results: [],
      technician: '',
      notes: '',
      attachments: [],
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = <K extends keyof Omit<MaterialTest, 'id' | 'createdAt' | 'updatedAt'>>(
    field: K,
    value: Omit<MaterialTest, 'id' | 'createdAt' | 'updatedAt'>[K]
  ) => {
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

      await onSubmit(formData);
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
          <Box display="flex" flexDirection="column" gap={3}>
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Tipo de Teste"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                required
              />

              <TextField
                fullWidth
                type="date"
                label="Data Prevista"
                value={formData.dueDate instanceof Date ? formData.dueDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange('dueDate', new Date(e.target.value))}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Técnico Responsável"
                value={formData.technician}
                onChange={(e) => handleChange('technician', e.target.value)}
                required
              />

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
            </Box>

            <TextField
              fullWidth
              label="Descrição"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              multiline
              rows={2}
            />

            <TextField
              fullWidth
              label="Resultados"
              multiline
              rows={4}
              value={JSON.stringify(formData.results, null, 2)}
              onChange={(e) => {
                try {
                  const results = JSON.parse(e.target.value) as TestResults[];
                  handleChange('results', results);
                } catch {
                  // Ignore invalid JSON
                }
              }}
              helperText="Insira os resultados em formato JSON"
            />

            <TextField
              fullWidth
              label="Observações"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </Box>

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
            {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 
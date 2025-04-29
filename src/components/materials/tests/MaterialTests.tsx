import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Chip,
} from '@mui/material';
import {
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { MaterialTest } from '@/types/materials';
import MaterialTestForm from './MaterialTestForm';
import MaterialTestDetails from './MaterialTestDetails';

interface MaterialTestsProps {
  materialId: string;
  tests: MaterialTest[];
  onAdd: (test: Omit<MaterialTest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onEdit: (id: string, test: Omit<MaterialTest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDuplicate: (test: MaterialTest) => Promise<void>;
}

const getStatusColor = (status: MaterialTest['status']): 'default' | 'primary' | 'success' | 'error' => {
  switch (status) {
    case 'pending':
      return 'default';
    case 'in_progress':
      return 'primary';
    case 'passed':
      return 'success';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: MaterialTest['status']): string => {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'in_progress':
      return 'Em Progresso';
    case 'passed':
      return 'Aprovado';
    case 'failed':
      return 'Reprovado';
    default:
      return status;
  }
};

export default function MaterialTests({
  materialId,
  tests,
  onAdd,
  onEdit,
  onDelete,
  onDuplicate,
}: MaterialTestsProps) {
  const [selectedTest, setSelectedTest] = useState<MaterialTest | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleAdd = () => {
    setSelectedTest(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEdit = (test: MaterialTest) => {
    setSelectedTest(test);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleView = (test: MaterialTest) => {
    setSelectedTest(test);
    setIsDetailsOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTest(null);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedTest(null);
  };

  const handleSubmit = async (testData: Omit<MaterialTest, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTest && isEditing) {
      await onEdit(selectedTest.id, testData);
    } else {
      await onAdd(testData);
    }
    handleCloseForm();
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          startIcon={<DocumentDuplicateIcon className="h-5 w-5" />}
        >
          Novo Teste
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Técnico</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Resultados</TableCell>
              <TableCell width={140} align="right">
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell>{test.type}</TableCell>
                <TableCell>
                  {format(new Date(test.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>{test.technician}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(test.status)}
                    color={getStatusColor(test.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {test.results.length > 0 ? (
                    <span>{test.results.length} resultados</span>
                  ) : (
                    <span className="text-gray-400">Sem resultados</span>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleView(test)}
                    size="small"
                    title="Visualizar"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEdit(test)}
                    size="small"
                    title="Editar"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </IconButton>
                  <IconButton
                    onClick={() => onDuplicate(test)}
                    size="small"
                    title="Duplicar"
                  >
                    <DocumentDuplicateIcon className="h-5 w-5" />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(test.id)}
                    size="small"
                    title="Excluir"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isFormOpen && (
        <MaterialTestForm
          materialId={materialId}
          open={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={selectedTest}
        />
      )}

      {isDetailsOpen && selectedTest && (
        <MaterialTestDetails
          test={selectedTest}
          open={isDetailsOpen}
          onClose={handleCloseDetails}
        />
      )}
    </>
  );
} 
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import {
  XMarkIcon,
  DocumentArrowDownIcon,
  BeakerIcon,
  UserIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import type { MaterialTest } from '@/types/materials';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MaterialTestDetailsProps {
  test: MaterialTest;
  open: boolean;
  onClose: () => void;
  onDownload?: () => void;
}

export default function MaterialTestDetails({
  test,
  open,
  onClose,
  onDownload,
}: MaterialTestDetailsProps) {
  const getStatusConfig = (status: MaterialTest['status']) => {
    switch (status) {
      case 'passed':
        return {
          label: 'Aprovado',
          className: 'bg-green-100 text-green-800'
        };
      case 'failed':
        return {
          label: 'Reprovado',
          className: 'bg-red-100 text-red-800'
        };
      case 'in_progress':
        return {
          label: 'Em Progresso',
          className: 'bg-yellow-100 text-yellow-800'
        };
      case 'pending':
      default:
        return {
          label: 'Pendente',
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const statusConfig = getStatusConfig(test.status);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BeakerIcon className="h-6 w-6 text-gray-500" />
          <Typography variant="h6">Detalhes do Teste</Typography>
        </div>
        <IconButton onClick={onClose} size="small">
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          <Grid component="div" item xs={12}>
            <Paper className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <Typography variant="h6" className="mb-2">
                    {test.type}
                  </Typography>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {format(new Date(test.date), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{test.technician}</span>
                    </div>
                  </div>
                </div>
                <Chip
                  label={statusConfig.label}
                  className={statusConfig.className}
                />
              </div>
            </Paper>
          </Grid>

          <Grid component="div" item xs={12}>
            <Paper className="p-4">
              <Typography variant="subtitle1" className="font-medium mb-3">
                <ClipboardDocumentListIcon className="h-5 w-5 inline-block mr-2" />
                Resultados
              </Typography>
              <div className="space-y-2">
                {Object.entries(test.results).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-2">
                    <Typography variant="body2" className="font-medium">
                      {key}:
                    </Typography>
                    <Typography variant="body2">{String(value)}</Typography>
                  </div>
                ))}
              </div>
            </Paper>
          </Grid>

          {test.notes && (
            <Grid component="div" item xs={12}>
              <Paper className="p-4">
                <Typography variant="subtitle1" className="font-medium mb-2">
                  Observações
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {test.notes}
                </Typography>
              </Paper>
            </Grid>
          )}

          {test.attachments && test.attachments.length > 0 && (
            <Grid component="div" item xs={12}>
              <Paper className="p-4">
                <Typography variant="subtitle1" className="font-medium mb-3">
                  Anexos
                </Typography>
                <div className="space-y-2">
                  {test.attachments.map((attachment, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <Typography variant="body2">
                        {`Anexo ${index + 1}`}
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
                        onClick={onDownload}
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </Paper>
            </Grid>
          )}

          <Grid component="div" item xs={12}>
            <Paper className="p-4">
              <Typography variant="subtitle2" className="text-gray-500">
                Criado em:{' '}
                {format(new Date(test.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
                {' por '} {test.createdBy}
              </Typography>
              <Typography variant="subtitle2" className="text-gray-500">
                Última atualização:{' '}
                {format(new Date(test.updatedAt), "dd/MM/yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
                {' por '} {test.updatedBy}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
} 
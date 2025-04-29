import { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Paper,
  Chip,
  Button,
  Box,
} from '@mui/material';
import {
  XMarkIcon,
  DocumentArrowDownIcon,
  BeakerIcon,
  UserIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Download, Close } from '@mui/icons-material';

interface MaterialTest {
  id: string;
  technician: string;
  date: string | Date;
  title: string;
  status: TestStatus;
  results: TestResult[];
  notes?: string;
  attachments?: Attachment[];
}

interface TestResult {
  parameter: string;
  value: number | string;
  unit: string;
}

interface Attachment {
  name: string;
  url: string;
}

type TestStatus = 'pending' | 'in_progress' | 'passed' | 'failed';

interface MaterialTestDetailsProps {
  test: MaterialTest;
  open: boolean;
  onClose: () => void;
  onDownload?: (attachment: Attachment) => void;
}

const getStatusColor = (status: TestStatus): 'default' | 'primary' | 'success' | 'error' => {
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

export default function MaterialTestDetails({ test, open, onClose, onDownload }: MaterialTestDetailsProps) {
  const statusColor = getStatusColor(test.status);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Detalhes do Teste</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Header Information */}
            <Paper sx={{ p: 2 }}>
              <Box display="flex" flexWrap="wrap" gap={2}>
                <Box flex={1} minWidth={240}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <UserIcon width={24} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Técnico Responsável
                      </Typography>
                      <Typography>{test.technician}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box flex={1} minWidth={240}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarIcon width={24} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Data do Teste
                      </Typography>
                      <Typography>
                        {format(new Date(test.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box flex={1} minWidth={240}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <ClipboardDocumentListIcon width={24} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Título
                      </Typography>
                      <Typography>{test.title}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Test Results */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Resultados
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={2}>
                {test.results.map((result, index) => (
                  <Box key={index} flex={1} minWidth={240}>
                    <Typography variant="caption" color="text.secondary">
                      {result.parameter}
                    </Typography>
                    <Typography>
                      {result.value} {result.unit}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Notes */}
            {test.notes && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Observações
                </Typography>
                <Typography>{test.notes}</Typography>
              </Paper>
            )}

            {/* Attachments */}
            {test.attachments && test.attachments.length > 0 && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Anexos
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {test.attachments.map((attachment, index) => (
                    <Box key={index} flex={1} minWidth={240}>
                      <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={() => onDownload?.(attachment)}
                        fullWidth
                      >
                        {attachment.name}
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
} 
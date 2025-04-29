import { FC } from 'react';
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
  Box,
  Card,
} from '@mui/material';
import {
  XMarkIcon,
  DocumentArrowDownIcon,
  BeakerIcon,
  UserIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import type { MaterialTest, TestResults, TestStatus } from '@/types/materials';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Download } from '@mui/icons-material';

interface MaterialTestDetailsProps {
  test: MaterialTest;
  open: boolean;
  onClose: () => void;
  onDownload?: () => void;
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

const MaterialTestDetails: FC<MaterialTestDetailsProps> = ({ test, open, onClose, onDownload }) => {
  const statusColor = getStatusColor(test.status);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" component="h2">
          Detalhes do Teste
        </Typography>
        <IconButton onClick={onClose} size="small">
          <XMarkIcon width={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BeakerIcon width={20} />
                    <Typography variant="subtitle1">Status</Typography>
                  </Box>
                  <Chip
                    label={test.status}
                    color={statusColor}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <UserIcon width={20} />
                    <Typography variant="subtitle1">Técnico Responsável</Typography>
                  </Box>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {test.technician}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarIcon width={20} />
                    <Typography variant="subtitle1">Data Prevista</Typography>
                  </Box>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {format(test.dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </Typography>
                </Grid>
                {test.completionDate && (
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarIcon width={20} />
                      <Typography variant="subtitle1">Data de Conclusão</Typography>
                    </Box>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {format(test.completionDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Card>
          </Grid>

          {test.results && (
            <Grid item xs={12}>
              <Card sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <ClipboardDocumentListIcon width={20} />
                  <Typography variant="subtitle1">Resultados</Typography>
                </Box>
                <Grid container spacing={2}>
                  {Object.entries(test.results).map(([parameter, value]) => (
                    <Grid item xs={12} sm={6} key={parameter}>
                      <Typography variant="subtitle2">{parameter}</Typography>
                      <Typography color="text.secondary">
                        {value.toString()}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          )}

          {test.notes && (
            <Grid item xs={12}>
              <Card sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <ClipboardDocumentListIcon width={20} />
                  <Typography variant="subtitle1">Observações</Typography>
                </Box>
                <Typography color="text.secondary">
                  {test.notes}
                </Typography>
              </Card>
            </Grid>
          )}

          {test.attachments && test.attachments.length > 0 && (
            <Grid item xs={12}>
              <Card sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <DocumentArrowDownIcon width={20} />
                  <Typography variant="subtitle1">Anexos</Typography>
                </Box>
                <Grid container spacing={1}>
                  {test.attachments.map((attachment, index) => (
                    <Grid item xs={12} key={index}>
                      <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={onDownload}
                        fullWidth
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        {attachment.name}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialTestDetails; 
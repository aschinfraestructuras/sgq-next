import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  PrinterIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import type { Material, MaterialInventoryMovement, MaterialBatch } from '@/types/materials';
import { useTranslation } from '@/hooks/useTranslation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMaterials } from '@/hooks/useMaterials';
import { toast } from 'react-hot-toast';

interface MaterialInventoryProps {
  material: Material;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function MaterialInventory({ material, onClose }: MaterialInventoryProps) {
  const { t } = useTranslation();
  const { editMaterial } = useMaterials();
  const [tabValue, setTabValue] = useState(0);
  const [openMovementDialog, setOpenMovementDialog] = useState(false);
  const [movementType, setMovementType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [movementQuantity, setMovementQuantity] = useState<number>(0);
  const [movementReason, setMovementReason] = useState<string>('');
  const [movementDocument, setMovementDocument] = useState<string>('');
  const [movementLocation, setMovementLocation] = useState<string>(material.location || '');
  const [selectedBatch, setSelectedBatch] = useState<string>('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenMovementDialog = (type: 'in' | 'out' | 'adjustment') => {
    setMovementType(type);
    setOpenMovementDialog(true);
  };

  const handleCloseMovementDialog = () => {
    setOpenMovementDialog(false);
    setMovementQuantity(0);
    setMovementReason('');
    setMovementDocument('');
    setSelectedBatch('');
  };

  const handleSubmitMovement = async () => {
    try {
      if (movementQuantity <= 0) {
        toast.error(t('materials.inventory.errors.invalidQuantity'));
        return;
      }

      const newMovement: MaterialInventoryMovement = {
        id: Date.now().toString(),
        type: movementType,
        quantity: movementQuantity,
        date: new Date().toISOString(),
        batch: selectedBatch || undefined,
        document: movementDocument,
        reason: movementReason,
        requestedBy: 'currentUser', // Substituir pelo usuário atual
        approvedBy: 'currentUser', // Substituir pelo usuário atual
        location: movementLocation
      };

      // Atualizar o estoque do material
      const newStock = material.currentStock + 
        (movementType === 'in' ? movementQuantity : 
         movementType === 'out' ? -movementQuantity : 
         movementQuantity);

      // Atualizar o histórico de movimentações
      const updatedMaterial = {
        ...material,
        currentStock: newStock,
        historico: [
          {
            tipo: movementType === 'in' ? 'entrada' : 
                  movementType === 'out' ? 'saida' : 'ajuste',
            quantidade: movementQuantity,
            data: new Date().toISOString(),
            responsavel: 'currentUser', // Substituir pelo usuário atual
            observacao: movementReason
          },
          ...(material.historico || [])
        ]
      };

      await editMaterial(material.id, updatedMaterial);
      toast.success(t('materials.inventory.success.movementAdded'));
      handleCloseMovementDialog();
    } catch (error) {
      console.error('Error adding movement:', error);
      toast.error(t('materials.inventory.errors.addMovementFailed'));
    }
  };

  const handlePrintReport = () => {
    // Implementar a lógica para imprimir relatório
    toast.info(t('materials.inventory.info.printingReport'));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Typography variant="h6">
          {t('materials.inventory.title')}: {material.name}
        </Typography>
        <div className="flex space-x-2">
          <Button
            variant="outlined"
            startIcon={<ChartBarIcon className="h-5 w-5" />}
            onClick={() => setTabValue(2)}
          >
            {t('materials.inventory.actions.viewAnalytics')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrinterIcon className="h-5 w-5" />}
            onClick={handlePrintReport}
          >
            {t('materials.inventory.actions.printReport')}
          </Button>
        </div>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="inventory tabs">
          <Tab label={t('materials.inventory.tabs.movements')} />
          <Tab label={t('materials.inventory.tabs.batches')} />
          <Tab label={t('materials.inventory.tabs.analytics')} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <div className="mb-4 flex space-x-2">
          <Button
            variant="contained"
            color="success"
            startIcon={<ArrowDownTrayIcon className="h-5 w-5" />}
            onClick={() => handleOpenMovementDialog('in')}
          >
            {t('materials.inventory.actions.addEntry')}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<ArrowUpTrayIcon className="h-5 w-5" />}
            onClick={() => handleOpenMovementDialog('out')}
          >
            {t('materials.inventory.actions.addExit')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<AdjustmentsHorizontalIcon className="h-5 w-5" />}
            onClick={() => handleOpenMovementDialog('adjustment')}
          >
            {t('materials.inventory.actions.addAdjustment')}
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('materials.inventory.table.date')}</TableCell>
                <TableCell>{t('materials.inventory.table.type')}</TableCell>
                <TableCell>{t('materials.inventory.table.quantity')}</TableCell>
                <TableCell>{t('materials.inventory.table.document')}</TableCell>
                <TableCell>{t('materials.inventory.table.reason')}</TableCell>
                <TableCell>{t('materials.inventory.table.location')}</TableCell>
                <TableCell>{t('materials.inventory.table.responsible')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {material.historico && material.historico.length > 0 ? (
                material.historico.map((movement, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {format(new Date(movement.data), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {t(`materials.movements.${movement.tipo}`)}
                    </TableCell>
                    <TableCell>
                      {movement.quantidade} {material.unit}
                    </TableCell>
                    <TableCell>
                      {movement.documento || '-'}
                    </TableCell>
                    <TableCell>
                      {movement.observacao || '-'}
                    </TableCell>
                    <TableCell>
                      {movement.localizacao || material.location || '-'}
                    </TableCell>
                    <TableCell>
                      {movement.responsavel}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {t('materials.inventory.noMovements')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <div className="mb-4">
          <Button
            variant="contained"
            startIcon={<DocumentTextIcon className="h-5 w-5" />}
            onClick={() => {/* Implementar adição de lote */}}
          >
            {t('materials.inventory.actions.addBatch')}
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('materials.inventory.table.batchNumber')}</TableCell>
                <TableCell>{t('materials.inventory.table.quantity')}</TableCell>
                <TableCell>{t('materials.inventory.table.manufacturingDate')}</TableCell>
                <TableCell>{t('materials.inventory.table.expiryDate')}</TableCell>
                <TableCell>{t('materials.inventory.table.supplier')}</TableCell>
                <TableCell>{t('materials.inventory.table.cost')}</TableCell>
                <TableCell>{t('materials.inventory.table.status')}</TableCell>
                <TableCell>{t('materials.inventory.table.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {material.batches && material.batches.length > 0 ? (
                material.batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>{batch.number}</TableCell>
                    <TableCell>{batch.quantity} {material.unit}</TableCell>
                    <TableCell>
                      {format(new Date(batch.manufacturingDate), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {batch.expiryDate ? format(new Date(batch.expiryDate), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                    </TableCell>
                    <TableCell>{batch.supplier || '-'}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(batch.cost)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        batch.status === 'in_stock' ? 'bg-green-100 text-green-800' :
                        batch.status === 'in_use' ? 'bg-blue-100 text-blue-800' :
                        batch.status === 'consumed' ? 'bg-gray-100 text-gray-800' :
                        batch.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {t(`materials.inventory.status.${batch.status}`)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => {/* Implementar visualização de lote */}}>
                        <DocumentTextIcon className="h-4 w-4" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {t('materials.inventory.noBatches')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              {t('materials.inventory.analytics.stockHistory')}
            </Typography>
            {/* Implementar gráfico de histórico de estoque */}
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <Typography variant="body2" color="textSecondary">
                {t('materials.inventory.analytics.chartPlaceholder')}
              </Typography>
            </div>
          </Paper>
          
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              {t('materials.inventory.analytics.movementTypes')}
            </Typography>
            {/* Implementar gráfico de tipos de movimentação */}
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <Typography variant="body2" color="textSecondary">
                {t('materials.inventory.analytics.chartPlaceholder')}
              </Typography>
            </div>
          </Paper>
          
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              {t('materials.inventory.analytics.turnoverRate')}
            </Typography>
            {/* Implementar gráfico de taxa de giro */}
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <Typography variant="body2" color="textSecondary">
                {t('materials.inventory.analytics.chartPlaceholder')}
              </Typography>
            </div>
          </Paper>
          
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              {t('materials.inventory.analytics.supplierPerformance')}
            </Typography>
            {/* Implementar gráfico de desempenho de fornecedores */}
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <Typography variant="body2" color="textSecondary">
                {t('materials.inventory.analytics.chartPlaceholder')}
              </Typography>
            </div>
          </Paper>
        </div>
      </TabPanel>

      <Dialog open={openMovementDialog} onClose={handleCloseMovementDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {movementType === 'in' ? t('materials.inventory.dialog.addEntry') :
           movementType === 'out' ? t('materials.inventory.dialog.addExit') :
           t('materials.inventory.dialog.addAdjustment')}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <TextField
              label={t('materials.inventory.form.quantity')}
              type="number"
              fullWidth
              value={movementQuantity}
              onChange={(e) => setMovementQuantity(Number(e.target.value))}
              InputProps={{
                endAdornment: <span>{material.unit}</span>
              }}
            />
            
            <TextField
              label={t('materials.inventory.form.document')}
              fullWidth
              value={movementDocument}
              onChange={(e) => setMovementDocument(e.target.value)}
            />
            
            <TextField
              label={t('materials.inventory.form.reason')}
              fullWidth
              multiline
              rows={2}
              value={movementReason}
              onChange={(e) => setMovementReason(e.target.value)}
            />
            
            <TextField
              label={t('materials.inventory.form.location')}
              fullWidth
              value={movementLocation}
              onChange={(e) => setMovementLocation(e.target.value)}
            />
            
            {movementType === 'in' && (
              <FormControl fullWidth>
                <InputLabel>{t('materials.inventory.form.batch')}</InputLabel>
                <Select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  label={t('materials.inventory.form.batch')}
                >
                  <MenuItem value="">
                    <em>{t('materials.inventory.form.newBatch')}</em>
                  </MenuItem>
                  {material.batches?.map((batch) => (
                    <MenuItem key={batch.id} value={batch.id}>
                      {batch.number}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMovementDialog}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmitMovement} variant="contained" color="primary">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 
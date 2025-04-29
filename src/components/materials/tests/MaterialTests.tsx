import React from 'react';
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
  Tooltip,
  Chip,
} from '@mui/material';
import {
  BeakerIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import type { Material, MaterialTest } from '@/types/materials';
import { useTranslation } from '@/hooks/useTranslation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MaterialTestsProps {
  material: Material;
  onAddTest: () => void;
  onViewTestDetails: (test: MaterialTest) => void;
  onDownloadReport: (test: MaterialTest) => void;
}

export default function MaterialTests({
  material,
  onAddTest,
  onViewTestDetails,
  onDownloadReport,
}: MaterialTestsProps) {
  const { t } = useTranslation();

  const getStatusConfig = (status: MaterialTest['status']) => {
    switch (status) {
      case 'passed':
        return {
          icon: <CheckCircleIcon className="h-5 w-5" />,
          color: 'success',
          label: t('materials.tests.status.passed'),
          className: 'bg-green-100 text-green-800'
        };
      case 'failed':
        return {
          icon: <XCircleIcon className="h-5 w-5" />,
          color: 'error',
          label: t('materials.tests.status.failed'),
          className: 'bg-red-100 text-red-800'
        };
      case 'in_progress':
        return {
          icon: <ArrowPathIcon className="h-5 w-5" />,
          color: 'warning',
          label: t('materials.tests.status.inProgress'),
          className: 'bg-yellow-100 text-yellow-800'
        };
      case 'pending':
      default:
        return {
          icon: <ClockIcon className="h-5 w-5" />,
          color: 'default',
          label: t('materials.tests.status.pending'),
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t('materials.tests.title')}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t('materials.tests.description')}
          </p>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlusIcon className="h-5 w-5" />}
          onClick={onAddTest}
        >
          {t('materials.tests.add')}
        </Button>
      </div>

      <TableContainer component={Paper} className="shadow-sm">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell>{t('materials.tests.type')}</TableCell>
              <TableCell>{t('materials.tests.date')}</TableCell>
              <TableCell>{t('materials.tests.technician')}</TableCell>
              <TableCell>{t('materials.tests.status')}</TableCell>
              <TableCell>{t('materials.tests.results')}</TableCell>
              <TableCell align="right">{t('materials.tests.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {material.tests.map((test) => {
              const statusConfig = getStatusConfig(test.status);
              
              return (
                <TableRow
                  key={test.id}
                  className="hover:bg-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <BeakerIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{test.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(test.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>{test.technician}</TableCell>
                  <TableCell>
                    <Chip
                      icon={statusConfig.icon}
                      label={statusConfig.label}
                      color={statusConfig.color as any}
                      size="small"
                      className={statusConfig.className}
                    />
                  </TableCell>
                  <TableCell>
                    {Object.entries(test.results).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium">{key}:</span> {value}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end space-x-2">
                      <Tooltip title={t('materials.tests.view')}>
                        <IconButton
                          size="small"
                          onClick={() => onViewTestDetails(test)}
                        >
                          <BeakerIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      {test.attachments && test.attachments.length > 0 && (
                        <Tooltip title={t('materials.tests.download')}>
                          <IconButton
                            size="small"
                            onClick={() => onDownloadReport(test)}
                          >
                            <DocumentArrowDownIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {material.tests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-gray-500">
                    <BeakerIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">
                      {t('materials.tests.empty')}
                    </p>
                    <Button
                      variant="text"
                      color="primary"
                      startIcon={<PlusIcon className="h-5 w-5" />}
                      onClick={onAddTest}
                      className="mt-2"
                    >
                      {t('materials.tests.addFirst')}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
} 
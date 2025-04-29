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
} from '@mui/material';
import {
  DocumentIcon,
  DocumentArrowDownIcon,
  DocumentPlusIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import type { Material, MaterialCertification } from '@/types/materials';
import { useTranslation } from '@/hooks/useTranslation';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MaterialCertificationsProps {
  material: Material;
  onAddCertification: () => void;
  onViewCertification: (certification: MaterialCertification) => void;
  onDownloadCertification: (certification: MaterialCertification) => void;
}

export default function MaterialCertifications({
  material,
  onAddCertification,
  onViewCertification,
  onDownloadCertification,
}: MaterialCertificationsProps) {
  const { t } = useTranslation();

  const getCertificationStatus = (certification: MaterialCertification) => {
    const now = new Date();
    const expiryDate = new Date(certification.expiryDate);
    const warningDate = addDays(now, 30);

    if (certification.status === 'revoked') {
      return {
        icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
        label: t('materials.certifications.status.revoked'),
        className: 'bg-red-100 text-red-800'
      };
    }

    if (isBefore(expiryDate, now)) {
      return {
        icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
        label: t('materials.certifications.status.expired'),
        className: 'bg-red-100 text-red-800'
      };
    }

    if (isBefore(expiryDate, warningDate)) {
      return {
        icon: <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />,
        label: t('materials.certifications.status.expiring'),
        className: 'bg-yellow-100 text-yellow-800'
      };
    }

    return {
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
      label: t('materials.certifications.status.valid'),
      className: 'bg-green-100 text-green-800'
    };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t('materials.certifications.title')}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t('materials.certifications.description')}
          </p>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DocumentPlusIcon className="h-5 w-5" />}
          onClick={onAddCertification}
        >
          {t('materials.certifications.add')}
        </Button>
      </div>

      <TableContainer component={Paper} className="shadow-sm">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell>{t('materials.certifications.name')}</TableCell>
              <TableCell>{t('materials.certifications.type')}</TableCell>
              <TableCell>{t('materials.certifications.issuer')}</TableCell>
              <TableCell>{t('materials.certifications.issueDate')}</TableCell>
              <TableCell>{t('materials.certifications.expiryDate')}</TableCell>
              <TableCell>{t('materials.certifications.status')}</TableCell>
              <TableCell align="right">{t('materials.certifications.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {material.certifications.map((certification) => {
              const status = getCertificationStatus(certification);
              
              return (
                <TableRow
                  key={certification.id}
                  className="hover:bg-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <DocumentIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{certification.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {t(`materials.certifications.types.${certification.type}`)}
                    </span>
                  </TableCell>
                  <TableCell>{certification.issuer}</TableCell>
                  <TableCell>
                    {format(new Date(certification.issueDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(certification.expiryDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                      {status.icon}
                      <span>{status.label}</span>
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end space-x-2">
                      <Tooltip title={t('materials.certifications.view')}>
                        <IconButton
                          size="small"
                          onClick={() => onViewCertification(certification)}
                        >
                          <DocumentIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      {certification.documentUrl && (
                        <Tooltip title={t('materials.certifications.download')}>
                          <IconButton
                            size="small"
                            onClick={() => onDownloadCertification(certification)}
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
            {material.certifications.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-gray-500">
                    <DocumentIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">
                      {t('materials.certifications.empty')}
                    </p>
                    <Button
                      variant="text"
                      color="primary"
                      startIcon={<DocumentPlusIcon className="h-5 w-5" />}
                      onClick={onAddCertification}
                      className="mt-2"
                    >
                      {t('materials.certifications.addFirst')}
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
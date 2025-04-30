import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  DocumentIcon,
  TruckIcon,
  BeakerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import type { Material } from '@/types/materials';
import { useTranslation } from '@/hooks/useTranslation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Typography } from '@mui/material';

interface MaterialEvent {
  type: 'receipt' | 'test' | 'movement';
  date: Date;
  title: string;
  description: string;
  metadata?: Record<string, string | number>;
  status?: 'success' | 'error' | 'warning' | 'info';
}

interface MaterialTraceabilityProps {
  materialId: string;
  batchNumber: string;
}

export function MaterialTraceability({ materialId, batchNumber }: MaterialTraceabilityProps) {
  const { t } = useTranslation();

  // Simulated events for the material batch
  const events: MaterialEvent[] = [
    {
      type: 'receipt',
      date: new Date('2024-03-10'),
      title: 'Recebimento do Lote',
      description: 'Material recebido do fornecedor',
      metadata: {
        'Fornecedor': 'Fornecedor XYZ',
        'Quantidade': '100 unidades',
        'Nota Fiscal': 'NF-123456'
      },
      status: 'success'
    },
    {
      type: 'test',
      date: new Date('2024-03-11'),
      title: 'Teste de Qualidade',
      description: 'Teste de conformidade realizado',
      metadata: {
        'Resultado': 'Aprovado',
        'Responsável': 'João Silva'
      },
      status: 'info'
    },
    {
      type: 'movement',
      date: new Date('2024-03-12'),
      title: 'Movimentação',
      description: 'Transferência para produção',
      metadata: {
        'Destino': 'Setor de Produção',
        'Quantidade': '50 unidades'
      },
      status: 'info'
    }
  ];

  const getStatusColor = (status?: MaterialEvent['status']) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Rastreabilidade do Material
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        ID: {materialId} | Lote: {batchNumber}
      </Typography>
      
      <Timeline position="alternate">
        {events.map((event, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent color="text.secondary">
              {format(event.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot color={getStatusColor(event.status)} />
              {index < events.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            
            <TimelineContent>
              <Typography variant="h6" component="span">
                {event.title}
              </Typography>
              <Typography>{event.description}</Typography>
              
              {event.metadata && (
                <div style={{ marginTop: 8 }}>
                  {Object.entries(event.metadata).map(([key, value]) => (
                    <Typography key={key} variant="body2" color="text.secondary">
                      {key}: {value}
                    </Typography>
                  ))}
                </div>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
} 
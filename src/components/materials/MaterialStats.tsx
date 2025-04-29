import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  ChartBarIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  DocumentChartBarIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import type { MaterialStats } from '@/types/materials';
import { useTranslations } from '@/hooks/useTranslations';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/format';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color?: 'primary' | 'success' | 'warning' | 'error';
  progress?: number;
  tooltip?: string;
}

const StatCard = ({ title, value, icon: Icon, color = 'primary', progress, tooltip }: StatCardProps) => {
  const card = (
    <Card>
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2}>
            <Icon className="h-8 w-8 text-gray-500" />
          </Grid>
          <Grid item xs={10}>
            <Typography variant="subtitle2" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h6">
              {value}
            </Typography>
            {progress !== undefined && (
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                color={color}
                sx={{ mt: 1 }}
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        {card}
      </Tooltip>
    );
  }

  return card;
};

interface MaterialStatsProps {
  stats: MaterialStats;
  loading?: boolean;
}

export default function MaterialStats({ stats, loading = false }: MaterialStatsProps) {
  const t = useTranslations();

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[...Array(6)].map((_, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card>
              <CardContent sx={{ p: 2, height: 100 }}>
                <LinearProgress />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  const stockHealth = (stats.inStock / stats.total) * 100;
  const lowStock = (stats.lowStock / stats.total) * 100;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title={t('materials.stats.totalItems')}
          value={formatNumber(stats.total)}
          icon={ClipboardDocumentListIcon}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title={t('materials.stats.totalValue')}
          value={formatCurrency(stats.totalValue)}
          icon={CurrencyDollarIcon}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title={t('materials.stats.stockHealth')}
          value={formatPercent(stockHealth / 100)}
          icon={CheckCircleIcon}
          color={stockHealth >= 80 ? 'success' : stockHealth >= 50 ? 'warning' : 'error'}
          progress={stockHealth}
          tooltip={t('materials.stats.stockHealthTooltip', {
            inStock: formatNumber(stats.inStock),
            total: formatNumber(stats.total)
          })}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title={t('materials.stats.lowStock')}
          value={formatPercent(lowStock / 100)}
          icon={ExclamationTriangleIcon}
          color={lowStock <= 20 ? 'success' : lowStock <= 50 ? 'warning' : 'error'}
          progress={lowStock}
          tooltip={t('materials.stats.lowStockTooltip', {
            count: formatNumber(stats.lowStock)
          })}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title={t('materials.stats.turnoverRate')}
          value={formatNumber(stats.turnoverRate, { maximumFractionDigits: 1 })}
          icon={ArrowTrendingUpIcon}
          tooltip={t('materials.stats.turnoverRateTooltip')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title={t('materials.stats.averageLeadTime')}
          value={`${formatNumber(stats.averageLeadTime, { maximumFractionDigits: 0 })} ${t('common.days')}`}
          icon={ClockIcon}
          tooltip={t('materials.stats.averageLeadTimeTooltip')}
        />
      </Grid>
    </Grid>
  );
} 
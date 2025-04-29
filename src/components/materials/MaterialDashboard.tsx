import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import type { MaterialStats } from '@/types/materials';
import { formatCurrency } from '@/utils/format';
import { CircularProgress } from '@mui/material';
import { useTranslation } from '@/hooks/useTranslation';

interface MaterialDashboardProps {
  stats?: MaterialStats;
  loading?: boolean;
  error?: string;
}

type CardColor = 'blue' | 'green' | 'orange' | 'pink';

const baseProps = {
  placeholder: "",
  onPointerEnterCapture: () => {},
  onPointerLeaveCapture: () => {},
  crossOrigin: undefined,
};

export function MaterialDashboard({ stats, loading, error }: MaterialDashboardProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="mb-6 flex items-center justify-center p-8" role="status" aria-label="Loading">
        <CircularProgress size={40} className="text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const cards = [
    {
      title: t('materials.dashboard.totalMaterials'),
      value: stats.total,
      color: 'blue' as CardColor,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-white"
          aria-hidden="true"
        >
          <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
        </svg>
      )
    },
    {
      title: t('materials.dashboard.totalValue'),
      value: formatCurrency(stats.totalValue),
      color: 'green' as CardColor,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-white"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9.75 17.25a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-.75zm2.25-3a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-5.25z"
            clipRule="evenodd"
          />
        </svg>
      )
    },
    {
      title: t('materials.dashboard.lowStock'),
      value: stats.lowStock,
      color: 'orange' as CardColor,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-white"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
            clipRule="evenodd"
          />
        </svg>
      )
    },
    {
      title: t('materials.dashboard.pendingTests'),
      value: stats.withPendingTests,
      color: 'pink' as CardColor,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-white"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z"
            clipRule="evenodd"
          />
        </svg>
      )
    }
  ];

  return (
    <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} {...baseProps} className="transform transition-all duration-300 hover:scale-105 focus-within:scale-105">
          <CardHeader
            {...baseProps}
            variant="gradient"
            color={card.color}
            className="absolute -mt-4 grid h-16 w-16 place-items-center"
          >
            {card.icon}
          </CardHeader>
          <CardBody {...baseProps} className="p-4 text-right">
            <Typography {...baseProps} variant="small" className="font-normal text-blue-gray-600">
              {card.title}
            </Typography>
            <Typography {...baseProps} variant="h4" color="blue-gray">
              {card.value}
            </Typography>
          </CardBody>
        </Card>
      ))}
    </div>
  );
} 
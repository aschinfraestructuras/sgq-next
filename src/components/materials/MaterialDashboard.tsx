import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface MaterialStats {
  totalCost: number;
  total: number;
  valorTotal: number;
  quantidadeTotal: number;
  movimentacoes: Array<{
    data: string;
    tipo: string;
    quantidade: number;
    material: string;
  }>;
  consumoMedioMensal: Array<{
    mes: string;
    consumo: number;
  }>;
}

interface MaterialDashboardProps {
  stats: MaterialStats;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

const baseProps = {
  placeholder: "",
  onPointerEnterCapture: () => {},
  onPointerLeaveCapture: () => {},
};

export default function MaterialDashboard({ stats }: MaterialDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card {...baseProps} className="w-full" shadow={false} variant="filled">
        <CardBody {...baseProps} className="flex items-center gap-4">
          <div className="rounded-full p-3 bg-blue-100">
            <CurrencyDollarIcon className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <Typography {...baseProps} className="mb-1" variant="h6" color="blue-gray">
              Custo Total
            </Typography>
            <Typography {...baseProps} className="font-normal" variant="h4">
              {formatCurrency(stats.totalCost)}
            </Typography>
          </div>
        </CardBody>
      </Card>

      <Card {...baseProps} className="w-full" shadow={false} variant="filled">
        <CardBody {...baseProps} className="flex items-center gap-4">
          <div className="rounded-full p-3 bg-blue-100">
            <ChartBarIcon className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <Typography {...baseProps} className="mb-1" variant="h6" color="blue-gray">
              Total de Materiais
            </Typography>
            <Typography {...baseProps} className="font-normal" variant="h4">
              {stats.total}
            </Typography>
          </div>
        </CardBody>
      </Card>

      <Card {...baseProps} className="w-full" shadow={false} variant="filled">
        <CardBody {...baseProps} className="flex items-center gap-4">
          <div className="rounded-full p-3 bg-green-100">
            <CurrencyDollarIcon className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <Typography {...baseProps} className="mb-1" variant="h6" color="blue-gray">
              Valor Total
            </Typography>
            <Typography {...baseProps} className="font-normal" variant="h4">
              {formatCurrency(stats.valorTotal)}
            </Typography>
          </div>
        </CardBody>
      </Card>

      <Card {...baseProps} className="w-full" shadow={false} variant="filled">
        <CardBody {...baseProps} className="flex items-center gap-4">
          <div className="rounded-full p-3 bg-purple-100">
            <ScaleIcon className="h-6 w-6 text-purple-700" />
          </div>
          <div>
            <Typography {...baseProps} className="mb-1" variant="h6" color="blue-gray">
              Quantidade Total
            </Typography>
            <Typography {...baseProps} className="font-normal" variant="h4">
              {stats.quantidadeTotal}
            </Typography>
          </div>
        </CardBody>
      </Card>

      <Card {...baseProps} className="lg:col-span-2 w-full" shadow={false} variant="filled">
        <CardHeader {...baseProps} variant="gradient" color="blue" className="p-4">
          <Typography {...baseProps} variant="h6" color="white" className="font-normal">
            Últimas Movimentações
          </Typography>
        </CardHeader>
        <CardBody {...baseProps} className="px-0 pt-0">
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200">
              {stats.movimentacoes.map((movimento, index) => (
                <li key={index} className="py-4 px-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {movimento.tipo === 'entrada' ? (
                        <ArrowTrendingUpIcon className="h-6 w-6 text-green-500" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {movimento.material}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        Quantidade: {movimento.quantidade}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {formatDate(new Date(movimento.data))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardBody>
      </Card>

      <Card {...baseProps} className="w-full" shadow={false} variant="filled">
        <CardHeader {...baseProps} variant="gradient" color="green" className="p-4">
          <Typography {...baseProps} variant="h6" color="white" className="font-normal">
            Consumo Médio Mensal
          </Typography>
        </CardHeader>
        <CardBody {...baseProps} className="px-0 pt-0">
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200">
              {stats.consumoMedioMensal.map((item, index) => (
                <li key={index} className="py-4 px-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <ClockIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {item.mes}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {item.consumo} unidades
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
} 
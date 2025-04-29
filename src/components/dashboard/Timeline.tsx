import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TimelineItem } from '@/types/dashboard';
import {
  DocumentIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface TimelineProps {
  items: TimelineItem[];
}

const typeIcons = {
  document: DocumentIcon,
  test: BeakerIcon,
  nonConformity: ExclamationTriangleIcon
};

const statusConfig = {
  pending: {
    icon: ClockIcon,
    color: 'yellow',
    label: 'Pendente'
  },
  completed: {
    icon: CheckCircleIcon,
    color: 'green',
    label: 'Concluído'
  },
  failed: {
    icon: XCircleIcon,
    color: 'red',
    label: 'Falhou'
  },
  inProgress: {
    icon: ClockIcon,
    color: 'blue',
    label: 'Em Progresso'
  }
};

const colorClasses = {
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    hover: 'hover:bg-yellow-100'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    hover: 'hover:bg-green-100'
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    hover: 'hover:bg-red-100'
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-100'
  }
};

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {items.map((item, itemIdx) => {
          const TypeIcon = typeIcons[item.type as keyof typeof typeIcons] || DocumentIcon;
          const status = statusConfig[item.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;
          const colors = colorClasses[status.color as keyof typeof colorClasses];

          return (
            <li key={item.id} className="animate-slide-in" style={{ animationDelay: `${itemIdx * 0.1}s` }}>
              <div className="relative pb-8">
                {itemIdx !== items.length - 1 ? (
                  <span
                    className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gradient-to-b from-gray-200 to-transparent"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-gray-200 group-hover:border-gray-300 transition-colors duration-200 ring-8 ring-white">
                    <TypeIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-600 transition-colors duration-200" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          className="h-8 w-8 rounded-full ring-2 ring-white"
                          src={item.user.avatar}
                          alt={item.user.name}
                        />
                        <span className="font-medium text-gray-900">
                          {item.user.name}
                        </span>
                      </div>
                      <time className="text-sm text-gray-500">
                        {format(new Date(item.date), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </time>
                    </div>
                    <div className="mt-2">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <span
                        className={`
                          inline-flex items-center space-x-1.5 rounded-full px-3 py-1
                          text-sm font-medium ${colors.bg} ${colors.text} ${colors.border}
                          transition-colors duration-200 ${colors.hover}
                        `}
                      >
                        <StatusIcon className="h-4 w-4" />
                        <span>{status.label}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 
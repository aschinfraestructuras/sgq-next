import React from 'react';
import Link from 'next/link';
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

export interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'indigo';
  href?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50 text-blue-600',
    hover: 'hover:bg-blue-100',
    border: 'border-blue-100',
    gradient: 'from-blue-500/20'
  },
  green: {
    bg: 'bg-green-50 text-green-600',
    hover: 'hover:bg-green-100',
    border: 'border-green-100',
    gradient: 'from-green-500/20'
  },
  red: {
    bg: 'bg-red-50 text-red-600',
    hover: 'hover:bg-red-100',
    border: 'border-red-100',
    gradient: 'from-red-500/20'
  },
  purple: {
    bg: 'bg-purple-50 text-purple-600',
    hover: 'hover:bg-purple-100',
    border: 'border-purple-100',
    gradient: 'from-purple-500/20'
  },
  orange: {
    bg: 'bg-orange-50 text-orange-600',
    hover: 'hover:bg-orange-100',
    border: 'border-orange-100',
    gradient: 'from-orange-500/20'
  },
  indigo: {
    bg: 'bg-indigo-50 text-indigo-600',
    hover: 'hover:bg-indigo-100',
    border: 'border-indigo-100',
    gradient: 'from-indigo-500/20'
  }
};

export default function StatsCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon: Icon, 
  color,
  href 
}: StatsCardProps) {
  const isPositive = change >= 0;
  const Arrow = isPositive ? ArrowUpIcon : ArrowDownIcon;
  const changeColorClass = isPositive ? 'text-green-600' : 'text-red-600';
  const CardWrapper = href ? Link : 'div';

  const card = (
    <div className={`
      bg-white rounded-lg border ${colorClasses[color].border}
      shadow-sm transition-all duration-200
      ${href ? `${colorClasses[color].hover} cursor-pointer group` : ''}
      relative overflow-hidden h-full
    `}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color].bg} transition-colors duration-200`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className={`flex items-center space-x-1 text-sm ${changeColorClass}`}>
            <Arrow className="h-4 w-4" />
            <span>{Math.abs(change)}%</span>
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-gray-700 transition-colors duration-200">
          {title}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900">
            {value.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">
            {changeLabel}
          </span>
        </div>

        {href && (
          <div className="mt-4 flex items-center text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
            <span>Ver detalhes</span>
            <ArrowRightIcon className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        )}
      </div>

      <div className={`
        absolute bottom-0 left-0 w-full h-1
        bg-gradient-to-r ${colorClasses[color].gradient} to-transparent
        opacity-50 group-hover:opacity-75 transition-opacity duration-200
      `} />
    </div>
  );

  return href ? (
    <CardWrapper href={href}>
      {card}
    </CardWrapper>
  ) : card;
} 
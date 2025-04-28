import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  return (
    <header className={`bg-white shadow-sm px-6 py-4 flex justify-between items-center ${className}`}>
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700">
          <BellIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-2">
          <UserCircleIcon className="h-8 w-8 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Usuário</span>
        </div>
      </div>
    </header>
  );
} 
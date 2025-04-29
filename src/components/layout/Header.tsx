'use client';

import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAppState } from '@/hooks/useAppState';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, setTheme, notifications, markNotificationAsRead } = useAppState();
  const { user, logout } = useAuth();

  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex justify-between items-center px-4 py-4">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
            Sistema de Gestão da Qualidade
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Alternador de Tema */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>

          {/* Menu de Notificações */}
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              <span className="sr-only">Ver notificações</span>
              <div className="relative">
                <BellIcon className="h-6 w-6" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
                    {unreadNotifications.length}
                  </span>
                )}
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      Nenhuma notificação
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <Menu.Item key={notification.id}>
                        {({ active }) => (
                          <button
                            onClick={() => markNotificationAsRead(notification.id)}
                            className={`${
                              active
                                ? 'bg-gray-100 dark:bg-gray-600'
                                : notification.read
                                ? 'bg-white dark:bg-gray-700'
                                : 'bg-blue-50 dark:bg-blue-900'
                            } w-full text-left px-4 py-2 text-sm`}
                          >
                            <p className={`${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white font-medium'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </button>
                        )}
                      </Menu.Item>
                    ))
                  )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Menu do Usuário */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2">
              {user?.photoURL ? (
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.photoURL}
                  alt={user.displayName || 'Usuário'}
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              )}
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.displayName || 'Usuário'}
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/profile"
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-600' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                      >
                        <UserCircleIcon className="h-5 w-5 mr-3" />
                        Perfil
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/settings"
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-600' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                      >
                        <Cog6ToothIcon className="h-5 w-5 mr-3" />
                        Configurações
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-600' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                        Sair
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header; 
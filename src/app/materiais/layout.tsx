'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Tabs, Tab, Box } from '@mui/material';
import { useTranslation } from '@/hooks/useTranslation';

export default function MaterialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const tabs = [
    { path: '/materiais', label: t('materials.tabs.list') },
    { path: '/materiais/categorias', label: t('materials.tabs.categories') },
    { path: '/materiais/testes', label: t('materials.tabs.tests') },
    { path: '/materiais/certificacoes', label: t('materials.tabs.certifications') },
  ];

  const currentTab = tabs.findIndex(tab => pathname === tab.path);

  return (
    <div className="flex flex-col h-full">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab !== -1 ? currentTab : 0}>
          {tabs.map((tab, index) => (
            <Tab
              key={tab.path}
              label={tab.label}
              component={Link}
              href={tab.path}
              value={index}
            />
          ))}
        </Tabs>
      </Box>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
} 
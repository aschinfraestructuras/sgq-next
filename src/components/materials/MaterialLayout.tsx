'use client';

import { MaterialTabs } from './MaterialTabs';

interface MaterialLayoutProps {
  children: React.ReactNode;
}

export function MaterialLayout({ children }: MaterialLayoutProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Materiais</h1>
      </div>
      <MaterialTabs />
      <div className="flex-1">{children}</div>
    </div>
  );
} 
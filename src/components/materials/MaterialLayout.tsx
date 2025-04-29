'use client';

import { MaterialTabs } from './MaterialTabs';
import MaterialNavigation from './MaterialNavigation';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { Material } from '@/types/materials';

interface MaterialLayoutProps {
  children: React.ReactNode;
}

export function MaterialLayout({ children }: MaterialLayoutProps) {
  const pathname = usePathname();
  const isMainPage = pathname === '/materials';
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);

  const handleEdit = (material: Material) => {
    // Implement edit logic
    console.log('Edit material:', material);
  };

  const handleDelete = (material: Material) => {
    // Implement delete logic
    console.log('Delete material:', material);
  };

  const handleAdd = () => {
    // Implement add logic
    console.log('Add new material');
  };

  return (
    <div className="flex flex-col h-full">
      <MaterialNavigation />
      <div className="flex-grow">
        {isMainPage ? (
          <MaterialTabs
            materials={materials}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            loading={loading}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
} 